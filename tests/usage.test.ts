import { describe, expect, it } from "vitest";
import { GET as getUsageCsv } from "../src/app/usage.csv/route";
import sitemap from "../src/app/sitemap";
import { harnesses } from "../src/data/harnesses";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution";
import { primaryNavigationItems, searchablePageItems } from "../src/lib/navigation";
import { siteUrl } from "../src/lib/site";

describe("usage surface", () => {
  it("is discoverable through navigation, search, and the sitemap", () => {
    expect(primaryNavigationItems).toContainEqual({ label: "Usage", href: "/usage" });
    expect(searchablePageItems).toContainEqual(expect.objectContaining({ href: "/usage" }));
    expect(sitemap()).toContainEqual(expect.objectContaining({ url: `${siteUrl}/usage` }));
  });

  it("exports every active OpenRouter record for all three windows", async () => {
    const activeHarnessById = new Map(
      harnesses.filter((harness) => harness.status === "active").map((harness) => [harness.id, harness]),
    );
    const expectedSnapshots = openRouterAttributionSnapshots.filter((snapshot) => activeHarnessById.has(snapshot.harnessId));
    const response = getUsageCsv();
    const csv = await response.text();
    const rows = csv.trim().split("\n");

    expect(response.headers.get("content-type")).toBe("text/csv; charset=utf-8");
    expect(response.headers.get("content-disposition")).toContain("harnessmatch-openrouter-usage.csv");
    expect(rows).toHaveLength(1 + expectedSnapshots.length * 3);
    expect(rows[0]).toContain("openrouter_coding_rank");
    for (const snapshot of expectedSnapshots) {
      const harness = activeHarnessById.get(snapshot.harnessId)!;
      expect(csv).toContain(`${siteUrl}/harnesses/${harness.slug}`);
      expect(csv).toContain(snapshot.windows.month.sourceUrl);
    }
  });
});
