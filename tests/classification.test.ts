import { describe, expect, it } from "vitest";
import { harnesses } from "../src/data/harnesses";

describe("harness classification", () => {
  it("keeps every active product on the three operational axes", () => {
    for (const harness of harnesses.filter((item) => item.status === "active")) {
      expect(harness.classification.role).toBeTruthy();
      expect(harness.classification.orchestration).toBeTruthy();
      expect(harness.classification.execution).toBeTruthy();
    }
  });

  it("does not claim a sandboxed boundary without first-class sandbox support", () => {
    for (const harness of harnesses) {
      if (harness.classification.execution !== "host-process") {
        expect(harness.features.sandbox, harness.name).toBe(true);
      }
    }
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
});
