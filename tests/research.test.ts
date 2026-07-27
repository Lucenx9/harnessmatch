import { describe, expect, it } from "vitest";
import { researchInsights, researchSources } from "../src/data/research";

describe("scientific methodology ledger", () => {
  it("keeps source maturity and limitations explicit", () => {
    expect(researchSources.length).toBeGreaterThanOrEqual(24);
    expect(researchSources.some((source) => source.maturity === "peer-reviewed")).toBe(true);
    expect(researchSources.some((source) => source.maturity === "preprint")).toBe(true);

    for (const source of researchSources) {
      expect(source.supports.length).toBeGreaterThan(40);
      expect(source.limitation.length).toBeGreaterThan(40);
      expect(new URL(source.url).protocol).toBe("https:");
    }
  });

  it("does not duplicate scientific records", () => {
    expect(new Set(researchSources.map((source) => source.url)).size).toBe(researchSources.length);
  });

  it("uses general-agent evaluation research as methodology rather than goose evidence", () => {
    const source = researchSources.find((item) => item.title === "General Agent Evaluation")!;

    expect(source.maturity).toBe("preprint");
    expect(source.supports).toContain("agent, model, and environment");
    expect(source.limitation).toContain("does not evaluate goose");
    expect(source.limitation).toContain("not as product evidence");
  });

  it("qualifies model-based judges instead of treating them as ground truth", () => {
    const source = researchSources.find((item) => item.title === "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena")!;

    expect(source.maturity).toBe("peer-reviewed");
    expect(source.supports).toContain("biases");
    expect(source.limitation).toContain("not a Codebuff capability or quality rating");
  });

  it("adds peer-reviewed foundations for repository and adversarial agent evaluation", () => {
    const sweBench = researchSources.find((item) => item.title.startsWith("SWE-bench: Can Language Models"))!;
    const agentDojo = researchSources.find((item) => item.title.startsWith("AgentDojo:"))!;

    expect(sweBench).toMatchObject({ maturity: "peer-reviewed", venue: "ICLR 2024" });
    expect(sweBench.supports).toContain("executable environments");
    expect(agentDojo).toMatchObject({ maturity: "peer-reviewed", venue: "NeurIPS 2024 Datasets and Benchmarks" });
    expect(agentDojo.supports).toContain("task utility from adversarial security");
  });

  it("keeps production curation and overeager-action results out of permanent product scores", () => {
    const reap = researchSources.find((item) => item.title.startsWith("REAP:"))!;
    const overeager = researchSources.find((item) => item.title.startsWith("Overeager Coding Agents:"))!;
    const scopeInsight = researchInsights.find((item) => item.title === "A sandbox and aligned scope solve different problems.")!;

    expect(reap.supports).toContain("multi-run stability");
    expect(reap.limitation).toContain("cannot be transferred");
    expect(overeager.supports).toContain("distinct from prompt injection and sandbox escape");
    expect(overeager.limitation).toContain("does not convert its product rates into permanent security scores");
    expect(scopeInsight.sourceUrls).toEqual(expect.arrayContaining([
      "https://proceedings.neurips.cc/paper_files/paper/2024/hash/97091a5177d8dc64b1da8bf3e1f6fb54-Abstract-Datasets_and_Benchmarks_Track.html",
      overeager.url,
    ]));
  });

  it("grounds vibe-coding guidance in real-session and least-privilege research", () => {
    const vibe = researchSources.find((item) => item.title === "SWE-chat: Coding Agent Interactions From Real Users in the Wild")!;
    const permissions = researchSources.find((item) => item.title === "Do Coding Agents Understand Least-Privilege Authorization?")!;
    const insight = researchInsights.find((item) => item.title === "Vibe coding still needs visible guardrails.")!;

    expect(vibe.maturity).toBe("preprint");
    expect(vibe.supports).toContain("vibe coding");
    expect(permissions.supports).toContain("harness-level policy");
    expect(insight.sourceUrls).toEqual(expect.arrayContaining([vibe.url, permissions.url]));
  });

  it("requires held-out validation before harness optimization affects general recommendations", () => {
    const observable = researchSources.find((item) => item.title.startsWith("Agentic Harness Engineering:"))!;
    const heldOut = researchSources.find((item) => item.title === "Rethinking the Evaluation of Harness Evolution for Agents")!;
    const definition = researchSources.find((item) => item.title.startsWith("What makes a harness a harness:"))!;
    const insight = researchInsights.find((item) => item.title === "A better harness must work beyond the tasks that shaped it.")!;

    expect(observable.supports).toContain("falsifiable prediction");
    expect(heldOut.supports).toContain("held-out tasks");
    expect(heldOut.supports).toContain("matched feedback and inference budgets");
    expect(definition.supports).toContain("evaluation harness used to score it");
    expect(insight.sourceUrls).toEqual(expect.arrayContaining([observable.url, heldOut.url]));
  });

  it("grounds both coding reliability and user-centered recommendation validation", () => {
    const reliability = researchSources.find((item) => item.title.startsWith("Applying Inter-Rater Reliability"))!;
    const alpha = researchSources.find((item) => item.title.startsWith("krippendorffsalpha:"))!;
    const recommenderUx = researchSources.find((item) => item.title === "A User-Centric Evaluation Framework for Recommender Systems")!;

    expect(reliability.venue).toBe("Journal of Systems and Software 2023");
    expect(reliability.url).toBe("https://doi.org/10.1016/j.jss.2022.111520");
    expect(alpha.limitation).toContain("reliability rather than validity");
    expect(recommenderUx.supports).toContain("perceived recommendation quality");
    expect(recommenderUx.limitation).toContain("domain-specific prospective study");
  });

  it("grounds every plain-language insight in the scientific ledger", () => {
    const ledgerUrls = new Set(researchSources.map((source) => source.url));

    expect(researchInsights.length).toBeGreaterThanOrEqual(5);
    for (const insight of researchInsights) {
      expect(insight.title.length).toBeGreaterThan(10);
      expect(insight.summary.length).toBeGreaterThan(70);
      expect(insight.sourceUrls.length).toBeGreaterThanOrEqual(2);
      expect(insight.sourceUrls.every((url) => ledgerUrls.has(url))).toBe(true);
    }
  });
});
