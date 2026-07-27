import { describe, expect, it } from "vitest";
import { workflowScenarios } from "../src/data/workflow-scenarios";
import { harnesses } from "../src/data/harnesses";
import { getOperationalProfile } from "../src/data/operational-profiles";
import {
  eligibilityAssessmentFor,
  eligibilityFailuresFor,
  fitBandFor,
  isCompatible,
  missingRequiredFeatures,
  recommendHarnesses,
  requiredFeaturesFor,
} from "../src/lib/recommendation";
import {
  capabilityAxisLabels,
  capabilityLevelAnchors,
  capabilityValueFunction,
  changeScopeWeights,
  controlStyleWeights,
  operatingModeWeights,
  operationalPostureScores,
  recommendationWeights,
} from "../src/lib/recommendation-config";
import type { Harness, RecommendationAnswers } from "../src/lib/types";

const base: RecommendationAnswers = {
  interface: "terminal",
  priority: "simplicity",
  modelAccess: "subscription",
  control: "balanced",
  changeScope: "large-repo",
  operatingMode: "interactive",
  requiredFeatures: [],
};

describe("recommendHarnesses", () => {
  it("keeps the published workflow weights normalized to 100", () => {
    expect(Object.values(recommendationWeights).reduce((total, weight) => total + weight, 0)).toBe(100);
  });

  it("publishes five behavioral anchors for every scored capability", () => {
    const capabilityKeys = Object.keys(harnesses[0].capabilities) as Array<keyof typeof harnesses[0]["capabilities"]>;

    expect(Object.keys(capabilityAxisLabels)).toEqual(capabilityKeys);
    for (const capability of capabilityKeys) {
      expect(Object.keys(capabilityLevelAnchors[capability])).toEqual(["1", "2", "3", "4", "5"]);
      for (const level of [1, 2, 3, 4, 5] as const) {
        expect(capabilityLevelAnchors[capability][level].length).toBeGreaterThan(20);
        expect(capabilityValueFunction[level]).toBe((level - 1) * 25);
      }
    }
  });

  it("keeps every operational subweight group normalized to 100", () => {
    for (const groups of [controlStyleWeights, changeScopeWeights, operatingModeWeights]) {
      for (const weights of Object.values(groups)) {
        const numericWeights = Object.values(weights) as number[];
        expect(numericWeights.reduce((total, weight) => total + weight, 0)).toBe(100);
      }
    }
  });

  it("represents unknown operational evidence as missing rather than a neutral score", () => {
    for (const posture of Object.values(operationalPostureScores)) {
      expect(posture.unknown).toBeNull();
    }
  });

  it("uses required capabilities as hard eligibility gates", () => {
    const answers: RecommendationAnswers = {
      ...base,
      modelAccess: "local",
      priority: "flexibility",
      requiredFeatures: ["localModels", "mcp"],
    };
    const result = recommendHarnesses(answers);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.harness.localModels && item.harness.features.mcp)).toBe(true);
  });

  it("describes failed gates as insufficient current evidence rather than product incapability", () => {
    const harness = harnesses.find((item) => item.id === "claude-code")!;
    const assessment = eligibilityAssessmentFor(harness, {
      ...base,
      modelAccess: "local",
      requiredFeatures: ["browser"],
    });

    expect(assessment.state).toBe("not-eligible-on-current-evidence");
    expect(assessment.label).toBe("Not eligible on current evidence");
    expect(assessment.failures.length).toBeGreaterThan(0);
  });

  it("publishes four workflow-fit bands without exposing the internal value as a quality grade", () => {
    expect(fitBandFor(100)).toBe("strong");
    expect(fitBandFor(75)).toBe("strong");
    expect(fitBandFor(74)).toBe("good");
    expect(fitBandFor(55)).toBe("good");
    expect(fitBandFor(54)).toBe("conditional");
    expect(fitBandFor(35)).toBe("conditional");
    expect(fitBandFor(34)).toBe("weak");
    expect(fitBandFor(0)).toBe("weak");
  });

  it("treats interface and model access as non-compensatory gates", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "ide",
      modelAccess: "local",
    };
    const result = recommendHarnesses(answers);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.harness.interfaces.includes("ide") && item.harness.localModels)).toBe(true);
  });

  it("explains every failed eligibility gate", () => {
    const answers: RecommendationAnswers = {
      ...base,
      operatingMode: "ci",
      requiredFeatures: ["sandbox", "browser"],
    };
    const activeHarnesses = harnesses.filter((harness) => harness.status === "active");

    for (const harness of activeHarnesses) {
      const missing = missingRequiredFeatures(harness, answers);
      expect(missing).toEqual(
        requiredFeaturesFor(answers).filter((feature) => !harness.features[feature]),
      );
      expect(isCompatible(harness, answers)).toBe(eligibilityFailuresFor(harness, answers).length === 0);
    }
  });

  it("does not turn a met requirement into a score bonus", () => {
    const withoutGate = recommendHarnesses(base).find((item) => item.harness.id === "claude-code");
    const withGate = recommendHarnesses({ ...base, requiredFeatures: ["mcp"] })
      .find((item) => item.harness.id === "claude-code");

    expect(withGate?.score).toBe(withoutGate?.score);
  });

  it("makes headless execution an implicit CI requirement", () => {
    const answers: RecommendationAnswers = { ...base, operatingMode: "ci" };
    const result = recommendHarnesses(answers);

    expect(requiredFeaturesFor(answers)).toContain("headless");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.harness.features.headless)).toBe(true);
  });

  it("makes subagents an implicit parallel-work requirement", () => {
    const answers: RecommendationAnswers = { ...base, operatingMode: "parallel" };
    const result = recommendHarnesses(answers);

    expect(requiredFeaturesFor(answers)).toContain("subagents");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.harness.features.subagents)).toBe(true);
  });

  it("keeps audited automation posture distinct across Aider, OpenHands, and Cline", () => {
    expect(getOperationalProfile("aider")).toMatchObject({ context: "managed", permissions: "approval", recovery: "checkpoint" });
    expect(getOperationalProfile("openhands")).toMatchObject({ context: "persistent", permissions: "policy", observability: "traces" });
    expect(getOperationalProfile("cline")).toMatchObject({ permissions: "policy", observability: "logs", recovery: "checkpoint" });
  });

  it("represents the audited safety and recovery upgrades in current major CLIs", () => {
    expect(getOperationalProfile("gemini-cli")).toMatchObject({ context: "persistent", permissions: "policy", observability: "traces", recovery: "checkpoint" });
    expect(getOperationalProfile("copilot-cli")).toMatchObject({ context: "persistent", permissions: "policy", recovery: "checkpoint" });
    expect(getOperationalProfile("cursor-cli")).toMatchObject({ permissions: "policy", recovery: "checkpoint" });
    expect(getOperationalProfile("factory-droid")).toMatchObject({ permissions: "policy", observability: "traces", recovery: "checkpoint" });
  });

  it("recognizes Letta's opt-in policy for controlled multi-agent work without hiding its permissive default", () => {
    const answers: RecommendationAnswers = {
      ...base,
      priority: "security",
      modelAccess: "local",
      control: "approval-heavy",
      changeScope: "cross-file",
      operatingMode: "parallel",
      requiredFeatures: ["mcp", "sandbox", "subagents"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "letta-code");

    expect(getOperationalProfile("letta-code").permissions).toBe("policy");
    expect(result).toBeDefined();
    expect(result!.scoreBreakdown.control).toBeGreaterThan(80);
    expect(result!.reasons).toContain("It documents scoped policy or approval controls.");
    expect(result!.harness.tradeoffs.join(" ")).toContain("starts in unrestricted mode");
  });

  it("admits Junie's tethered browser surface without describing it as an autonomous cloud runtime", () => {
    const result = recommendHarnesses({ ...base, interface: "web" }).find((item) => item.harness.id === "junie-cli");

    expect(result).toBeDefined();
    expect(result!.harness.interfaces).toContain("web");
    expect(result!.harness.classification.runtime).toBe("host-first");
    expect(result!.harness.tradeoffs.join(" ")).toContain("running local CLI");
    expect(result!.harness.tradeoffs.join(" ")).toContain("terminal-only actions");
  });

  it("keeps fit separate from evidence coverage", () => {
    const cline = harnesses.find((harness) => harness.id === "cline")!;
    const limited: Harness = { ...cline, evidence: cline.evidence.slice(0, 2) };
    const fullResult = recommendHarnesses({ ...base, interface: "ide" }, [cline])[0];
    const limitedResult = recommendHarnesses({ ...base, interface: "ide" }, [limited])[0];

    expect(fullResult.score).toBe(limitedResult.score);
    expect(fullResult.evidenceCoverage).toBe("high");
    expect(limitedResult.evidenceCoverage).toBe("limited");
  });

  it("excludes every non-active product before scoring", () => {
    const archived: Harness = { ...harnesses[0], id: "archived-test", status: "archived" };
    const dormant: Harness = { ...harnesses[0], id: "dormant-test", status: "dormant" };
    expect(recommendHarnesses(base, [archived])).toEqual([]);
    expect(recommendHarnesses(base, [dormant])).toEqual([]);
    expect(recommendHarnesses(base).some((result) => result.harness.id === "plandex")).toBe(false);
  });

  it("returns scores in descending order", () => {
    const result = recommendHarnesses(base);
    const scores = result.map((item) => item.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("reports deterministic sensitivity rather than presenting the value index as certainty", () => {
    const first = recommendHarnesses(base);
    const second = recommendHarnesses(base);
    expect(first.map((item) => item.robustness)).toEqual(second.map((item) => item.robustness));
    for (const result of first) {
      expect(result.robustness.scenarioCount).toBe(512);
      expect(result.robustness.topRankFrequency).toBeGreaterThanOrEqual(0);
      expect(result.robustness.topThreeFrequency).toBeLessThanOrEqual(100);
      expect(result.robustness.bestRank).toBeLessThanOrEqual(result.robustness.worstRank);
    }
  });

  it("keeps every homepage scenario tied to its explicit workflow gates", () => {
    const topHarnesses = new Set<string>();

    for (const scenario of workflowScenarios) {
      const result = recommendHarnesses(scenario.answers);
      expect(result.length, scenario.id).toBeGreaterThan(0);
      expect(result.every((item) => isCompatible(item.harness, scenario.answers)), scenario.id).toBe(true);
      topHarnesses.add(result[0].harness.id);
    }

    expect(topHarnesses.size).toBeGreaterThan(2);
  });

  it("leads with a product-specific reason in every homepage ranking", () => {
    for (const scenario of workflowScenarios) {
      const leadReasons = recommendHarnesses(scenario.answers).map((result) => result.reasons[0]);

      expect(leadReasons.every((reason) => reason.startsWith("Documented use case:")), scenario.id).toBe(true);
      expect(new Set(leadReasons).size, scenario.id).toBe(leadReasons.length);
    }
  });

  it("offers a plain-language vibe-coding starting point without hidden must-haves", () => {
    const scenario = workflowScenarios.find((item) => item.id === "vibe-coding")!;

    expect(scenario.label).toBe("Vibe coding");
    expect(scenario.description).toContain("let the agent write most of the code");
    expect(scenario.answers).toMatchObject({
      interface: "ide",
      priority: "simplicity",
      modelAccess: "subscription",
      control: "balanced",
      operatingMode: "interactive",
      requiredFeatures: [],
    });
    expect(recommendHarnesses(scenario.answers).length).toBeGreaterThan(0);
  });

  it("admits Kilo for controlled IDE vibe coding when rollback, isolation, browser, and delegation are required", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "ide",
      priority: "simplicity",
      modelAccess: "subscription",
      control: "approval-heavy",
      operatingMode: "parallel",
      requiredFeatures: ["sandbox", "checkpoints", "mcp", "browser"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "kilo-code");

    expect(result).toBeDefined();
    expect(result?.harness.features).toMatchObject({ sandbox: true, checkpoints: true, subagents: true, browser: true });
    expect(requiredFeaturesFor(answers)).toContain("subagents");
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.compromises.join(" ")).toContain("disabled by default");
    expect(getOperationalProfile("kilo-code")).toEqual({
      context: "managed",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "traces",
      recovery: "checkpoint",
    });
  });

  it("admits Mistral Vibe for a controlled IDE workflow without pretending its local CLI is sandboxed", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "ide",
      priority: "simplicity",
      modelAccess: "subscription",
      control: "approval-heavy",
      operatingMode: "interactive",
      requiredFeatures: ["checkpoints", "mcp"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "mistral-vibe");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.features).toMatchObject({ checkpoints: true, mcp: true, sandbox: false });
    expect(result?.harness.providerStyle).toBe("multi-provider");
    expect(result?.compromises.join(" ")).toContain("local CLI executes on the host");
    expect(getOperationalProfile("mistral-vibe")).toEqual({
      context: "managed",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "traces",
      recovery: "checkpoint",
    });
  });

  it("admits Stagewise for attended parallel desktop work but not unattended CI", () => {
    const parallelAnswers: RecommendationAnswers = {
      ...base,
      interface: "ide",
      modelAccess: "local",
      priority: "simplicity",
      control: "approval-heavy",
      operatingMode: "parallel",
      requiredFeatures: ["browser", "checkpoints"],
    };
    const parallel = recommendHarnesses(parallelAnswers).find((item) => item.harness.id === "stagewise");
    const unattended = recommendHarnesses({
      ...parallelAnswers,
      operatingMode: "ci",
      requiredFeatures: [],
    }).find((item) => item.harness.id === "stagewise");

    expect(parallel).toBeDefined();
    expect(missingRequiredFeatures(parallel!.harness, parallelAnswers)).toEqual([]);
    expect(parallel?.harness.features).toMatchObject({ subagents: true, browser: true, checkpoints: true, headless: false });
    expect(parallel?.harness.tradeoffs.join(" ")).toContain("separate top-level agent sessions");
    expect(unattended).toBeUndefined();
    expect(getOperationalProfile("stagewise")).toEqual({
      context: "managed",
      permissions: "approval",
      verification: "tool-assisted",
      observability: "logs",
      recovery: "checkpoint",
    });
  });

  it("keeps Zoo Code in controlled IDE workflows until its public headless path is verifiable", () => {
    const interactiveAnswers: RecommendationAnswers = {
      ...base,
      interface: "ide",
      modelAccess: "local",
      priority: "flexibility",
      control: "approval-heavy",
      operatingMode: "interactive",
      requiredFeatures: ["mcp", "checkpoints"],
    };
    const interactive = recommendHarnesses(interactiveAnswers).find((item) => item.harness.id === "zoo-code");
    const unattended = recommendHarnesses({
      ...interactiveAnswers,
      operatingMode: "ci",
      requiredFeatures: [],
    }).find((item) => item.harness.id === "zoo-code");

    expect(interactive).toBeDefined();
    expect(missingRequiredFeatures(interactive!.harness, interactiveAnswers)).toEqual([]);
    expect(interactive?.harness.tradeoffs.join(" ")).toContain("no Zoo-owned CLI release asset");
    expect(unattended).toBeUndefined();
    expect(getOperationalProfile("zoo-code")).toEqual({
      context: "managed",
      permissions: "approval",
      verification: "tool-assisted",
      observability: "logs",
      recovery: "checkpoint",
    });
  });

  it("admits ZCode for scheduled desktop work but not unattended CI", () => {
    const scheduledAnswers: RecommendationAnswers = {
      ...base,
      interface: "automation",
      modelAccess: "subscription",
      priority: "autonomy",
      control: "balanced",
      operatingMode: "interactive",
      requiredFeatures: ["subagents", "browser", "sandbox", "checkpoints"],
    };
    const scheduled = recommendHarnesses(scheduledAnswers).find((item) => item.harness.id === "zcode");
    const unattended = recommendHarnesses({
      ...scheduledAnswers,
      operatingMode: "ci",
      requiredFeatures: [],
    }).find((item) => item.harness.id === "zcode");

    expect(scheduled).toBeDefined();
    expect(missingRequiredFeatures(scheduled!.harness, scheduledAnswers)).toEqual([]);
    expect(scheduled?.harness.features.headless).toBe(false);
    expect(scheduled?.harness.tradeoffs.join(" ")).toContain("scheduled automation still belongs to the desktop product");
    expect(unattended).toBeUndefined();
    expect(getOperationalProfile("zcode")).toEqual({
      context: "managed",
      permissions: "policy",
      verification: "workflow-gated",
      observability: "traces",
      recovery: "managed-recovery",
    });
  });

  it("admits Hermes Agent for isolated autonomous automation while exposing its host-default caveat", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "automation",
      modelAccess: "local",
      priority: "autonomy",
      control: "hands-off",
      changeScope: "large-repo",
      operatingMode: "parallel",
      requiredFeatures: ["sandbox", "browser", "checkpoints", "mcp"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "hermes-agent");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.features).toMatchObject({ headless: true, sandbox: true, checkpoints: true, subagents: true });
    expect(result?.compromises.join(" ")).toContain("default local backend executes with the user's host privileges");
    expect(getOperationalProfile("hermes-agent")).toEqual({
      context: "persistent",
      permissions: "policy",
      verification: "workflow-gated",
      observability: "traces",
      recovery: "managed-recovery",
    });
  });

  it("admits mini-SWE-agent for a simple confirmed terminal workflow without treating prompts as rollback", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "terminal",
      modelAccess: "local",
      priority: "simplicity",
      control: "approval-heavy",
      changeScope: "focused",
      operatingMode: "interactive",
      requiredFeatures: ["sandbox"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "mini-swe-agent");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.capabilities.humanControl).toBe(3);
    expect(result?.compromises.join(" ")).toContain("default local environment executes directly with the user's host privileges");
    expect(result?.harness.tradeoffs.join(" ")).toContain("no rollback checkpoint");
    expect(getOperationalProfile("mini-swe-agent")).toEqual({
      context: "basic",
      permissions: "approval",
      verification: "manual",
      observability: "traces",
      recovery: "manual",
    });
  });

  it("admits Amp for durable sandboxed parallel automation while exposing the local permission default", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "automation",
      modelAccess: "subscription",
      priority: "autonomy",
      control: "hands-off",
      changeScope: "large-repo",
      operatingMode: "parallel",
      requiredFeatures: ["sandbox", "mcp", "browser"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "amp");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.classification.isolation).toContain("managed-sandbox");
    expect(result?.harness.features.checkpoints).toBe(false);
    expect(result?.compromises.join(" ")).toContain("Local tools run with host privileges and without approval by default");
    expect(getOperationalProfile("amp")).toEqual({
      context: "persistent",
      permissions: "host",
      verification: "tool-assisted",
      observability: "traces",
      recovery: "managed-recovery",
    });
  });

  it("admits Kiro for controlled parallel CLI work but keeps host isolation out of the claim", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "terminal",
      modelAccess: "enterprise",
      priority: "autonomy",
      control: "approval-heavy",
      changeScope: "large-repo",
      operatingMode: "parallel",
      requiredFeatures: ["mcp", "checkpoints"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "kiro-cli");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.features).toMatchObject({ subagents: true, checkpoints: true, sandbox: false });
    expect(result?.compromises.join(" ")).toContain("Commands and tools operate in the local environment");
    expect(getOperationalProfile("kiro-cli")).toEqual({
      context: "managed",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "logs",
      recovery: "checkpoint",
    });
  });

  it("admits Poolside for policy-controlled local-model automation without promising checkpoints", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "automation",
      modelAccess: "local",
      priority: "security",
      control: "approval-heavy",
      changeScope: "large-repo",
      operatingMode: "ci",
      requiredFeatures: ["mcp", "sandbox"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "poolside-cli");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.features).toMatchObject({ headless: true, localModels: true, sandbox: true, checkpoints: false });
    expect(result?.compromises.join(" ")).toContain("local environment is enabled by default");
    expect(getOperationalProfile("poolside-cli")).toEqual({
      context: "managed",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "traces",
      recovery: "session-resume",
    });
  });

  it("does not present Codebuff as approval-oriented when the user wants close control", () => {
    const result = recommendHarnesses({
      ...base,
      control: "approval-heavy",
    }).find((item) => item.harness.id === "codebuff")!;

    expect(result.scoreBreakdown.control).toBeCloseTo(60.75, 2);
    expect(result.reasons.join(" ")).not.toContain("approvals close to the developer");
    expect(result.compromises.join(" ")).toContain("host access");
  });

  it("does not overstate ForgeCode control when its restrictive rules are optional", () => {
    const result = recommendHarnesses({
      ...base,
      priority: "security",
      modelAccess: "local",
      control: "approval-heavy",
    }).find((item) => item.harness.id === "forgecode")!;

    expect(result).toBeDefined();
    expect(result.scoreBreakdown.control).toBeLessThan(65);
    expect(result.reasons.join(" ")).not.toContain("approvals close to the developer");
    expect(result.compromises.join(" ")).toContain("host access");
    expect(result.harness.tradeoffs.join(" ")).toContain("MCP tools bypass it");
  });

  it("admits Coder Agents for its documented self-hosted MCP and desktop path", () => {
    const result = recommendHarnesses({
      ...base,
      interface: "web",
      modelAccess: "local",
      priority: "security",
      operatingMode: "parallel",
      requiredFeatures: ["mcp", "browser"],
    });
    const coderAgents = result.find((item) => item.harness.id === "coder-agents");

    expect(coderAgents).toBeDefined();
    expect(coderAgents?.harness.tradeoffs.join(" ")).toContain("desktop and browser work are experimental");
    expect(coderAgents?.harness.tradeoffs.join(" ")).toContain("isolation depends on the selected template");
  });

  it("admits Crush for practical terminal delegation and scripted local workflows", () => {
    const delegated = recommendHarnesses({
      ...base,
      modelAccess: "subscription",
      operatingMode: "parallel",
      requiredFeatures: ["mcp"],
    }).find((item) => item.harness.id === "crush");
    const scripted = recommendHarnesses({
      ...base,
      interface: "automation",
      modelAccess: "local",
      operatingMode: "ci",
    }).find((item) => item.harness.id === "crush");

    expect(delegated).toBeDefined();
    expect(delegated?.harness.bestFor.join(" ")).toContain("read-only research agent");
    expect(delegated?.harness.tradeoffs.join(" ")).toContain("not independent write-capable implementation");
    expect(scripted).toBeDefined();
    expect(scripted?.harness.features.sandbox).toBe(false);
  });

  it("partitions every active harness into ranked or explicitly excluded", () => {
    const activeHarnesses = harnesses.filter((harness) => harness.status === "active");

    for (const scenario of workflowScenarios) {
      const ranked = recommendHarnesses(scenario.answers, activeHarnesses);
      const rankedIds = new Set(ranked.map((result) => result.harness.id));
      const excluded = activeHarnesses.filter((harness) => !rankedIds.has(harness.id));

      expect(ranked.length + excluded.length, scenario.id).toBe(activeHarnesses.length);
      expect(excluded.every((harness) => (
        eligibilityFailuresFor(harness, scenario.answers).length > 0
      )), scenario.id).toBe(true);
    }
  });

  it("surfaces controlled IDE candidates for rollback and MCP work", () => {
    const result = recommendHarnesses({
      ...base,
      interface: "ide",
      control: "approval-heavy",
      modelAccess: "model-agnostic",
      requiredFeatures: ["checkpoints", "mcp"],
    });

    expect(result[0].harness.interfaces).toContain("ide");
    expect(result[0].harness.features.checkpoints).toBe(true);
    expect(result[0].harness.features.mcp).toBe(true);
  });

  it("keeps autonomous CI recommendations gated by both isolation and headless support", () => {
    const result = recommendHarnesses({
      ...base,
      priority: "autonomy",
      control: "hands-off",
      operatingMode: "ci",
      requiredFeatures: ["sandbox"],
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.harness.features.sandbox && item.harness.features.headless)).toBe(true);
  });

  it("admits Claude Code for durable managed parallel work while exposing its opt-in local boundary", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "web",
      modelAccess: "subscription",
      priority: "autonomy",
      control: "approval-heavy",
      operatingMode: "parallel",
      requiredFeatures: ["sandbox", "mcp", "browser", "checkpoints"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "claude-code");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.classification).toMatchObject({ state: "persistent-memory" });
    expect(result?.compromises.join(" ")).toContain("OS sandboxing is disabled by default");
    expect(getOperationalProfile("claude-code")).toEqual({
      context: "persistent",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "traces",
      recovery: "checkpoint",
    });
  });

  it("admits Codex for local-model parallel automation without claiming checkpoint recovery", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "automation",
      modelAccess: "local",
      priority: "flexibility",
      control: "approval-heavy",
      operatingMode: "parallel",
      requiredFeatures: ["sandbox", "mcp"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "codex");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness).toMatchObject({ providerStyle: "multi-provider", localModels: true });
    expect(result?.harness.features.checkpoints).toBe(false);
    expect(result?.harness.tradeoffs.join(" ")).toContain("no product-level file checkpoint");
    expect(getOperationalProfile("codex")).toEqual({
      context: "persistent",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "traces",
      recovery: "session-resume",
    });
  });

  it("admits OpenCode for flexible local CI while preserving its host-risk tradeoff", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "automation",
      modelAccess: "local",
      priority: "flexibility",
      control: "approval-heavy",
      operatingMode: "ci",
      requiredFeatures: ["mcp", "checkpoints"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "opencode");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.capabilities.security).toBe(3);
    expect(result?.harness.features.sandbox).toBe(false);
    expect(result?.harness.tradeoffs.join(" ")).toContain("application policy rather than an isolation boundary");
    expect(getOperationalProfile("opencode")).toEqual({
      context: "managed",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "logs",
      recovery: "checkpoint",
    });
  });

  it("admits Pi for a minimal local scripted workflow without upgrading host access to approval control", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "automation",
      modelAccess: "local",
      priority: "simplicity",
      control: "hands-off",
      operatingMode: "ci",
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "pi");

    expect(result).toBeDefined();
    expect(result?.harness.features).toMatchObject({ headless: true, sandbox: false, checkpoints: false });
    expect(result?.harness.tradeoffs.join(" ")).toContain("no built-in permission system");
    expect(getOperationalProfile("pi")).toEqual({
      context: "managed",
      permissions: "host",
      verification: "manual",
      observability: "session",
      recovery: "session-resume",
    });
  });

  it("admits OMP for local parallel tooling while surfacing yolo defaults and transcript-only rewind", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "terminal",
      modelAccess: "local",
      priority: "flexibility",
      control: "balanced",
      operatingMode: "parallel",
      requiredFeatures: ["mcp", "browser"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "omp");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.capabilities.humanControl).toBe(3);
    expect(result?.harness.features.checkpoints).toBe(false);
    expect(result?.harness.tradeoffs.join(" ")).toContain("subagents also run yolo");
    expect(getOperationalProfile("omp")).toEqual({
      context: "persistent",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "logs",
      recovery: "session-resume",
    });
  });

  it("admits Grok Build for controlled parallel CI but retains its optional-sandbox caveat", () => {
    const answers: RecommendationAnswers = {
      ...base,
      interface: "automation",
      modelAccess: "model-agnostic",
      priority: "security",
      control: "approval-heavy",
      operatingMode: "parallel",
      requiredFeatures: ["sandbox", "mcp", "checkpoints"],
    };
    const result = recommendHarnesses(answers).find((item) => item.harness.id === "grok-build");

    expect(result).toBeDefined();
    expect(missingRequiredFeatures(result!.harness, answers)).toEqual([]);
    expect(result?.harness.tradeoffs.join(" ")).toContain("OS sandbox is off by default");
    expect(getOperationalProfile("grok-build")).toEqual({
      context: "persistent",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "traces",
      recovery: "checkpoint",
    });
  });
});
