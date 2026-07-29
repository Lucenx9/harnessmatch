import { describe, expect, it } from "vitest";
import { GET as getUsageCsv } from "../src/app/usage.csv/route";
import sitemap from "../src/app/sitemap";
import { ecosystemSignalSnapshots } from "../src/data/ecosystem-signals";
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

  it("keeps the benchmark archive secondary but discoverable", () => {
    expect(primaryNavigationItems).not.toContainEqual({ label: "Benchmarks", href: "/benchmarks" });
    expect(searchablePageItems).toContainEqual(expect.objectContaining({
      href: "/benchmarks",
      navigation: null,
    }));
    expect(sitemap()).toContainEqual(expect.objectContaining({ url: `${siteUrl}/benchmarks` }));
  });

  it("exports every active source record without combining their metrics", async () => {
    const activeHarnessById = new Map(
      harnesses.filter((harness) => harness.status === "active").map((harness) => [harness.id, harness]),
    );
    const expectedSnapshots = openRouterAttributionSnapshots.filter((snapshot) => activeHarnessById.has(snapshot.harnessId));
    const expectedEcosystemSignals = ecosystemSignalSnapshots.filter((signal) => activeHarnessById.has(signal.harnessId));
    const response = getUsageCsv();
    const csv = await response.text();
    const rows = csv.trim().split("\n");

    expect(response.headers.get("content-type")).toBe("text/csv; charset=utf-8");
    expect(response.headers.get("content-disposition")).toContain("harnessmatch-usage-signals.csv");
    expect(rows).toHaveLength(1 + expectedSnapshots.length * 5 + expectedEcosystemSignals.length);
    expect(rows[0]).toContain("ranking_mode");
    expect(rows[0]).toContain("rank_scope");
    expect(rows[0]).toContain("artifact_id");
    for (const snapshot of expectedSnapshots) {
      const harness = activeHarnessById.get(snapshot.harnessId)!;
      expect(csv).toContain(`${siteUrl}/harnesses/${harness.slug}`);
      expect(csv).toContain(snapshot.windows.month.sourceUrl);
    }
    for (const source of ["homebrew", "npm", "github-releases", "vscode", "openvsx", "jetbrains", "github"]) {
      expect(csv).toContain(`${source},`);
    }
    expect(csv).toContain("global_coding_apps");
    expect(csv).toContain("openrouter,attributed_tokens,trending");
    expect(csv).toContain("mapped_harnessmatch_products");
  });
});
