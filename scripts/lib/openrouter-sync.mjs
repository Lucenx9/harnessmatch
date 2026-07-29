const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const openRouterApps = [
  { harnessId: "hermes-agent", appSlug: "hermes-agent", appId: 3_067_167, appName: "Hermes Agent", integrationUrl: "https://openrouter.ai/docs/cookbook/coding-agents/hermes-integration" },
  { harnessId: "kilo-code", appSlug: "kilo-code", appId: 2_262_242, appName: "Kilo Code", integrationUrl: "https://kilo.ai/docs/providers/openrouter" },
  { harnessId: "openclaw", appSlug: "openclaw", appId: 2_725_608, appName: "OpenClaw", integrationUrl: "https://openrouter.ai/docs/cookbook/coding-agents/openclaw-integration" },
  { harnessId: "claude-code", appSlug: "claude-code", appId: 2_627_404, appName: "Claude Code", integrationUrl: "https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration" },
  { harnessId: "openhands", appSlug: "openhands", appId: 189_563, appName: "OpenHands" },
  { harnessId: "omp", appSlug: "oh-my-pi", appId: 2_929_093, appName: "Oh My Pi" },
  { harnessId: "cline", appSlug: "cline", appId: 190_604, appName: "Cline", integrationUrl: "https://docs.cline.bot/provider-config/openrouter" },
  { harnessId: "pi", appSlug: "pi", appId: 2_853_275, appName: "pi" },
  { harnessId: "aider", appSlug: "aider", appId: 143_418, appName: "Aider", integrationUrl: "https://aider.chat/docs/llms/openrouter.html" },
  { harnessId: "goose", appSlug: "goose", appId: 2_236_657, appName: "Goose" },
  { harnessId: "codex", appSlug: "codex", appId: 2_668_297, appName: "Codex" },
  { harnessId: "qwen-code", appSlug: "qwen-code", appId: 2_354_934, appName: "Qwen Code" },
];

export const rankingDatasetSourceUrl = "https://openrouter.ai/docs/agent-sdk/typescript/api-reference/datasets";

export const rankingWindows = [
  { key: "day", days: 1 },
  { key: "week", days: 7 },
  { key: "month", days: 30 },
];

export const trendingRankingWindows = rankingWindows.filter(({ key }) => key !== "day");

function assertSafePositiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer`);
  }
}

function assertIsoDate(value, label) {
  if (!isoDatePattern.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${label} must be an ISO date`);
  }
}

function parseInteger(value, label) {
  const parsed = typeof value === "number" ? value : Number(value);
  assertSafePositiveInteger(parsed, label);
  return parsed;
}

function inclusiveUtcDays(startDate, endDate) {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000) + 1;
}

export function parseOpenRouterAppPage(html, app) {
  const marker = `\\"slug\\":\\"${app.appSlug}\\"`;
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`${app.appSlug}: canonical app payload was not found`);
  }

  const beforeMarker = html.slice(Math.max(0, markerIndex - 2_000), markerIndex);
  const afterMarker = html.slice(markerIndex, markerIndex + 3_000);
  const idMatches = [...beforeMarker.matchAll(/\\"id\\":(\d+)/g)];
  const appId = Number(idMatches.at(-1)?.[1]);
  const stats = afterMarker.match(/\\"totalTokens\\":(\d+),\\"rank\\":(null|\d+),\\"modelsUsed\\":(\d+)/);

  if (!Number.isSafeInteger(appId) || !stats) {
    throw new Error(`${app.appSlug}: app identity or public metrics could not be parsed`);
  }
  if (appId !== app.appId) {
    throw new Error(`${app.appSlug}: canonical app id changed from ${app.appId} to ${appId}`);
  }

  return {
    appId,
    attributedTokens: parseInteger(stats[1], `${app.appSlug} attributed tokens`),
    dailyGlobalRank: stats[2] === "null" ? null : parseInteger(stats[2], `${app.appSlug} daily global rank`),
    modelsObserved: parseInteger(stats[3], `${app.appSlug} models observed`),
  };
}

