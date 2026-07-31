import { describe, expect, it } from "vitest";
import { ecosystemSignalSnapshots } from "../src/data/ecosystem-signals";
import { harnesses } from "../src/data/harnesses";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution";
import { harnessReleaseSnapshots } from "../src/data/release-signals";
import { buildRecentReleaseActivity, buildUsageViewRecords } from "../src/lib/usage-view";

describe("usage view records", () => {
  it("joins only active harnesses while preserving every source-specific record", () => {
    const records = buildUsageViewRecords({
      harnesses,
      openRouterSnapshots: openRouterAttributionSnapshots,
      ecosystemSignals: ecosystemSignalSnapshots,
    });
    const activeIds = new Set(harnesses.filter((harness) => harness.status === "active").map((harness) => harness.id));
    const expectedOpenRouter = openRouterAttributionSnapshots.filter((snapshot) => activeIds.has(snapshot.harnessId));
    const expectedEcosystem = ecosystemSignalSnapshots.filter((signal) => activeIds.has(signal.harnessId));

    expect(records.activeHarnessCount).toBe(activeIds.size);
    expect(records.products).toHaveLength(activeIds.size);
    expect(records.products.map((product) => product.name)).toEqual(
      records.products.map((product) => product.name).toSorted((left, right) => left.localeCompare(right)),
    );
    expect(records.openRouterRecords).toHaveLength(expectedOpenRouter.length);
    expect(records.ecosystemRecords).toHaveLength(expectedEcosystem.length);
    expect(new Set(records.ecosystemRecords.map((record) => record.signal.source))).toEqual(
      new Set(["homebrew", "npm", "github-releases", "vscode", "openvsx", "jetbrains", "github"]),
    );
    expect(records.openRouterRecords.every((record) => activeIds.has(record.id))).toBe(true);
    expect(records.ecosystemRecords.every((record) => activeIds.has(record.id))).toBe(true);
  });

  it("keeps native signal units instead of creating a combined popularity metric", () => {
    const records = buildUsageViewRecords({
      harnesses,
      openRouterSnapshots: openRouterAttributionSnapshots,
      ecosystemSignals: ecosystemSignalSnapshots,
    });

    expect(records.openRouterRecords[0]).toHaveProperty("windows.week.attributedTokens");
    expect(records.openRouterRecords[0]).toHaveProperty("trendingWindows.week.attributedTokens");
    expect(records.openRouterRecords[0]).toHaveProperty("appUrl");
    expect(records.ecosystemRecords.every((record) => "signal" in record)).toBe(true);
    expect(records.ecosystemRecords.some((record) => record.signal.metric === "install-events")).toBe(true);
    expect(records.ecosystemRecords.some((record) => record.signal.metric === "downloads")).toBe(true);
    expect(records.ecosystemRecords.some((record) => record.signal.metric === "asset-downloads")).toBe(true);
    expect(records.ecosystemRecords.some((record) => record.signal.metric === "installs")).toBe(true);
    expect(records.ecosystemRecords.some((record) => record.signal.metric === "stars")).toBe(true);
  });

  it("builds a recent-release view from active harnesses without creating a quality rank", () => {
    const records = buildRecentReleaseActivity({
      harnesses,
      releaseSnapshots: harnessReleaseSnapshots,
    });
    const activeIds = new Set(harnesses.filter((harness) => harness.status === "active").map((harness) => harness.id));

    expect(records).toHaveLength(harnessReleaseSnapshots.length);
    expect(records.every((record) => activeIds.has(record.id))).toBe(true);
    expect(records.every((record) => record.signal.latestVersion.length > 0)).toBe(true);
    expect(records.every((record) => record.signal.recentReleaseWindowDays === 90)).toBe(true);
    expect(records.map((record) => record.id)).toEqual(
      records.toSorted((left, right) => (
        right.signal.latestReleaseAt.localeCompare(left.signal.latestReleaseAt)
        || right.signal.recentReleaseCount - left.signal.recentReleaseCount
        || left.name.localeCompare(right.name)
      )).map((record) => record.id),
    );
    expect(buildRecentReleaseActivity({ harnesses, releaseSnapshots: harnessReleaseSnapshots, limit: 8 })).toHaveLength(8);
  });
});
