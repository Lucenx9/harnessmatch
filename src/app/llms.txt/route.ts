import { harnesses } from "@/data/harnesses";
import { latestVerifiedAt } from "@/lib/evidence-freshness";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const coreResources = [
  ["Home", "/", "Product scope, current activity, and catalog entry points"],
  ["Compare harnesses", "/compare", "Side-by-side capability and operating-model comparison"],
  ["Harness catalog", "/harnesses", "Filterable catalog of coding harness profiles"],
  ["Usage signals", "/usage", "Source-separated routing, package, release, editor-marketplace, and repository observations with explicit limits"],
  ["Coding agent GUIs", "/guis", "Workflow classification for native and multi-harness graphical interfaces"],
  ["Methodology", "/methodology", "Catalog boundaries, classification rules, measurement limits, and evidence policy"],
  ["Data and sources", "/data", "Current reviewed stable release feeds and a searchable ledger of dated first-party evidence"],
  ["Benchmark archive", "/benchmarks", "Exploratory configuration-specific benchmark records and limitations"],
] as const;

export function GET() {
  const activeProfiles = harnesses
    .filter((harness) => harness.status === "active")
    .map((harness) => (
      `- [${harness.name}](${siteUrl}/harnesses/${harness.slug}): ${harness.tagline}`
    ));
  const lines = [
    "# HarnessMatch",
    "",
    "> HarnessMatch is a source-backed catalog and comparison tool for AI coding harnesses.",
    "",
    "A model's capability is not treated as a harness capability. HarnessMatch evaluates the CLI, IDE extension, agent platform, or runtime mechanisms that turn model reasoning into coding work.",
    "",
    "HarnessMatch is not a generic model leaderboard or an affiliate ranking site. Capability claims require a first-party source and verification date; benchmark results belong only to the exact recorded model, harness version, environment, budget, attempts, and date.",
    "",
    `Evidence records were most recently verified on ${latestVerifiedAt()}. Only active profiles appear below; dormant or archived tools may remain in the data ledger for research continuity.`,
    "",
    "## Core resources",
    "",
    ...coreResources.map(([label, path, description]) => (
      `- [${label}](${path === "/" ? siteUrl : `${siteUrl}${path}`}): ${description}`
    )),
    "",
    "## Active harness profiles",
    "",
    ...activeProfiles,
    "",
    "## Optional",
    "",
    `- [Privacy](${siteUrl}/privacy): Data processing and analytics disclosure`,
    `- [Sitemap](${siteUrl}/sitemap.xml): Canonical list of indexable pages`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
