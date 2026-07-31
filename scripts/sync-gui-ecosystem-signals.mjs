import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  guiGitHubReleaseArtifacts,
  guiHomebrewArtifacts,
} from "./lib/gui-ecosystem-signal-mappings.mjs";
import {
  parseGuiGitHubRepository,
  parseGuiGitHubReleaseDownloads,
  parseGuiHomebrewAnalytics,
  parseGuiRepositoryAuditSource,
  renderGuiEcosystemSignalsFile,
} from "./lib/gui-ecosystem-signals.mjs";
import { fetchResponseWithRetry } from "./lib/fetch-with-retry.mjs";

const execFile = promisify(execFileCallback);
const projectRoot = process.cwd();
const outputPath = resolve(projectRoot, "src/data/gui-ecosystem-signals.ts");
const observedAt = new Date().toISOString().slice(0, 10);

async function fetchWithRetry(url, init, label) {
  return fetchResponseWithRetry(url, init, {
    label,
    timeoutMs: 25_000,
    retryDelayMs: 700,
  });
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
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
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

async function guiRepositoryAudits() {
  const directory = resolve(projectRoot, "src/data/gui-audits");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".ts") && file !== "index.ts").sort();
  const audits = [];
  for (const file of files) {
    const audit = parseGuiRepositoryAuditSource(await readFile(resolve(directory, file), "utf8"));
    if (!audit) throw new Error(`Could not parse GUI repository audit ${file}`);
    audits.push(audit);
  }
  if (new Set(audits.map((audit) => audit.guiId)).size !== audits.length) {
    throw new Error("GUI repository audits repeat a GUI id");
  }
  return audits;
}

async function homebrewSignals() {
  const [analytics, identities] = await Promise.all([
    fetchWithRetry(
      "https://formulae.brew.sh/api/analytics/cask-install/homebrew-cask/30d.json",
      {},
      "Homebrew GUI analytics",
    ).then((response) => response.json()),
    mapWithConcurrency(guiHomebrewArtifacts, 4, async (artifact) => (
      fetchWithRetry(
        `https://formulae.brew.sh/api/cask/${artifact.artifactId}.json`,
        {},
        `Homebrew GUI identity ${artifact.artifactId}`,
      ).then((response) => response.json())
    )),
  ]);
  return parseGuiHomebrewAnalytics(analytics, guiHomebrewArtifacts, identities, observedAt);
}

async function githubSignals() {
  const [audits, token] = await Promise.all([guiRepositoryAudits(), githubToken()]);
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "HarnessMatch-gui-ecosystem-sync",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return mapWithConcurrency(audits, 4, async (audit) => {
    const slug = audit.repositoryUrl.replace("https://github.com/", "");
    const response = await fetchWithRetry(`https://api.github.com/repos/${slug}`, { headers }, `GitHub GUI ${slug}`);
    return parseGuiGitHubRepository(await response.json(), audit, observedAt);
  });
}

async function githubReleaseSignals() {
  const [audits, token] = await Promise.all([guiRepositoryAudits(), githubToken()]);
  const auditByGui = new Map(audits.map((audit) => [audit.guiId, audit]));
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "HarnessMatch-gui-release-sync",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return mapWithConcurrency(guiGitHubReleaseArtifacts, 3, async (artifact) => {
    const audit = auditByGui.get(artifact.guiId);
    if (!audit) throw new Error(`No canonical GUI repository audit for releases: ${artifact.guiId}`);
    const slug = audit.repositoryUrl.replace("https://github.com/", "");
    const releases = [];
    for (let page = 1; ; page += 1) {
      const response = await fetchWithRetry(
        `https://api.github.com/repos/${slug}/releases?per_page=100&page=${page}`,
        { headers },
        `GitHub GUI releases ${slug} page ${page}`,
      );
      const pageReleases = await response.json();
      if (!Array.isArray(pageReleases)) throw new Error(`GitHub GUI releases schema changed for ${slug}`);
      releases.push(...pageReleases);
      if (pageReleases.length < 100) break;
    }
    return parseGuiGitHubReleaseDownloads(releases, artifact, audit, observedAt);
  });
}

const groups = await Promise.all([homebrewSignals(), githubReleaseSignals(), githubSignals()]);
const signals = groups.flat().sort((left, right) => (
  left.source.localeCompare(right.source) || left.guiId.localeCompare(right.guiId)
));
const identityKeys = new Set();
for (const signal of signals) {
  const key = `${signal.source}:${signal.guiId}`;
  if (identityKeys.has(key)) throw new Error(`A GUI source maps more than one artifact to ${signal.guiId}: ${signal.source}`);
  identityKeys.add(key);
}

const nextContents = renderGuiEcosystemSignalsFile(signals);
let previousContents = "";
try {
  previousContents = await readFile(outputPath, "utf8");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

if (previousContents === nextContents) {
  console.log(`GUI ecosystem signals are current as of ${observedAt}.`);
} else {
  await writeFile(outputPath, nextContents, "utf8");
  console.log(`Updated ${signals.length} GUI ecosystem signals as of ${observedAt}.`);
}
