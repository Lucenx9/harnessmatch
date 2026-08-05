import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hasMobileHeaderContract } from "../scripts/lib/responsive-contract.mjs";

function findTsxFiles(directory: URL): URL[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry): URL[] => {
    const entryUrl = new URL(entry.name, directory);

    if (entry.isDirectory()) {
      return findTsxFiles(new URL(`${entry.name}/`, directory));
    }

    return entry.isFile() && entry.name.endsWith(".tsx") ? [entryUrl] : [];
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
    const profilesIndex = globals.indexOf('@import "./styles/profiles.css";');
    const guisIndex = globals.indexOf('@import "./styles/guis.css";');
    const responsiveIndex = globals.indexOf('@import "./styles/responsive.css";');
    const routeStyleImports = findTsxFiles(new URL("src/app/", repositoryRoot))
      .filter((file) => /styles\/(?:profiles|guis)\.css/.test(readFileSync(file, "utf8")))
      .map((file) => file.pathname);

    expect(profilesIndex).toBeGreaterThan(-1);
    expect(guisIndex).toBeGreaterThan(-1);
    expect(responsiveIndex).toBeGreaterThan(profilesIndex);
    expect(responsiveIndex).toBeGreaterThan(guisIndex);
    expect(routeStyleImports).toEqual([]);
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
