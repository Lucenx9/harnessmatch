import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { harnessProfileTitle, siteName } from "../src/lib/site";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

describe("search-result metadata", () => {
  it("builds concise, intent-specific titles for the first profile opportunities", () => {
    for (const name of ["Claude Code", "Cline", "Codex", "OpenCode"] as const) {
      const title = harnessProfileTitle(name);

      expect(title).toBe(`${name} coding harness capabilities`);
      expect(`${title} | ${siteName}`.length).toBeLessThanOrEqual(60);
    }

    expect(harnessProfileTitle("Letta Harness")).toBe("Letta Harness capabilities and controls");
    expect(() => harnessProfileTitle("A".repeat(80))).toThrow(
      "Unable to build a search-result title",
    );
  });

  it("wires intent-specific titles into the priority pages", () => {
    const dataPageSource = readFileSync(`${repositoryRoot}/src/app/data/page.tsx`, "utf8");
    const methodologyPageSource = readFileSync(`${repositoryRoot}/src/app/methodology/page.tsx`, "utf8");
    const harnessPageSource = readFileSync(`${repositoryRoot}/src/app/harnesses/[slug]/page.tsx`, "utf8");

    expect(dataPageSource).toContain('title: "AI coding harness data and primary sources"');
    expect(methodologyPageSource).toContain('title: "AI coding harness research methodology"');
    expect(harnessPageSource).toContain("title: harnessProfileTitle(harness.name)");
  });
});
