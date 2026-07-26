import { harnesses } from "@/data/harnesses";
import { workflowScenarios } from "@/data/workflow-scenarios";
import { HarnessLensExplorer } from "@/components/harness-lens-explorer";
import { WorkflowFitExplorer } from "@/components/workflow-fit-explorer";
import { recommendHarnesses } from "@/lib/recommendation";

export default function HomePage() {
  const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
  const sourceCount = activeHarnesses.reduce((total, harness) => total + harness.evidence.length, 0);
  const latestVerification = activeHarnesses.reduce(
    (latest, harness) => harness.verifiedAt > latest ? harness.verifiedAt : latest,
    "",
  );
  const scenarioViews = workflowScenarios.map((scenario) => ({
    ...scenario,
    results: recommendHarnesses(scenario.answers, activeHarnesses).map((result) => ({
      id: result.harness.id,
      slug: result.harness.slug,
      name: result.harness.name,
      logo: result.harness.logo,
      score: result.score,
      blockers: result.blockers,
      verifiedAt: result.harness.verifiedAt,
    })),
  }));

  return (
    <>
      <section className="tool-intro">
        <div className="shell tool-intro-grid">
          <div className="tool-intro-copy">
            <h1>Compare coding harnesses by workflow fit.</h1>
            <p>Select a scenario, inspect the fit points, then trace every capability claim to a first-party source.</p>
          </div>
          <dl className="dataset-summary" aria-label="Dataset status">
            <div><dt>Active harnesses</dt><dd>{activeHarnesses.length}</dd></div>
            <div><dt>First-party sources</dt><dd>{sourceCount}</dd></div>
            <div><dt>Workflow scenarios</dt><dd>{workflowScenarios.length}</dd></div>
            <div><dt>Latest verification</dt><dd>{latestVerification}</dd></div>
          </dl>
        </div>
      </section>

      <section className="analysis-section" aria-label="Workflow fit analysis">
        <div className="wide-shell shell">
          <WorkflowFitExplorer scenarios={scenarioViews} />
        </div>
      </section>

      <section className="section catalog-explorer-section">
        <div className="shell">
          <div className="section-heading stacked-heading catalog-explorer-heading">
            <h2>Filter the source-backed catalog.</h2>
            <p>Apply a verified capability filter or open a profile to inspect its evidence ledger.</p>
          </div>
          <HarnessLensExplorer harnesses={activeHarnesses.map((harness) => ({
            id: harness.id,
            slug: harness.slug,
            name: harness.name,
            logo: harness.logo,
            tagline: harness.tagline,
            category: harness.category,
            interfaces: harness.interfaces,
            providerStyle: harness.providerStyle,
            features: harness.features,
            evidenceCount: harness.evidence.length,
            verifiedAt: harness.verifiedAt,
          }))} />
        </div>
      </section>
    </>
  );
}
