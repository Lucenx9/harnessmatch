import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { guiExclusions, guiProducts } from "../src/data/gui-products";
import { guiRepositoryAudits } from "../src/data/gui-repository-audits";
import {
  classifyGuiFit,
  classifyGuiProducts,
  guiWorkflowById,
  guiWorkflows,
} from "../src/lib/gui-fit";
import { guiEvidenceTopicOrder } from "../src/lib/gui-evidence-topics";
import { arbitraryCliEntry, namedHarnesses } from "../src/lib/gui-harness-coverage";
import type { GuiProduct } from "../src/lib/gui-types";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const guiEvidenceTopics = new Set(guiEvidenceTopicOrder);

function requiredGuiProduct(id: string) {
  const product = guiProducts.find((candidate) => candidate.id === id);
  if (!product) throw new Error(`Expected GUI product ${id} in the test catalog.`);
  return product;
}

const firstPartyGuiHosts: Record<string, string[]> = {
  agetor: ["github.com", "www.agetor.dev"],
  aionui: ["github.com"],
  aq: ["aq.dev", "www.aq.dev"],
  blackcrab: ["github.com", "www.blackcrab.app"],
  "claude-code-desktop": ["code.claude.com"],
  codeg: ["github.com"],
  "codex-desktop": ["learn.chatgpt.com"],
  conductor: ["www.conductor.build"],
  emdash: ["emdash.com", "github.com"],
  hapi: ["github.com"],
  maestro: ["docs.runmaestro.ai", "github.com"],
  nimbalyst: ["docs.nimbalyst.com", "github.com", "nimbalyst.com"],
  openchamber: ["github.com", "openchamber.dev"],
  "openhands-agent-canvas": ["docs.openhands.dev", "github.com", "www.openhands.dev"],
  qm: ["github.com"],
  "qwen-code-desktop": ["docs.qwencloud.com", "github.com"],
  superset: ["docs.superset.sh", "github.com"],
  "t3-code": ["github.com", "t3.codes"],
  traycer: ["docs.traycer.ai", "github.com"],
  webmux: ["github.com"],
};

