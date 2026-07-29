import { describe, expect, it } from "vitest";
import { harnesses } from "../src/data/harnesses";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution";
import { isValidVerificationDate } from "../src/lib/evidence-freshness";
import type { OpenRouterTrendingWindowKey, OpenRouterUsageWindowKey } from "../src/lib/types";

const expectedWindowDays: Record<OpenRouterUsageWindowKey, number> = {
  day: 1,
  week: 7,
  month: 30,
};

const expectedTrendingWindowDays: Record<OpenRouterTrendingWindowKey, number> = {
  week: 7,
  month: 30,
};

function inclusiveDays(startDate: string, endDate: string) {
  return Math.round(
    (Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86_400_000,
  ) + 1;
}

describe("OpenRouter attribution snapshots", () => {
  const harnessIds = new Set(harnesses.map((harness) => harness.id));

  it("maps each canonical app page to one catalog harness", () => {
    const snapshotIds = openRouterAttributionSnapshots.map((snapshot) => snapshot.harnessId);

    expect(new Set(snapshotIds).size).toBe(snapshotIds.length);
    for (const snapshot of openRouterAttributionSnapshots) {
      expect(harnessIds.has(snapshot.harnessId), snapshot.harnessId).toBe(true);
      expect(snapshot.sourceUrl).toBe(`https://openrouter.ai/apps/${snapshot.appSlug}`);
      expect(Number.isSafeInteger(snapshot.appId), snapshot.harnessId).toBe(true);
      expect(snapshot.appId, snapshot.harnessId).toBeGreaterThan(0);
    }
  });

  it("keeps public attribution values and dates internally valid", () => {
    for (const snapshot of openRouterAttributionSnapshots) {
      expect(Number.isSafeInteger(snapshot.attributedTokens), snapshot.harnessId).toBe(true);
      expect(snapshot.attributedTokens, snapshot.harnessId).toBeGreaterThan(0);
      expect(Number.isInteger(snapshot.modelsObserved), snapshot.harnessId).toBe(true);
      expect(snapshot.modelsObserved, snapshot.harnessId).toBeGreaterThan(0);
      if (snapshot.dailyGlobalRank !== null) {
        expect(Number.isInteger(snapshot.dailyGlobalRank), snapshot.harnessId).toBe(true);
        expect(snapshot.dailyGlobalRank, snapshot.harnessId).toBeGreaterThan(0);
      }
      expect(isValidVerificationDate(snapshot.observedAt), snapshot.harnessId).toBe(true);
      for (const key of Object.keys(expectedWindowDays) as OpenRouterUsageWindowKey[]) {
        const window = snapshot.windows[key];
        expect(window.category, `${snapshot.harnessId}:${key}`).toBe("coding");
        expect(window.days, `${snapshot.harnessId}:${key}`).toBe(expectedWindowDays[key]);
        expect(isValidVerificationDate(window.windowStart), `${snapshot.harnessId}:${key}`).toBe(true);
        expect(isValidVerificationDate(window.windowEnd), `${snapshot.harnessId}:${key}`).toBe(true);
        expect(isValidVerificationDate(window.observedAt), `${snapshot.harnessId}:${key}`).toBe(true);
        expect(window.windowEnd <= window.observedAt, `${snapshot.harnessId}:${key}`).toBe(true);
        expect(inclusiveDays(window.windowStart, window.windowEnd), `${snapshot.harnessId}:${key}`).toBe(window.days);
        expect(window.sourceUrl).toBe("https://openrouter.ai/docs/agent-sdk/typescript/api-reference/datasets");
        const values = [window.rank, window.attributedTokens, window.attributedRequests];
        const allMissing = values.every((value) => value === null);
        const allPresent = values.every((value) => value !== null);
        expect(allMissing || allPresent, `${snapshot.harnessId}:${key}`).toBe(true);
        for (const value of values) {
          if (value !== null) {
            expect(Number.isSafeInteger(value), `${snapshot.harnessId}:${key}`).toBe(true);
            expect(value, `${snapshot.harnessId}:${key}`).toBeGreaterThan(0);
          }
        }
      }
      for (const key of Object.keys(expectedTrendingWindowDays) as OpenRouterTrendingWindowKey[]) {
        const window = snapshot.trendingWindows[key];
        expect(window.category, `${snapshot.harnessId}:trending:${key}`).toBe("coding");
        expect(window.days, `${snapshot.harnessId}:trending:${key}`).toBe(expectedTrendingWindowDays[key]);
        expect(isValidVerificationDate(window.windowStart), `${snapshot.harnessId}:trending:${key}`).toBe(true);
        expect(isValidVerificationDate(window.windowEnd), `${snapshot.harnessId}:trending:${key}`).toBe(true);
        expect(isValidVerificationDate(window.observedAt), `${snapshot.harnessId}:trending:${key}`).toBe(true);
        expect(window.windowEnd <= window.observedAt, `${snapshot.harnessId}:trending:${key}`).toBe(true);
        expect(inclusiveDays(window.windowStart, window.windowEnd), `${snapshot.harnessId}:trending:${key}`).toBe(window.days);
        const values = [window.rank, window.attributedTokens, window.attributedRequests];
        const allMissing = values.every((value) => value === null);
        const allPresent = values.every((value) => value !== null);
        expect(allMissing || allPresent, `${snapshot.harnessId}:trending:${key}`).toBe(true);
        for (const value of values) {
          if (value !== null) {
            expect(Number.isSafeInteger(value), `${snapshot.harnessId}:trending:${key}`).toBe(true);
            expect(value, `${snapshot.harnessId}:trending:${key}`).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
