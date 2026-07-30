import type { GuiProduct } from "@/lib/gui-types";

/**
 * `Custom CLI` marks arbitrary-CLI support inside a GUI harness list. Named
 * harness support and arbitrary CLI support are distinct claims, so the
 * placeholder never counts as a named integration.
 */
export const arbitraryCliEntry = "Custom CLI";

export function namedHarnesses(product: Pick<GuiProduct, "supportedHarnesses">): string[] {
  return product.supportedHarnesses.filter((harness) => harness !== arbitraryCliEntry);
}
