import type { Metadata } from "next";
import { EvidenceRankingExplorer } from "@/components/evidence-ranking-explorer";
import { EvidenceLedger } from "@/components/evidence-ledger";
import { GuiEvidenceLedger } from "@/components/gui-evidence-ledger";
import { benchmarkRuns } from "@/data/benchmark-runs";
import { discoveryWatchlist } from "@/data/discovery-watchlist";
import { guiProducts } from "@/data/gui-products";
import { guiRepositoryAudits } from "@/data/gui-repository-audits";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { getOperationalProfileRecord } from "@/data/operational-profiles";
import { repositoryArtifactCount, repositoryAudits } from "@/data/repository-audits";
import { researchProcessDisclosure } from "@/data/research-process";
import {
  architectureProfileFor,
  benchmarkConfidenceInterval95,
  benchmarkParetoFrontier,
  benchmarkTopIntervalGroup,
} from "@/lib/evaluation";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Data and sources",
  description:
    "Search the first-party evidence behind AI coding harness capabilities, classifications, trade-offs, and verification dates.",
  path: "/data",
});

export default function DataPage() {
  const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
  const guiAuditById = new Map(guiRepositoryAudits.map((audit) => [audit.guiId, audit]));
  const ledgerRecords = harnesses.map((harness) => ({
    id: harness.id,
    name: harness.name,
    summary: harness.summary,
    logo: harness.logo,
    status: harness.status,
    productLayer: getHarnessMembershipAssessment(harness)?.layer ?? null,
    role: harness.classification.role,
    orchestration: harness.classification.orchestration,
    runtime: harness.classification.runtime,
    isolation: harness.classification.isolation,
    state: harness.classification.state,
    license: harness.license,
    verifiedAt: harness.verifiedAt,
    evidence: harness.evidence.map((source) => ({
      title: source.title,
      url: source.url,
      covers: source.covers,
      kind: source.kind,
    })),
    discovery: harness.discovery?.map((source) => ({
      title: source.title,
      url: source.url,
      note: source.note,
    })),
  }));
  const guiLedgerRecords = guiProducts.map((product) => ({
    id: product.id,
    name: product.name,
    summary: product.summary,
    logo: product.logo,
    status: product.status,
    layer: product.layer,
    sourceAccess: product.sourceAccess,
    license: product.license,
    platforms: product.platforms,
    supportedHarnesses: product.supportedHarnesses,
    acceptsArbitraryCli: product.acceptsArbitraryCli,
    verifiedAt: product.verifiedAt,
    evidence: product.evidence,
    preview: product.preview ? {
      caption: product.preview.caption,
      provenance: product.preview.provenance,
      sourceUrl: product.preview.sourceUrl,
      verifiedAt: product.preview.verifiedAt,
    } : undefined,
    audit: guiAuditById.get(product.id),
  }));
  const primarySourceCount = activeHarnesses.reduce((total, harness) => total + harness.evidence.length, 0)
    + guiProducts.reduce((total, product) => total + product.evidence.length, 0);
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
  const benchmarkPareto = benchmarkParetoFrontier(benchmarkRuns);
  const benchmarkTopGroup = benchmarkTopIntervalGroup(benchmarkRuns);
  const benchmarkRanking = benchmarkRuns.flatMap((run) => {
    const harness = harnessById.get(run.harnessId);
    if (!harness || harness.status !== "active") return [];
    const interval = benchmarkConfidenceInterval95(run);
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
      onParetoFrontier: benchmarkPareto.has(run.id),
      inTopIntervalGroup: benchmarkTopGroup.has(run.id),
      totalTrials: run.totalTrials,
      integrityAdjustmentPercent: run.integrityAdjustmentPercent,
      runDate: run.runDate,
      resultSourceUrl: run.resultSourceUrl,
    }];
  });

  return (
    <section className="section page-section">
      <div className="shell wide-shell">
        <div className="page-intro">
          <h1>Inspect the sources.</h1>
          <p>Search coding-harness and GUI claims, then open the first-party page that supports each record. The two evidence layers stay separate so interface features are not mistaken for harness capabilities.</p>
        </div>
        <aside className="notice prominent research-disclosure" aria-label="Research process disclosure">
          <p><strong>{researchProcessDisclosure.label}:</strong> {researchProcessDisclosure.short}</p>
          <a href="/methodology#research-process">Read how the research process is governed</a>
        </aside>
        <div className="ledger-summary">
          <span><strong>{activeHarnesses.length}</strong> active products</span>
          <span><strong>{guiProducts.length}</strong> GUI records</span>
          <span><strong>{primarySourceCount}</strong> primary sources</span>
          <span><strong>{guiRepositoryAudits.length}</strong> pinned GUI code audits</span>
          <span><strong>{discoveryWatchlist.length}</strong> watchlist records</span>
          <span><strong>0</strong> affiliate sources</span>
        </div>

        <section className="data-ranking-section" aria-label="Evidence-based rankings">
          <EvidenceRankingExplorer
            operational={operationalRanking}
            auditability={auditabilityRanking}
            benchmarks={benchmarkRanking}
            unrankedRepositoryCount={supportOnlyRepositories.length}
          />
        </section>

        <section className="data-evidence-section" id="harness-evidence" aria-labelledby="harness-evidence-heading">
          <div className="section-heading stacked-heading">
            <h2 id="harness-evidence-heading">Harness evidence</h2>
            <p>Runtime classifications, documented controls, product state, and the first-party sources supporting each harness record.</p>
          </div>
          <EvidenceLedger records={ledgerRecords} />
        </section>

        <section className="data-evidence-section" id="gui-evidence" aria-labelledby="gui-evidence-heading">
          <div className="section-heading stacked-heading">
            <h2 id="gui-evidence-heading">GUI evidence</h2>
            <p>Interface layer, platform support, harness compatibility, source access, product media provenance, and pinned implementation audits.</p>
          </div>
          <GuiEvidenceLedger records={guiLedgerRecords} />
        </section>

        <section className="watchlist-section" aria-labelledby="watchlist-heading">
          <div className="section-heading stacked-heading">
            <h2 id="watchlist-heading">Discovery watchlist</h2>
            <p>Products stay outside the ranked catalog until first-party evidence supports a complete coding-harness profile.</p>
          </div>
          <div className="watchlist-grid">
            {discoveryWatchlist.map((candidate) => (
              <a href={candidate.sourceUrl} target="_blank" rel="noreferrer" key={candidate.name}>
                <span>
                  <strong>{candidate.name}</strong>
                  <small>{candidate.reason}</small>
                </span>
                <span className="evidence-kind">{candidate.status.replaceAll("-", " ")}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
