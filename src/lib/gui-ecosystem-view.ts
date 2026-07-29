import type { GuiEcosystemSignalSnapshot, GuiProduct } from "./gui-types";

export type GuiEcosystemViewRecord = {
  product: GuiProduct;
  signal: GuiEcosystemSignalSnapshot;
};

export function buildGuiEcosystemViewRecords(
  products: GuiProduct[],
  signals: GuiEcosystemSignalSnapshot[],
) {
  const productById = new Map(products.map((product) => [product.id, product]));
  const records = signals.flatMap((signal) => {
    const product = productById.get(signal.guiId);
    return product && product.status === "active" ? [{ product, signal }] : [];
  });

  return {
    homebrew: records
      .filter((record) => record.signal.source === "homebrew")
      .toSorted((left, right) => right.signal.value - left.signal.value),
    github: records
      .filter((record) => record.signal.source === "github")
      .toSorted((left, right) => right.signal.value - left.signal.value),
    githubReleases: records
      .filter((record) => record.signal.source === "github-releases")
      .toSorted((left, right) => right.signal.value - left.signal.value),
  };
}
