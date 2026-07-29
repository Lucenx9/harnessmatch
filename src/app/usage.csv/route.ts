import { ecosystemSignalSnapshots } from "@/data/ecosystem-signals";
import { harnesses } from "@/data/harnesses";
import { openRouterAttributionSnapshots } from "@/data/openrouter-attribution";
import { siteUrl } from "@/lib/site";
import type {
  EcosystemSignalSnapshot,
  OpenRouterTrendingWindowKey,
  OpenRouterUsageWindowKey,
} from "@/lib/types";

export const dynamic = "force-static";

const windowKeys: OpenRouterUsageWindowKey[] = ["day", "week", "month"];
const trendingWindowKeys: OpenRouterTrendingWindowKey[] = ["week", "month"];

const header = [
  "source",
  "metric",
  "ranking_mode",
  "window_days",
  "window_start",
  "window_end",
  "rank",
  "rank_scope",
  "harness_id",
  "harness_name",
  "profile_url",
  "value",
  "secondary_metric",
  "secondary_value",
  "observed_at",
  "artifact_id",
  "artifact_url",
  "source_url",
];

function csvCell(value: string | number | null) {
  if (value === null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function ecosystemSecondary(signal: EcosystemSignalSnapshot): [string, string | number] {
  if (signal.source === "github") return ["forks", signal.forks];
  if (signal.source === "homebrew") return ["artifact_kind", signal.artifactKind];
  if (signal.source === "github-releases") return ["matched_assets", `${signal.assetCount} across ${signal.releaseCount} stable releases`];
  if (signal.source === "openvsx") return ["latest_version", signal.latestVersion];
  if (signal.source === "jetbrains") return ["plugin_id", signal.pluginId];
  return ["artifact_id", signal.artifactId];
}

export function GET() {
  const activeHarnessById = new Map(
    harnesses.filter((harness) => harness.status === "active").map((harness) => [harness.id, harness]),
  );

  const rankingWindows = [
    ...windowKeys.map((key) => ({ mode: "popular", key, collection: "windows" as const })),
    ...trendingWindowKeys.map((key) => ({ mode: "trending", key, collection: "trendingWindows" as const })),
  ];
  const openRouterRows = rankingWindows.flatMap(({ mode, key, collection }) => (
    openRouterAttributionSnapshots.flatMap((snapshot) => {
      const harness = activeHarnessById.get(snapshot.harnessId);
      if (!harness) return [];
      const window = collection === "windows"
        ? snapshot.windows[key as OpenRouterUsageWindowKey]
        : snapshot.trendingWindows[key as OpenRouterTrendingWindowKey];
      return [[
        "openrouter",
        "attributed_tokens",
        mode,
        window.days,
        window.windowStart,
        window.windowEnd,
        window.rank,
        "global_coding_apps",
        harness.id,
        harness.name,
        `${siteUrl}/harnesses/${harness.slug}`,
        window.attributedTokens,
        "attributed_requests",
        window.attributedRequests,
        window.observedAt,
        snapshot.appSlug,
        snapshot.sourceUrl,
        window.sourceUrl,
      ].map(csvCell).join(",")];
    })
  ));

  const activeSignals = ecosystemSignalSnapshots.filter((signal) => activeHarnessById.has(signal.harnessId));
  const rankBySignal = new Map<string, number>();
  for (const source of ["homebrew", "npm", "github-releases", "vscode", "openvsx", "jetbrains", "github"] as const) {
    activeSignals
      .filter((signal) => signal.source === source)
      .sort((left, right) => right.value - left.value || left.harnessId.localeCompare(right.harnessId))
      .forEach((signal, index) => rankBySignal.set(`${source}:${signal.harnessId}`, index + 1));
  }
  const ecosystemRows = activeSignals.map((signal) => {
    const harness = activeHarnessById.get(signal.harnessId)!;
    const [secondaryMetric, secondaryValue] = ecosystemSecondary(signal);
    return [
      signal.source,
      signal.metric,
      null,
      "windowDays" in signal ? signal.windowDays : null,
      "windowStart" in signal ? signal.windowStart : null,
      "windowEnd" in signal ? signal.windowEnd : null,
      rankBySignal.get(`${signal.source}:${signal.harnessId}`) ?? null,
      "mapped_harnessmatch_products",
      harness.id,
      harness.name,
      `${siteUrl}/harnesses/${harness.slug}`,
      signal.value,
      secondaryMetric,
      secondaryValue,
      signal.observedAt,
      signal.artifactId,
      signal.artifactUrl,
      signal.sourceUrl,
    ].map(csvCell).join(",");
  });

  return new Response([header.join(","), ...openRouterRows, ...ecosystemRows, ""].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="harnessmatch-usage-signals.csv"',
    },
  });
}
