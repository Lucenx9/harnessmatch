import "../styles/profiles.css";
import type { Metadata } from "next";
import Link from "next/link";
import { EvidenceRankingExplorer } from "@/components/evidence-ranking-explorer";
import { EvidenceLedger, type EvidenceLedgerRecord } from "@/components/evidence-ledger";
import { GuiEvidenceLedger, type GuiEvidenceLedgerRecord } from "@/components/gui-evidence-ledger";
import { HomeReleaseActivity } from "@/components/home-release-activity";
import { benchmarkRuns } from "@/data/benchmark-runs";
import { discoveryWatchlist } from "@/data/discovery-watchlist";
import { guiProducts } from "@/data/gui-products";
import { guiRepositoryAudits } from "@/data/gui-repository-audits";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { getOperationalProfileRecord } from "@/data/operational-profiles";
import { repositoryArtifactCount, repositoryAudits } from "@/data/repository-audits";
import { researchProcessDisclosure } from "@/data/research-process";
import { harnessReleaseSnapshots } from "@/data/release-signals";
import {
  architectureProfileFor,
  benchmarkConfidenceInterval95,
  benchmarkFamilyCount,
  benchmarkParetoFrontier,
  benchmarkTopIntervalGroup,
} from "@/lib/evaluation";
import { pageMetadata } from "@/lib/site";
import { buildRecentReleaseActivity } from "@/lib/usage-view";

export const metadata: Metadata = pageMetadata({
  title: "AI coding harness data and primary sources",
  description:
    "Inspect current stable releases and first-party evidence for AI coding harness capabilities, classifications, trade-offs, and verification dates.",
  path: "/data",
});

export default function DataPage() {
  const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
  const guiAuditById = new Map(guiRepositoryAudits.map((audit) => [audit.guiId, audit]));
  const releaseActivity = buildRecentReleaseActivity({ harnesses, releaseSnapshots: harnessReleaseSnapshots });
  const ledgerRecords: EvidenceLedgerRecord[] = harnesses.map((harness) => ({
    id: harness.id,
    slug: harness.slug,
    name: harness.name,
    summary: harness.summary,
    logo: harness.logo,
    status: harness.status,
    productLayer: getHarnessMembershipAssessment(harness)?.layer ?? null,
    role: harness.classification.role,
    license: harness.license,
    verifiedAt: harness.verifiedAt,
    primarySourceCount: harness.evidence.length,
    discoverySourceCount: harness.discovery?.length ?? 0,
    searchText: [
      harness.classification.orchestration,
      harness.classification.runtime,
      ...harness.classification.isolation,
      harness.classification.state,
      ...harness.evidence.flatMap((source) => [source.title, source.covers]),
      ...(harness.discovery?.flatMap((source) => [source.title, source.note]) ?? []),
    ].join(" "),
  }));
  const guiLedgerRecords: GuiEvidenceLedgerRecord[] = guiProducts.map((product) => {
    const audit = guiAuditById.get(product.id);
    return {
      id: product.id,
      name: product.name,
      summary: product.summary,
      logo: product.logo,
      status: product.status,
      layer: product.layer,
      sourceAccess: product.sourceAccess,
      license: product.license,
      verifiedAt: product.verifiedAt,
      evidenceRecordCount: product.evidence.length + (product.preview ? 1 : 0) + (audit ? 1 : 0),
      searchText: [
        ...product.platforms,
        ...product.supportedHarnesses,
        product.acceptsArbitraryCli ? "arbitrary CLI" : "named integrations",
        ...product.evidence.flatMap((source) => [source.title, source.covers]),
        ...(product.preview ? [product.preview.caption, product.preview.provenance] : []),
      ].join(" "),
    };
  });
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
    if (harness?.status !== "active" || artifactCount === null || audit.sourceScope === "support-repository") return [];
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
  const benchmarkFamilies = benchmarkFamilyCount(benchmarkRuns);
  const benchmarkRanking = benchmarkRuns.flatMap((run) => {
    const harness = harnessById.get(run.harnessId);
    if (harness?.status !== "active") return [];
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
          <Link href="/methodology#research-process">Read how the research process is governed</Link>
        </aside>
        <div className="ledger-summary">
          <span><strong>{activeHarnesses.length}</strong> active products</span>
          <span><strong>{guiProducts.length}</strong> GUI records</span>
          <span><strong>{primarySourceCount}</strong> primary sources</span>
          <span><strong>{guiRepositoryAudits.length}</strong> pinned GUI code audits</span>
          <span><strong>{discoveryWatchlist.length}</strong> watchlist records</span>
          <span><strong>{releaseActivity.length}</strong> stable release feeds</span>
          <span><strong>0</strong> affiliate sources</span>
        </div>

        <div className="data-release-section" id="stable-releases">
          <HomeReleaseActivity records={releaseActivity} />
        </div>

        <section className="data-ranking-section" aria-label="Evidence-based rankings">
          <EvidenceRankingExplorer
            operational={operationalRanking}
            auditability={auditabilityRanking}
            benchmarks={benchmarkRanking}
            benchmarkFamilyCount={benchmarkFamilies}
            unrankedRepositoryCount={supportOnlyRepositories.length}
          />
        </section>

        <section className="data-evidence-section" id="harness-evidence" aria-labelledby="harness-evidence-heading">
          <div className="section-heading stacked-heading">
            <h2 id="harness-evidence-heading">Harness evidence</h2>
            <p>Search classifications and source coverage, then open the canonical harness profile for the complete first-party ledger.</p>
          </div>
          <EvidenceLedger records={ledgerRecords} />
        </section>

        <section className="data-evidence-section" id="gui-evidence" aria-labelledby="gui-evidence-heading">
          <div className="section-heading stacked-heading">
            <h2 id="gui-evidence-heading">GUI evidence</h2>
            <p>Search interface coverage, compatibility, and provenance, then open the canonical GUI profile for the complete evidence ledger.</p>
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
