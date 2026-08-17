const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const openRouterApps = [
  { harnessId: "hermes-agent", appId: 3_067_167, appName: "Hermes Agent", originUrl: "https://hermes-agent.nousresearch.com/", slug: "hermes-agent", integrationUrl: "https://openrouter.ai/docs/cookbook/coding-agents/hermes-integration" },
  { harnessId: "kilo-code", appId: 2_262_242, appName: "Kilo Code", originUrl: "https://kilocode.ai/", slug: "kilo-code", integrationUrl: "https://kilo.ai/docs/ai-providers/openrouter" },
  { harnessId: "openclaw", appId: 2_725_608, appName: "OpenClaw", originUrl: "https://openclaw.ai/", slug: "openclaw", integrationUrl: "https://openrouter.ai/docs/cookbook/coding-agents/openclaw-integration" },
  { harnessId: "claude-code", appId: 2_627_404, appName: "Claude Code", originUrl: "https://claude.ai/code", slug: "claude-code", integrationUrl: "https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration" },
  { harnessId: "openhands", appId: 189_563, appName: "OpenHands", originUrl: "https://docs.all-hands.dev/", slug: "openhands" },
  { harnessId: "omp", appId: 3_682_314, appName: "Oh-My-Pi", acceptedAppNames: ["Oh-My-Pi", "omp"], originUrl: "https://omp.sh/", slug: null },
  { harnessId: "cline", appId: 190_604, appName: "Cline", originUrl: "https://cline.bot/", slug: "cline", integrationUrl: "https://docs.cline.bot/provider-config/openrouter" },
  { harnessId: "pi", appId: 2_853_275, appName: "pi", originUrl: "https://pi.dev/", slug: "pi" },
  { harnessId: "command-code", appId: 3_909_382, appName: "Command Code", originUrl: "https://commandcode.ai/", slug: null },
  { harnessId: "aider", appId: 143_418, appName: "Aider", originUrl: "https://aider.chat/", slug: "aider", integrationUrl: "https://aider.chat/docs/llms/openrouter.html" },
  { harnessId: "codebuff", appId: 1_275_184, appName: "Codebuff", originUrl: "https://codebuff.com/", slug: null },
  { harnessId: "opensquilla", appId: 3_451_751, appName: "OpenSquilla", originUrl: "https://opensquilla.ai/", slug: null },
  { harnessId: "goose", appId: 3_248_223, appName: "goose", originUrl: "https://goose-docs.ai/", slug: null },
  { harnessId: "poolside-cli", appId: 2_697_020, appName: "Poolside", originUrl: "https://poolside.ai/", slug: "pool", integrationUrl: "https://github.com/poolsideai/pool#openrouter" },
  { harnessId: "crush", appId: 2_351_296, appName: "Crush", originUrl: "https://charm.land/", slug: null },
  { harnessId: "codex", appId: 2_668_297, appName: "Codex", originUrl: "https://openai.com/codex/", slug: "codex" },
  { harnessId: "qwen-code", appId: 2_354_934, appName: "Qwen Code", originUrl: "https://github.com/QwenLM/qwen-code.git", slug: "qwen-code" },
  { harnessId: "mimo-code", appId: 3_980_383, appName: "mimocode", originUrl: "https://mimo.xiaomi.com/coder", slug: null },
  { harnessId: "cursor-cli", appId: 2_237_546, appName: "Cursor", originUrl: "https://cursor.com/", slug: null },
  { harnessId: "deepagents-code", appId: 3_687_500, appName: "Deep Agents Code", originUrl: "https://pypi.org/project/deepagents-code", slug: null },
  { harnessId: "ante", appId: 3_067_206, appName: "Ante", originUrl: "https://docs.antigma.ai/", slug: null },
  { harnessId: "postqode", appId: 2_304_560, appName: "PostQode", originUrl: "https://postqode.ai/", slug: null },
  { harnessId: "kern", appId: 3_149_465, appName: "Kern Agent", originUrl: "https://github.com/oguzbilgic/kern-ai", slug: null },
  { harnessId: "junie-cli", appId: 3_053_821, appName: "Junie", originUrl: "https://www.jetbrains.com/junie", slug: "junie" },
  { harnessId: "wakil", appId: 4_397_443, appName: "wakil", originUrl: "https://github.com/treeol/wakil", slug: null },
  { harnessId: "ggcode", appId: 4_434_691, appName: "GGCode", originUrl: "https://ggcode.dev/", slug: null },
  { harnessId: "slate", appId: 2_567_728, appName: "Slate Agent", originUrl: "https://randomlabs.ai/", slug: null },
];

