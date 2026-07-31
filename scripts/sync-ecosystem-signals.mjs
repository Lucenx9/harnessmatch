import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  parseGitHubRepository,
  parseGitHubReleaseDownloads,
  parseHomebrewAnalytics,
  parseJetBrainsPlugin,
  parseNpmDownloads,
  parseOpenVsxExtension,
  parseRepositoryAudits,
  parseVsCodeExtension,
  renderEcosystemSignalsFile,
  validateNpmPackageIdentity,
} from "./lib/ecosystem-signals.mjs";
import {
  githubReleaseArtifacts,
  homebrewArtifacts,
  jetBrainsPlugins,
  npmPackages,
  openVsxExtensions,
  vsCodeExtensions,
} from "./lib/ecosystem-signal-mappings.mjs";
import { fetchResponseWithRetry } from "./lib/fetch-with-retry.mjs";

const execFile = promisify(execFileCallback);
const projectRoot = process.cwd();
const outputPath = resolve(projectRoot, "src/data/ecosystem-signals.ts");
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

async function homebrewSignals() {
  const [formulaPayload, caskPayload] = await Promise.all([
    fetchWithRetry("https://formulae.brew.sh/api/analytics/install-on-request/homebrew-core/30d.json", {}, "Homebrew formula analytics").then((response) => response.json()),
    fetchWithRetry("https://formulae.brew.sh/api/analytics/cask-install/homebrew-cask/30d.json", {}, "Homebrew cask analytics").then((response) => response.json()),
  ]);
  return [
    ...parseHomebrewAnalytics(formulaPayload, homebrewArtifacts.filter(({ artifactKind }) => artifactKind === "formula"), "formula", observedAt),
    ...parseHomebrewAnalytics(caskPayload, homebrewArtifacts.filter(({ artifactKind }) => artifactKind === "cask"), "cask", observedAt),
  ];
}

async function npmSignals() {
  return mapWithConcurrency(npmPackages, 5, async (artifact) => {
    const encodedPackage = artifact.artifactId.split("/").map(encodeURIComponent).join("/");
    const [downloadsResponse, identityResponse] = await Promise.all([
      fetchWithRetry(
        `https://api.npmjs.org/downloads/point/last-month/${encodedPackage}`,
        {},
        `npm ${artifact.artifactId} downloads`,
      ),
      artifact.identity.kind === "install-page"
        ? fetchWithRetry(artifact.identity.value, {}, `npm ${artifact.artifactId} install page`)
        : fetchWithRetry(`https://registry.npmjs.org/${encodeURIComponent(artifact.artifactId)}/latest`, {}, `npm ${artifact.artifactId} identity`),
    ]);
    if (artifact.identity.kind === "install-page") {
      const identityText = await identityResponse.text();
      if (!identityText.includes(artifact.identity.contains)) {
        throw new Error(`Official install-page identity changed for ${artifact.artifactId}`);
      }
    } else {
      validateNpmPackageIdentity(await identityResponse.json(), artifact);
    }
    return parseNpmDownloads(await downloadsResponse.json(), artifact, observedAt);
  });
}

async function vsCodeSignals() {
  return mapWithConcurrency(vsCodeExtensions, 3, async (artifact) => {
    const response = await fetchWithRetry(
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
      {
        method: "POST",
        headers: {
          Accept: "application/json;api-version=7.2-preview.1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: [{ criteria: [{ filterType: 7, value: artifact.artifactId }] }],
          flags: 914,
        }),
      },
      `VS Code ${artifact.artifactId}`,
    );
    return parseVsCodeExtension(await response.json(), artifact, observedAt);
  });
}

async function openVsxSignals() {
  return mapWithConcurrency(openVsxExtensions, 3, async (artifact) => {
    const response = await fetchWithRetry(
      `https://open-vsx.org/api/${artifact.artifactId}`,
      { headers: { Accept: "application/json", "User-Agent": "HarnessMatch-ecosystem-sync" } },
      `Open VSX ${artifact.artifactId}`,
    );
    return parseOpenVsxExtension(await response.json(), artifact, observedAt);
  });
}

