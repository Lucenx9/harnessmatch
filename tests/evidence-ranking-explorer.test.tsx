import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EvidenceRankingExplorer } from "../src/components/evidence-ranking-explorer";
import {
  architectureProfile,
  auditabilityRow,
  benchmarkRow,
  operationalRow,
} from "./component-fixtures";

type ExplorerProps = Parameters<typeof EvidenceRankingExplorer>[0];

function render(overrides: Partial<ExplorerProps> = {}) {
  return renderToStaticMarkup(
    <EvidenceRankingExplorer
      operational={[]}
      auditability={[]}
      benchmarks={[]}
      benchmarkFamilyCount={0}
      unrankedRepositoryCount={0}
      {...overrides}
    />,
  );
}

/** Recovers the CSV payload the download link serialises into a data URI. */
function decodeCsv(html: string) {
  const match = /href="data:text\/csv;charset=utf-8,([^"]*)"/.exec(html);
  if (!match?.[1]) throw new Error("The explorer did not render a CSV download link.");
  return decodeURIComponent(match[1].replaceAll("&amp;", "&"));
}

function countOccurrences(html: string, needle: string) {
  return html.split(needle).length - 1;
}

describe("evidence ranking explorer", () => {
  it("exports every comparable record, not just the charted rows", () => {
    const operational = Array.from({ length: 13 }, (_, index) => operationalRow({
      id: `harness-${index}`,
      name: `Harness ${String(index).padStart(2, "0")}`,
      levels: architectureProfile(4 - (index % 4)),
    }));

    const csv = decodeCsv(render({ operational }));
    const lines = csv.split("\n");

    expect(lines[0]).toBe(
      '"order","harness","architecture_layer","documented_level","level_anchor","documented_layers","evidence_sources","verified_at"',
    );
    expect(lines).toHaveLength(operational.length + 1);
    expect(csv).toContain('"Verification"');
  });

  it("escapes quotes in exported names instead of breaking the CSV row", () => {
    const csv = decodeCsv(render({
      operational: [operationalRow({ id: "quoted", name: 'The "Quoted" Harness' })],
    }));

    expect(csv).toContain('"The ""Quoted"" Harness"');
  });

  it("charts at most ten operational rows and discloses the remainder", () => {
    const operational = Array.from({ length: 12 }, (_, index) => operationalRow({
      id: `harness-${index}`,
      name: `Harness ${index}`,
    }));

    const html = render({ operational });

    expect(countOccurrences(html, 'class="evidence-chart-row"')).toBe(10);
    expect(html).toContain("Show the complete 12-record ranking");
    expect(html).toContain("12 comparable records");
  });

  it("omits axes with no documented mechanism rather than ranking them as zero", () => {
    const html = render({
      operational: [
        operationalRow({ id: "documented", name: "Documented Harness" }),
        operationalRow({
          id: "undocumented",
          name: "Undocumented Harness",
          levels: { ...architectureProfile(3), verification: null },
        }),
      ],
    });

    expect(html).toContain("1 comparable records");
    expect(html).toContain("Documented Harness");
    expect(html).not.toContain("Undocumented Harness");
    expect(decodeCsv(html)).not.toContain("Undocumented Harness");
  });

  it("reports a tie on the leading level as a shared lead", () => {
    const tied = render({
      operational: [
        operationalRow({ id: "first", name: "First Harness", levels: architectureProfile(4) }),
        operationalRow({ id: "second", name: "Second Harness", levels: architectureProfile(4) }),
      ],
    });

    expect(tied).toContain("First Harness and Second Harness share the lead");

    const outright = render({
      operational: [
        operationalRow({ id: "first", name: "First Harness", levels: architectureProfile(4) }),
        operationalRow({ id: "second", name: "Second Harness", levels: architectureProfile(2) }),
      ],
    });

    expect(outright).toContain("First Harness leads");
  });

  it("compacts a wide tie into a count instead of listing every name", () => {
    const html = render({
      operational: ["alpha", "beta", "gamma"].map((name) => operationalRow({
        id: name,
        name,
        levels: architectureProfile(4),
      })),
    });

    expect(html).toContain("3 harnesses share the lead");
  });

  it("degrades to N/A without inventing a leader when no records exist", () => {
    const html = render();

    expect(html).toContain("no comparable record");
    expect(html).toContain("No documented leader");
    expect(html).toContain("No ranked repository");
    expect(html).toContain("No measured configuration");
    expect(html).toContain("0 comparable records");
  });

  it("keeps a single selected tab wired to the ranking panel", () => {
    const html = render({
      operational: [operationalRow({ id: "only", name: "Only Harness" })],
    });

    expect(countOccurrences(html, 'aria-selected="true"')).toBe(1);
    expect(countOccurrences(html, 'aria-selected="false"')).toBe(2);
    expect(countOccurrences(html, 'tabindex="0"')).toBe(1);
    expect(html).toContain('id="evidence-ranking-tab-operational"');
    expect(html).toContain('aria-labelledby="evidence-ranking-tab-operational"');
    expect(countOccurrences(html, 'aria-controls="evidence-ranking-panel"')).toBe(3);
  });

  it("summarises the highest observed benchmark after ordering by score", () => {
    const html = render({
      benchmarks: [
        benchmarkRow({ id: "middle", name: "Middle Harness", score: 60 }),
        benchmarkRow({ id: "highest", name: "Highest Harness", score: 71.4 }),
        benchmarkRow({ id: "lowest", name: "Lowest Harness", score: 12 }),
      ],
      benchmarkFamilyCount: 1,
    });

    expect(html).toContain("Highest observed: Highest Harness");
    expect(html).toContain("benchmark family");
    expect(html).not.toContain("benchmark families");
    expect(html).toContain("3 exact configurations");
  });

  it("names the auditability leader and flags unranked support repositories", () => {
    const html = render({
      auditability: [
        auditabilityRow({ id: "partial", name: "Partial Harness", artifactCount: 2 }),
        auditabilityRow({ id: "complete", name: "Complete Harness", artifactCount: 5 }),
      ],
      unrankedRepositoryCount: 4,
    });

    expect(html).toContain("Complete Harness leads");
    expect(html).toContain("5/5");
    expect(html).toContain("2 repositories ranked at pinned commits");
  });
});