export const rankingDatasetSourceUrl = "https://openrouter.ai/docs/agent-sdk/typescript/api-reference/datasets";

export const rankingWindows = [
  { key: "day", days: 1 },
  { key: "week", days: 7 },
  { key: "month", days: 30 },
];

export const trendingRankingWindows = rankingWindows.filter(({ key }) => key !== "day");

export function openRouterAppUrl(app) {
  return app.slug === null
    ? `https://openrouter.ai/apps/url/${encodeURIComponent(app.originUrl)}`
    : `https://openrouter.ai/apps/${app.slug}`;
}

function isAcceptedAppName(app, appName) {
  return (app.acceptedAppNames ?? [app.appName]).includes(appName);
}

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
  const idMarker = `\\"id\\":${app.appId},`;
  const markerIndex = html.indexOf(idMarker);
  if (markerIndex === -1) {
    throw new Error(`${app.harnessId}: canonical app payload was not found`);
  }

  const payload = html.slice(markerIndex, markerIndex + 3_000);
  const escapedJsonString = (value) => JSON.stringify(value).replaceAll('"', String.raw`\"`);
  const expectedIdentity = [
    `\\"origin_url\\":${escapedJsonString(app.originUrl)}`,
    `\\"slug\\":${app.slug === null ? "null" : escapedJsonString(app.slug)}`,
  ];
  const hasAcceptedTitle = (app.acceptedAppNames ?? [app.appName]).some((appName) => (
    payload.includes(`\\"title\\":${escapedJsonString(appName)}`)
  ));
  if (expectedIdentity.some((field) => !payload.includes(field)) || !hasAcceptedTitle) {
    throw new Error(`${app.harnessId}: canonical app identity changed`);
  }

  const stats = payload.match(/\\"totalTokens\\":(\d+),\\"rank\\":(null|\d+),\\"modelsUsed\\":(\d+)/);
  if (!stats) {
    throw new Error(`${app.harnessId}: public app metrics could not be parsed`);
  }

  return {
    appId: app.appId,
    attributedTokens: parseInteger(stats[1], `${app.harnessId} attributed tokens`),
    dailyGlobalRank: stats[2] === "null" ? null : parseInteger(stats[2], `${app.harnessId} daily global rank`),
    modelsObserved: parseInteger(stats[3], `${app.harnessId} models observed`),
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
    if (!page) throw new Error(`${app.harnessId}: public app metrics are missing`);
    const windows = Object.fromEntries(rankingWindows.map(({ key, days }) => {
      const ranking = rankings[key];
      const ranked = ranking.rowsByAppId.get(app.appId) ?? null;
      if (ranked && !isAcceptedAppName(app, ranked.appName)) {
        throw new Error(`${app.harnessId}: ranking name changed from ${app.appName} to ${ranked.appName}`);
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
      if (ranked && !isAcceptedAppName(app, ranked.appName)) {
        throw new Error(`${app.harnessId}: trending ranking name changed from ${app.appName} to ${ranked.appName}`);
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
      artifactId: app.appName,
      appId: app.appId,
      sourceUrl: openRouterAppUrl(app),
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
      `    artifactId: ${quote(snapshot.artifactId)},`,
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
