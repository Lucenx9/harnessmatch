import { readdir } from "node:fs/promises";
import { createViteServer } from "vitest/node";

const dataRoot = new URL("../src/data/", import.meta.url);
const concurrency = Number.parseInt(process.env.SOURCE_CHECK_CONCURRENCY ?? "8", 10);
const timeoutMs = Number.parseInt(process.env.SOURCE_CHECK_TIMEOUT_MS ?? "15000", 10);
const restrictedStatuses = new Set([401, 403, 429]);

if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error("SOURCE_CHECK_CONCURRENCY must be a positive integer.");
if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new Error("SOURCE_CHECK_TIMEOUT_MS must be a positive integer.");

function urlsIn(source) {
  const matches = source.match(/https?:\/\/[^\s"'`<>\\]+/g) ?? [];
  return matches.map((url) => url.replace(/[),.;]+$/, ""));
}

async function probe(url) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: attempt === 1 ? "HEAD" : "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          accept: "text/html,application/xhtml+xml,application/json,text/plain,*/*",
          "user-agent": "HarnessMatch source-health audit (+https://harnessmatch.dev)",
        },
      });
      await response.body?.cancel();
      clearTimeout(timeout);

      if (attempt === 1 && [404, 405, 501].includes(response.status)) continue;
      if (response.status >= 500 && attempt < 3) continue;

      return {
        url,
        status: response.status,
        finalUrl: response.url,
        redirected: response.redirected,
        state: response.ok || (response.status >= 300 && response.status < 400)
          ? "healthy"
          : restrictedStatuses.has(response.status)
            ? "access-restricted"
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

async function mapConcurrent(items, worker, limit) {
  const results = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function collectUrls(value, urls, seen) {
  if (typeof value === "string") {
    for (const url of urlsIn(value)) urls.add(url);
    return;
  }
  if (value === null || (typeof value !== "object" && typeof value !== "function")) return;
  if (seen.has(value)) return;
  seen.add(value);
  if (typeof value === "function") return;
  for (const item of Object.values(value)) collectUrls(item, urls, seen);
}

const moduleFiles = (await readdir(dataRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
  .map((entry) => `/src/data/${entry.name}`);
const vite = await createViteServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const modules = await Promise.all(moduleFiles.map((path) => vite.ssrLoadModule(path)));
await vite.close();
const urlSet = new Set();
const seen = new WeakSet();
for (const module of modules) collectUrls(module, urlSet, seen);
const urls = [...urlSet].sort();
const results = await mapConcurrent(urls, probe, concurrency);
const broken = results.filter((result) => result.state === "broken");
const restricted = results.filter((result) => result.state === "access-restricted");
const inconclusive = results.filter((result) => result.state === "inconclusive");
const redirected = results.filter((result) => result.redirected);

for (const result of broken) {
  console.error(`BROKEN ${result.status ?? "network"} ${result.url}${result.error ? ` — ${result.error}` : ""}`);
}
for (const result of restricted) {
  console.warn(`RESTRICTED ${result.status} ${result.url}`);
}
for (const result of inconclusive) {
  console.warn(`INCONCLUSIVE ${result.status ?? "network"} ${result.url}${result.error ? ` — ${result.error}` : ""}`);
}

console.log(`Checked ${results.length} unique published source URLs across ${moduleFiles.length} data modules.`);
console.log(`${results.length - broken.length - restricted.length - inconclusive.length} healthy, ${restricted.length} access-restricted, ${inconclusive.length} inconclusive, ${redirected.length} redirected, ${broken.length} broken.`);

if (broken.length > 0) process.exitCode = 1;