export function parseRankingResponses(payloads) {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new Error("OpenRouter ranking response is empty");
  }

  const firstMeta = payloads[0]?.meta;
  if (!firstMeta || typeof firstMeta.as_of !== "string" || typeof firstMeta.version !== "string") {
    throw new Error("OpenRouter ranking metadata is incomplete");
  }
  assertIsoDate(firstMeta.start_date, "ranking start date");
  assertIsoDate(firstMeta.end_date, "ranking end date");
  const observedAt = firstMeta.as_of.slice(0, 10);
  assertIsoDate(observedAt, "ranking observation date");

  const rowsByAppId = new Map();
  for (const payload of payloads) {
    const meta = payload?.meta;
    if (
      meta?.start_date !== firstMeta.start_date
      || meta?.end_date !== firstMeta.end_date
      || meta?.version !== firstMeta.version
    ) {
      throw new Error("OpenRouter ranking pages do not describe the same dataset window");
    }
    if (!Array.isArray(payload.data)) {
      throw new Error("OpenRouter ranking data is not an array");
    }
    for (const row of payload.data) {
      const appId = parseInteger(row.app_id, "ranking app id");
      if (rowsByAppId.has(appId)) {
        throw new Error(`OpenRouter ranking dataset repeats app id ${appId}`);
      }
      rowsByAppId.set(appId, {
        appId,
        appName: String(row.app_name),
        rank: parseInteger(row.rank, `${appId} ranking`),
        attributedTokens: parseInteger(row.total_tokens, `${appId} rolling tokens`),
        attributedRequests: parseInteger(row.total_requests, `${appId} rolling requests`),
      });
    }
  }

  return {
    rowsByAppId,
    meta: {
      windowStart: firstMeta.start_date,
      windowEnd: firstMeta.end_date,
      observedAt,
      datasetVersion: firstMeta.version,
    },
  };
}

export function buildOpenRouterSnapshots(pageMetrics, rankings, trendingRankings) {
  for (const { key, days } of rankingWindows) {
    const ranking = rankings[key];
    if (!ranking) throw new Error(`${key} ranking window is missing`);
    const actualDays = inclusiveUtcDays(ranking.meta.windowStart, ranking.meta.windowEnd);
    if (actualDays !== days) {
      throw new Error(`${key} ranking spans ${actualDays} days instead of ${days}`);
    }
  }
  for (const { key, days } of trendingRankingWindows) {
    const ranking = trendingRankings[key];
    if (!ranking) throw new Error(`${key} trending ranking window is missing`);
    const actualDays = inclusiveUtcDays(ranking.meta.windowStart, ranking.meta.windowEnd);
    if (actualDays !== days) {
      throw new Error(`${key} trending ranking spans ${actualDays} days instead of ${days}`);
    }
  }

  return openRouterApps.map((app) => {
    const page = pageMetrics.get(app.appId);
    if (!page) throw new Error(`${app.appSlug}: public app metrics are missing`);
    const windows = Object.fromEntries(rankingWindows.map(({ key, days }) => {
      const ranking = rankings[key];
      const ranked = ranking.rowsByAppId.get(app.appId) ?? null;
      if (ranked && ranked.appName !== app.appName) {
        throw new Error(`${app.appSlug}: ranking name changed from ${app.appName} to ${ranked.appName}`);
      }

      return [key, {
        category: "coding",
        days,
        rank: ranked?.rank ?? null,
        attributedTokens: ranked?.attributedTokens ?? null,
        attributedRequests: ranked?.attributedRequests ?? null,
        ...ranking.meta,
        sourceUrl: rankingDatasetSourceUrl,
      }];
    }));
    const trendingWindows = Object.fromEntries(trendingRankingWindows.map(({ key, days }) => {
      const ranking = trendingRankings[key];
      const ranked = ranking.rowsByAppId.get(app.appId) ?? null;
      if (ranked && ranked.appName !== app.appName) {
        throw new Error(`${app.appSlug}: trending ranking name changed from ${app.appName} to ${ranked.appName}`);
      }

      return [key, {
        category: "coding",
        days,
        rank: ranked?.rank ?? null,
        attributedTokens: ranked?.attributedTokens ?? null,
        attributedRequests: ranked?.attributedRequests ?? null,
        ...ranking.meta,
        sourceUrl: rankingDatasetSourceUrl,
      }];
    }));

    return {
      harnessId: app.harnessId,
      appSlug: app.appSlug,
      appId: app.appId,
      sourceUrl: `https://openrouter.ai/apps/${app.appSlug}`,
      ...(app.integrationUrl ? { integrationUrl: app.integrationUrl } : {}),
      ...page,
      windows,
      trendingWindows,
    };
  });
}

