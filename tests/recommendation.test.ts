import { describe, expect, it } from "vitest";
import { recommendHarnesses } from "../src/lib/recommendation";
import { workflowScenarios } from "../src/data/workflow-scenarios";
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

  it("surfaces Grok Build for controlled IDE work that requires isolation and rewind", () => {
    const result = recommendHarnesses({
      ...base,
      interface: "ide",
      priority: "security",
      modelAccess: "model-agnostic",
      control: "approval-heavy",
      requiredFeatures: ["sandbox", "checkpoints"],
    });

    expect(result[0].harness.id).toBe("grok-build");
    expect(result[0].blockers).toHaveLength(0);
  });

  it("surfaces Oh My Pi for editor-integrated browser and subagent workflows", () => {
    const result = recommendHarnesses({
      ...base,
      interface: "ide",
      priority: "flexibility",
      modelAccess: "model-agnostic",
      control: "hands-off",
      repoContext: "multi-agent",
      requiredFeatures: ["browser", "subagents", "headless", "mcp"],
    });

    expect(result[0].harness.id).toBe("omp");
    expect(result[0].blockers).toHaveLength(0);
  });

  it("surfaces Gemini CLI for subscription-first terminal work that requires isolation and rollback", () => {
    const result = recommendHarnesses({
      ...base,
      priority: "security",
      modelAccess: "subscription",
      control: "approval-heavy",
      repoContext: "large",
      requiredFeatures: ["sandbox", "checkpoints"],
    });

    const gemini = result.find((item) => item.harness.id === "gemini-cli");
    expect(gemini?.score).toBeGreaterThanOrEqual(95);
    expect(gemini?.blockers).toHaveLength(0);
  });

  it("surfaces Copilot CLI for local-model fleet work with sandbox and rollback requirements", () => {
    const result = recommendHarnesses({
      ...base,
      priority: "flexibility",
      modelAccess: "local",
      control: "hands-off",
      repoContext: "multi-agent",
      requiredFeatures: ["mcp", "localModels", "subagents", "sandbox", "checkpoints"],
    });

    expect(result[0].harness.id).toBe("copilot-cli");
    expect(result[0].blockers).toHaveLength(0);
  });

  it("keeps Cursor CLI competitive for a simple subscription-first terminal loop with MCP automation", () => {
    const result = recommendHarnesses({
      ...base,
      priority: "simplicity",
      modelAccess: "subscription",
      control: "approval-heavy",
      repoContext: "small",
      requiredFeatures: ["mcp", "headless"],
    });

    const cursor = result.find((item) => item.harness.id === "cursor-cli");
    expect(cursor?.score).toBeGreaterThanOrEqual(95);
    expect(cursor?.blockers).toHaveLength(0);
  });

  it("surfaces Junie CLI for IDE-first local-model work with delegated agents", () => {
    const result = recommendHarnesses({
      ...base,
      interface: "ide",
      priority: "flexibility",
      modelAccess: "local",
      control: "approval-heavy",
      repoContext: "large",
      requiredFeatures: ["mcp", "localModels", "subagents", "headless"],
    });

    expect(result[0].harness.id).toBe("junie-cli");
    expect(result[0].blockers).toHaveLength(0);
  });

  it("keeps Factory Droid competitive for autonomous local-model CI orchestration", () => {
    const result = recommendHarnesses({
      ...base,
      priority: "autonomy",
      modelAccess: "local",
      control: "hands-off",
      repoContext: "ci",
      requiredFeatures: ["mcp", "localModels", "subagents", "headless"],
    });

    expect(result.slice(0, 5).map((item) => item.harness.id)).toContain("factory-droid");
    expect(result.find((item) => item.harness.id === "factory-droid")?.blockers).toHaveLength(0);
  });

  it("returns scores in descending order", () => {
    const result = recommendHarnesses(base);
    const scores = result.map((item) => item.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("keeps homepage scenario results tied to the selected workflow", () => {
    const byId = new Map(workflowScenarios.map((scenario) => [scenario.id, scenario]));
    const local = recommendHarnesses(byId.get("local-flexibility")!.answers)[0];
    const ide = recommendHarnesses(byId.get("ide-review")!.answers)[0];
    const autonomous = recommendHarnesses(byId.get("autonomous-ci")!.answers)[0];
    const enterprise = recommendHarnesses(byId.get("enterprise-controls")!.answers)[0];
    const browser = recommendHarnesses(byId.get("browser-work")!.answers)[0];

    expect(local.harness.localModels).toBe(true);
    expect(local.harness.features.mcp).toBe(true);
    expect(ide.harness.id).toBe("cline");
    expect(autonomous.harness.features.headless).toBe(true);
    expect(autonomous.harness.features.sandbox).toBe(true);
    expect(enterprise.harness.features.sandbox).toBe(true);
    expect(browser.harness.features.browser).toBe(true);
    expect(new Set([local.harness.id, ide.harness.id, autonomous.harness.id, enterprise.harness.id, browser.harness.id]).size).toBeGreaterThan(2);
  });
});
