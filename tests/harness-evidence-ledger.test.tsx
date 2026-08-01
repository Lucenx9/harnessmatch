import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HarnessEvidenceLedger } from "@/components/harness-evidence-ledger";
import type { EvidenceSource } from "@/lib/types";

function evidenceSource(
  title: string,
  topic?: EvidenceSource["topic"],
): EvidenceSource {
  return {
    title,
    ...(topic ? { topic } : {}),
    url: `https://example.com/${title.toLowerCase().replaceAll(" ", "-")}`,
    covers: `${title} coverage`,
    kind: "official-docs",
    verifiedAt: "2026-07-30",
  };
}

describe("harness evidence ledger", () => {
  it("groups every source by the stable evidence taxonomy", () => {
    const sources = [
      evidenceSource("Unclassified source"),
      evidenceSource("Execution source", "execution-control"),
      evidenceSource("Product source four", "product-surfaces"),
      evidenceSource("Product source one", "product-surfaces"),
      evidenceSource("Product source two", "product-surfaces"),
      evidenceSource("Product source three", "product-surfaces"),
    ];

    const html = renderToStaticMarkup(
      <HarnessEvidenceLedger sources={sources} recordVerifiedAt="2026-07-30" />,
    );

    expect(html).toContain("First-party evidence");
    expect(html).toContain("6 first-party sources");
    expect(html).toContain("View 3 more sources");
    expect(html).toContain("Opens in a new tab");
    expect(html).not.toContain("Primary evidence");
    expect(html.indexOf("Product and interfaces")).toBeLessThan(html.indexOf("Execution and control"));
    expect(html.indexOf("Execution and control")).toBeLessThan(html.indexOf("Additional first-party sources"));
    expect(html).toContain("https://example.com/product-source-four");
  });
});
