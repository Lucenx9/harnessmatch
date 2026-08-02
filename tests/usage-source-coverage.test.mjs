import { describe, expect, it } from "vitest";
import {
  githubReleaseArtifacts,
  homebrewArtifacts,
  jetBrainsPlugins,
  npmPackages,
  openVsxExtensions,
  vsCodeExtensions,
} from "../scripts/lib/ecosystem-signal-mappings.mjs";
import { openRouterApps } from "../scripts/lib/openrouter-sync.mjs";
import { unmappedHarnessIdsByUsageSource } from "../scripts/lib/usage-source-coverage.mjs";
import { harnesses } from "../src/data/harnesses.ts";
import { repositoryAudits } from "../src/data/repository-audits.ts";

const mappedArtifactsBySource = {
  openrouter: openRouterApps,
  homebrew: homebrewArtifacts,
  npm: npmPackages,
  vscode: vsCodeExtensions,
  openvsx: openVsxExtensions,
  jetbrains: jetBrainsPlugins,
  "github-releases": githubReleaseArtifacts,
  github: repositoryAudits,
};

describe("usage source coverage", () => {
  it("accounts for every active harness as exactly mapped or explicitly unmapped", () => {
    const activeIds = harnesses
      .filter(({ status }) => status === "active")
      .map(({ id }) => id)
      .toSorted();

    expect(Object.keys(unmappedHarnessIdsByUsageSource).toSorted()).toEqual(
      Object.keys(mappedArtifactsBySource).toSorted(),
    );
    for (const [source, artifacts] of Object.entries(mappedArtifactsBySource)) {
      const mappedIds = artifacts
        .filter(({ harnessId }) => activeIds.includes(harnessId))
        .map(({ harnessId }) => harnessId);
      const unmappedIds = unmappedHarnessIdsByUsageSource[source];
      expect(new Set(mappedIds).size, `${source}: duplicate mapping`).toBe(mappedIds.length);
      expect(new Set(unmappedIds).size, `${source}: duplicate unmapped id`).toBe(unmappedIds.length);
      expect(mappedIds.filter((id) => unmappedIds.includes(id)), `${source}: conflicting state`).toEqual([]);
      expect([...mappedIds, ...unmappedIds].toSorted(), `${source}: incomplete active coverage`).toEqual(activeIds);
    }
  });

  it("preserves the exact artifacts admitted by the coverage correction", () => {
    expect(openRouterApps.map(({ harnessId }) => harnessId)).toEqual(expect.arrayContaining([
      "command-code", "codebuff", "opensquilla", "poolside-cli", "crush",
      "postqode", "kern", "junie-cli", "wakil",
      "ggcode", "mimo-code",
    ]));
    expect(homebrewArtifacts).toEqual(expect.arrayContaining([
      expect.objectContaining({ harnessId: "antigravity-cli", artifactId: "antigravity-cli" }),
      expect.objectContaining({ harnessId: "grok-build", artifactId: "grok-build" }),
      expect.objectContaining({ harnessId: "kiro-cli", artifactId: "kiro-cli" }),
      expect.objectContaining({ harnessId: "mimo-code", artifactId: "mimo-code", artifactKind: "formula" }),
    ]));
    expect(npmPackages).toEqual(expect.arrayContaining([
      expect.objectContaining({ harnessId: "amp", artifactId: "@ampcode/cli" }),
      expect.objectContaining({ harnessId: "factory-droid", artifactId: "@factory/cli" }),
      expect.objectContaining({ harnessId: "crush", artifactId: "@charmland/crush" }),
      expect.objectContaining({ harnessId: "mimo-code", artifactId: "@mimo-ai/cli" }),
    ]));
    expect(vsCodeExtensions.map(({ harnessId }) => harnessId)).toEqual(expect.arrayContaining([
      "factory-droid", "qwen-code", "gemini-cli", "mistral-vibe", "zoo-code",
    ]));
    expect(openVsxExtensions.map(({ harnessId }) => harnessId)).toEqual(expect.arrayContaining([
      "qwen-code", "gemini-cli", "mistral-vibe", "zoo-code",
    ]));
    expect(jetBrainsPlugins.map(({ harnessId }) => harnessId)).toEqual(expect.arrayContaining([
      "claude-code", "factory-droid",
    ]));
    expect(githubReleaseArtifacts.map(({ harnessId }) => harnessId)).toEqual(expect.arrayContaining([
      "cline", "crush", "deepagents-code", "kilo-code", "kimi-code",
      "mimo-code", "mistral-vibe", "opensquilla", "poolside-cli", "zoo-code", "ggcode",
    ]));
  });
});
