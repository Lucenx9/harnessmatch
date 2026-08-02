import Link from "next/link";
import { ecosystemSignalSnapshots } from "@/data/ecosystem-signals";
import { featureSupportFor } from "@/data/feature-claims";
import { requireHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { openRouterAttributionSnapshots } from "@/data/openrouter-attribution";
import { harnessReleaseSnapshots } from "@/data/release-signals";
import { researchSources } from "@/data/research";
import { HarnessLensExplorer } from "@/components/harness-lens-explorer";
import { HomeReleaseActivity } from "@/components/home-release-activity";
import { HomeUsageSummary } from "@/components/home-usage-summary";
import { latestVerifiedAt } from "@/lib/evidence-freshness";
import { buildRecentReleaseActivity, buildUsageViewRecords } from "@/lib/usage-view";

const latestCheckFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export default function HomePage() {
  const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
  const primarySourcePageCount = new Set(
    activeHarnesses.flatMap((harness) => harness.evidence.map((source) => source.url)),
  ).size;
  const peerReviewedStudyCount = researchSources.filter((source) => source.maturity === "peer-reviewed").length;
  const latestCheck = latestCheckFormatter.format(new Date(`${latestVerifiedAt()}T00:00:00Z`));
  const usageRecords = buildUsageViewRecords({
    harnesses,
    openRouterSnapshots: openRouterAttributionSnapshots,
    ecosystemSignals: ecosystemSignalSnapshots,
  });
  const homeEcosystemRecords = usageRecords.ecosystemRecords.filter(({ signal }) => (
    signal.source === "homebrew"
    || signal.source === "npm"
    || signal.source === "github-releases"
    || signal.source === "vscode"
  ));
  const recentReleaseActivity = buildRecentReleaseActivity({
    harnesses,
    releaseSnapshots: harnessReleaseSnapshots,
  });

  return (
    <>
      <section className="tool-intro">
        <div className="shell">
          <div className="tool-intro-grid">
            <div className="tool-intro-copy">
              <h1>Source-backed data on AI coding harnesses.</h1>
              <p>Compare documented capabilities, operating models, public usage signals, and evidence coverage. Popularity and quality remain separate.</p>
            </div>
            <dl className="dataset-summary" aria-label="Dataset status">
              <div><dt>Active catalog entries</dt><dd>{activeHarnesses.length}</dd></div>
              <div><dt>Latest source check</dt><dd>{latestCheck}</dd></div>
              <div><dt>Peer-reviewed studies</dt><dd>{peerReviewedStudyCount}</dd></div>
              <div><dt>Primary source pages</dt><dd>{primarySourcePageCount}</dd></div>
            </dl>
          </div>
          <nav className="home-data-nav" aria-label="Primary data views">
            <Link href="/usage"><strong>Usage signals</strong><span>Eight source-separated views</span></Link>
            <Link href="/compare"><strong>Compare harnesses</strong><span>Capabilities and operating model</span></Link>
            <Link href="/data"><strong>Evidence ledger</strong><span>{primarySourcePageCount} primary-source pages</span></Link>
            <Link href="#catalog"><strong>Harness catalog</strong><span>{activeHarnesses.length} active profiles</span></Link>
          </nav>
        </div>
      </section>

      <section className="home-usage-section" aria-label="Observed usage signals">
        <div className="shell">
          <HomeUsageSummary
            openRouterRecords={usageRecords.openRouterRecords}
            ecosystemRecords={homeEcosystemRecords}
            activeHarnessCount={usageRecords.activeHarnessCount}
          />
        </div>
      </section>

      <section className="section catalog-explorer-section" id="catalog">
        <div className="shell">
          <div className="section-heading stacked-heading catalog-explorer-heading">
            <h2>Browse all harnesses.</h2>
            <p>Filter by a capability, then open a profile for trade-offs and sources.</p>
          </div>
          <HarnessLensExplorer harnesses={activeHarnesses.map((harness) => ({
            id: harness.id,
            slug: harness.slug,
            name: harness.name,
            logo: harness.logo,
            tagline: harness.tagline,
            layer: requireHarnessMembershipAssessment(harness).layer,
            role: harness.classification.role,
            orchestration: harness.classification.orchestration,
            runtime: harness.classification.runtime,
            isolation: harness.classification.isolation,
            state: harness.classification.state,
            interfaces: harness.interfaces,
            providerStyle: harness.providerStyle,
            featureSupport: featureSupportFor(harness),
            evidenceCount: harness.evidence.length,
            verifiedAt: harness.verifiedAt,
          }))} />
        </div>
      </section>

      <section className="home-release-section" aria-label="Latest stable harness releases">
        <div className="shell">
          <HomeReleaseActivity
            records={recentReleaseActivity}
            limit={8}
            action={{ href: "/data#stable-releases", label: "Open all release feeds" }}
          />
        </div>
      </section>
    </>
  );
}
