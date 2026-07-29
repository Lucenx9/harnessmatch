import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { appendWorkflowSummary, requiredEnvironment } from "./lib/github-automation.mjs";
import { parseHarnessReleaseSnapshots } from "./lib/release-signals.mjs";
import {
  buildReleaseTriageMessages,
  emptyReleaseReviewQueue,
  mergeReleaseReviewQueue,
  parseReleaseReviewQueue,
  pendingReleaseCandidates,
  releaseReviewQueuePath,
  releaseTriageModel,
  releaseTriageTool,
  renderReleaseReviewQueue,
  validateReleaseTriageOutput,
} from "./lib/release-triage.mjs";

const projectRoot = process.cwd();
const releaseSnapshotPath = resolve(projectRoot, "src/data/release-signals.json");
const queuePath = resolve(projectRoot, releaseReviewQueuePath);
const analyzedAt = new Date().toISOString();
const maximumCandidates = Number.parseInt(process.env.RELEASE_TRIAGE_MAX_CANDIDATES ?? "20", 10);
const refreshAll = process.env.RELEASE_TRIAGE_REFRESH_ALL === "true";

if (!Number.isInteger(maximumCandidates) || maximumCandidates < 1) {
  throw new Error("RELEASE_TRIAGE_MAX_CANDIDATES must be a positive integer");
}

class NonRetryableHttpError extends Error {}

async function readQueue() {
  try {
    return parseReleaseReviewQueue(await readFile(queuePath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return emptyReleaseReviewQueue(analyzedAt);
    throw error;
  }
}

async function fetchJsonWithRetry(url, init, label, timeoutMs = 45_000) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (response.ok) return await response.json();
      const body = await response.text();
      if (![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === 3) {
        throw new NonRetryableHttpError(`${label}: HTTP ${response.status} ${body.slice(0, 300)}`);
      }
    } catch (error) {
      if (error instanceof NonRetryableHttpError) throw error;
      if (attempt === 3) throw new Error(`${label}: request failed after ${attempt} attempts`, { cause: error });
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 1_000));
  }
  throw new Error(`${label}: retry budget exhausted`);
}

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${requiredEnvironment("GITHUB_TOKEN")}`,
    "User-Agent": "HarnessMatch-release-triage",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function fetchOfficialRelease(release) {
  const sourceApiUrl = `https://api.github.com/repos/${release.repository}/releases/tags/${encodeURIComponent(release.version)}`;
  const payload = await fetchJsonWithRetry(
    sourceApiUrl,
    { headers: githubHeaders() },
    `GitHub release ${release.harnessId} ${release.version}`,
  );
  if (payload?.tag_name !== release.version) throw new Error(`GitHub release tag changed for ${release.harnessId}`);
  if (payload?.html_url !== release.releaseUrl) throw new Error(`GitHub release URL changed for ${release.harnessId}`);
  if (payload?.draft || payload?.prerelease) throw new Error(`Stable release mapping resolved to a draft or prerelease for ${release.harnessId}`);
  if (typeof payload?.published_at !== "string" || payload.published_at.slice(0, 10) !== release.releasedAt) {
    throw new Error(`GitHub release date changed for ${release.harnessId}`);
  }
  return { payload, sourceApiUrl };
}

async function analyzeRelease(release, releasePayload, openRouterApiKey) {
  const { messages, releaseNotes, limitedReleaseNotes } = buildReleaseTriageMessages(release, releasePayload);
  const response = await fetchJsonWithRetry(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://harnessmatch.dev",
        "X-Title": "HarnessMatch release triage",
      },
      body: JSON.stringify({
        model: releaseTriageModel,
        messages,
        tools: [releaseTriageTool],
        tool_choice: { type: "function", function: { name: "submit_release_triage" } },
        reasoning: { effort: "minimal", exclude: true },
        temperature: 0,
        max_tokens: 6_000,
      }),
    },
    `OpenRouter triage ${release.harnessId} ${release.version}`,
    120_000,
  );
  const toolCall = response?.choices?.[0]?.message?.tool_calls?.find(
    (candidate) => candidate?.function?.name === "submit_release_triage",
  );
  const content = toolCall?.function?.arguments;
  if (typeof content !== "string" || content.length === 0) {
    throw new Error(`OpenRouter returned no release-triage tool call for ${release.harnessId} ${release.version}`);
  }
  let parsedContent;
  try {
    parsedContent = JSON.parse(content);
  } catch (error) {
    const finishReason = response?.choices?.[0]?.finish_reason ?? "unknown";
    throw new Error(`OpenRouter returned invalid JSON for ${release.harnessId} ${release.version} (${content.length} characters, finish reason ${finishReason})`, { cause: error });
  }
  const triage = validateReleaseTriageOutput(parsedContent);
  const usage = response?.usage;
  const normalizedUsage = usage && [usage.prompt_tokens, usage.completion_tokens, usage.total_tokens]
    .every((value) => Number.isInteger(value) && value >= 0)
    ? {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      }
    : null;
  return {
    triage,
    releaseNotesSha256: createHash("sha256").update(releaseNotes).digest("hex"),
    releaseNotesTruncated: releaseNotes.length > limitedReleaseNotes.length,
    usage: normalizedUsage,
  };
}

async function mapWithConcurrency(items, concurrency, task) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

const [releaseSnapshotSource, queue] = await Promise.all([readFile(releaseSnapshotPath, "utf8"), readQueue()]);
const releases = parseHarnessReleaseSnapshots(JSON.parse(releaseSnapshotSource)).map((snapshot) => ({
  harnessId: snapshot.harnessId,
  repository: snapshot.repository,
  version: snapshot.latestVersion,
  releasedAt: snapshot.latestReleaseAt,
  releaseUrl: snapshot.latestReleaseUrl,
}));
const candidates = refreshAll ? releases : pendingReleaseCandidates(releases, queue);

if (candidates.length === 0) {
  console.log("No untriaged stable releases were found.");
  appendWorkflowSummary("GPT-OSS release triage: no new stable versions required review.");
  process.exit(0);
}

if (candidates.length > maximumCandidates) {
  throw new Error(`Release triage found ${candidates.length} candidates; limit is ${maximumCandidates}`);
}

const openRouterApiKey = requiredEnvironment("OPENROUTER_API_KEY");
const newItems = await mapWithConcurrency(candidates, 2, async (release) => {
  const { payload, sourceApiUrl } = await fetchOfficialRelease(release);
  const analysis = await analyzeRelease(release, payload, openRouterApiKey);
  return {
    key: `${release.harnessId}:${release.version}`,
    harnessId: release.harnessId,
    version: release.version,
    releasedAt: release.releasedAt,
    releaseUrl: release.releaseUrl,
    sourceApiUrl,
    releaseTitle: typeof payload.name === "string" ? payload.name.slice(0, 300) : "",
    releaseNotesSha256: analysis.releaseNotesSha256,
    releaseNotesTruncated: analysis.releaseNotesTruncated,
    analyzedAt,
    status: "needs-editorial-review",
    model: releaseTriageModel,
    usage: analysis.usage,
    triage: analysis.triage,
  };
});

const nextQueue = mergeReleaseReviewQueue(queue, newItems, analyzedAt);
await writeFile(queuePath, renderReleaseReviewQueue(nextQueue), "utf8");
console.log(`Triaged ${newItems.length} stable releases with ${releaseTriageModel}.`);
appendWorkflowSummary(`GPT-OSS release triage: ${newItems.length} new stable releases added to the editorial queue.`);
