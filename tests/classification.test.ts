import { describe, expect, it } from "vitest";
import { featureSupportFor } from "../src/data/feature-claims";
import { harnesses } from "../src/data/harnesses";
import { getHarnessMembershipAssessment } from "../src/data/harness-membership";
import { getOperationalProfileRecord } from "../src/data/operational-profiles";

describe("harness classification", () => {
  it("keeps catalog layer and four membership criteria source-governed", () => {
    for (const harness of harnesses) {
      const assessment = getHarnessMembershipAssessment(harness);
      expect(assessment, harness.name).not.toBeNull();
      expect(assessment!.verifiedAt, harness.name).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(assessment!.limitation.length, harness.name).toBeGreaterThan(60);

      const evidenceUrls = new Set(harness.evidence.map((source) => source.url));
      for (const criterion of Object.values(assessment!.criteria)) {
        expect(criterion.state, harness.name).toBe("documented");
        expect(criterion.sourceUrls.length, harness.name).toBeGreaterThan(0);
        expect(criterion.sourceUrls.every((url) => evidenceUrls.has(url)), harness.name).toBe(true);
      }
    }
  });

  it("classifies current catalog entries as coding harnesses without overloading product role", () => {
    for (const harness of harnesses) {
      expect(getHarnessMembershipAssessment(harness)?.layer, harness.name).toBe("coding-harness");
      expect(harness.classification.role).toBeTruthy();
    }
  });

  it("keeps every active product on the operational facets", () => {
    for (const harness of harnesses.filter((item) => item.status === "active")) {
      expect(harness.classification.role).toBeTruthy();
      expect(harness.classification.orchestration).toBeTruthy();
      expect(harness.classification.runtime).toBeTruthy();
      expect(Array.isArray(harness.classification.isolation)).toBe(true);
      expect(harness.classification.state).toBeTruthy();
    }
  });

  it("keeps security isolation separate from Git worktree isolation", () => {
    for (const harness of harnesses) {
      const securityIsolation = harness.classification.isolation.filter((mode) => mode !== "worktree");
      if (securityIsolation.length > 0) {
        expect(featureSupportFor(harness).sandbox, harness.name).toBe(true);
      }
      if (featureSupportFor(harness).sandbox) {
        expect(securityIsolation.length, harness.name).toBeGreaterThan(0);
      }
    }
  });

  it("reserves persistent-memory posture for products with documented durable agent memory", () => {
    const persistent = harnesses
      .filter((harness) => harness.classification.state === "persistent-memory")
      .map((harness) => harness.id);

    expect(persistent).toEqual([
      "claude-code",
      "codex",
      "omp",
      "grok-build",
      "openhands",
      "gemini-cli",
      "copilot-cli",
      "qwen-code",
      "letta-code",
      "command-code",
      "mux",
      "hermes-agent",
      "openclaw",
      "plandex",
      "wakil",
      "deepagents-code",
      "opensquilla",
      "postqode",
      "kern",
    ]);
  });

  it("keeps orchestration labels consistent with documented subagent support", () => {
    for (const harness of harnesses) {
      if (harness.classification.orchestration === "single-agent") {
        expect(featureSupportFor(harness).subagents, harness.name).toBe(false);
      } else {
        expect(featureSupportFor(harness).subagents, harness.name).toBe(true);
      }
    }
  });

  it("keeps every active product on the literature-derived operational facets", () => {
    for (const harness of harnesses.filter((item) => item.status === "active")) {
      const record = getOperationalProfileRecord(harness.id);
      const profile = record.profile;
      expect(profile.context, harness.name).not.toBe("unknown");
      expect(profile.permissions, harness.name).not.toBe("unknown");
      expect(profile.verification, harness.name).not.toBe("unknown");
      expect(profile.observability, harness.name).not.toBe("unknown");
      expect(profile.recovery, harness.name).not.toBe("unknown");
      expect(record.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.sourceUrls.length, harness.name).toBeGreaterThan(0);
      expect(record.limitation.length, harness.name).toBeGreaterThan(40);
      const evidenceUrls = new Set(harness.evidence.map((source) => source.url));
      expect(record.sourceUrls.every((url) => evidenceUrls.has(url)), harness.name).toBe(true);
    }
  });
});
