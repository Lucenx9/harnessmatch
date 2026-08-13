import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseRepositoryAudits } from "./lib/ecosystem-signals.mjs";
import { fetchJsonWithRetry as fetchJsonResponseWithRetry } from "./lib/fetch-with-retry.mjs";
import { githubReleaseWatches } from "./lib/release-watch-mappings.mjs";
import {
  buildHarnessReleaseSnapshot,
  githubReleasePageSize,
  releaseHistoryPageNeedsNextPage,
  renderHarnessReleaseSnapshots,
} from "./lib/release-signals.mjs";

const execFile = promisify(execFileCallback);
const projectRoot = process.cwd();
const outputPath = resolve(projectRoot, "src/data/release-signals.json");
const repositoryAuditPath = resolve(projectRoot, "src/data/repository-audits.ts");
const observedAt = new Date().toISOString().slice(0, 10);
// Keep high-volume repositories fully scannable while bounding API work.
const maximumPages = 25;

async function fetchJsonWithRetry(url, init, label) {
  return fetchJsonResponseWithRetry(url, init, {
    label,
    timeoutMs: 45_000,
    retryDelayMs: 1_000,
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
      `https://api.github.com/repos/${repository}/releases?per_page=${githubReleasePageSize}&page=${page}`,
      { headers },
      `GitHub release feed ${watch.harnessId} page ${page}`,
    );
    if (!Array.isArray(payload)) throw new Error(`GitHub release schema changed for ${watch.harnessId}`);
    releases.push(...payload);
    if (!releaseHistoryPageNeedsNextPage(payload)) return releases;
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
