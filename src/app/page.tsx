import Link from "next/link";
import { benchmarkRuns } from "@/data/benchmark-runs";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { getOperationalProfileRecord } from "@/data/operational-profiles";
import {
  repositoryAudits,
  repositoryArtifactCount,
} from "@/data/repository-audits";
import { researchInsights, researchSources } from "@/data/research";
import { workflowScenarios } from "@/data/workflow-scenarios";
import { EvidenceRankingExplorer } from "@/components/evidence-ranking-explorer";
import { HarnessLensExplorer } from "@/components/harness-lens-explorer";
import { WorkflowFitExplorer } from "@/components/workflow-fit-explorer";
import {
  architectureProfileFor,
  benchmarkConfidenceInterval95,
  benchmarkParetoFrontier,
  benchmarkTopIntervalGroup,
} from "@/lib/evaluation";
import { eligibilityFailuresFor, recommendHarnesses } from "@/lib/recommendation";

export default function HomePage() {
  const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
  const sourceCount = activeHarnesses.reduce((total, harness) => total + harness.evidence.length, 0);
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
  const researchByUrl = new Map(researchSources.map((source) => [source.url, source]));
  const harnessById = new Map(harnesses.map((harness) => [harness.id, harness]));
  const operationalRanking = activeHarnesses.flatMap((harness) => {
    const profile = architectureProfileFor(harness);
    const record = getOperationalProfileRecord(harness.id);
    const documentedAxes = Object.values(profile).filter((value) => value !== null).length;
    if (documentedAxes === 0) return [];
    return [{
      id: harness.id,
      slug: harness.slug,
      name: harness.name,
      logo: harness.logo,
      levels: profile,
      documentedAxes,
      evidenceSources: record.sourceUrls.length,
      verifiedAt: record.verifiedAt,
    }];
  });
  const supportOnlyRepositories = repositoryAudits.filter((audit) => (
    audit.sourceScope === "support-repository" && harnessById.get(audit.harnessId)?.status === "active"
  ));
  const auditabilityRanking = repositoryAudits.flatMap((audit) => {
    const harness = harnessById.get(audit.harnessId);
    const artifactCount = repositoryArtifactCount(audit);
    if (!harness || harness.status !== "active" || artifactCount === null || audit.sourceScope === "support-repository") return [];
    return [{
      id: harness.id,
      slug: harness.slug,
      name: harness.name,
      logo: harness.logo,
      artifactCount,
      sourceScope: audit.sourceScope,
      passedSignals: Object.values(audit.signals).filter(Boolean).length,
      repositoryUrl: audit.repositoryUrl,
      inspectedRef: audit.inspectedRef,
    }];
  });
  const benchmarkRanking = benchmarkRuns.flatMap((run) => {
    const harness = harnessById.get(run.harnessId);
    if (!harness || harness.status !== "active") return [];
    const interval = benchmarkConfidenceInterval95(run);
    const pareto = benchmarkParetoFrontier(benchmarkRuns);
    const topIntervalGroup = benchmarkTopIntervalGroup(benchmarkRuns);
    return [{
      id: run.id,
      slug: harness.slug,
      name: harness.name,
      logo: harness.logo,
      score: run.accuracy,
      harnessVersion: run.harnessVersion,
      model: run.model,
      reasoningEffort: run.reasoningEffort,
      totalCostUsd: run.totalCostUsd,
      standardError: run.standardError,
      intervalLower: interval.lower,
      intervalUpper: interval.upper,
      onParetoFrontier: pareto.has(run.id),
      inTopIntervalGroup: topIntervalGroup.has(run.id),
      totalTrials: run.totalTrials,
      integrityAdjustmentPercent: run.integrityAdjustmentPercent,
      runDate: run.runDate,
      resultSourceUrl: run.resultSourceUrl,
    }];
  });
  const homepageResearchInsights = researchInsights.slice(0, 3);

  return (
    <>
      <section className="tool-intro">
        <div className="shell tool-intro-grid">
          <div className="tool-intro-copy">
            <h1>Choose the right coding harness.</h1>
            <p>The model reasons. The harness is the CLI, IDE extension, or agent platform that turns it into working code.</p>
            <div className="tool-intro-actions">
              <Link className="button primary" href="/recommend">Find your match</Link>
              <Link className="button secondary" href="#catalog">Browse catalog</Link>
            </div>
          </div>
          <dl className="dataset-summary" aria-label="Dataset status">
            <div><dt>Active catalog entries</dt><dd>{activeHarnesses.length}</dd></div>
            <div><dt>First-party sources</dt><dd>{sourceCount}</dd></div>
            <div><dt>Scientific papers</dt><dd>{researchSources.length}</dd></div>
            <div><dt>Measured configurations</dt><dd>{benchmarkRuns.length}</dd></div>
          </dl>
        </div>
      </section>

      <section className="analysis-section" aria-label="Workflow fit analysis">
        <div className="wide-shell shell">
          <WorkflowFitExplorer scenarios={scenarioViews} />
        </div>
      </section>

      <section className="section evidence-ranking-section" aria-label="Evidence-based rankings">
        <div className="wide-shell shell">
          <EvidenceRankingExplorer
            operational={operationalRanking}
            auditability={auditabilityRanking}
            benchmarks={benchmarkRanking}
            unrankedRepositoryCount={supportOnlyRepositories.length}
          />
        </div>
      </section>

      <section className="section research-translation-section">
        <div className="shell">
          <div className="section-heading stacked-heading">
            <h2>Three rules behind the ranking.</h2>
            <p>The short version of the research. Every rule links to its underlying papers.</p>
          </div>
          <div className="research-insight-grid">
            {homepageResearchInsights.map((insight) => (
              <article key={insight.title}>
                <h3>{insight.title}</h3>
                <p>{insight.summary}</p>
                <div className="research-insight-sources">
                  {insight.sourceUrls.map((url) => {
                    const source = researchByUrl.get(url);
                    return (
                      <a href={url} key={url} target="_blank" rel="noreferrer">
                        {source ? `${source.title.split(":")[0]}, ${source.venue}` : "Research source"}
                      </a>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
          <Link className="text-link research-methodology-link" href="/methodology">Open the full methodology</Link>
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
            features: harness.features,
            evidenceCount: harness.evidence.length,
            verifiedAt: harness.verifiedAt,
          }))} />
        </div>
      </section>
    </>
  );
}
