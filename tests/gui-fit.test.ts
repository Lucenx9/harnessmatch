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

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

const firstPartyGuiHosts: Record<string, string[]> = {
  aq: ["aq.dev", "www.aq.dev"],
  "claude-code-desktop": ["code.claude.com"],
  "codex-desktop": ["learn.chatgpt.com"],
  conductor: ["www.conductor.build"],
  emdash: ["emdash.ai", "github.com"],
  nimbalyst: ["docs.nimbalyst.com", "github.com", "nimbalyst.com"],
  superset: ["docs.superset.sh", "github.com"],
  "t3-code": ["github.com", "t3.codes"],
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
      expect(
        product.evidence.every((source) => (firstPartyGuiHosts[product.id] ?? []).includes(new URL(source.url).hostname)),
        product.name,
      ).toBe(true);

      for (const [capability, claim] of Object.entries(product.capabilities)) {
        if (claim.state === "documented") {
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
    expect(webmux.harnessSupportNote).toContain("terminal-first");
    expect(guiProducts.find((product) => product.id === "claude-code-desktop")?.platforms).toEqual([
      "macOS",
      "Windows",
    ]);
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
    const conductor = guiProducts.find((product) => product.id === "conductor")!;
    const aq = guiProducts.find((product) => product.id === "aq")!;
    const superset = guiProducts.find((product) => product.id === "superset")!;

    expect(classifyGuiFit(conductor, teamWorkflow)).toEqual(expect.objectContaining({
      fitBand: "conditional",
      missingRequired: expect.arrayContaining(["remoteExecution", "teamCollaboration"]),
    }));
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
    expect(guiExclusions.some((product) => product.id === "vibe-kanban")).toBe(true);
    expect(guiProducts.some((product) => product.id === "vibe-kanban")).toBe(false);
  });
});
