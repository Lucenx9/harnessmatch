import { describe, expect, it } from "vitest";
import { guiEcosystemSignalSnapshots } from "../src/data/gui-ecosystem-signals";
import { guiProducts } from "../src/data/gui-products";
import { guiRepositoryAudits } from "../src/data/gui-repository-audits";
import { buildGuiEcosystemViewRecords } from "../src/lib/gui-ecosystem-view";
import { buildGuiLiveSignalsViewModel } from "../src/lib/gui-view-models";

describe("GUI ecosystem signals", () => {
  it("joins every signal to an active GUI without duplicate source identities", () => {
    const activeIds = new Set(guiProducts.filter((product) => product.status === "active").map((product) => product.id));
    const keys = new Set<string>();
    for (const signal of guiEcosystemSignalSnapshots) {
      expect(activeIds.has(signal.guiId)).toBe(true);
      const key = `${signal.source}:${signal.guiId}`;
      expect(keys.has(key)).toBe(false);
      keys.add(key);
      expect(signal.value).toBeGreaterThanOrEqual(0);
    }
  });

  it("uses every canonical GUI code audit as the GitHub identity", () => {
    const githubSignals = guiEcosystemSignalSnapshots.filter((signal) => signal.source === "github");
    expect(githubSignals).toHaveLength(guiRepositoryAudits.length);
    for (const audit of guiRepositoryAudits) {
      const signal = githubSignals.find((candidate) => candidate.guiId === audit.guiId);
      expect(signal?.artifactUrl).toBe(audit.repositoryUrl);
      expect(signal?.repositoryScope).toBe(audit.sourceScope);
    }
  });

  it("admits stable installer downloads only for reviewed GUI mappings", () => {
    const releaseSignals = guiEcosystemSignalSnapshots.filter((signal) => signal.source === "github-releases");
    expect(releaseSignals.map((signal) => signal.guiId).toSorted()).toEqual([
      "agetor",
      "aionui",
      "blackcrab",
      "codeg",
      "emdash",
      "nimbalyst",
      "openchamber",
      "openhands-agent-canvas",
      "superset",
      "t3-code",
    ]);
    for (const signal of releaseSignals) {
      expect(signal.value).toBeGreaterThan(0);
      expect(signal.assetCount).toBeGreaterThan(0);
      expect(signal.releaseCount).toBeGreaterThan(0);
      expect(signal.artifactScope).toMatch(/^Stable .+ desktop installers$/);
    }
  });

  it("sorts each source independently and never fabricates missing records", () => {
    const records = buildGuiEcosystemViewRecords(guiProducts, guiEcosystemSignalSnapshots);
    expect(records.homebrew).toHaveLength(7);
    expect(records.github).toHaveLength(guiRepositoryAudits.length);
    expect(records.githubReleases).toHaveLength(10);
    for (const group of [records.homebrew, records.githubReleases, records.github]) {
      expect(group.map((record) => record.signal.value)).toEqual(
        group.map((record) => record.signal.value).toSorted((left, right) => right - left),
      );
    }
    expect(records.homebrew.some((record) => record.product.id === "codex-desktop")).toBe(false);
    expect(records.githubReleases.some((record) => record.product.id === "webmux")).toBe(false);
  });

  it("builds a serializable client view without changing source-native units", () => {
    const viewModel = buildGuiLiveSignalsViewModel(
      guiProducts,
      guiEcosystemSignalSnapshots,
    );

    expect(viewModel.observedAt).toBe(
      guiEcosystemSignalSnapshots.map((signal) => signal.observedAt).toSorted().at(-1),
    );
    expect(viewModel.sources.map((source) => source.id)).toEqual([
      "homebrew",
      "github-releases",
      "github",
    ]);
    expect(viewModel.sources.every((source) => (
      source.rows.every((row) => row.barPercent >= 3 && row.barPercent <= 100)
    ))).toBe(true);
    expect(viewModel.sources.find((source) => source.id === "homebrew")?.rows[0]?.valueLabel)
      .toMatch(/ installs$/);
    expect(viewModel.sources.find((source) => source.id === "github-releases")?.rows[0]?.valueLabel)
      .toMatch(/ downloads$/);
    expect(viewModel.sources.find((source) => source.id === "github")?.rows[0]?.valueLabel)
      .toMatch(/ stars$/);
  });
});
