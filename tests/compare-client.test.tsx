import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CompareClient } from "../src/components/compare-client";
import { compareRecord } from "./component-fixtures";

/** The ids the component preselects before the URL query string is applied. */
const defaultIds = ["claude-code", "codex", "opencode"] as const;

function countOccurrences(html: string, needle: string) {
  return html.split(needle).length - 1;
}

describe("compare client", () => {
  it("builds one column per preselected harness", () => {
    const html = renderToStaticMarkup(
      <CompareClient
        harnesses={defaultIds.map((id) => compareRecord({ id, name: `Product ${id}` }))}
      />,
    );

    expect(countOccurrences(html, "comparison-brand")).toBe(3);
    expect(html).toContain("Product claude-code");
    expect(html).toContain("Product codex");
    expect(html).toContain("Product opencode");
  });

  it("drops preselected ids that the catalog no longer publishes", () => {
    const html = renderToStaticMarkup(
      <CompareClient
        harnesses={[
          compareRecord({ id: "claude-code", name: "Retained Harness" }),
          compareRecord({ id: "some-other-harness", name: "Unselected Harness" }),
        ]}
      />,
    );

    expect(countOccurrences(html, "comparison-brand")).toBe(1);
    expect(html).toContain("Retained Harness");
    expect(html).toContain("Remove Retained Harness from comparison");
    expect(html).not.toContain("Remove Unselected Harness from comparison");
  });

  it("keeps technical rows collapsed until they are requested", () => {
    const html = renderToStaticMarkup(
      <CompareClient harnesses={[compareRecord({ id: "claude-code", name: "Only Harness" })]} />,
    );

    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain("Show technical rows");
    expect(html).toContain("Practical comparison.");
    expect(html).not.toContain("Catalog layer");
    expect(html).not.toContain("Harness membership");
    expect(html).not.toContain("Public code auditability");
    expect(html).not.toContain("Technical classification and evidence");
  });

  it("states the absence of an admitted run rather than leaving the cell blank", () => {
    const html = renderToStaticMarkup(
      <CompareClient harnesses={[compareRecord({ id: "claude-code", name: "Unmeasured" })]} />,
    );

    expect(html).toContain("No admitted run");
  });

  it("renders an admitted run with its accuracy interval and configuration", () => {
    const html = renderToStaticMarkup(
      <CompareClient
        harnesses={[
          compareRecord({
            id: "claude-code",
            name: "Measured",
            measuredRuns: [{
              id: "run-1",
              accuracy: 72.5,
              standardError: 1.2,
              model: "fixture-model",
              harnessVersion: "2.1.0",
            }],
          }),
        ]}
      />,
    );

    expect(html).toContain("72.50%");
    expect(html).toContain("1.20");
    expect(html).toContain("fixture-model, harness 2.1.0");
    expect(html).not.toContain("No admitted run");
  });

  it("prompts for a selection instead of rendering an empty table", () => {
    const html = renderToStaticMarkup(<CompareClient harnesses={[]} />);

    expect(html).toContain("Choose at least one harness");
    expect(html).toContain("Choose harnesses");
    expect(html).not.toContain("comparison-table");
  });

  it("pluralises the picker match count", () => {
    const many = renderToStaticMarkup(
      <CompareClient
        harnesses={defaultIds.map((id) => compareRecord({ id, name: `Product ${id}` }))}
      />,
    );
    const one = renderToStaticMarkup(
      <CompareClient harnesses={[compareRecord({ id: "claude-code", name: "Sole Harness" })]} />,
    );

    expect(many).toContain("3 matches");
    expect(one).toContain("1 match,");
    expect(one).not.toContain("1 matches");
  });

  it("exposes the picker as a modal dialog labelled by its heading", () => {
    const html = renderToStaticMarkup(
      <CompareClient harnesses={[compareRecord({ id: "claude-code", name: "Only Harness" })]} />,
    );

    expect(html).toContain('aria-labelledby="compare-picker-dialog-title"');
    expect(html).toContain('id="compare-picker-dialog-title"');
    expect(html).toContain("Choose up to four harnesses");
  });
});
