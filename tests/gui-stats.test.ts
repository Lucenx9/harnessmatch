import { describe, expect, it } from "vitest";
import { guiProducts } from "../src/data/gui-products";
import { guiRepositoryAudits } from "../src/data/gui-repository-audits";
import { guiWorkflows } from "../src/lib/gui-fit";
import { summarizeGuiCatalog } from "../src/lib/gui-stats";

describe("GUI catalog statistics", () => {
  const stats = summarizeGuiCatalog(guiProducts, guiRepositoryAudits, guiWorkflows);

  it("derives catalog totals from evidence-backed records", () => {
    expect(stats).toEqual(expect.objectContaining({
      activeProducts: 18,
      documentedClaims: 71,
      totalClaims: 90,
      codeAudits: 14,
      previews: 5,
      publicCodeProducts: 14,
      proprietaryProducts: 4,
      nativeProducts: 5,
      multiHarnessProducts: 13,
    }));
    expect(stats.evidenceSources).toBeGreaterThanOrEqual(guiProducts.length);
  });

  it("keeps evidence gaps visible in capability coverage", () => {
    expect(stats.capabilityCoverage.find((item) => item.key === "teamCollaboration")).toEqual({
      key: "teamCollaboration",
      documented: 5,
      unknown: 13,
      contradicted: 0,
      total: 18,
    });
    expect(stats.capabilityCoverage.find((item) => item.key === "visualReview")?.documented).toBe(17);
  });

  it("summarizes workflow bands without creating an overall score", () => {
    expect(stats.workflowCoverage.find((item) => item.id === "parallel-local")?.counts).toEqual({
      strong: 15,
      good: 1,
      conditional: 2,
      "not-eligible": 0,
    });
    expect(stats.workflowCoverage.find((item) => item.id === "remote-control")?.counts).toEqual({
      strong: 5,
      good: 10,
      conditional: 1,
      "not-eligible": 2,
    });
  });
});