function formatInteger(value) {
  if (value === null) return "null";
  return value.toLocaleString("en-US").replaceAll(",", "_");
}

function quote(value) {
  return JSON.stringify(value);
}

function appendRankingWindow(lines, key, window) {
  lines.push(
    `      ${key}: {`,
    `        category: ${quote(window.category)},`,
    `        days: ${window.days},`,
    `        rank: ${formatInteger(window.rank)},`,
    `        attributedTokens: ${formatInteger(window.attributedTokens)},`,
    `        attributedRequests: ${formatInteger(window.attributedRequests)},`,
    `        windowStart: ${quote(window.windowStart)},`,
    `        windowEnd: ${quote(window.windowEnd)},`,
    `        observedAt: ${quote(window.observedAt)},`,
    `        datasetVersion: ${quote(window.datasetVersion)},`,
    `        sourceUrl: ${quote(window.sourceUrl)},`,
    "      },",
  );
}

export function renderOpenRouterAttributionFile(snapshots) {
  const records = snapshots.map((snapshot) => {
    const lines = [
      "  {",
      `    harnessId: ${quote(snapshot.harnessId)},`,
      `    appSlug: ${quote(snapshot.appSlug)},`,
      `    appId: ${formatInteger(snapshot.appId)},`,
      `    sourceUrl: ${quote(snapshot.sourceUrl)},`,
    ];
    if (snapshot.integrationUrl) lines.push(`    integrationUrl: ${quote(snapshot.integrationUrl)},`);
    lines.push(
      `    attributedTokens: ${formatInteger(snapshot.attributedTokens)},`,
      `    dailyGlobalRank: ${formatInteger(snapshot.dailyGlobalRank)},`,
      `    modelsObserved: ${formatInteger(snapshot.modelsObserved)},`,
      `    observedAt: ${quote(snapshot.observedAt)},`,
      "    windows: {",
    );
    for (const { key } of rankingWindows) {
      appendRankingWindow(lines, key, snapshot.windows[key]);
    }
    lines.push("    },", "    trendingWindows: {");
    for (const { key } of trendingRankingWindows) {
      appendRankingWindow(lines, key, snapshot.trendingWindows[key]);
    }
    lines.push("    },", "  },");
    return lines.join("\n");
  }).join("\n");

  return `import type { OpenRouterAttributionSnapshot } from "../lib/types";\n\n/**\n * Generated by \`npm run sync:openrouter\` from canonical OpenRouter app pages\n * and authenticated popular plus trending coding-app ranking datasets. These\n * records are ecosystem context only; they never affect capability claims or classification.\n */\nexport const openRouterAttributionSnapshots: OpenRouterAttributionSnapshot[] = [\n${records}\n];\n\nexport const openRouterAttributionByHarness = new Map(\n  openRouterAttributionSnapshots.map((snapshot) => [snapshot.harnessId, snapshot]),\n);\n`;
}
