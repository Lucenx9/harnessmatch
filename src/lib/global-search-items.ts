import type { GuiProduct } from "@/lib/gui-types";
import type { GlobalSearchItem } from "@/lib/search";

/**
 * Identifiers, slugs, and taxonomy values overlap often (`claude-code` is both
 * id and slug). Ranking folds case anyway, so duplicates would only add weight
 * to the payload serialized into every page.
 */
export function dedupeKeywords(values: readonly string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Only active GUI products have a generated `/guis/[slug]` route; a dormant or
 * archived product in the search index would rank normally and then resolve to
 * a 404. Harness profiles render for every status, so they stay searchable.
 */
export function guiSearchItemsFor(products: readonly GuiProduct[]): GlobalSearchItem[] {
  const items: GlobalSearchItem[] = [];

  for (const product of products) {
    if (product.status !== "active") continue;
    items.push({
      id: `gui-${product.id}`,
      kind: "gui",
      title: product.name,
      description: product.summary,
      href: `/guis/${product.id}`,
      keywords: dedupeKeywords([
        "gui",
        "coding agent interface",
        product.layer,
        product.sourceAccess,
        product.license,
        ...product.platforms,
        ...product.supportedHarnesses,
        ...(product.acceptsArbitraryCli ? ["any cli", "multiple harnesses"] : []),
      ]),
      imageSrc: product.logo.src,
      meta: product.layer === "harness-native" ? "Native GUI" : "Agent workspace",
    });
  }

  return items;
}
