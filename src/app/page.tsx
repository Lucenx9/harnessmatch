import Link from "next/link";
import { ecosystemSignalSnapshots } from "@/data/ecosystem-signals";
import { featureSupportFor } from "@/data/feature-claims";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { openRouterAttributionSnapshots } from "@/data/openrouter-attribution";
import { researchSources } from "@/data/research";
import { workflowScenarios } from "@/data/workflow-scenarios";
import { HarnessLensExplorer } from "@/components/harness-lens-explorer";
import { HomeUsageSummary } from "@/components/home-usage-summary";
import { WorkflowFitExplorer } from "@/components/workflow-fit-explorer";
import { eligibilityFailuresFor, recommendHarnesses } from "@/lib/recommendation";
import { latestVerifiedAt } from "@/lib/evidence-freshness";
import { buildUsageViewRecords } from "@/lib/usage-view";

export default function HomePage() {
  const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
  const primarySourcePageCount = new Set(
    activeHarnesses.flatMap((harness) => harness.evidence.map((source) => source.url)),
  ).size;
  const peerReviewedStudyCount = researchSources.filter((source) => source.maturity === "peer-reviewed").length;
  const latestCheck = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${latestVerifiedAt()}T00:00:00Z`));
  const scenarioViews = workflowScenarios.map((scenario) => {
    const results = recommendHarnesses(scenario.answers, activeHarnesses);
    const compatibleIds = new Set(results.map((result) => result.harness.id));

    return {
      ...scenario,
      results: results.map((result) => ({
        id: result.harness.id,
        slug: result.harness.slug,
        name: result.harness.name,
        logo: result.harness.logo,
        score: result.score,
        fitBand: result.fitBand,
        robustness: result.robustness,
        evidenceState: result.evidenceState.label,
        evidenceCoverage: result.evidenceCoverage,
        evidenceSourceCount: result.evidenceSourceCount,
        verifiedAt: result.harness.verifiedAt,
        why: result.reasons[0] ?? result.harness.bestFor[0] ?? "Every required capability has current supporting documentation.",
        watchOut: result.compromises[0] ?? result.harness.tradeoffs[0] ?? "No major limitation is documented for this workflow.",
      })),
      excluded: activeHarnesses
        .filter((harness) => !compatibleIds.has(harness.id))
        .map((harness) => ({
          id: harness.id,
          slug: harness.slug,
          name: harness.name,
          logo: harness.logo,
          failures: eligibilityFailuresFor(harness, scenario.answers),
        })),
    };
  });
  const usageRecords = buildUsageViewRecords({
    harnesses,
    openRouterSnapshots: openRouterAttributionSnapshots,
    ecosystemSignals: ecosystemSignalSnapshots,
  });

  return (
    <>
      <section className="tool-intro">
        <div className="shell tool-intro-grid">
          <div className="tool-intro-copy">
            <h1>Find the coding harness that fits how you work.</h1>
            <p>A coding harness is the tool around the model: Claude Code, Codex, Cline, and others. Compare them by workflow, control, and evidence.</p>
            <div className="tool-intro-actions">
              <Link className="button primary" href="/recommend">Answer 7 questions</Link>
              <Link className="button secondary" href="#catalog">Browse catalog</Link>
            </div>
          </div>
          <dl className="dataset-summary" aria-label="Dataset status">
            <div><dt>Active catalog entries</dt><dd>{activeHarnesses.length}</dd></div>
            <div><dt>Latest source check</dt><dd>{latestCheck}</dd></div>
            <div><dt>Peer-reviewed studies</dt><dd>{peerReviewedStudyCount}</dd></div>
            <div><dt>Primary source pages</dt><dd>{primarySourcePageCount}</dd></div>
          </dl>
        </div>
      </section>

      <section className="analysis-section" aria-label="Workflow fit analysis">
        <div className="wide-shell shell">
          <WorkflowFitExplorer scenarios={scenarioViews} />
        </div>
      </section>

      <section className="section home-usage-section" aria-label="Observed usage signals">
        <div className="wide-shell shell">
          <HomeUsageSummary {...usageRecords} />
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
            layer: getHarnessMembershipAssessment(harness)!.layer,
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
    </>
  );
}
