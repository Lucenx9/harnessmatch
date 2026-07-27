import Link from "next/link";
import { benchmarkRuns } from "@/data/benchmark-runs";
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
  const homepageResearchInsights = researchInsights.slice(0, 4);

  return (
    <>
      <section className="tool-intro">
        <div className="shell tool-intro-grid">
          <div className="tool-intro-copy">
            <h1>Find the right coding harness for your workflow.</h1>
            <p>Choose a workflow. See every eligible tool, why it ranks there, and where current documentation is insufficient.</p>
          </div>
          <dl className="dataset-summary" aria-label="Dataset status">
            <div><dt>Active harnesses</dt><dd>{activeHarnesses.length}</dd></div>
            <div><dt>First-party sources</dt><dd>{sourceCount}</dd></div>
            <div><dt>Scientific papers</dt><dd>{researchSources.length}</dd></div>
            <div><dt>Measured systems</dt><dd>{benchmarkRuns.length}</dd></div>
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
            <h2>What the research means for your choice.</h2>
            <p>{homepageResearchInsights.length} practical rules, with the complete research ledger in the methodology.</p>
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
          <Link className="text-link research-methodology-link" href="/methodology">Read the full methodology and source limitations</Link>
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
