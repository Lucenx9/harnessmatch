import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildOpenRouterSnapshots,
  openRouterApps,
  parseOpenRouterAppPage,
  parseRankingResponses,
  rankingWindows,
  renderOpenRouterAttributionFile,
} from "./lib/openrouter-sync.mjs";

const projectRoot = process.cwd();
const outputPath = resolve(projectRoot, "src/data/openrouter-attribution.ts");
const runObservedAt = new Date().toISOString().slice(0, 10);

async function localApiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  try {
    const localEnv = await readFile(resolve(projectRoot, ".env.local"), "utf8");
    const line = localEnv.split(/\r?\n/).find((candidate) => candidate.startsWith("OPENROUTER_API_KEY="));
    if (!line) return null;
    const raw = line.slice("OPENROUTER_API_KEY=".length).trim();
    if (raw.startsWith('"') && raw.endsWith('"')) return JSON.parse(raw);
    if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1);
    return raw;
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function fetchWithRetry(url, init, label) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(20_000) });
      if (response.ok) return response;
      const body = await response.text();
      if (![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === 3) {
        throw new Error(`${label}: HTTP ${response.status} ${body.slice(0, 240)}`);
      }
    } catch (error) {
      if (attempt === 3) throw error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 750));
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
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function fetchAppMetrics() {
  const records = await mapWithConcurrency(openRouterApps, 4, async (app) => {
    const response = await fetchWithRetry(`https://openrouter.ai/apps/${app.appSlug}`, {}, app.appSlug);
    const parsed = parseOpenRouterAppPage(await response.text(), app);
    return [app.appId, { ...parsed, observedAt: runObservedAt }];
  });
  return new Map(records);
}

function utcDateBefore(isoDate, daysBefore) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - daysBefore);
  return date.toISOString().slice(0, 10);
}

async function fetchRankingPages(apiKey, window) {
  const payloads = [];
  for (const offset of [0, 100]) {
    const url = new URL("https://openrouter.ai/api/v1/datasets/app-rankings");
    url.searchParams.set("category", "coding");
    url.searchParams.set("sort", "popular");
    url.searchParams.set("limit", "100");
    url.searchParams.set("offset", String(offset));
    if (window.startDate) url.searchParams.set("start_date", window.startDate);
    if (window.endDate) url.searchParams.set("end_date", window.endDate);
    const response = await fetchWithRetry(
      url,
      { headers: { Authorization: `Bearer ${apiKey}` } },
      `${window.key} ranking page ${offset / 100 + 1}`,
    );
    payloads.push(await response.json());
  }
  return parseRankingResponses(payloads);
}

const apiKey = await localApiKey();
if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY is missing. Add it to .env.local or the process environment.");
}

const [pageMetrics, monthRanking] = await Promise.all([
  fetchAppMetrics(),
  fetchRankingPages(apiKey, { key: "month" }),
]);
const resolvedEndDate = monthRanking.meta.windowEnd;
const shorterWindows = await Promise.all(
  rankingWindows
    .filter(({ key }) => key !== "month")
    .map(({ key, days }) => fetchRankingPages(apiKey, {
      key,
      startDate: utcDateBefore(resolvedEndDate, days - 1),
      endDate: resolvedEndDate,
    })),
);
const rankings = {
  month: monthRanking,
  ...Object.fromEntries(
    rankingWindows
      .filter(({ key }) => key !== "month")
      .map(({ key }, index) => [key, shorterWindows[index]]),
  ),
};
const snapshots = buildOpenRouterSnapshots(pageMetrics, rankings);
const nextContents = renderOpenRouterAttributionFile(snapshots);
const previousContents = await readFile(outputPath, "utf8");

if (previousContents === nextContents) {
  console.log(`OpenRouter attribution is current through ${resolvedEndDate}.`);
} else {
  await writeFile(outputPath, nextContents, "utf8");
  const listed = snapshots.filter((snapshot) => snapshot.windows.month.rank !== null).length;
  console.log(`Updated ${snapshots.length} OpenRouter app snapshots through ${resolvedEndDate}; ${listed} are listed in the 30-day coding window.`);
}
