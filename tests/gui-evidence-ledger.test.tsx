import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GuiProfileEvidenceLedger } from "@/components/gui-profile-evidence-ledger";
import type { GuiEvidenceSource, GuiEvidenceTopic } from "@/lib/gui-types";

function evidenceSource(title: string, topic: GuiEvidenceTopic): GuiEvidenceSource {
  return {
    title,
    topic,
    url: `https://example.com/${title.toLowerCase().replaceAll(" ", "-")}`,
    covers: `${title} coverage`,
    kind: "official-docs",
    verifiedAt: "2026-07-30",
  };
}

describe("GUI evidence ledger", () => {
  it("uses the stable GUI-specific topic order and keeps every source reachable", () => {
    const sources = [
      evidenceSource("Public code source", "public-code"),
      evidenceSource("Session source", "sessions-isolation-review"),
      evidenceSource("Product source four", "product-workflow"),
      evidenceSource("Product source one", "product-workflow"),
      evidenceSource("Product source two", "product-workflow"),
      evidenceSource("Product source three", "product-workflow"),
      evidenceSource("Harness source", "harness-integrations"),
    ];

    const html = renderToStaticMarkup(
      <GuiProfileEvidenceLedger sources={sources} recordVerifiedAt="2026-07-30" />,
    );

    expect(html).toContain("First-party evidence");
    expect(html).toContain("7 first-party sources");
    expect(html).toContain("GUI record checked");
    expect(html).toContain("View 1 more source");
    expect(html).toContain("Opens in a new tab");
    expect(html.indexOf("Product and workflow")).toBeLessThan(html.indexOf("Harness integrations"));
    expect(html.indexOf("Harness integrations")).toBeLessThan(html.indexOf("Sessions, isolation and review"));
    expect(html.indexOf("Sessions, isolation and review")).toBeLessThan(html.indexOf("Public code and implementation"));
    expect(html).toContain("https://example.com/product-source-four");
  });
});
