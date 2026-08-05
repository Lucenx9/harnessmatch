import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import {
  isReviewedAccessRestriction,
  mapConcurrentByOrigin,
  shouldRetrySourceProbe,
  sourceHealthFailures,
  sourceHealthRequestHeaders,
  sourceHealthRetryDelayMs,
} from "./lib/source-health-policy.mjs";
import { isAccessRestrictedLanding, safeFetch } from "./source-health-network.mjs";
import { collectUrls } from "./source-health-urls.mjs";
import { loadPublishedDataModules } from "./source-health-modules.mjs";
import { reviewedSourceHealthRestrictions } from "./source-health-reviewed-restrictions.mjs";

const execFile = promisify(execFileCallback);
const concurrency = Number.parseInt(process.env.SOURCE_CHECK_CONCURRENCY ?? "8", 10);
const timeoutMs = Number.parseInt(process.env.SOURCE_CHECK_TIMEOUT_MS ?? "15000", 10);
const restrictedStatuses = new Set([401, 403, 429]);

if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error("SOURCE_CHECK_CONCURRENCY must be a positive integer.");
if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new Error("SOURCE_CHECK_TIMEOUT_MS must be a positive integer.");

function validateReviewedRestrictions(restrictions) {
  const keys = new Set();
  for (const restriction of restrictions) {
    if (typeof restriction.url !== "string" || !restriction.url.startsWith("https://")) {
      throw new Error("A reviewed source restriction has an invalid URL.");
    }
    if (!Number.isInteger(restriction.status) || restriction.status < 100 || restriction.status > 599) {
      throw new Error(`Reviewed source restriction has an invalid status: ${restriction.url}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(restriction.reviewedAt)) {
      throw new Error(`Reviewed source restriction has an invalid review date: ${restriction.url}`);
    }
    if (typeof restriction.reason !== "string" || restriction.reason.trim().length < 10) {
      throw new Error(`Reviewed source restriction needs a rationale: ${restriction.url}`);
    }
    const key = `${restriction.status}:${restriction.url}`;
    if (keys.has(key)) throw new Error(`Reviewed source restriction is duplicated: ${restriction.url}`);
    keys.add(key);
  }
}

async function githubToken() {
  const environmentToken = process.env.GITHUB_TOKEN?.trim();
  if (environmentToken) return environmentToken;
  try {
    const { stdout } = await execFile("gh", ["auth", "token"], { timeout: 5_000 });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function probe(url, githubAccessToken) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const { response, finalUrl, redirected } = await safeFetch(url, {
        method: attempt === 1 ? "HEAD" : "GET",
        signal: controller.signal,
        headers: sourceHealthRequestHeaders(url, githubAccessToken),
      });
      await response.body?.cancel();
      clearTimeout(timeout);

      if (shouldRetrySourceProbe(attempt, response.status)) {
        await new Promise((resolve) => setTimeout(
          resolve,
          sourceHealthRetryDelayMs(response.status, response.headers, attempt),
        ));
        continue;
      }

      return {
        url,
        status: response.status,
        finalUrl,
        redirected,
        state: restrictedStatuses.has(response.status) || isAccessRestrictedLanding(finalUrl)
            ? "access-restricted"
          : response.ok || (response.status >= 300 && response.status < 400)
            ? "healthy"
            : response.status >= 400 && response.status < 500
              ? "broken"
              : "inconclusive",
      };
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }
  }

  return {
    url,
    status: null,
    finalUrl: null,
    redirected: false,
    state: "inconclusive",
    error: lastError instanceof Error ? lastError.message : String(lastError),
  };
}

const { moduleFiles, modules } = await loadPublishedDataModules();
validateReviewedRestrictions(reviewedSourceHealthRestrictions);
const urlSet = new Set();
const seen = new WeakSet();
for (const module of modules) collectUrls(module, urlSet, seen);
const urls = [...urlSet].sort();
const githubAccessToken = await githubToken();
const results = await mapConcurrentByOrigin(urls, (url) => probe(url, githubAccessToken), concurrency, 1);
const broken = results.filter((result) => result.state === "broken");
const restricted = results.filter((result) => result.state === "access-restricted");
const inconclusive = results.filter((result) => result.state === "inconclusive");
const redirected = results.filter((result) => result.redirected);
const reviewedRestricted = restricted.filter((result) => (
  isReviewedAccessRestriction(result, reviewedSourceHealthRestrictions)
));
const unresolvedRestricted = restricted.filter((result) => (
  !isReviewedAccessRestriction(result, reviewedSourceHealthRestrictions)
));
const failures = sourceHealthFailures(results, reviewedSourceHealthRestrictions);

for (const result of broken) {
  console.error(`BROKEN ${result.status ?? "network"} ${result.url}${result.error ? ` — ${result.error}` : ""}`);
}
for (const result of unresolvedRestricted) {
  console.error(`UNREVIEWED RESTRICTION ${result.status} ${result.url}`);
}
for (const result of reviewedRestricted) {
  console.warn(`REVIEWED RESTRICTION ${result.status} ${result.url}`);
}
for (const result of inconclusive) {
  console.warn(`INCONCLUSIVE ${result.status ?? "network"} ${result.url}${result.error ? ` — ${result.error}` : ""}`);
}

console.log(`Checked ${results.length} unique published source URLs across ${moduleFiles.length} data modules.`);
console.log(`${results.length - broken.length - restricted.length - inconclusive.length} healthy, ${reviewedRestricted.length} reviewed access-restricted, ${unresolvedRestricted.length} unreviewed access-restricted, ${inconclusive.length} inconclusive, ${redirected.length} redirected, ${broken.length} broken.`);

if (failures.length > 0) process.exitCode = 1;
