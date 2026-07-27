import { describe, expect, it } from "vitest";
import { researchProcessDisclosure } from "../src/data/research-process";

describe("AI-assisted research disclosure", () => {
  it("keeps model output subordinate to traceable sources", () => {
    expect(researchProcessDisclosure.governance).toContain("not evidence");
    expect(researchProcessDisclosure.governance).toContain("verification date");
    expect(researchProcessDisclosure.governance).toContain("source record");
  });

  it("does not present multi-model agreement as validation", () => {
    expect(researchProcessDisclosure.crossCheck).toContain("Not every claim");
    expect(researchProcessDisclosure.crossCheck).toContain("does not establish accuracy");
    expect(researchProcessDisclosure.crossCheck).toContain("scientific validity");
  });

  it("publishes only after an explicit source-governed gate", () => {
    const publishStage = researchProcessDisclosure.stages.find((stage) => stage.label === "Publish");

    expect(publishStage?.description).toContain("allowed source");
    expect(publishStage?.description).toContain("verification date");
  });
});
