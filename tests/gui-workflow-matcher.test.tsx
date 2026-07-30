import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GuiWorkflowMatcher } from "../src/components/gui-workflow-matcher";
import { guiCapabilityLabels, guiProducts } from "../src/data/gui-products";
import { guiFitBandLabels, guiWorkflows } from "../src/lib/gui-fit";

/**
 * The matcher reads the published catalog directly, so these tests assert the
 * catalog-first contract rather than injected fixtures.
 */
const activeProducts = guiProducts.filter((product) => product.status === "active");
const html = renderToStaticMarkup(<GuiWorkflowMatcher />);

describe("gui workflow matcher", () => {
  it("opens on the complete catalog rather than a preselected workflow", () => {
    expect(html).toContain("All documented interfaces");
    expect(html).toContain(`${activeProducts.length} products`);
    expect(html).toContain(`<strong>${activeProducts.length}</strong> interfaces shown`);
  });

  it("withholds fit language until a workflow is chosen", () => {
    for (const label of Object.values(guiFitBandLabels)) {
      expect(html).not.toContain(label);
    }
    expect(html).not.toContain("Why it fits");
    expect(html).not.toContain("Required evidence");
    expect(html).toContain("Product details and evidence");
    expect(html).toContain("Best for");
  });

  it("lists every active product with a profile link", () => {
    for (const product of activeProducts) {
      expect(html).toContain(`>${product.name}</a>`);
      expect(html).toContain(`href="/guis/${product.id}"`);
      expect(html).toContain(`${product.name} profile`);
    }
  });

  it("orders the catalog alphabetically", () => {
    const positions = activeProducts
      .map((product) => ({ name: product.name, index: html.indexOf(`id="gui-${product.id}"`) }))
      .sort((left, right) => left.index - right.index)
      .map((entry) => entry.name);

    expect(positions).toEqual(
      [...activeProducts.map((product) => product.name)].sort((left, right) => left.localeCompare(right)),
    );
  });

  it("renders every capability claim with its evidence state", () => {
    for (const label of Object.values(guiCapabilityLabels)) {
      expect(html).toContain(label);
    }
    expect(html).toContain("Capability claims");
    expect(html).toContain("First-party sources");
  });

  it("offers every documented workflow as a filter option", () => {
    expect(html).toContain("All workflows");
    for (const workflow of guiWorkflows) {
      expect(html).toContain(`value="${workflow.id}"`);
      expect(html).toContain(workflow.label);
    }
  });
});
