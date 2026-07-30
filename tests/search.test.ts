import { describe, expect, it } from "vitest";
import { guiProducts } from "../src/data/gui-products";
import { harnesses } from "../src/data/harnesses";
import { primaryNavigationItems, secondaryNavigationItems } from "../src/lib/navigation";
import { createSearchIndex, highlightSearchMatch, rankSearchItems } from "../src/lib/search";
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
    keywords: ["terminal", "cli", "subscription", "sandbox"],
    meta: "Harness",
  },
  {
    id: "harness-cline",
    kind: "harness",
    title: "Cline",
    description: "IDE-native coding agent.",
    href: "/harnesses/cline",
    keywords: ["ide", "editor", "multiple providers", "local models"],
    meta: "Harness",
  },
  {
    id: "harness-forgecode",
    kind: "harness",
    title: "ForgeCode",
    description: "Terminal agent with a provider-agnostic client.",
    href: "/harnesses/forgecode",
    keywords: ["terminal", "cli"],
    meta: "Harness",
  },
  {
    id: "harness-aider",
    kind: "harness",
    title: "Aider",
    description: "Pair programming in the terminal.",
    href: "/harnesses/aider",
    keywords: ["terminal", "cli"],
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

const index = createSearchIndex(items);
const titlesFor = (query: string) => rankSearchItems(index, query).map((item) => item.title);

describe("rankSearchItems", () => {
  it("returns no result before the user starts typing", () => {
    expect(rankSearchItems(index, "   ")).toEqual([]);
  });

  it("returns no result for a query made only of separators", () => {
    expect(rankSearchItems(index, "--")).toEqual([]);
  });

  it("filters immediately from a partial product name", () => {
    expect(titlesFor("cl").slice(0, 2)).toEqual(["Claude Code", "Cline"]);
  });

  it("matches every token across documented search terms", () => {
    expect(titlesFor("local ide")).toEqual(["Cline"]);
  });

  it("ranks an explicit capability keyword ahead of incidental description text", () => {
    expect(titlesFor("local")).toEqual(["Cline", "Claude Code"]);
  });

  it("ranks an exact page title before broader keyword matches", () => {
    expect(rankSearchItems(index, "methodology")[0]?.href).toBe("/methodology");
  });

  it("does not return unrelated entries", () => {
    expect(rankSearchItems(index, "browser automation")).toEqual([]);
  });

  it("finds GUI records without treating them as harness profiles", () => {
    expect(rankSearchItems(index, "t3 gui").map((item) => item.kind)).toEqual(["gui"]);
  });

  it("matches a product name written without its separator", () => {
    expect(titlesFor("t3code")).toEqual(["T3 Code"]);
  });

  it("ignores a fragment that only appears inside a longer word", () => {
    expect(titlesFor("ide")).toEqual(["Cline"]);
  });

  it("keeps a camel-case product name reachable by its parts", () => {
    expect(titlesFor("code")).toContain("ForgeCode");
  });

  it("ranks a keyword prefix ahead of the same prefix found in prose", () => {
    expect(titlesFor("prov")).toEqual(["Cline", "ForgeCode"]);
  });

  it("ranks the named product first when a second token describes its surface", () => {
    expect(titlesFor("forgecode cli")[0]).toBe("ForgeCode");
  });

  it("puts an exact title above a record that merely mentions it", () => {
    expect(titlesFor("claude code")).toEqual(["Claude Code", "T3 Code"]);
  });

  it("scores a title word above a keyword and a keyword above description prose", () => {
    expect(titlesFor("terminal")).toEqual(["Aider", "Claude Code", "ForgeCode"]);
  });

  it("puts a product-name prefix above records that only document the surface", () => {
    expect(titlesFor("cli")).toEqual(["Cline", "Aider", "Claude Code", "ForgeCode"]);
  });

  it("ignores diacritics on both sides of the comparison", () => {
    const accented = createSearchIndex([{
      id: "harness-goose",
      kind: "harness",
      title: "Gööse",
      description: "Accented record.",
      href: "/harnesses/goose",
      keywords: [],
      meta: "Harness",
    }]);
    expect(rankSearchItems(accented, "goose")).toHaveLength(1);
  });
});

describe("rankSearchItems against the published catalog", () => {
  const catalogItems: GlobalSearchItem[] = [
    ...harnesses.map((harness) => ({
      id: `harness-${harness.id}`,
      kind: "harness" as const,
      title: harness.name,
      description: harness.tagline,
      href: `/harnesses/${harness.slug}`,
      keywords: [harness.slug, harness.license, ...harness.interfaces],
      meta: "Harness",
    })),
    ...guiProducts.map((product) => ({
      id: `gui-${product.id}`,
      kind: "gui" as const,
      title: product.name,
      description: product.summary,
      href: `/guis/${product.id}`,
      keywords: ["gui", product.license, ...product.supportedHarnesses],
      meta: "GUI",
    })),
  ];
  const catalogIndex = createSearchIndex(catalogItems);

  /**
   * A short query used to match any record containing those letters anywhere,
   * which returned most of the catalog for two-letter input. Every answer must
   * now start a word rather than sit buried inside one.
   */
  it("keeps a short query from matching letters buried inside words", () => {
    const results = rankSearchItems(catalogIndex, "op");
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThan(catalogItems.length / 2);
    for (const item of results) {
      const words = `${item.title} ${item.keywords.join(" ")} ${item.description}`
        .toLowerCase()
        .split(/[^a-z0-9]+/);
      expect(words.some((word) => word.startsWith("op"))).toBe(true);
    }
  });

  it("puts the named product first instead of falling back to alphabetical order", () => {
    expect(rankSearchItems(catalogIndex, "codex")[0]?.title).toBe("Codex");
  });
});

describe("highlightSearchMatch", () => {
  it("returns the untouched text when there is nothing to highlight", () => {
    expect(highlightSearchMatch("Claude Code", "  ")).toEqual([
      { start: 0, value: "Claude Code", matched: false },
    ]);
  });

  it("marks the matched prefix of a word", () => {
    expect(highlightSearchMatch("Claude Code", "cl")).toEqual([
      { start: 0, value: "Cl", matched: true },
      { start: 2, value: "aude Code", matched: false },
    ]);
  });

  it("marks each token of a multi-word query", () => {
    expect(highlightSearchMatch("Claude Code", "claude code")).toEqual([
      { start: 0, value: "Claude", matched: true },
      { start: 6, value: " ", matched: false },
      { start: 7, value: "Code", matched: true },
    ]);
  });

  it("marks a camel-case hump the query reached", () => {
    expect(highlightSearchMatch("ForgeCode", "code")).toEqual([
      { start: 0, value: "Forge", matched: false },
      { start: 5, value: "Code", matched: true },
    ]);
  });

  it("does not mark a fragment inside a word", () => {
    expect(highlightSearchMatch("Aider", "ide")).toEqual([
      { start: 0, value: "Aider", matched: false },
    ]);
  });

  it("handles an empty title without producing an empty segment list", () => {
    expect(highlightSearchMatch("", "cl")).toEqual([{ start: 0, value: "", matched: false }]);
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
