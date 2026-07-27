import { describe, expect, it } from "vitest";
import { harnesses } from "../src/data/harnesses";
import { repositoryAuditForHarness } from "../src/data/repository-audits";
import {
  contentValidityPlan,
  interRaterValidationPlan,
  userValidationPlan,
} from "../src/data/validation-plan";

describe("published validation protocol", () => {
  it("fixes a unique active sample spanning product and evidence strata", () => {
    const sample = interRaterValidationPlan.sampleHarnessIds.map((id) => (
      harnesses.find((harness) => harness.id === id)!
    ));

    expect(new Set(interRaterValidationPlan.sampleHarnessIds).size).toBe(sample.length);
    expect(sample.every((harness) => harness?.status === "active")).toBe(true);
    expect(new Set(sample.map((harness) => harness.classification.role)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(sample.map((harness) => harness.classification.runtime)).size).toBeGreaterThanOrEqual(3);

    const sourceScopes = new Set(sample.map((harness) => (
      repositoryAuditForHarness(harness.id)?.sourceScope ?? "no-public-audit"
    )));
    expect(sourceScopes.size).toBeGreaterThanOrEqual(3);
  });

  it("separates reliability, content validity, and prospective usefulness", () => {
    expect(interRaterValidationPlan.status).toBe("protocol-published");
    expect(interRaterValidationPlan.independentRaters).toBeGreaterThanOrEqual(2);
    expect(interRaterValidationPlan.workingThreshold).toBe(0.8);
    expect(interRaterValidationPlan.thresholdCaveat).toContain("not a universal law");
    expect(contentValidityPlan.status).toBe("not-started");
    expect(userValidationPlan.status).toBe("not-started");
    expect(userValidationPlan.sampleSizePolicy).toContain("Pilot results alone do not establish predictive validity");
  });
});
