import { describe, expect, it } from "vitest";
import { GET } from "../src/app/llms.txt/route";
import { guiProducts } from "../src/data/gui-products";
import { harnesses } from "../src/data/harnesses";
import { latestVerifiedAt } from "../src/lib/evidence-freshness";
import { siteUrl } from "../src/lib/site";

describe("llms.txt", () => {
  it("publishes a concise machine-readable guide on the canonical domain", async () => {
    const response = GET();
    const manifest = await response.text();
    const links = [...manifest.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
      .flatMap((match) => match[1] ? [match[1]] : []);

    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(manifest).toContain("# HarnessMatch");
    expect(manifest).toContain("A model's capability is not treated as a harness capability.");
    expect(manifest).toContain("does not catalog or rank individual skills");
    expect(manifest).toContain(`Evidence records were most recently verified on ${latestVerifiedAt()}.`);
    expect(manifest).toContain("## Core resources");
    expect(manifest).toContain("## Active harness profiles");
    expect(manifest).toContain("## Active GUI profiles");
    expect(manifest).toContain("They do not transfer capabilities from supported harnesses or models.");
    expect(manifest).toContain(`](${siteUrl}/guis)`);
    expect(manifest).toContain(`](${siteUrl}/usage)`);
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((link) => link === siteUrl || link.startsWith(`${siteUrl}/`))).toBe(true);
  });

  it("lists every active harness profile and excludes inactive harness profiles", async () => {
    const manifest = await GET().text();

    for (const harness of harnesses) {
      const profileUrl = `${siteUrl}/harnesses/${harness.slug}`;
      if (harness.status === "active") {
        expect(manifest).toContain(`](${profileUrl})`);
      } else {
        expect(manifest).not.toContain(`](${profileUrl})`);
      }
    }
  });

  it("lists every active GUI profile and excludes inactive GUI profiles", async () => {
    const manifest = await GET().text();

    for (const product of guiProducts) {
      const profileUrl = `${siteUrl}/guis/${product.id}`;
      if (product.status === "active") {
        expect(manifest).toContain(`](${profileUrl})`);
      } else {
        expect(manifest).not.toContain(`](${profileUrl})`);
      }
    }
  });
});
