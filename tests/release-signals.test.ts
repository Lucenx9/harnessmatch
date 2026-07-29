import { describe, expect, it } from "vitest";
import { harnesses } from "../src/data/harnesses";
import { harnessReleaseSnapshots } from "../src/data/release-signals";
import { repositoryAudits } from "../src/data/repository-audits";
import { githubReleaseWatches } from "../scripts/lib/release-watch-mappings.mjs";

describe("public stable release snapshots", () => {
  it("covers every reviewed harness release watch with source-native facts", () => {
    const activeHarnessIds = new Set(harnesses.filter((harness) => harness.status === "active").map((harness) => harness.id));
    const auditByHarness = new Map(repositoryAudits.map((audit) => [audit.harnessId, audit]));
    expect(harnessReleaseSnapshots).toHaveLength(githubReleaseWatches.length);
    expect(new Set(harnessReleaseSnapshots.map((snapshot) => snapshot.harnessId)).size).toBe(harnessReleaseSnapshots.length);

    for (const snapshot of harnessReleaseSnapshots) {
      const audit = auditByHarness.get(snapshot.harnessId);
      expect(activeHarnessIds.has(snapshot.harnessId)).toBe(true);
      expect(audit).toBeDefined();
      expect(snapshot.repository).toBe(audit?.repositoryUrl.replace("https://github.com/", ""));
      expect(snapshot.repositoryScope).toBe(audit?.sourceScope);
      expect(snapshot.latestVersion.length).toBeGreaterThan(0);
      expect(snapshot.latestReleaseAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(snapshot.latestReleaseAt <= snapshot.observedAt).toBe(true);
      expect(snapshot.latestReleaseUrl.startsWith(`${audit?.repositoryUrl}/releases/tag/`)).toBe(true);
      expect(decodeURIComponent(new URL(snapshot.latestReleaseUrl).pathname.split("/releases/tag/")[1] ?? ""))
        .toBe(snapshot.latestVersion);
      expect(snapshot.recentReleaseCount).toBeGreaterThanOrEqual(0);
      expect(snapshot.recentReleaseWindowDays).toBe(90);
      expect(snapshot.sourceUrl).toBe(`https://api.github.com/repos/${snapshot.repository}/releases`);
      expect(snapshot).not.toHaveProperty("score");
      expect(snapshot).not.toHaveProperty("summary");
    }
  });

  it("keeps OpenHands on the harness release train", () => {
    expect(harnessReleaseSnapshots.find(({ harnessId }) => harnessId === "openhands")?.latestVersion)
      .toMatch(/^\d+\.\d+\.\d+$/);
  });
});