async function jetBrainsSignals() {
  return mapWithConcurrency(jetBrainsPlugins, 3, async (artifact) => {
    const response = await fetchWithRetry(
      `https://plugins.jetbrains.com/api/plugins/${artifact.pluginId}`,
      { headers: { Accept: "application/json", "User-Agent": "HarnessMatch-ecosystem-sync" } },
      `JetBrains ${artifact.artifactId}`,
    );
    return parseJetBrainsPlugin(await response.json(), artifact, observedAt);
  });
}

async function githubHeaders() {
  const token = await githubToken();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "HarnessMatch-ecosystem-sync",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function canonicalRepositoryAudits() {
  const source = await readFile(resolve(projectRoot, "src/data/repository-audits.ts"), "utf8");
  return parseRepositoryAudits(source);
}

async function githubSignals() {
  const [audits, headers] = await Promise.all([canonicalRepositoryAudits(), githubHeaders()]);
  return mapWithConcurrency(audits, 4, async (audit) => {
    const slug = audit.repositoryUrl.replace("https://github.com/", "");
    const response = await fetchWithRetry(`https://api.github.com/repos/${slug}`, { headers }, `GitHub ${slug}`);
    return parseGitHubRepository(await response.json(), audit, observedAt);
  });
}

async function githubReleaseSignals() {
  const [audits, headers] = await Promise.all([canonicalRepositoryAudits(), githubHeaders()]);
  const auditByHarness = new Map(audits.map((audit) => [audit.harnessId, audit]));
  return mapWithConcurrency(githubReleaseArtifacts, 3, async (artifact) => {
    const audit = auditByHarness.get(artifact.harnessId);
    if (!audit) throw new Error(`No canonical repository audit for GitHub releases: ${artifact.harnessId}`);
    const slug = audit.repositoryUrl.replace("https://github.com/", "");
    const releases = [];
    for (let page = 1; ; page += 1) {
      const response = await fetchWithRetry(
        `https://api.github.com/repos/${slug}/releases?per_page=100&page=${page}`,
        { headers },
        `GitHub releases ${slug} page ${page}`,
      );
      const pageReleases = await response.json();
      if (!Array.isArray(pageReleases)) throw new Error(`GitHub releases schema changed for ${slug}`);
      releases.push(...pageReleases);
      if (pageReleases.length < 100) break;
    }
    return parseGitHubReleaseDownloads(releases, artifact, audit, observedAt);
  });
}

const groups = await Promise.all([
  homebrewSignals(),
  npmSignals(),
  vsCodeSignals(),
  openVsxSignals(),
  jetBrainsSignals(),
  githubReleaseSignals(),
  githubSignals(),
]);
const signals = groups.flat().sort((left, right) => (
  left.source.localeCompare(right.source) || left.harnessId.localeCompare(right.harnessId)
));
const identityKeys = new Set();
for (const signal of signals) {
  const key = `${signal.source}:${signal.harnessId}`;
  if (identityKeys.has(key)) throw new Error(`A source maps more than one artifact to ${signal.harnessId}: ${signal.source}`);
  identityKeys.add(key);
}

const nextContents = renderEcosystemSignalsFile(signals);
let previousContents = "";
try {
  previousContents = await readFile(outputPath, "utf8");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

if (previousContents === nextContents) {
  console.log(`Ecosystem signals are current as of ${observedAt}.`);
} else {
  await writeFile(outputPath, nextContents, "utf8");
  const counts = Object.fromEntries(groups.map((group) => [group[0]?.source, group.length]));
  console.log(`Updated ${signals.length} ecosystem signals as of ${observedAt}: ${JSON.stringify(counts)}.`);
}