describe("GUI workflow classification", () => {
  it("keeps native and multi-harness GUIs in a separate active catalog", () => {
    expect(guiProducts.length).toBeGreaterThanOrEqual(8);
    expect(new Set(guiProducts.map((product) => product.id))).toHaveLength(guiProducts.length);
    expect(guiProducts.every((product) => product.status === "active")).toBe(true);
    expect(guiProducts.some((product) => product.layer === "harness-native")).toBe(true);
    expect(guiProducts.some((product) => product.layer === "multi-harness-workspace")).toBe(true);
    expect(guiProducts.some((product) => product.sourceAccess === "proprietary")).toBe(true);
  });

  it("requires direct source links for every documented GUI capability", () => {
    for (const product of guiProducts) {
      const evidenceUrls = new Set(product.evidence.map((source) => source.url));
      expect(product.evidence.length, product.name).toBeGreaterThan(0);
      expect(product.harnessSupportNote.length, product.name).toBeGreaterThan(0);
      expect(product.logo.src, product.name).toMatch(/^\/(guis|harnesses)\//);
      expect(product.logo.sourceUrl, product.name).toMatch(/^https:\/\//);
      expect(existsSync(`${repositoryRoot}/public${product.logo.src}`), product.name).toBe(true);
      if (product.preview) {
        expect(product.preview.src, product.name).toMatch(/^\/gui-previews\//);
        expect(existsSync(`${repositoryRoot}/public${product.preview.src}`), product.name).toBe(true);
        expect(product.preview.sourceUrl, product.name).toMatch(/^https:\/\//);
        expect(product.preview.width, product.name).toBeGreaterThan(0);
        expect(product.preview.height, product.name).toBeGreaterThan(0);
        expect(product.preview.alt.length, product.name).toBeGreaterThan(20);
        if (product.preview.kind === "video") {
          expect(product.preview.poster, product.name).toMatch(/^\/gui-previews\//);
          expect(existsSync(`${repositoryRoot}/public${product.preview.poster}`), product.name).toBe(true);
        }
      }
      expect(product.evidence.every((source) => source.url.startsWith("https://")), product.name).toBe(true);
      expect(product.evidence.every((source) => guiEvidenceTopics.has(source.topic)), product.name).toBe(true);
      expect(
        product.evidence.every((source) => (firstPartyGuiHosts[product.id] ?? []).includes(new URL(source.url).hostname)),
        product.name,
      ).toBe(true);

      for (const [capability, claim] of Object.entries(product.capabilities)) {
        if (claim.state === "documented" || claim.state === "contradicted") {
          expect(claim.sourceUrls.length, `${product.name}: ${capability}`).toBeGreaterThan(0);
          expect(claim.sourceUrls.every((url) => url.startsWith("https://"))).toBe(true);
          expect(
            claim.sourceUrls.every((url) => evidenceUrls.has(url)),
            `${product.name}: ${capability}`,
          ).toBe(true);
        } else if (claim.state === "unknown") {
          expect(claim.sourceUrls, `${product.name}: ${capability}`).toEqual([]);
        }
      }
    }
  });

  it("preserves provider breadth and integration-depth distinctions from current sources", () => {
    const t3Code = guiProducts.find((product) => product.id === "t3-code")!;
    const emdash = guiProducts.find((product) => product.id === "emdash")!;
    const superset = guiProducts.find((product) => product.id === "superset")!;
    const conductor = guiProducts.find((product) => product.id === "conductor")!;
    const nimbalyst = guiProducts.find((product) => product.id === "nimbalyst")!;
    const webmux = guiProducts.find((product) => product.id === "webmux")!;

    expect(t3Code.supportedHarnesses).toEqual(expect.arrayContaining([
      "Claude Code",
      "Codex",
      "Cursor Agent",
      "Grok",
      "OpenCode",
    ]));
    expect(t3Code.acceptsArbitraryCli).toBe(false);
    expect(t3Code.harnessSupportNote).toContain("subscriptions");

    expect(emdash.supportedHarnesses).toHaveLength(35);
    expect(emdash.supportedHarnesses).toContain("CodeBuddy Code");
    expect(emdash.acceptsArbitraryCli).toBe(false);

    expect(superset.supportedHarnesses).toHaveLength(14);
    expect(superset.supportedHarnesses).toEqual(expect.arrayContaining(["Grok", "Kimi", "OpenCode"]));
    expect(superset.acceptsArbitraryCli).toBe(true);

    expect(conductor.supportedHarnesses).toContain("OpenCode");
    expect(nimbalyst.license).toBe("MIT");
    expect(nimbalyst.harnessSupportNote).toContain("alpha");
    expect(nimbalyst.evidence).toEqual(expect.arrayContaining([
      expect.objectContaining({
        url: "https://github.com/nimbalyst/nimbalyst/releases/tag/v0.73.2",
        verifiedAt: "2026-08-13",
      }),
    ]));
    expect(nimbalyst.capabilities.teamCollaboration.state).toBe("unknown");
    expect(nimbalyst.capabilities.teamCollaboration.summary).toContain("same live coding-agent session");
    expect(webmux.harnessSupportNote).toContain("terminal-first");
    expect(guiProducts.find((product) => product.id === "claude-code-desktop")?.platforms).toEqual([
      "macOS",
      "Windows",
    ]);
  });

  it("preserves the source-backed boundaries of the newly admitted GUI records", () => {
    const agetor = requiredGuiProduct("agetor");
    const aionUi = requiredGuiProduct("aionui");
    const blackcrab = requiredGuiProduct("blackcrab");
    const codeg = requiredGuiProduct("codeg");
    const hapi = requiredGuiProduct("hapi");
    const openChamber = requiredGuiProduct("openchamber");
    const openHands = requiredGuiProduct("openhands-agent-canvas");
    const qwenDesktop = requiredGuiProduct("qwen-code-desktop");

    expect(agetor.supportedHarnesses).toEqual(["Claude Code", "Codex", "Cursor Agent", "Gemini CLI"]);
    expect(agetor.harnessSupportNote).toContain("experimental, disabled-by-default Cursor Agent");
    expect(agetor.evidence).toEqual(expect.arrayContaining([
      expect.objectContaining({
        url: "https://github.com/alamops/agetor/releases/tag/v0.0.18",
        verifiedAt: "2026-08-10",
      }),
      expect.objectContaining({
        url: "https://github.com/alamops/agetor/releases/tag/v0.1.0",
        verifiedAt: "2026-08-13",
      }),
    ]));
    expect(agetor.capabilities.remoteExecution.state).toBe("contradicted");

    expect(aionUi.supportedHarnesses).toHaveLength(20);
    expect(aionUi.supportedHarnesses).toEqual(expect.arrayContaining(["Antigravity", "OMP"]));
    expect(aionUi.acceptsArbitraryCli).toBe(false);
    expect(aionUi.capabilities.workspaceIsolation.state).toBe("unknown");
    expect(aionUi.capabilities.teamCollaboration.state).toBe("unknown");

    expect(blackcrab.layer).toBe("harness-native");
    expect(blackcrab.supportedHarnesses).toEqual(["Claude Code"]);
    expect(blackcrab.capabilities.remoteExecution.state).toBe("unknown");

    expect(codeg.supportedHarnesses).toHaveLength(13);
    expect(codeg.supportedHarnesses).toContain("DeepSeek Harness");
    expect(codeg.platforms).toEqual(expect.arrayContaining(["iOS", "Android"]));
    expect(codeg.acceptsArbitraryCli).toBe(false);
    expect(codeg.harnessSupportNote).toContain("ACP-compatible");

    expect(hapi.supportedHarnesses).toEqual([
      "Claude Code",
      "Codex",
      "Cursor Agent",
      "Grok Build",
      "OpenCode",
    ]);
    expect(hapi.capabilities.workspaceIsolation.state).toBe("unknown");

    expect(openChamber.layer).toBe("harness-native");
    expect(openChamber.supportedHarnesses).toEqual(["OpenCode"]);

    expect(openHands.supportedHarnesses).toEqual([
      "Claude Code",
      "Codex",
      "Gemini CLI",
      "OpenHands",
    ]);
    expect(Object.values(openHands.capabilities).every((claim) => claim.state === "documented")).toBe(true);

    expect(qwenDesktop.layer).toBe("harness-native");
    expect(qwenDesktop.supportedHarnesses).toEqual(["Qwen Code"]);
    expect(qwenDesktop.capabilities.remoteExecution.state).toBe("contradicted");

    for (const product of [agetor, aionUi, blackcrab, codeg, hapi, openChamber, openHands, qwenDesktop]) {
      expect(product.acceptsArbitraryCli, product.name).toBe(false);
    }
  });

  it("keeps Maestro and Traycer integration depth and collaboration boundaries explicit", () => {
    const maestro = requiredGuiProduct("maestro");
    const traycer = requiredGuiProduct("traycer");

    expect(maestro.supportedHarnesses).toHaveLength(9);
    expect(maestro.supportedHarnesses).toEqual(expect.arrayContaining([
      "Factory Droid",
      "GitHub Copilot CLI",
    ]));
    expect(maestro.supportedHarnesses).not.toContain("Droid");
    expect(maestro.supportedHarnesses).not.toContain("GitHub Copilot");
    expect(maestro.supportedHarnesses).not.toContain("Gemini CLI");
    expect(maestro.harnessSupportNote).toContain("Gemini CLI is planned");
    expect(maestro.acceptsArbitraryCli).toBe(false);
    expect(maestro.capabilities.teamCollaboration.state).toBe("unknown");
    expect(classifyGuiFit(maestro, guiWorkflowById("parallel-local")).fitBand).toBe("strong");
    expect(classifyGuiFit(maestro, guiWorkflowById("remote-control")).fitBand).toBe("good");
    expect(classifyGuiFit(maestro, guiWorkflowById("team-workspace")).fitBand).toBe("conditional");

    expect(traycer.supportedHarnesses).toHaveLength(16);
    expect(traycer.supportedHarnesses).toEqual(expect.arrayContaining([
      "Claude Code",
      "Codex",
      "Devin",
      "Factory Droid",
      "GitHub Copilot CLI",
      "OpenCode",
      "OpenRouter",
      "Traycer",
    ]));
    expect(traycer.supportedHarnesses).not.toContain("Droid");
    expect(traycer.supportedHarnesses).not.toContain("GitHub Copilot");
    expect(traycer.acceptsArbitraryCli).toBe(false);
    expect(traycer.harnessSupportNote).toContain("terminal interface");
    expect(Object.values(traycer.capabilities).every((claim) => claim.state === "documented")).toBe(true);
    expect(classifyGuiFit(traycer, guiWorkflowById("team-workspace")).fitBand).toBe("strong");

    expect(guiRepositoryAudits.find((audit) => audit.guiId === "maestro")?.sourceScope).toBe("full-source");
    expect(guiRepositoryAudits.find((audit) => audit.guiId === "traycer")?.sourceScope).toBe("client-source");
  });

  it("keeps QM remote collaboration separate from unresolved visual review", () => {
    const qm = requiredGuiProduct("qm");
    expect(qm.supportedHarnesses).toEqual(["Claude Code", "Codex", "OpenCode", "Pi"]);
    expect(qm.acceptsArbitraryCli).toBe(false);
    expect(qm.capabilities.visualReview.state).toBe("unknown");
    expect(classifyGuiFit(qm, guiWorkflowById("focused-review")).fitBand).toBe("conditional");
    expect(classifyGuiFit(qm, guiWorkflowById("parallel-local")).fitBand).toBe("good");
    expect(classifyGuiFit(qm, guiWorkflowById("remote-control")).fitBand).toBe("strong");
    expect(classifyGuiFit(qm, guiWorkflowById("team-workspace")).fitBand).toBe("good");
  });

  it("uses reopened first-party sources for Conductor local and cloud isolation", () => {
    const conductor = requiredGuiProduct("conductor");
    const worktreeSource = conductor.evidence.find((source) => (
      source.url === "https://www.conductor.build/docs/concepts/git-worktrees"
    ));
    const cloudSource = conductor.evidence.find((source) => (
      source.topic === "remote-collaboration"
    ));

    expect(worktreeSource).toEqual(expect.objectContaining({
      topic: "sessions-isolation-review",
      verifiedAt: "2026-07-31",
    }));
    expect(cloudSource).toEqual(expect.objectContaining({
      url: "https://www.conductor.build/changelog/0.78.0-introducing-conductor-cloud",
      verifiedAt: "2026-07-31",
    }));
    expect(conductor.evidence.some((source) => source.url === "https://www.conductor.build/cloud")).toBe(false);
    expect(conductor.capabilities.workspaceIsolation).toEqual(expect.objectContaining({
      state: "documented",
      summary: expect.stringContaining("Local workspaces use separate Git worktrees"),
      sourceUrls: [
        "https://www.conductor.build/docs/concepts/git-worktrees",
        "https://www.conductor.build/changelog/0.78.0-introducing-conductor-cloud",
      ],
      verifiedAt: "2026-07-31",
    }));
    expect(conductor.capabilities.remoteExecution.state).toBe("documented");
    expect(conductor.capabilities.teamCollaboration.state).toBe("documented");
    expect(classifyGuiFit(conductor, guiWorkflowById("remote-control"))).toEqual(expect.objectContaining({
      fitBand: "strong",
      missingRequired: [],
      missingPreferred: [],
    }));
    expect(classifyGuiFit(conductor, guiWorkflowById("team-workspace"))).toEqual(expect.objectContaining({
      fitBand: "strong",
      missingRequired: [],
      missingPreferred: [],
    }));
  });

  it("keeps the arbitrary-CLI placeholder out of every named integration count", () => {
    const webmux = requiredGuiProduct("webmux");
    const superset = requiredGuiProduct("superset");
    const claudeCodeDesktop = requiredGuiProduct("claude-code-desktop");

    expect(webmux.supportedHarnesses).toContain(arbitraryCliEntry);
    expect(webmux.acceptsArbitraryCli).toBe(true);
    expect(namedHarnesses(webmux)).toEqual(["Codex", "Claude Code"]);

    expect(namedHarnesses(superset)).toEqual(superset.supportedHarnesses);
    expect(namedHarnesses(claudeCodeDesktop)).toEqual(["Claude Code"]);
    expect(namedHarnesses({ supportedHarnesses: [arbitraryCliEntry] })).toEqual([]);

    for (const product of guiProducts) {
      expect(namedHarnesses(product), product.name).not.toContain(arbitraryCliEntry);
    }
  });

  it("pins every public-code audit to an exact commit and inspected paths", () => {
    const auditedIds = new Set(guiRepositoryAudits.map((audit) => audit.guiId));
    const publicCodeProducts = guiProducts.filter((product) => product.sourceAccess !== "proprietary");

    expect(guiRepositoryAudits).toHaveLength(publicCodeProducts.length);
    for (const audit of guiRepositoryAudits) {
      expect(audit.inspectedRef).toMatch(/^[a-f0-9]{40}$/);
      expect(audit.inspectedPaths.length, audit.guiId).toBeGreaterThan(0);
      expect(audit.established.length, audit.guiId).toBeGreaterThan(0);
    }
    for (const product of publicCodeProducts) {
      expect(auditedIds.has(product.id), product.name).toBe(true);
    }
    for (const product of guiProducts.filter((candidate) => candidate.sourceAccess === "proprietary")) {
      expect(auditedIds.has(product.id), product.name).toBe(false);
    }
  });

  it("does not use code availability as a fit input", () => {
    const t3Code = guiProducts.find((product) => product.id === "t3-code")!;
    const workflow = guiWorkflowById("parallel-local");
    const sourceAvailableClone = { ...t3Code, sourceAccess: "proprietary" as const };

    expect(classifyGuiFit(t3Code, workflow).fitBand).toBe("strong");
    expect(classifyGuiFit(sourceAvailableClone, workflow)).toEqual(expect.objectContaining({
      fitBand: classifyGuiFit(t3Code, workflow).fitBand,
      missingRequired: classifyGuiFit(t3Code, workflow).missingRequired,
      missingPreferred: classifyGuiFit(t3Code, workflow).missingPreferred,
    }));
  });

  it("uses unresolved evidence as conditional fit instead of evidence of absence", () => {
    const teamWorkflow = guiWorkflowById("team-workspace");
    const conductor = requiredGuiProduct("conductor");
    const t3Code = requiredGuiProduct("t3-code");
    const aq = requiredGuiProduct("aq");
    const superset = requiredGuiProduct("superset");
    const unresolvedTeamProduct: GuiProduct = {
      ...t3Code,
      id: "unresolved-team-fixture",
      capabilities: {
        ...t3Code.capabilities,
        remoteExecution: {
          state: "unknown",
          summary: "The synthetic fixture leaves remote execution unresolved.",
          sourceUrls: [],
          verifiedAt: t3Code.verifiedAt,
        },
        teamCollaboration: {
          state: "unknown",
          summary: "The synthetic fixture leaves team collaboration unresolved.",
          sourceUrls: [],
          verifiedAt: t3Code.verifiedAt,
        },
      },
    };

    expect(classifyGuiFit(unresolvedTeamProduct, teamWorkflow)).toEqual(expect.objectContaining({
      fitBand: "conditional",
      missingRequired: ["remoteExecution", "teamCollaboration"],
    }));
    expect(classifyGuiFit(t3Code, teamWorkflow)).toEqual(expect.objectContaining({
      fitBand: "conditional",
      missingRequired: ["teamCollaboration"],
    }));
    expect(classifyGuiFit(conductor, teamWorkflow).fitBand).toBe("strong");
    expect(classifyGuiFit(aq, teamWorkflow).fitBand).toBe("strong");
    expect(classifyGuiFit(superset, teamWorkflow).fitBand).toBe("strong");
  });

  it("groups by evidence-backed fit and uses alphabetical order inside every band", () => {
    for (const workflow of guiWorkflows) {
      const results = classifyGuiProducts(guiProducts, workflow);
      for (const band of ["strong", "good", "conditional", "not-eligible"] as const) {
        const names = results.filter((result) => result.fitBand === band).map((result) => result.product.name);
        expect(names, `${workflow.id}: ${band}`).toEqual([...names].sort((left, right) => left.localeCompare(right)));
      }
    }

    const remoteResults = classifyGuiProducts(guiProducts, guiWorkflowById("remote-control"));
    expect(remoteResults.find((result) => result.product.id === "aq")?.fitBand).toBe("strong");
    expect(remoteResults.find((result) => result.product.id === "t3-code")?.fitBand).toBe("good");
    expect(remoteResults.find((result) => result.product.id === "superset")?.fitBand).toBe("strong");
  });

  it("publishes no hidden numeric score in product or fit records", () => {
    const results = classifyGuiProducts(guiProducts, guiWorkflowById("focused-review"));
    expect(guiProducts.every((product) => !("score" in product))).toBe(true);
    expect(results.every((result) => !("score" in result))).toBe(true);
  });

  it("keeps sunset products outside active workflow matches", () => {
    expect(guiExclusions.some((product) => product.id === "1code")).toBe(true);
    expect(guiProducts.some((product) => product.id === "1code")).toBe(false);
    expect(guiExclusions.some((product) => product.id === "vibe-kanban")).toBe(true);
    expect(guiProducts.some((product) => product.id === "vibe-kanban")).toBe(false);
  });
});
