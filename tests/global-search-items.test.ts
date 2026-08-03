import { describe, expect, it } from "vitest";
import { guiProducts } from "../src/data/gui-products";
import { guiSearchItemsFor } from "../src/lib/global-search-items";
import type { GuiProduct } from "../src/lib/gui-types";

function catalogFixture(): GuiProduct {
  const product = guiProducts[0];
  if (!product) throw new Error("The GUI catalog has no products to build a fixture from.");
  return product;
}

describe("global search GUI items", () => {
  it("indexes every active GUI product with its profile route", () => {
    const items = guiSearchItemsFor(guiProducts);
    const activeProducts = guiProducts.filter((product) => product.status === "active");

    expect(items.map((item) => item.id)).toEqual(activeProducts.map((product) => `gui-${product.id}`));
    expect(items.map((item) => item.href)).toEqual(activeProducts.map((product) => `/guis/${product.id}`));
  });

  it("keeps dormant and archived GUI products out of the search index", () => {
    const active: GuiProduct = {
      ...catalogFixture(),
      id: "active-fixture",
      status: "active",
    };
    const dormant: GuiProduct = { ...active, id: "dormant-fixture", status: "dormant" };
    const archived: GuiProduct = { ...active, id: "archived-fixture", status: "archived" };

    const items = guiSearchItemsFor([dormant, active, archived]);

    expect(items.map((item) => item.id)).toEqual([`gui-${active.id}`]);
  });
});
