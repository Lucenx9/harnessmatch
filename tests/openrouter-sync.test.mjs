import { describe, expect, it } from "vitest";
import {
  buildOpenRouterSnapshots,
  openRouterApps,
  parseOpenRouterAppPage,
  parseRankingResponses,
  renderOpenRouterAttributionFile,
} from "../scripts/lib/openrouter-sync.mjs";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution.ts";

describe("OpenRouter attribution sync", () => {
  it("keeps the generated dataset aligned with the stable app mapping", () => {
    expect(openRouterAttributionSnapshots.map(({ harnessId, appSlug, appId }) => ({ harnessId, appSlug, appId }))).toEqual(
      openRouterApps.map(({ harnessId, appSlug, appId }) => ({ harnessId, appSlug, appId })),
    );
  });

  it("extracts only the canonical app payload", () => {
    const app = openRouterApps[0];
    const html = `noise \\"id\\":42 ${`\\"id\\":${app.appId}`} \\"slug\\":\\"${app.appSlug}\\"},\\"totalTokens\\":29665059035281,\\"rank\\":1,\\"modelsUsed\\":394 tail`;
    expect(parseOpenRouterAppPage(html, app)).toEqual({
      appId: app.appId,
      attributedTokens: 29_665_059_035_281,
      dailyGlobalRank: 1,
      modelsObserved: 394,
    });
  });

  it("joins ranking rows by stable app id instead of duplicate names", () => {
    const app = openRouterApps[0];
    function rankingFor(startDate) {
      return parseRankingResponses([{
        data: [{
          app_id: app.appId,
          app_name: app.appName,
          rank: 1,
          total_tokens: "1000",
          total_requests: 20,
        }],
        meta: {
          as_of: "2026-07-28T22:57:13.831Z",
          version: "v1",
          start_date: startDate,
          end_date: "2026-07-27",
        },
      }]);
    }
    const rankings = {
      day: rankingFor("2026-07-27"),
      week: rankingFor("2026-07-21"),
      month: rankingFor("2026-06-28"),
    };
    const pageMetrics = new Map(openRouterApps.map((candidate) => [candidate.appId, {
      appId: candidate.appId,
      attributedTokens: 10,
      dailyGlobalRank: null,
      modelsObserved: 1,
      observedAt: "2026-07-28",
    }]));
    const snapshots = buildOpenRouterSnapshots(pageMetrics, rankings);

    expect(snapshots[0].windows.month).toMatchObject({ days: 30, rank: 1, attributedTokens: 1_000, attributedRequests: 20 });
    expect(snapshots[1].windows.day).toMatchObject({ days: 1, rank: null, attributedTokens: null, attributedRequests: null });
    expect(renderOpenRouterAttributionFile(snapshots)).toContain("ecosystem context only");
  });
});
