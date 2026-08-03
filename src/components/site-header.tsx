import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { GlobalSearch } from "@/components/global-search";
import { MobileNavigation } from "@/components/mobile-navigation";
import { NavLinks } from "@/components/nav-links";
import { SecondaryNavigation } from "@/components/secondary-navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { guiProducts } from "@/data/gui-products";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { searchablePageItems } from "@/lib/navigation";
import { serializeGlobalSearchItem, type GlobalSearchItem } from "@/lib/search";
import type { GuiProduct } from "@/lib/gui-types";
import type { FeatureKey, InterfaceType, ProductLayer } from "@/lib/types";

const supportedFeatureStates = new Set(["default", "documented", "optional", "surface-specific"]);

/**
 * Interface names are taxonomy values; these are the words a reader types for
 * the same surface. Lexical synonyms only: none of them widens a claim beyond
 * the interface the record already documents.
 */
const interfaceSearchTerms: Record<InterfaceType, string[]> = {
  terminal: ["terminal", "cli", "command line"],
  ide: ["ide", "editor"],
  web: ["web"],
  automation: ["automation"],
};

/**
 * Identifiers, slugs, and taxonomy values overlap often (`claude-code` is both
 * id and slug). Ranking folds case anyway, so the duplicates would only add
 * weight to the payload serialized into every page.
 */
function dedupeKeywords(values: readonly string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const featureSearchTerms: Record<FeatureKey, string[]> = {
  mcp: ["mcp", "external tools", "integrations"],
  skills: ["agent skills", "skills", "skill.md", "reusable workflows"],
  localModels: ["local models", "ollama", "self hosted models"],
  subagents: ["subagents", "parallel agents", "delegation"],
  headless: ["headless", "ci", "automation"],
  browser: ["browser", "web control"],
  sandbox: ["sandbox", "isolated execution"],
  checkpoints: ["checkpoints", "undo", "rewind"],
};

const productLayerLabels: Record<ProductLayer, string> = {
  "coding-harness": "Harness",
  "external-harness-orchestrator": "Orchestrator",
  "framework-runtime": "Framework / runtime",
  "adjacent-tool": "Adjacent tool",
};

const harnessSearchItems: GlobalSearchItem[] = harnesses.map((harness) => {
  const membership = getHarnessMembershipAssessment(harness);
  const documentedFeatures = Object.entries(harness.featureClaims).flatMap(([feature, claim]) => (
    supportedFeatureStates.has(claim.state) ? featureSearchTerms[feature as FeatureKey] : []
  ));

  return {
    id: `harness-${harness.id}`,
    kind: "harness",
    title: harness.name,
    description: harness.tagline,
    href: `/harnesses/${harness.slug}`,
    keywords: dedupeKeywords([
      harness.id,
      harness.slug,
      harness.license,
      harness.providerStyle,
      membership?.layer ?? "catalog entry",
      harness.classification.role,
      harness.classification.orchestration,
      harness.classification.runtime,
      ...harness.classification.isolation,
      ...harness.interfaces.flatMap((surface) => interfaceSearchTerms[surface]),
      ...(harness.supportsSubscription ? ["subscription"] : []),
      ...(harness.supportsEnterpriseAccess ? ["enterprise access"] : []),
      ...documentedFeatures,
    ]),
    imageSrc: harness.logo.src,
    meta: harness.status === "active"
      ? membership
        ? productLayerLabels[membership.layer]
        : "Catalog entry"
      : harness.status === "dormant"
        ? "Dormant"
        : "Archived",
  };
});

/**
 * Only active GUI products have a generated `/guis/[slug]` route; a dormant or
 * archived product in the search index would rank normally and then resolve to
 * a 404. Harness profiles render for every status, so they stay searchable.
 */
export function guiSearchItemsFor(products: readonly GuiProduct[]): GlobalSearchItem[] {
  return products
    .filter((product) => product.status === "active")
    .map((product) => ({
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
    }));
}

const guiSearchItems = guiSearchItemsFor(guiProducts);

const pageSearchItems: GlobalSearchItem[] = searchablePageItems.map((page) => ({
  id: `page-${page.href === "/" ? "home" : page.href.slice(1)}`,
  kind: "page",
  title: page.label,
  description: page.description,
  href: page.href,
  keywords: [...page.keywords],
  meta: "Page",
}));

const globalSearchItems = [...harnessSearchItems, ...guiSearchItems, ...pageSearchItems];
const serializedGlobalSearchItems = globalSearchItems.map(serializeGlobalSearchItem);

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="HarnessMatch home">
          <BrandMark />
          <span>HarnessMatch</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavLinks />
          <SecondaryNavigation />
        </nav>
        <GlobalSearch recordCount={harnessSearchItems.length + guiSearchItems.length} items={serializedGlobalSearchItems} />
        <MobileNavigation />
        <ThemeToggle />
      </div>
    </header>
  );
}
