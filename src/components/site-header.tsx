import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { GlobalSearch } from "@/components/global-search";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { searchablePageItems } from "@/lib/navigation";
import type { GlobalSearchItem } from "@/lib/search";
import type { FeatureKey, ProductLayer } from "@/lib/types";

const supportedFeatureStates = new Set(["default", "documented", "optional", "surface-specific"]);

const featureSearchTerms: Record<FeatureKey, string[]> = {
  mcp: ["mcp", "external tools", "integrations"],
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
    keywords: [
      harness.id,
      harness.slug,
      harness.license,
      harness.providerStyle,
      membership?.layer ?? "catalog entry",
      harness.classification.role,
      harness.classification.orchestration,
      harness.classification.runtime,
      ...harness.classification.isolation,
      ...harness.interfaces,
      ...(harness.supportsSubscription ? ["subscription"] : []),
      ...(harness.supportsEnterpriseAccess ? ["enterprise access"] : []),
      ...documentedFeatures,
    ],
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

const pageSearchItems: GlobalSearchItem[] = searchablePageItems.map((page) => ({
  id: `page-${page.href === "/" ? "home" : page.href.slice(1)}`,
  kind: "page",
  title: page.label,
  description: page.description,
  href: page.href,
  keywords: [...page.keywords],
  meta: "Page",
}));

const globalSearchItems = [...harnessSearchItems, ...pageSearchItems];

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
        </nav>
        <GlobalSearch profileCount={harnesses.length} items={globalSearchItems} />
        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <NavLinks />
          </nav>
        </details>
        <ThemeToggle />
      </div>
    </header>
  );
}
