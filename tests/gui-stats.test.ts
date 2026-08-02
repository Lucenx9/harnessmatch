import { describe, expect, it } from "vitest";
import { guiProducts } from "../src/data/gui-products";
import { guiRepositoryAudits } from "../src/data/gui-repository-audits";
import { guiWorkflows } from "../src/lib/gui-fit";
import { summarizeGuiCatalog } from "../src/lib/gui-stats";

describe("GUI catalog statistics", () => {
  const stats = summarizeGuiCatalog(guiProducts, guiRepositoryAudits, guiWorkflows);

  it("derives catalog totals from evidence-backed records", () => {
    expect(stats).toEqual(expect.objectContaining({
      activeProducts: 10,
      documentedClaims: 43,
      totalClaims: 50,
      codeAudits: 6,
      previews: 5,
      publicCodeProducts: 6,
      proprietaryProducts: 4,
      nativeProducts: 2,
      multiHarnessProducts: 8,
    }));
    expect(stats.evidenceSources).toBeGreaterThanOrEqual(guiProducts.length);
  });

  it("keeps evidence gaps visible in capability coverage", () => {
    expect(stats.capabilityCoverage.find((item) => item.key === "teamCollaboration")).toEqual({
      key: "teamCollaboration",
      documented: 4,
      unknown: 6,
      contradicted: 0,
      total: 10,
    });
    expect(stats.capabilityCoverage.find((item) => item.key === "visualReview")?.documented).toBe(9);
  });

  it("summarizes workflow bands without creating an overall score", () => {
    expect(stats.workflowCoverage.find((item) => item.id === "parallel-local")?.counts).toEqual({
      strong: 9,
      good: 1,
      conditional: 0,
      "not-eligible": 0,
    });
    expect(stats.workflowCoverage.find((item) => item.id === "remote-control")?.counts).toEqual({
      strong: 4,
      good: 6,
      conditional: 0,
      "not-eligible": 0,
    });
  });
});
