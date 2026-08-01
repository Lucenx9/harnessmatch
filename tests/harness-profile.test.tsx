import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HarnessPage from "../src/app/harnesses/[slug]/page";

describe("harness profile", () => {
  it("opens comparison with the current harness selected", async () => {
    const page = await HarnessPage({ params: Promise.resolve({ slug: "codex" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('href="/compare?ids=codex"');
  });

  it("shows product qualities before expandable technical and public context", async () => {
    const page = await HarnessPage({ params: Promise.resolve({ slug: "codex" }) });
    const html = renderToStaticMarkup(page);

    expect(html.indexOf("Capability support")).toBeLessThan(html.indexOf("Classification and operating model"));
    expect(html.indexOf("Getting started")).toBeLessThan(html.indexOf("Classification and operating model"));
    expect(html).toContain("Inspect category criteria and operating mechanisms");
    expect(html).toContain("Inspect code audit, measured configurations, and ecosystem signals");
  });
});
