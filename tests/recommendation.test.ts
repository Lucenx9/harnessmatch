import { describe, expect, it } from "vitest";
import { recommendHarnesses } from "../src/lib/recommendation";
import type { RecommendationAnswers } from "../src/lib/types";

const base: RecommendationAnswers = {
  interface: "terminal",
  priority: "simplicity",
  modelAccess: "subscription",
  control: "balanced",
  repoContext: "large",
  requiredFeatures: [],
};

describe("recommendHarnesses", () => {
  it("prefers model-agnostic tools when local models are mandatory", () => {
    const result = recommendHarnesses({
      ...base,
      modelAccess: "local",
      priority: "flexibility",
      requiredFeatures: ["localModels", "mcp"],
    });

    expect(result[0].harness.localModels).toBe(true);
    expect(result[0].harness.features.mcp).toBe(true);
    expect(result.find((item) => item.harness.id === "claude-code")?.score).toBeLessThan(60);
  });

  it("recommends Cline highly for IDE-first approval-heavy work", () => {
    const result = recommendHarnesses({
      ...base,
      interface: "ide",
      control: "approval-heavy",
      modelAccess: "model-agnostic",
      requiredFeatures: ["checkpoints", "mcp"],
    });

    expect(result[0].harness.id).toBe("cline");
  });

  it("keeps a sandbox requirement visible in scoring", () => {
    const result = recommendHarnesses({
      ...base,
      priority: "security",
      control: "hands-off",
      repoContext: "ci",
      requiredFeatures: ["sandbox", "headless"],
    });

    expect(result[0].harness.features.sandbox).toBe(true);
    expect(result[0].blockers).toHaveLength(0);
  });

  it("returns scores in descending order", () => {
    const result = recommendHarnesses(base);
    const scores = result.map((item) => item.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});
