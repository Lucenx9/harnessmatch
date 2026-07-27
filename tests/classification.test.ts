import { describe, expect, it } from "vitest";
import { harnesses } from "../src/data/harnesses";
import { getOperationalProfile, getOperationalProfileRecord } from "../src/data/operational-profiles";

describe("harness classification", () => {
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
        expect(harness.features.sandbox, harness.name).toBe(true);
      }
      if (harness.features.sandbox) {
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
      "plandex",
    ]);
  });

  it("keeps orchestration labels consistent with documented subagent support", () => {
    for (const harness of harnesses) {
      if (harness.classification.orchestration === "single-agent") {
        expect(harness.features.subagents, harness.name).toBe(false);
      } else {
        expect(harness.features.subagents, harness.name).toBe(true);
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
