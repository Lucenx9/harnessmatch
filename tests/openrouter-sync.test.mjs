import { describe, expect, it } from "vitest";
import {
  buildOpenRouterSnapshots,
  openRouterApps,
  openRouterAppUrl,
  parseOpenRouterAppPage,
  parseRankingResponses,
  renderOpenRouterAttributionFile,
} from "../scripts/lib/openrouter-sync.mjs";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution.ts";

describe("OpenRouter attribution sync", () => {
  it("keeps the generated dataset aligned with the stable app mapping", () => {
    expect(openRouterAttributionSnapshots.map(({ harnessId, artifactId, appId, sourceUrl, integrationUrl }) => (
      { harnessId, artifactId, appId, sourceUrl, integrationUrl }
    ))).toEqual(
      openRouterApps.map((app) => ({
        harnessId: app.harnessId,
        artifactId: app.appName,
        appId: app.appId,
        sourceUrl: openRouterAppUrl(app),
        integrationUrl: app.integrationUrl,
      })),
    );
  });

  it("validates the complete canonical app identity, including slugless pages", () => {
    const app = openRouterApps[0];
    const html = `noise \\"id\\":42 ${`\\"id\\":${app.appId}`},\\"origin_url\\":\\"${app.originUrl}\\",\\"slug\\":\\"${app.slug}\\",\\"title\\":\\"${app.appName}\\"},\\"totalTokens\\":29665059035281,\\"rank\\":1,\\"modelsUsed\\":394 tail`;
    expect(parseOpenRouterAppPage(html, app)).toEqual({
      appId: app.appId,
      attributedTokens: 29_665_059_035_281,
      dailyGlobalRank: 1,
      modelsObserved: 394,
    });

    const sluglessApp = openRouterApps.find((candidate) => candidate.slug === null);
    const sluglessHtml = `\\"id\\":${sluglessApp.appId},\\"origin_url\\":\\"${sluglessApp.originUrl}\\",\\"slug\\":null,\\"title\\":\\"${sluglessApp.appName}\\"},\\"totalTokens\\":10,\\"rank\\":null,\\"modelsUsed\\":2`;
    expect(parseOpenRouterAppPage(sluglessHtml, sluglessApp)).toMatchObject({
      appId: sluglessApp.appId,
      attributedTokens: 10,
      dailyGlobalRank: null,
    });
    expect(openRouterAppUrl(sluglessApp)).toContain("/apps/url/");
  });

  it("uses the current slugless app identities", () => {
    expect(openRouterApps.find(({ harnessId }) => harnessId === "goose")).toMatchObject({
      appId: 3_248_223,
      originUrl: "https://goose-docs.ai/",
      slug: null,
    });
    expect(openRouterApps.find(({ harnessId }) => harnessId === "omp")).toMatchObject({
      appId: 3_682_314,
      originUrl: "https://omp.sh/",
      slug: null,
    });
    expect(openRouterApps.find(({ harnessId }) => harnessId === "ggcode")).toMatchObject({
      appId: 4_434_691,
      appName: "GGCode",
      originUrl: "https://ggcode.dev/",
      slug: null,
    });
    expect(openRouterApps.find(({ harnessId }) => harnessId === "mimo-code")).toMatchObject({
      appId: 3_980_383,
      appName: "mimocode",
      originUrl: "https://mimo.xiaomi.com/coder",
      slug: null,
    });
    expect(openRouterApps.find(({ harnessId }) => harnessId === "cursor-cli")).toMatchObject({
      appId: 2_237_546,
      appName: "Cursor",
      originUrl: "https://cursor.com/",
      slug: null,
    });
    expect(openRouterApps.find(({ harnessId }) => harnessId === "deepagents-code")).toMatchObject({
      appId: 3_687_500,
      appName: "Deep Agents Code",
      originUrl: "https://pypi.org/project/deepagents-code",
      slug: null,
    });
    expect(openRouterApps.find(({ harnessId }) => harnessId === "ante")).toMatchObject({
      appId: 3_067_206,
      appName: "Ante",
      originUrl: "https://docs.antigma.ai/",
      slug: null,
    });
    expect(openRouterApps.find(({ harnessId }) => harnessId === "slate")).toMatchObject({
      appId: 2_567_728,
      appName: "Slate Agent",
      originUrl: "https://randomlabs.ai/",
      slug: null,
    });
    expect(openRouterApps.some(({ harnessId }) => harnessId === "spectral-agent")).toBe(false);
  });

  it("joins ranking rows by stable app id instead of duplicate names", () => {
    const app = openRouterApps[0];
    function rankingFor(startDate, rank = 1) {
      return parseRankingResponses([{
        data: [{
          app_id: app.appId,
          app_name: app.appName,
          rank,
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
    const trendingRankings = {
      week: rankingFor("2026-07-21", 3),
      month: rankingFor("2026-06-28", 2),
    };
    const pageMetrics = new Map(openRouterApps.map((candidate) => [candidate.appId, {
      appId: candidate.appId,
      attributedTokens: 10,
      dailyGlobalRank: null,
      modelsObserved: 1,
      observedAt: "2026-07-28",
    }]));
    const snapshots = buildOpenRouterSnapshots(pageMetrics, rankings, trendingRankings);

    expect(snapshots[0].windows.month).toMatchObject({ days: 30, rank: 1, attributedTokens: 1_000, attributedRequests: 20 });
    expect(snapshots[0].trendingWindows.week).toMatchObject({ days: 7, rank: 3, attributedTokens: 1_000, attributedRequests: 20 });
    expect(snapshots[1].windows.day).toMatchObject({ days: 1, rank: null, attributedTokens: null, attributedRequests: null });
    expect(snapshots[1].trendingWindows.month).toMatchObject({ days: 30, rank: null, attributedTokens: null, attributedRequests: null });
    expect(renderOpenRouterAttributionFile(snapshots)).toContain("authenticated popular plus trending");
  });
});
