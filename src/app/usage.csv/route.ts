import { harnesses } from "@/data/harnesses";
import { openRouterAttributionSnapshots } from "@/data/openrouter-attribution";
import { siteUrl } from "@/lib/site";
import type { OpenRouterUsageWindowKey } from "@/lib/types";

export const dynamic = "force-static";

const windowKeys: OpenRouterUsageWindowKey[] = ["day", "week", "month"];

function csvCell(value: string | number | null) {
  if (value === null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function GET() {
  const harnessById = new Map(harnesses.map((harness) => [harness.id, harness]));
  const header = [
    "window_days",
    "window_start",
    "window_end",
    "openrouter_coding_rank",
    "harness_id",
    "harness_name",
    "profile_url",
    "attributed_tokens",
    "attributed_requests",
    "observed_at",
    "source_url",
  ];
  const rows = windowKeys.flatMap((key) => openRouterAttributionSnapshots.flatMap((snapshot) => {
    const harness = harnessById.get(snapshot.harnessId);
    if (!harness || harness.status !== "active") return [];
    const window = snapshot.windows[key];
    return [[
      window.days,
      window.windowStart,
      window.windowEnd,
      window.rank,
      harness.id,
      harness.name,
      `${siteUrl}/harnesses/${harness.slug}`,
      window.attributedTokens,
      window.attributedRequests,
      window.observedAt,
      window.sourceUrl,
    ].map(csvCell).join(",")];
  }));

  return new Response([header.join(","), ...rows, ""].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="harnessmatch-openrouter-usage.csv"',
    },
  });
}
