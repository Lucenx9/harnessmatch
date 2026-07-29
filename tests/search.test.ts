import { describe, expect, it } from "vitest";
import { primaryNavigationItems, secondaryNavigationItems } from "../src/lib/navigation";
import { rankSearchItems } from "../src/lib/search";
import type { GlobalSearchItem } from "../src/lib/search";

const items: GlobalSearchItem[] = [
  {
    id: "gui-t3-code",
    kind: "gui",
    title: "T3 Code",
    description: "Visual workspace for Codex and Claude Code.",
    href: "/guis/t3-code",
    keywords: ["gui", "parallel agents", "worktrees"],
    meta: "Agent workspace",
  },
  {
    id: "harness-claude-code",
    kind: "harness",
    title: "Claude Code",
    description: "Local Claude-first coding agent.",
    href: "/harnesses/claude-code",
    keywords: ["terminal", "subscription", "sandbox"],
    meta: "Harness",
  },
  {
    id: "harness-cline",
    kind: "harness",
    title: "Cline",
    description: "IDE-native coding agent.",
    href: "/harnesses/cline",
    keywords: ["ide", "multiple providers", "local models"],
    meta: "Harness",
  },
  {
    id: "page-methodology",
    kind: "page",
    title: "Methodology",
    description: "Scoring and evidence rules.",
    href: "/methodology",
    keywords: ["science", "weights", "research"],
    meta: "Page",
  },
];

describe("rankSearchItems", () => {
  it("returns no result before the user starts typing", () => {
    expect(rankSearchItems(items, "   ")).toEqual([]);
  });

  it("filters immediately from a partial product name", () => {
    expect(rankSearchItems(items, "cl").map((item) => item.title)).toEqual(["Claude Code", "Cline", "T3 Code"]);
  });

  it("matches every token across documented search terms", () => {
    expect(rankSearchItems(items, "local ide").map((item) => item.title)).toEqual(["Cline"]);
  });

  it("ranks an explicit capability keyword ahead of incidental description text", () => {
    expect(rankSearchItems(items, "local").map((item) => item.title)).toEqual(["Cline", "Claude Code"]);
  });

  it("ranks an exact page title before broader keyword matches", () => {
    expect(rankSearchItems(items, "methodology")[0]?.href).toBe("/methodology");
  });

  it("does not return unrelated entries", () => {
    expect(rankSearchItems(items, "browser automation")).toEqual([]);
  });

  it("finds GUI records without treating them as harness profiles", () => {
    expect(rankSearchItems(items, "t3 gui").map((item) => item.kind)).toEqual(["gui"]);
  });
});

describe("primary navigation", () => {
  it("keeps the permanent header focused on data surfaces", () => {
    expect(primaryNavigationItems.map((item) => item.label)).toEqual([
      "Harnesses",
      "Usage",
      "Compare",
      "Data",
    ]);
  });

  it("keeps supporting data paths in the secondary menu", () => {
    expect(secondaryNavigationItems.map((item) => item.label)).toEqual([
      "GUIs",
      "Methodology",
    ]);
  });
});
