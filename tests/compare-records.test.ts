import { describe, expect, it } from "vitest";
import { harnesses } from "../src/data/harnesses";
import { compareHarnessRecords } from "../src/lib/compare-records";

describe("compare records", () => {
  it("serializes every active harness through the narrow client boundary", () => {
    const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
    const records = compareHarnessRecords();

    expect(records.map((record) => record.id)).toEqual(activeHarnesses.map((harness) => harness.id));
    expect(JSON.parse(JSON.stringify(records))).toEqual(records);

    for (const record of records) {
      expect(record.featureClaims).toBeDefined();
      expect(record).not.toHaveProperty("evidence");
      expect(record).not.toHaveProperty("classification");
      expect(record).not.toHaveProperty("tradeoffs");
    }
  });
});
