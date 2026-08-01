import { describe, expect, it } from "vitest";
import {
  featureClaimFor,
  featureClaimHarnessIds,
  featureClaimSupportsRequirement,
  featureKeys,
  featureSupportFor,
} from "../src/data/feature-claims";
import { harnesses } from "../src/data/harnesses";
import { isValidVerificationDate } from "../src/lib/evidence-freshness";

describe("feature claim ledger", () => {
  it("keeps every supported capability traceable to the harness evidence ledger", () => {
    const missingSources: string[] = [];
    for (const harness of harnesses) {
      const evidenceUrls = new Set(harness.evidence.map((source) => source.url));

      for (const feature of featureKeys) {
        const claim = featureClaimFor(harness, feature);
        expect(isValidVerificationDate(claim.verifiedAt), `${harness.id}.${feature}`).toBe(true);
        expect(claim.scope.length).toBeGreaterThan(12);
        expect(claim.limitation.length).toBeGreaterThan(12);

        if (featureClaimSupportsRequirement(claim)) {
          if (claim.sourceUrls.length === 0) missingSources.push(`${harness.id}.${feature}`);
        }
        for (const url of claim.sourceUrls) {
          expect(evidenceUrls, `${harness.id}.${feature}`).toContain(url);
        }
      }
    }
    expect(missingSources).toEqual([]);
  });

  it("stores one complete native claim record without legacy boolean mirrors", () => {
    expect([...featureClaimHarnessIds].sort()).toEqual(harnesses.map((harness) => harness.id).sort());
    for (const harness of harnesses) {
      expect(Object.keys(harness.featureClaims).sort()).toEqual([...featureKeys].sort());
      expect("features" in harness).toBe(false);
      expect("localModels" in harness).toBe(false);
      expect(featureSupportFor(harness)).toEqual(Object.fromEntries(featureKeys.map((feature) => [
        feature,
        featureClaimSupportsRequirement(featureClaimFor(harness, feature)),
      ])));
    }
  });

  it("distinguishes missing evidence from an explicit first-party absence", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));
    expect(featureClaimFor(byId.get("aider")!, "sandbox").state).toBe("not-documented");
    const openCodeSandbox = featureClaimFor(byId.get("opencode")!, "sandbox");
    const piSandbox = featureClaimFor(byId.get("pi")!, "sandbox");
    expect(openCodeSandbox.state).toBe("explicitly-absent");
    expect(piSandbox.state).toBe("explicitly-absent");
    expect(openCodeSandbox.sourceUrls).toHaveLength(1);
    expect(piSandbox.sourceUrls).toHaveLength(1);
  });

  it("makes mode-dependent isolation visible instead of treating it as an unconditional yes", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));
    expect(featureClaimFor(byId.get("claude-code")!, "sandbox").state).toBe("optional");
    expect(featureClaimFor(byId.get("codex")!, "sandbox").state).toBe("default");
    expect(featureClaimFor(byId.get("amp")!, "sandbox").state).toBe("surface-specific");
  });

  it("records reusable skills without inferring them from generic extensibility", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));

    expect(featureClaimFor(byId.get("claude-code")!, "skills").state).toBe("documented");
    expect(featureClaimFor(byId.get("codex")!, "skills").state).toBe("documented");
    expect(featureClaimFor(byId.get("gemini-cli")!, "skills").state).toBe("documented");
    expect(featureClaimFor(byId.get("cursor-cli")!, "skills").state).toBe("documented");
    expect(featureClaimFor(byId.get("goose")!, "skills")).toMatchObject({
      state: "documented",
      verifiedAt: "2026-08-01",
      sourceUrls: ["https://github.com/aaif-goose/goose/releases/tag/v1.45.0"],
    });
    expect(featureClaimFor(byId.get("qwen-code")!, "skills").state).toBe("optional");
    expect(featureClaimFor(byId.get("aider")!, "skills").state).toBe("not-documented");
    expect(featureClaimFor(byId.get("factory-droid")!, "skills").state).toBe("not-documented");
  });

  it("records Copilot autopilot as a conditional sandbox bypass", () => {
    const copilot = harnesses.find((harness) => harness.id === "copilot-cli")!;
    const sandbox = featureClaimFor(copilot, "sandbox");

    expect(sandbox.state).toBe("optional");
    expect(sandbox.verifiedAt).toBe("2026-08-01");
    expect(sandbox.sourceUrls).toContain("https://github.com/github/copilot-cli/releases/tag/v1.0.77");
    expect(sandbox.limitation).toContain("disables the sandbox for the current session");
    expect(sandbox.limitation).toContain("MDM policy");
  });
});
