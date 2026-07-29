import { describe, expect, it } from "vitest";
import { ecosystemSignalSnapshots } from "../src/data/ecosystem-signals";
import { harnesses } from "../src/data/harnesses";
import { repositoryAudits } from "../src/data/repository-audits";

describe("ecosystem usage signals", () => {
  it("maps at most one exact artifact per source and harness", () => {
    const harnessIds = new Set(harnesses.map((harness) => harness.id));
    const identities = new Set<string>();

    for (const signal of ecosystemSignalSnapshots) {
      expect(harnessIds.has(signal.harnessId)).toBe(true);
      expect(Number.isSafeInteger(signal.value)).toBe(true);
      expect(signal.value).toBeGreaterThanOrEqual(0);
      expect(signal.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(signal.artifactUrl).toMatch(/^https:\/\//);
      expect(signal.sourceUrl).toMatch(/^https:\/\//);
      const identity = `${signal.source}:${signal.harnessId}`;
      expect(identities.has(identity)).toBe(false);
      identities.add(identity);

      if (signal.source === "homebrew" || signal.source === "npm") {
        expect(signal.windowDays).toBe(30);
        expect(signal.windowStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(signal.windowEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      if (signal.source === "github-releases") {
        expect(signal.assetCount).toBeGreaterThan(0);
        expect(signal.releaseCount).toBeGreaterThan(0);
        expect(signal.recentReleaseCount).toBeGreaterThanOrEqual(0);
        expect(signal.recentReleaseCount).toBeLessThanOrEqual(signal.releaseCount);
        expect(signal.recentReleaseWindowDays).toBe(90);
        expect(signal.latestVersion.length).toBeGreaterThan(0);
        expect(signal.latestReleaseAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(signal.latestReleaseUrl).toMatch(/^https:\/\/github\.com\/.+\/releases\/tag\//);
      }
      if (signal.source === "openvsx") expect(signal.latestVersion.length).toBeGreaterThan(0);
      if (signal.source === "jetbrains") expect(signal.pluginId).toBeGreaterThan(0);
    }
  });

  it("keeps GitHub interest aligned with every canonical repository audit", () => {
    const githubSignals = ecosystemSignalSnapshots.filter((signal) => signal.source === "github");
    expect(githubSignals).toHaveLength(repositoryAudits.length);
    for (const audit of repositoryAudits) {
      const signal = githubSignals.find((candidate) => candidate.harnessId === audit.harnessId);
      expect(signal).toBeDefined();
      expect(signal?.artifactUrl).toBe(audit.repositoryUrl);
      expect(signal?.repositoryScope).toBe(audit.sourceScope);
    }
  });

  it("preserves the source-specific metrics instead of a composite score", () => {
    expect(new Set(ecosystemSignalSnapshots.map((signal) => signal.metric))).toEqual(
      new Set(["install-events", "downloads", "asset-downloads", "installs", "stars"]),
    );
    expect(ecosystemSignalSnapshots.every((signal) => !("score" in signal))).toBe(true);
  });
});
