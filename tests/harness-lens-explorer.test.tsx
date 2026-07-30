import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HarnessesPage from "../src/app/harnesses/page";
import { HarnessLensExplorer } from "../src/components/harness-lens-explorer";
import { harnesses } from "../src/data/harnesses";
import { lensHarness } from "./component-fixtures";

function catalog(size: number) {
  return Array.from({ length: size }, (_, index) => lensHarness({
    id: `harness-${index}`,
    name: `Harness ${String(index).padStart(2, "0")}`,
  }));
}

function countOccurrences(html: string, needle: string) {
  return html.split(needle).length - 1;
}

describe("harness lens explorer", () => {
  it("keeps dormant and archived records out of the active catalog summary", () => {
    const html = renderToStaticMarkup(<HarnessesPage />);
    const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
    const inactiveHarnesses = harnesses.filter((harness) => harness.status !== "active");

    expect(html).toContain(`<strong>${activeHarnesses.length}</strong> active profiles`);
    for (const harness of inactiveHarnesses) {
      expect(html).not.toContain(`>${harness.name}</a>`);
    }
  });

  it("renders only the initial page of profiles and offers the rest explicitly", () => {
    const html = renderToStaticMarkup(<HarnessLensExplorer harnesses={catalog(11)} />);

    expect(countOccurrences(html, 'class="lens-card"')).toBe(8);
    expect(html).toContain("Harness 07");
    expect(html).not.toContain("Harness 08");
    expect(html).toContain("Show all 11 profiles");
    expect(html).toContain("<strong>11</strong> active profiles");
  });

  it("honours a custom initial page size", () => {
    const html = renderToStaticMarkup(
      <HarnessLensExplorer harnesses={catalog(11)} initialVisibleCount={3} />,
    );

    expect(countOccurrences(html, 'class="lens-card"')).toBe(3);
    expect(html).toContain("Show all 11 profiles");
  });

  it("hides the show-all control when every profile already fits", () => {
    const html = renderToStaticMarkup(<HarnessLensExplorer harnesses={catalog(8)} />);

    expect(countOccurrences(html, 'class="lens-card"')).toBe(8);
    expect(html).not.toContain("Show all");
    expect(html).toContain("<strong>8</strong> active profiles");
  });

  it("offers only filter values that exist in the catalog", () => {
    const html = renderToStaticMarkup(
      <HarnessLensExplorer
        harnesses={[
          lensHarness({ id: "host", name: "Host Harness", runtime: "host-first" }),
          lensHarness({
            id: "orchestrator",
            name: "Orchestrator",
            layer: "external-harness-orchestrator",
          }),
        ]}
      />,
    );

    expect(html).toContain("Coding harness");
    expect(html).toContain("External harness orchestrator");
    expect(html).not.toContain("Framework or runtime");
    expect(html).not.toContain("Adjacent tool");
    expect(html).toContain("Host-first");
    expect(html).not.toContain("Sandbox-first");
    expect(html).not.toContain("Managed-first");
  });

  it("keeps every product role selectable so filters can be widened", () => {
    const html = renderToStaticMarkup(
      <HarnessLensExplorer harnesses={[lensHarness({ id: "only", name: "Only Harness" })]} />,
    );

    expect(html).toContain("Pair programmer");
    expect(html).toContain("Agent platform");
  });

  it("places card headings at the requested level", () => {
    const nested = renderToStaticMarkup(
      <HarnessLensExplorer harnesses={catalog(1)} cardHeadingLevel={2} />,
    );
    const defaulted = renderToStaticMarkup(<HarnessLensExplorer harnesses={catalog(1)} />);

    expect(nested).toContain("<h2>");
    expect(nested).not.toContain("<h3>");
    expect(defaulted).toContain("<h3>");
    expect(defaulted).not.toContain("<h2>");
  });

  it("shows a recovery affordance instead of an empty grid", () => {
    const html = renderToStaticMarkup(<HarnessLensExplorer harnesses={[]} />);

    expect(html).toContain("No profiles match these filters.");
    expect(html).toContain("Clear all filters");
    expect(countOccurrences(html, 'class="lens-card"')).toBe(0);
    expect(html).toContain("<strong>0</strong> active profiles");
  });

  it("starts with advanced filters inactive", () => {
    const html = renderToStaticMarkup(<HarnessLensExplorer harnesses={catalog(2)} />);

    expect(html).toContain("Layer, role, surface, and runtime");
    expect(html).not.toContain("Filters active");
    expect(html).toContain('class="lens-reset" type="button" disabled=""');
  });
});
