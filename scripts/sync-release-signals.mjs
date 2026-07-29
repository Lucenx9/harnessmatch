import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseRepositoryAudits } from "./lib/ecosystem-signals.mjs";
import { githubReleaseWatches } from "./lib/release-watch-mappings.mjs";
import {
  buildHarnessReleaseSnapshot,
  recentReleaseWindowDays,
  renderHarnessReleaseSnapshots,
} from "./lib/release-signals.mjs";

const execFile = promisify(execFileCallback);
const projectRoot = process.cwd();
const outputPath = resolve(projectRoot, "src/data/release-signals.json");
const repositoryAuditPath = resolve(projectRoot, "src/data/repository-audits.ts");
const observedAt = new Date().toISOString().slice(0, 10);
const releaseWindowStart = new Date(
  Date.parse(`${observedAt}T00:00:00Z`) - ((recentReleaseWindowDays - 1) * 86_400_000),
).toISOString().slice(0, 10);
const maximumPages = 20;

class NonRetryableHttpError extends Error {}

async function fetchJsonWithRetry(url, init, label) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(45_000) });
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

async function githubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const { stdout } = await execFile("gh", ["auth", "token"], { timeout: 5_000 });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function githubHeaders() {
  const token = await githubToken();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "HarnessMatch-release-sync",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchReleaseHistory(watch, audit, headers) {
  const repository = audit.repositoryUrl.replace("https://github.com/", "");
  const releases = [];
  for (let page = 1; page <= maximumPages; page += 1) {
    const payload = await fetchJsonWithRetry(
      `https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`,
      { headers },
      `GitHub release feed ${watch.harnessId} page ${page}`,
    );
    if (!Array.isArray(payload)) throw new Error(`GitHub release schema changed for ${watch.harnessId}`);
    releases.push(...payload);
    const pageIsBeforeWindow = payload.length > 0 && payload.every((release) => (
      typeof release?.created_at === "string" && release.created_at.slice(0, 10) < releaseWindowStart
    ));
    if (payload.length < 100 || pageIsBeforeWindow) return releases;
  }
  throw new Error(`GitHub release feed exceeded ${maximumPages} pages for ${watch.harnessId}`);
}

const [repositoryAuditSource, headers] = await Promise.all([
  readFile(repositoryAuditPath, "utf8"),
  githubHeaders(),
]);
const audits = parseRepositoryAudits(repositoryAuditSource);
const auditByHarness = new Map(audits.map((audit) => [audit.harnessId, audit]));
const watchedHarnessIds = new Set(githubReleaseWatches.map(({ harnessId }) => harnessId));
if (watchedHarnessIds.size !== githubReleaseWatches.length) throw new Error("Release watchlist repeats a harness id");

const snapshots = await mapWithConcurrency(githubReleaseWatches, 4, async (watch) => {
  const audit = auditByHarness.get(watch.harnessId);
  if (!audit) throw new Error(`No canonical repository audit for release watch: ${watch.harnessId}`);
  const releases = await fetchReleaseHistory(watch, audit, headers);
  return buildHarnessReleaseSnapshot(releases, watch, audit, observedAt);
});

const nextContents = renderHarnessReleaseSnapshots(snapshots);
let previousContents = "";
try {
  previousContents = await readFile(outputPath, "utf8");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

if (previousContents === nextContents) {
  console.log(`Harness release snapshots are current as of ${observedAt}.`);
} else {
  await writeFile(outputPath, nextContents, "utf8");
  console.log(`Updated ${snapshots.length} product-scoped stable release feeds as of ${observedAt}.`);
}
