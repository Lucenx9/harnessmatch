import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { hasMobileHeaderContract } from "../scripts/lib/responsive-contract.mjs";

describe("global responsive styles", () => {
  it("loads the responsive contract from the root stylesheet, including generated not-found pages", () => {
    const globals = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
    const responsive = readFileSync(new URL("../src/app/styles/responsive.css", import.meta.url), "utf8");

    expect(globals).toContain('@import "./styles/responsive.css";');
    expect(hasMobileHeaderContract(responsive)).toBe(true);
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
