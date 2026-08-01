import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GuiProfilePage from "@/app/guis/[slug]/page";
import { guiWorkflows } from "@/lib/gui-fit";

describe("GUI profile", () => {
  it("shows workflow fit and harness qualities before secondary context", async () => {
    const page = await GuiProfilePage({ params: Promise.resolve({ slug: "codex-desktop" }) });
    const html = renderToStaticMarkup(page);

    expect(html.indexOf("At a glance")).toBeLessThan(html.indexOf("Workflow fit"));
    expect(html.indexOf("Workflow fit")).toBeLessThan(html.indexOf("Harness coverage"));
    expect(html.indexOf("Harness coverage")).toBeLessThan(html.indexOf("Workflow mechanisms"));
    expect(html.indexOf("Workflow mechanisms")).toBeLessThan(html.indexOf("Open full size"));
    expect(html.indexOf("Open full size")).toBeLessThan(html.indexOf("Technical and public context"));
    expect(html.indexOf("Technical and public context")).toBeLessThan(html.indexOf("First-party evidence"));
    expect(html).toContain("Inspect implementation record and public activity");
    expect(html).toContain("Bands are non-numeric and do not rank product quality.");
  });

  it("publishes every predefined workflow without adding a product score", async () => {
    const page = await GuiProfilePage({ params: Promise.resolve({ slug: "codex-desktop" }) });
    const html = renderToStaticMarkup(page);

    for (const workflow of guiWorkflows) {
      expect(html).toContain(workflow.label);
    }
    expect(html.match(/gui-profile-workflow gui-profile-workflow--/g)).toHaveLength(guiWorkflows.length);
    expect(html).not.toContain("Product score");
  });
});
