import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HarnessPage from "../src/app/harnesses/[slug]/page";

describe("harness profile", () => {
  it("opens comparison with the current harness selected", async () => {
    const page = await HarnessPage({ params: Promise.resolve({ slug: "codex" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('href="/compare?ids=codex"');
  });
});
