import { describe, expect, it } from "vitest";
import {
  featureClaimFor,
  featureClaimsForHarness,
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

  it("does not refresh existing claims when only skills evidence is refreshed", () => {
    const skillsRefreshIds = new Set(["claude-code", "cursor-cli", "gemini-cli"]);
    const previousVerifiedAt = "2026-07-27";
    const refreshedVerifiedAt = "2026-08-01";

    for (const harness of harnesses.filter(({ id }) => skillsRefreshIds.has(id))) {
      const skillsSourceUrls = new Set(featureClaimFor(harness, "skills").sourceUrls);
      const baselineEvidence = harness.evidence.map((source) => skillsSourceUrls.has(source.url)
        ? { ...source, verifiedAt: previousVerifiedAt }
        : source);
      const refreshedEvidence = baselineEvidence.map((source) => skillsSourceUrls.has(source.url)
        ? { ...source, verifiedAt: refreshedVerifiedAt }
        : source);
      const baselineClaims = featureClaimsForHarness({
        id: harness.id,
        verifiedAt: previousVerifiedAt,
        evidence: baselineEvidence,
      });
      const refreshedClaims = featureClaimsForHarness({
        id: harness.id,
        verifiedAt: refreshedVerifiedAt,
        evidence: refreshedEvidence,
      });
      const nonSkillsFeatures = featureKeys.filter((feature) => feature !== "skills");
      const sourceLessFeatures = nonSkillsFeatures.filter(
        (feature) => baselineClaims[feature].sourceUrls.length === 0,
      );

      expect(sourceLessFeatures.length, harness.id).toBeGreaterThan(0);
      for (const feature of nonSkillsFeatures) {
        expect(refreshedClaims[feature].sourceUrls, `${harness.id}.${feature} sources`)
          .toEqual(baselineClaims[feature].sourceUrls);
        expect(refreshedClaims[feature].verifiedAt, `${harness.id}.${feature} date`)
          .toBe(baselineClaims[feature].verifiedAt);
      }
    }
  });

  it("derives an implicit claim date from its cited sources only", () => {
    const harness = harnesses.find(({ id }) => id === "claude-code");
    expect(harness).toBeDefined();
    if (!harness) return;

    const claims = featureClaimsForHarness({
      id: harness.id,
      verifiedAt: "2000-01-01",
      evidence: harness.evidence,
    });
    const claim = claims.mcp;
    const citedDates = harness.evidence
      .filter((source) => claim.sourceUrls.includes(source.url))
      .map((source) => source.verifiedAt)
      .sort();

    expect(citedDates.length).toBeGreaterThan(0);
    expect(claim.verifiedAt).toBe(citedDates.at(0));
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
    const mimoSandbox = featureClaimFor(byId.get("mimo-code")!, "sandbox");
    expect(openCodeSandbox.state).toBe("explicitly-absent");
    expect(piSandbox.state).toBe("explicitly-absent");
    expect(mimoSandbox.state).toBe("explicitly-absent");
    expect(openCodeSandbox.sourceUrls).toHaveLength(1);
    expect(piSandbox.sourceUrls).toHaveLength(1);
    expect(mimoSandbox.sourceUrls).toEqual([
      "https://github.com/XiaomiMiMo/MiMo-Code/blob/c045a9891069000b112079bb10bdc8828d75eb6e/SECURITY.md",
    ]);
  });

  it("makes mode-dependent isolation visible instead of treating it as an unconditional yes", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));
    expect(featureClaimFor(byId.get("claude-code")!, "sandbox").state).toBe("optional");
    expect(featureClaimFor(byId.get("codex")!, "sandbox").state).toBe("default");
    expect(featureClaimFor(byId.get("amp")!, "sandbox").state).toBe("surface-specific");
    expect(featureClaimFor(byId.get("reasonix")!, "sandbox").state).toBe("surface-specific");
    expect(featureClaimFor(byId.get("codewhale")!, "sandbox").state).toBe("optional");
    expect(featureClaimFor(byId.get("openharness")!, "sandbox").state).toBe("optional");
  });

  it("keeps local control surfaces separate from browser automation and rollback", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));
    expect(featureClaimFor(byId.get("codewhale")!, "browser").state).toBe("not-documented");
    expect(featureClaimFor(byId.get("codewhale")!, "checkpoints").state).toBe("documented");
    expect(featureClaimFor(byId.get("openharness")!, "browser").state).toBe("not-documented");
    expect(featureClaimFor(byId.get("openharness")!, "checkpoints").state).toBe("not-documented");
  });

  it("keeps Ante browser support build-dependent and does not invent isolation or rollback", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));
    const ante = byId.get("ante")!;
    const browser = featureClaimFor(ante, "browser");

    expect(browser).toMatchObject({
      state: "optional",
      sourceUrls: ["https://docs.antigma.ai/reference/tools-reference"],
    });
    expect(featureClaimFor(ante, "sandbox").state).toBe("not-documented");
    expect(featureClaimFor(ante, "checkpoints").state).toBe("not-documented");
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
    expect(featureClaimFor(byId.get("mimo-code")!, "skills").state).toBe("documented");
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
