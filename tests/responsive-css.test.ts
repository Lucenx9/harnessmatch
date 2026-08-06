import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hasMobileHeaderContract } from "../scripts/lib/responsive-contract.mjs";

function findTypeScriptFiles(directory: URL): URL[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry): URL[] => {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);

    if (entry.isDirectory()) {
      return findTypeScriptFiles(entryUrl);
    }

    return entry.isFile() && /\.tsx?$/.test(entry.name) ? [entryUrl] : [];
  });
}

describe("global responsive styles", () => {
  it("loads the responsive contract from the root stylesheet, including generated not-found pages", () => {
    const globals = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
    const responsive = readFileSync(new URL("../src/app/styles/responsive.css", import.meta.url), "utf8");

    expect(globals).toContain('@import "./styles/responsive.css";');
    expect(hasMobileHeaderContract(responsive)).toBe(true);
  });

  it("loads feature styles before their responsive overrides", () => {
    const repositoryRoot = new URL("../", import.meta.url);
    const globals = readFileSync(new URL("src/app/globals.css", repositoryRoot), "utf8");
    const profilesIndexes = [...globals.matchAll(/@import "\.\/styles\/profiles\.css";/g)].map(
      (match) => match.index,
    );
    const guisIndexes = [...globals.matchAll(/@import "\.\/styles\/guis\.css";/g)].map((match) => match.index);
    const responsiveIndexes = [...globals.matchAll(/@import "\.\/styles\/responsive\.css";/g)].map(
      (match) => match.index,
    );
    const sourceStyleImports = findTypeScriptFiles(new URL("src/", repositoryRoot))
      .filter((file) => /styles\/[^"']+\.css/.test(readFileSync(file, "utf8")))
      .map((file) => file.pathname);

    expect(profilesIndexes).toHaveLength(1);
    expect(guisIndexes).toHaveLength(1);
    expect(responsiveIndexes).toHaveLength(1);
    expect(
      [...profilesIndexes, ...guisIndexes].every((index) =>
        responsiveIndexes.every((responsiveIndex) => index < responsiveIndex),
      ),
    ).toBe(true);
    expect(sourceStyleImports).toEqual([]);
  });

  it("only accepts the header rules from inside the narrow-viewport media block", () => {
    const escaped = [
      ".desktop-nav { display: none; }",
      ".mobile-menu { display: block; }",
      "@media (max-width: 900px) { .site-header { padding: 0; } }",
    ].join("\n");
    const scoped = "@media (max-width: 900px) { .desktop-nav { display: none; } .mobile-menu { display: block; } }";

    expect(hasMobileHeaderContract(escaped)).toBe(false);
    expect(hasMobileHeaderContract(scoped)).toBe(true);
  });
});
