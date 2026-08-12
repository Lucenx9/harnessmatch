import { describe, expect, it } from "vitest";
import { benchmarkRuns } from "../src/data/benchmark-runs";
import { harnesses } from "../src/data/harnesses";
import {
  repositoryArtifactCount,
  repositoryAudits,
} from "../src/data/repository-audits";
import {
  architectureProfileFor,
  benchmarkConfidenceInterval95,
  benchmarkFamilyCount,
  benchmarkParetoFrontier,
  benchmarkTopIntervalGroup,
  evidenceStateFor,
  operationalReadinessFromProfile,
  operationalReadinessFor,
  operationalReadinessWeights,
} from "../src/lib/evaluation";

describe("multi-axis evidence evaluation", () => {
  it("keeps the legacy operational value model explicit while public artifacts stay unweighted", () => {
    expect(Object.values(operationalReadinessWeights).reduce((total, value) => total + value, 0)).toBe(100);
    for (const audit of repositoryAudits.filter((item) => item.sourceScope !== "support-repository")) {
      expect(repositoryArtifactCount(audit)).toBe(Object.values(audit.signals).filter(Boolean).length);
    }
  });

  it("keeps active operational records within the published rubric", () => {
    for (const harness of harnesses.filter((item) => item.status === "active")) {
      const readiness = operationalReadinessFor(harness.id);
      expect(readiness.documentedAxes, harness.name).toBeGreaterThan(0);
      expect(readiness.score, harness.name).not.toBeNull();
      expect(readiness.score!, harness.name).toBeGreaterThanOrEqual(0);
      expect(readiness.score!, harness.name).toBeLessThanOrEqual(100);
    }
    expect(operationalReadinessFor("missing-record").score).toBeNull();
  });

  it("leaves a partially undocumented operational record unranked instead of renormalizing it", () => {
    const readiness = operationalReadinessFromProfile({
      context: "persistent",
      permissions: "policy",
      verification: "tool-assisted",
      observability: "unknown",
      recovery: "checkpoint",
    });

    expect(readiness.documentedAxes).toBe(4);
    expect(readiness.score).toBeNull();
  });

  it("pins every repository audit and leaves support-only repositories unranked", () => {
    expect(repositoryAudits.length).toBeGreaterThanOrEqual(24);
    expect(new Set(repositoryAudits.map((audit) => audit.harnessId)).size).toBe(repositoryAudits.length);

    for (const audit of repositoryAudits) {
      expect(harnesses.some((harness) => harness.id === audit.harnessId)).toBe(true);
      expect(audit.repositoryUrl).toMatch(/^https:\/\/github\.com\//);
      expect(audit.inspectedRef).toMatch(/^[a-f0-9]{40}$/);
      expect(audit.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(audit.limitation.length).toBeGreaterThan(40);
      if (audit.sourceScope === "support-repository") {
        expect(repositoryArtifactCount(audit), audit.harnessId).toBeNull();
      } else {
        expect(repositoryArtifactCount(audit), audit.harnessId).toBeGreaterThanOrEqual(0);
        expect(repositoryArtifactCount(audit), audit.harnessId).toBeLessThanOrEqual(5);
      }
    }
  });

  it("keeps Pi's comparative eval package separate from benchmark evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "pi")!;

    expect(audit.inspectedRef).toBe("588915ec71714688cee8b7153339e8bdebb3e82e");
    expect(audit.verifiedAt).toBe("2026-08-05");
    expect(audit.signals.evaluationAssets).toBe(true);
    expect(audit.limitation).toContain("465 test-like paths");
    expect(audit.limitation).toContain("behavioral and comparative eval package");
    expect(benchmarkRuns.some((run) => run.harnessId === "pi")).toBe(false);
  });

  it("refreshes Grok Build's periodic source mirror without treating engineering artifacts as benchmark evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "grok-build");

    expect(audit).toMatchObject({
      inspectedRef: "afbc0fb710320c7add294c2106d447ecc3e3af2e",
      verifiedAt: "2026-08-07",
      sourceScope: "full-source",
      signals: { securityPolicy: true, continuousIntegration: false, automatedTests: true, evaluationAssets: false, contributorDocumentation: true },
    });
    expect(audit?.limitation).toContain("1.0.0 periodic public monorepo sync");
    expect(audit?.limitation).toContain("560 test-like files");
    expect(audit?.limitation).toContain("no public CI workflow or complete coding-task evaluation suite");
    expect(benchmarkRuns.some((run) => run.harnessId === "grok-build")).toBe(false);
  });

  it("keeps the new source-audit wave pinned and does not invent a public PostQode repository", () => {
    const audits = new Map(repositoryAudits.map((audit) => [audit.harnessId, audit]));
    expect(audits.get("wakil")?.inspectedRef).toBe("25ff56085007d8e8bdbc4d2f8c74ee4f994a0ed9");
    expect(audits.get("wakil")?.signals.evaluationAssets).toBe(false);
    expect(audits.get("ggcode")?.inspectedRef).toBe("b878385bfd4d0edab137e8d48c18fad512d49f21");
    expect(audits.get("deepagents-code")?.inspectedRef).toBe("43eb196cf7faa993f2fa372dcc1fa65572d8a301");
    expect(audits.get("opensquilla")?.inspectedRef).toBe("f569e05de52dcc1e3954bbcbebe1b10106cdba6e");
    expect(audits.get("kern")?.repositoryUrl).toBe("https://github.com/oguzbilgic/kern-ai");
    expect(audits.get("kern")?.inspectedRef).toBe("8f82a046833128b2bf5f67fdf85a76b35b0fe847");
    expect(audits.has("postqode")).toBe(false);
  });

  it("keeps Cursor's public support repository out of code-verifiable evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "cursor-cli")!;
    const evidence = evidenceStateFor("cursor-cli");

    expect(audit.inspectedRef).toBe("654b1b4775ca67aef473bd31a14c8c04a1abde2d");
    expect(audit.sourceScope).toBe("support-repository");
    expect(audit.signals.securityPolicy).toBe(true);
    expect(repositoryArtifactCount(audit)).toBeNull();
    expect(audit.limitation).toContain("only five paths");
    expect(audit.limitation).toContain("no Cursor CLI implementation");
    expect(evidence.states).toEqual(expect.arrayContaining(["documented", "independently-measured"]));
    expect(evidence.states).not.toContain("code-verifiable");
  });

  it("keeps Factory's rewritten support repository pinned and out of code-verifiable evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "factory-droid")!;

    expect(audit.inspectedRef).toBe("1fd9026d72f81668d88f37237cb5a2e89a17e6e2");
    expect(audit.verifiedAt).toBe("2026-08-12");
    expect(audit.sourceScope).toBe("support-repository");
    expect(audit.signals).toEqual({
      securityPolicy: false,
      continuousIntegration: true,
      automatedTests: false,
      evaluationAssets: true,
      contributorDocumentation: false,
    });
    expect(audit.limitation).toContain("README.md, .github/workflows/, docs/benchmarks/");
    expect(repositoryArtifactCount(audit)).toBeNull();
  });

  it("keeps Antigravity's support-only repository out of code-verifiable and benchmark evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "antigravity-cli")!;
    const evidence = evidenceStateFor("antigravity-cli");

    expect(audit.inspectedRef).toBe("03e095ac3619462ecd0928f3f5470387dbda6a00");
    expect(audit.sourceScope).toBe("support-repository");
    expect(Object.values(audit.signals).every((signal) => signal === false)).toBe(true);
    expect(repositoryArtifactCount(audit)).toBeNull();
    expect(audit.limitation).toContain("only 15");
    expect(audit.limitation).toContain("no core harness source");
    expect(evidence.states).toEqual(["documented"]);
    expect(benchmarkRuns.some((run) => run.harnessId === "antigravity-cli")).toBe(false);
  });

  it("does not invent public CI or benchmark results for Codebuff's source snapshot", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "codebuff")!;
    const evidence = evidenceStateFor("codebuff");

    expect(audit.inspectedRef).toBe("180071751c43a479684672576c44f14e120d2717");
    expect(audit.sourceScope).toBe("full-source");
    expect(audit.signals).toMatchObject({
      securityPolicy: true,
      continuousIntegration: false,
      automatedTests: true,
      evaluationAssets: true,
      contributorDocumentation: true,
    });
    expect(audit.limitation).toContain("no public CI configuration");
    expect(audit.limitation).toContain("LLM-judged");
    expect(evidence.states).toContain("code-verifiable");
    expect(benchmarkRuns.some((run) => run.harnessId === "codebuff")).toBe(false);
  });

  it("pins Junie's distribution-only audit and Kimi Code's current full-source release", () => {
    const junie = repositoryAudits.find((item) => item.harnessId === "junie-cli")!;
    const kimi = repositoryAudits.find((item) => item.harnessId === "kimi-code")!;

    expect(junie.inspectedRef).toBe("9b3fe80b5779f0fc0f9b0ee4eeba50cc071948a5");
    expect(junie.sourceScope).toBe("support-repository");
    expect(repositoryArtifactCount(junie)).toBeNull();
    expect(junie.limitation).toContain("35 installer, registry, template, and test files");
    expect(junie.limitation).toContain("no CI workflows");

    expect(kimi.inspectedRef).toBe("8a45f10eddbb35c317047e82e567cdb59a220b4f");
    expect(kimi.sourceScope).toBe("full-source");
    expect(kimi.signals).toMatchObject({ securityPolicy: true, continuousIntegration: true, automatedTests: true });
    expect(kimi.limitation).toContain("1,256 test-like files");
    expect(kimi.limitation).toContain("No dedicated coding-harness evaluation suite");
  });

  it("treats MiMo Code's bundled eval fixtures as project assets rather than benchmark evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "mimo-code")!;
    const evidence = evidenceStateFor("mimo-code");

    expect(audit.inspectedRef).toBe("c045a9891069000b112079bb10bdc8828d75eb6e");
    expect(audit.sourceScope).toBe("full-source");
    expect(audit.signals).toEqual({
      securityPolicy: true,
      continuousIntegration: true,
      automatedTests: true,
      evaluationAssets: true,
      contributorDocumentation: true,
    });
    expect(audit.limitation).toContain("bundled project-owned evaluation fixtures");
    expect(audit.limitation).toContain("no product score is imported");
    expect(evidence.states).toContain("code-verifiable");
    expect(benchmarkRuns.some((run) => run.harnessId === "mimo-code")).toBe(false);
  });

  it("keeps Ante's private core out of code-verifiable and benchmark evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "ante")!;
    const evidence = evidenceStateFor("ante");

    expect(audit.inspectedRef).toBe("8ce59518ed8a2ddda46c07cbb0b6fb1f528438a3");
    expect(audit.sourceScope).toBe("support-repository");
    expect(audit.signals).toEqual({
      securityPolicy: false,
      continuousIntegration: true,
      automatedTests: true,
      evaluationAssets: true,
      contributorDocumentation: false,
    });
    expect(repositoryArtifactCount(audit)).toBeNull();
    expect(audit.limitation).toContain("core harness remains private");
    expect(audit.limitation).toContain("no product score is imported");
    expect(evidence.states).toEqual(["documented"]);
    expect(benchmarkRuns.some((run) => run.harnessId === "ante")).toBe(false);
  });

  it("treats Crush engineering tests as auditable artifacts, not benchmark evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "crush")!;

    expect(audit.inspectedRef).toBe("def12cc6d8e162d6f48a7db260dde5ea3cc5f906");
    expect(audit.signals.automatedTests).toBe(true);
    expect(audit.signals.evaluationAssets).toBe(false);
    expect(audit.limitation).toContain("project-owned engineering tests");
    expect(audit.limitation).toContain("not an independent harness benchmark");
  });

  it("treats ForgeCode evals as project evidence and records its repository contradictions", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "forgecode")!;

    expect(audit.inspectedRef).toBe("1ca089a52fd2d11ec3b0e84fa0eba154bbb81270");
    expect(audit.signals.automatedTests).toBe(true);
    expect(audit.signals.evaluationAssets).toBe(true);
    expect(audit.signals.securityPolicy).toBe(false);
    expect(audit.limitation).toContain("not independent evidence");
    expect(audit.limitation).toContain("contribution guide is stale");
  });

  it("treats Kilo's private-bench smoke workflow as project evidence, not an imported result", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "kilo-code")!;

    expect(audit.inspectedRef).toBe("a19d44c3ef9fd71fb15291af9c7d87906c06f056");
    expect(audit.signals.automatedTests).toBe(true);
    expect(audit.signals.evaluationAssets).toBe(true);
    expect(audit.limitation).toContain("private KiloBench");
    expect(audit.limitation).toContain("rather than independent benchmark evidence");
    expect(audit.limitation).toContain("SECURITY.md still says no sandbox");
  });

  it("keeps Mistral Vibe engineering tests and third-party fork runs out of benchmark evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "mistral-vibe")!;
    const evidence = evidenceStateFor("mistral-vibe");

    expect(audit.inspectedRef).toBe("89350a4064ca90e4732271dcc27688e5d684871d");
    expect(audit.signals.automatedTests).toBe(true);
    expect(audit.signals.evaluationAssets).toBe(false);
    expect(audit.signals.securityPolicy).toBe(false);
    expect(audit.limitation).toContain("387 Python test files");
    expect(audit.limitation).toContain("no product benchmark is inferred");
    expect(evidence.states).toContain("code-verifiable");
    expect(evidence.states).not.toContain("independently-measured");
    expect(benchmarkRuns.some((run) => run.harnessId === "mistral-vibe")).toBe(false);
  });

  it("treats Plandex tests and its incomplete prompt eval as repository artifacts only", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "plandex")!;
    const evidence = evidenceStateFor("plandex");

    expect(audit.inspectedRef).toBe("e2d772072efadbe41d2946d97d79be55532dbab5");
    expect(audit.signals.securityPolicy).toBe(false);
    expect(audit.signals.continuousIntegration).toBe(false);
    expect(audit.signals.automatedTests).toBe(true);
    expect(audit.signals.evaluationAssets).toBe(true);
    expect(audit.signals.contributorDocumentation).toBe(false);
    expect(audit.limitation).toContain("six Go test files");
    expect(audit.limitation).toContain("unfinished Promptfoo proof of concept");
    expect(audit.limitation).toContain("independent task benchmark");
    expect(evidence.states).toContain("code-verifiable");
    expect(evidence.states).not.toContain("independently-measured");
    expect(benchmarkRuns.some((run) => run.harnessId === "plandex")).toBe(false);
  });

  it("does not mistake Stagewise engineering tests or a copywriting eval for a harness benchmark", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "stagewise")!;

    expect(audit.inspectedRef).toBe("cb38225c2b0de27e85c10f26ed46123f487fb6f8");
    expect(audit.signals).toEqual({
      securityPolicy: true,
      continuousIntegration: true,
      automatedTests: true,
      evaluationAssets: false,
      contributorDocumentation: true,
    });
    expect(audit.limitation).toContain("150 engineering test files");
    expect(audit.limitation).toContain("copywriting skill");
    expect(audit.limitation).toContain("no independent benchmark");
    expect(audit.limitation).toContain("external code pull requests are not accepted");
    expect(benchmarkRuns.filter((run) => run.harnessId === "stagewise")).toEqual([]);
  });

  it("records Zoo Code's extensive tests without inventing benchmark evidence", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "zoo-code")!;
    const evidence = evidenceStateFor("zoo-code");

    expect(audit.inspectedRef).toBe("d27153a251d2051b6a8e73d305b06ffbc5ac6970");
    expect(audit.signals).toEqual({
      securityPolicy: true,
      continuousIntegration: true,
      automatedTests: true,
      evaluationAssets: false,
      contributorDocumentation: true,
    });
    expect(audit.limitation).toContain("754 unit, integration, and end-to-end test files");
    expect(audit.limitation).toContain("no coding-harness evaluation suite");
    expect(audit.limitation).toContain("evals as a future goal");
    expect(evidence.states).toContain("code-verifiable");
    expect(evidence.states).not.toContain("independently-measured");
    expect(benchmarkRuns.filter((run) => run.harnessId === "zoo-code")).toEqual([]);
  });

  it("keeps ZCode's vendor-described goal verification out of measured evidence", () => {
    const evidence = evidenceStateFor("zcode");

    expect(repositoryAudits.some((audit) => audit.harnessId === "zcode")).toBe(false);
    expect(evidence.states).toEqual(["documented"]);
    expect(benchmarkRuns.filter((run) => run.harnessId === "zcode")).toEqual([]);
  });

  it("records Hermes Agent's engineering and eval assets without promoting them to an independent score", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "hermes-agent")!;
    const evidence = evidenceStateFor("hermes-agent");

    expect(audit.inspectedRef).toBe("0fa5e41c86f022bba147797849f0b44865721476");
    expect(audit.signals).toEqual({
      securityPolicy: true,
      continuousIntegration: true,
      automatedTests: true,
      evaluationAssets: true,
      contributorDocumentation: true,
    });
    expect(audit.limitation).toContain("2,729 Python and TypeScript test files");
    expect(audit.limitation).toContain("22 CI workflows");
    expect(audit.limitation).toContain("project-owned assets");
    expect(audit.limitation).toContain("no product score is imported");
    expect(evidence.states).toContain("code-verifiable");
    expect(evidence.states).not.toContain("independently-measured");
    expect(benchmarkRuns.filter((run) => run.harnessId === "hermes-agent")).toEqual([]);
  });

  it("separates mini-SWE-agent's project eval assets from its admitted pinned Terminal-Bench run", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "mini-swe-agent")!;
    const evidence = evidenceStateFor("mini-swe-agent");
    const runs = benchmarkRuns.filter((run) => run.harnessId === "mini-swe-agent");

    expect(audit.inspectedRef).toBe("a83fcae82d2a08f0ee0c688f9d137b3566c097f8");
    expect(audit.signals).toEqual({
      securityPolicy: true,
      continuousIntegration: true,
      automatedTests: true,
      evaluationAssets: true,
      contributorDocumentation: true,
    });
    expect(audit.limitation).toContain("42 Python test files");
    expect(audit.limitation).toContain("six GitHub Actions workflows");
    expect(audit.limitation).toContain("project-owned evaluation assets");
    expect(audit.limitation).toContain("Terminal-Bench 2.1 run is pinned to mini-SWE-agent 2.4.5");
    expect(evidence.states).toEqual(expect.arrayContaining(["documented", "code-verifiable", "independently-measured"]));
    expect(runs).toHaveLength(1);
    expect(runs[0]).toMatchObject({ harnessVersion: "2.4.5", benchmarkVersion: "2.1", attemptsPerTask: 5, totalTrials: 445 });
  });

  it("does not treat Amp's supplemental examples repository as product source", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "amp")!;
    const evidence = evidenceStateFor("amp");

    expect(audit.inspectedRef).toBe("435ffc0b4d82dfcb083848088411afb44b1ff55f");
    expect(audit.sourceScope).toBe("support-repository");
    expect(repositoryArtifactCount(audit)).toBeNull();
    expect(audit.limitation).toContain("supplemental collection of examples");
    expect(audit.limitation).toContain("does not expose the proprietary Amp client");
    expect(evidence.states).toEqual(["documented"]);
    expect(benchmarkRuns.filter((run) => run.harnessId === "amp")).toEqual([]);
  });

  it("does not confuse Kiro's issue-support repository with the proprietary CLI source", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "kiro-cli")!;
    const evidence = evidenceStateFor("kiro-cli");

    expect(audit.inspectedRef).toBe("e8daa058590dd58efb14f6d41ddb3ba1a26cfba3");
    expect(audit.sourceScope).toBe("support-repository");
    expect(repositoryArtifactCount(audit)).toBeNull();
    expect(audit.limitation).toContain("issue-triage automation");
    expect(audit.limitation).toContain("does not expose the proprietary Kiro IDE or CLI implementation");
    expect(evidence.states).toEqual(["documented"]);
    expect(benchmarkRuns.filter((run) => run.harnessId === "kiro-cli")).toEqual([]);
  });

  it("records Poolside's release-only repository and rejects its unpinned technical-report scores", () => {
    const audit = repositoryAudits.find((item) => item.harnessId === "poolside-cli")!;
    const evidence = evidenceStateFor("poolside-cli");

    expect(audit.inspectedRef).toBe("39e9094bd5d49d2dc4df780753cc6da37fc88eb6");
    expect(audit.sourceScope).toBe("support-repository");
    expect(repositoryArtifactCount(audit)).toBeNull();
    expect(audit.limitation).toContain("no client or service source");
    expect(audit.limitation).toContain("v1.0.13 Git tag resolves to ca5306676ab5fa9a0cfda2d4844470bf7d435741");
    expect(audit.limitation).toContain("changelog entry was added later on main");
    expect(evidence.states).toEqual(["documented"]);
    expect(benchmarkRuns.filter((run) => run.harnessId === "poolside-cli")).toEqual([]);
  });

  it("admits only complete, pinned benchmark configurations", () => {
    expect(benchmarkRuns.length).toBeGreaterThanOrEqual(5);
    expect(new Set(benchmarkRuns.map((run) => run.id)).size).toBe(benchmarkRuns.length);

    for (const run of benchmarkRuns) {
      const harness = harnesses.find((item) => item.id === run.harnessId);
      expect(harness?.status).toBe("active");
      expect(run.harnessVersion).not.toMatch(/^(latest|stable|unknown)$/i);
      expect(run.model.length).toBeGreaterThan(5);
      expect(run.reasoningEffort.length).toBeGreaterThan(1);
      expect(run.benchmarkVersion).toBe("2.1");
      expect(run.totalTrials).toBe(run.taskCount * run.attemptsPerTask);
      expect(run.totalTrials).toBe(445);
      expect(run.accuracy).toBeGreaterThanOrEqual(0);
      expect(run.accuracy).toBeLessThanOrEqual(100);
      expect(run.standardError).toBeGreaterThan(0);
      expect(run.totalCostUsd).toBeGreaterThan(0);
      expect(run.environment.length).toBeGreaterThan(40);
      expect(run.networkPolicy.length).toBeGreaterThan(40);
      expect(run.budgetPolicy.length).toBeGreaterThan(40);
      expect(new URL(run.resultSourceUrl).hostname).toBe("raw.githubusercontent.com");
      expect(new URL(run.submissionUrl).hostname).toBe("github.com");
      expect(new URL(run.benchmarkSourceUrl).hostname).toBe("github.com");
      expect(run.runDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(run.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("counts benchmark families without treating configurations as independent suites", () => {
    expect(benchmarkFamilyCount(benchmarkRuns)).toBe(1);
    expect(benchmarkFamilyCount([
      { benchmark: "Terminal-Bench", benchmarkVersion: "2.1" },
      { benchmark: "Terminal-Bench", benchmarkVersion: "2.1" },
      { benchmark: "SWE-bench", benchmarkVersion: "Verified" },
    ])).toBe(2);
  });

  it("keeps every non-active product out of all benchmark records", () => {
    const inactiveIds = new Set(harnesses.filter((harness) => harness.status !== "active").map((harness) => harness.id));
    expect(benchmarkRuns.every((run) => !inactiveIds.has(run.harnessId))).toBe(true);
  });

  it("describes seven architecture layers without creating a composite grade", () => {
    for (const harness of harnesses.filter((item) => item.status === "active")) {
      const profile = architectureProfileFor(harness);
      expect(Object.keys(profile)).toHaveLength(7);
      for (const level of Object.values(profile)) {
        if (level !== null) {
          expect(level).toBeGreaterThanOrEqual(1);
          expect(level).toBeLessThanOrEqual(4);
        }
      }
    }
  });

  it("keeps evidence states separate instead of averaging them", () => {
    const claude = evidenceStateFor("claude-code");
    const codex = evidenceStateFor("codex");
    const openCode = evidenceStateFor("opencode");
    expect(claude.states).toContain("independently-measured");
    expect(claude.states).not.toContain("code-verifiable");
    expect(claude.label).toBe("Documented + independently measured configuration");
    expect(codex.label).toBe("Documented + code-verifiable + independently measured configuration");
    expect(openCode.states).toContain("code-verifiable");
    expect(openCode.states).not.toContain("independently-measured");
    expect(claude.states).not.toContain("replicated");
  });

  it("reports descriptive intervals and explicit accuracy-cost Pareto status", () => {
    const frontier = benchmarkParetoFrontier(benchmarkRuns);
    const topGroup = benchmarkTopIntervalGroup(benchmarkRuns);
    expect(frontier.size).toBeGreaterThan(0);
    expect(topGroup.size).toBeGreaterThan(0);
    for (const run of benchmarkRuns) {
      const interval = benchmarkConfidenceInterval95(run);
      expect(interval.lower).toBeLessThan(run.accuracy);
      expect(interval.upper).toBeGreaterThan(run.accuracy);
    }
  });
});
