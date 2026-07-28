import { describe, expect, it } from "vitest";
import { harnesses } from "../src/data/harnesses";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution";
import { isValidVerificationDate } from "../src/lib/evidence-freshness";

describe("OpenRouter attribution snapshots", () => {
  const harnessIds = new Set(harnesses.map((harness) => harness.id));

  it("maps each canonical app page to one catalog harness", () => {
    const snapshotIds = openRouterAttributionSnapshots.map((snapshot) => snapshot.harnessId);

    expect(new Set(snapshotIds).size).toBe(snapshotIds.length);
    for (const snapshot of openRouterAttributionSnapshots) {
      expect(harnessIds.has(snapshot.harnessId), snapshot.harnessId).toBe(true);
      expect(snapshot.sourceUrl).toBe(`https://openrouter.ai/apps/${snapshot.appSlug}`);
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
    }
  });
});
