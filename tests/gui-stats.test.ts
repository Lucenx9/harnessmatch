import { describe, expect, it } from "vitest";
import { guiProducts } from "../src/data/gui-products";
import { guiRepositoryAudits } from "../src/data/gui-repository-audits";
import { guiWorkflows } from "../src/lib/gui-fit";
import { summarizeGuiCatalog } from "../src/lib/gui-stats";

describe("GUI catalog statistics", () => {
  const stats = summarizeGuiCatalog(guiProducts, guiRepositoryAudits, guiWorkflows);

  it("derives catalog totals from evidence-backed records", () => {
    expect(stats).toEqual(expect.objectContaining({
      activeProducts: 9,
      documentedClaims: 37,
      totalClaims: 45,
      codeAudits: 5,
      previews: 5,
      publicCodeProducts: 5,
      proprietaryProducts: 4,
      nativeProducts: 2,
      multiHarnessProducts: 7,
    }));
    expect(stats.evidenceSources).toBeGreaterThanOrEqual(guiProducts.length);
  });

  it("keeps evidence gaps visible in capability coverage", () => {
    expect(stats.capabilityCoverage.find((item) => item.key === "teamCollaboration")).toEqual({
      key: "teamCollaboration",
      documented: 2,
      unknown: 7,
      contradicted: 0,
      total: 9,
    });
    expect(stats.capabilityCoverage.find((item) => item.key === "visualReview")?.documented).toBe(9);
  });

  it("summarizes workflow bands without creating an overall score", () => {
    expect(stats.workflowCoverage.find((item) => item.id === "parallel-local")?.counts).toEqual({
      strong: 9,
      good: 0,
      conditional: 0,
      "not-eligible": 0,
    });
    expect(stats.workflowCoverage.find((item) => item.id === "remote-control")?.counts).toEqual({
      strong: 2,
      good: 6,
      conditional: 1,
      "not-eligible": 0,
    });
  });
});
