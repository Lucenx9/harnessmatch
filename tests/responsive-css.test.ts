import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("global responsive styles", () => {
  it("loads the responsive contract from the root stylesheet, including generated not-found pages", () => {
    const globals = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
    const responsive = readFileSync(new URL("../src/app/styles/responsive.css", import.meta.url), "utf8");

    expect(globals).toContain('@import "./styles/responsive.css";');
    expect(responsive).toMatch(/@media \(max-width: 900px\)[\s\S]*?\.desktop-nav \{ display: none; \}/);
    expect(responsive).toMatch(/@media \(max-width: 900px\)[\s\S]*?\.mobile-menu \{ display: block;/);
  });
});
