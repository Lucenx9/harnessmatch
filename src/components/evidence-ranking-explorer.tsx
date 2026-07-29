"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { ArchitectureLevelIndicator } from "@/components/architecture-level-indicator";
import { HarnessLogo } from "@/components/harness-logo";
import { architectureAxisLabels, architectureLevelAnchors } from "@/lib/evaluation";
import type { ArchitectureAxis, ArchitectureProfile, HarnessLogo as HarnessLogoData } from "@/lib/types";

export type OperationalRankingRow = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogoData;
  levels: ArchitectureProfile;
  documentedAxes: number;
  evidenceSources: number;
  verifiedAt: string;
};

export type AuditabilityRankingRow = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogoData;
  artifactCount: number;
  sourceScope: "full-source" | "client-source";
  passedSignals: number;
  repositoryUrl: string;
  inspectedRef: string;
};

export type BenchmarkRankingRow = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogoData;
  score: number;
  harnessVersion: string;
  model: string;
  reasoningEffort: string;
  totalCostUsd: number;
  standardError: number;
  intervalLower: number;
  intervalUpper: number;
  onParetoFrontier: boolean;
  inTopIntervalGroup: boolean;
  totalTrials: number;
  integrityAdjustmentPercent: number;
  runDate: string;
  resultSourceUrl: string;
};

type Props = {
  operational: OperationalRankingRow[];
  auditability: AuditabilityRankingRow[];
  benchmarks: BenchmarkRankingRow[];
  benchmarkFamilyCount: number;
  unrankedRepositoryCount: number;
};

type ViewId = "operational" | "auditability" | "benchmarks";
type OperationalLens = ArchitectureAxis;

const viewLabels: Record<ViewId, string> = {
  operational: "Operational mechanisms",
  auditability: "Public artifacts",
  benchmarks: "Benchmark evidence",
};

const operationalLensLabels = architectureAxisLabels;

function escapeCsv(value: string | number | boolean) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function compactLeaderNames(rows: Array<{ name: string }>) {
  const names = rows.map((row) => row.name);
  if (names.length === 0) return "No comparable records";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.length} harnesses`;
}

export function EvidenceRankingExplorer({
  operational,
  auditability,
  benchmarks,
  benchmarkFamilyCount,
  unrankedRepositoryCount,
}: Props) {
  const [view, setView] = useState<ViewId>("operational");
  const [operationalLens, setOperationalLens] = useState<OperationalLens>("verification");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const views = Object.keys(viewLabels) as ViewId[];

  const operationalRows = useMemo(() => operational
    .map((row) => ({
      ...row,
      level: row.levels[operationalLens],
    }))
    .filter((row): row is typeof row & { level: number } => row.level !== null)
    .sort((a, b) => b.level - a.level || a.name.localeCompare(b.name)), [operational, operationalLens]);

  const sortedAuditability = useMemo(
    () => [...auditability].sort((a, b) => b.artifactCount - a.artifactCount || a.name.localeCompare(b.name)),
    [auditability],
  );
  const sortedBenchmarks = useMemo(
    () => [...benchmarks].sort((a, b) => b.score - a.score),
    [benchmarks],
  );
  const operationalLeaderLevel = operationalRows[0]?.level;
  const operationalLeaders = operationalLeaderLevel === undefined
    ? []
    : operationalRows.filter((row) => row.level === operationalLeaderLevel);
  const auditabilityLeaderCount = sortedAuditability[0]?.artifactCount;
  const auditabilityLeaders = auditabilityLeaderCount === undefined
    ? []
    : sortedAuditability.filter((row) => row.artifactCount === auditabilityLeaderCount);
  const topBenchmark = sortedBenchmarks[0];
  const highlightViews: Array<{
    id: ViewId;
    label: string;
    value: ReactNode;
    unit: string;
    headline: string;
    detail: string;
  }> = [
    {
      id: "operational",
      label: viewLabels.operational,
      value: operationalLeaderLevel === undefined
        ? "N/A"
        : <ArchitectureLevelIndicator axis={operationalLens} level={operationalLeaderLevel} />,
      unit: operationalLeaderLevel === undefined
        ? "no comparable record"
        : architectureLevelAnchors[operationalLens][operationalLeaderLevel],
      headline: operationalLeaders.length > 0
        ? `${compactLeaderNames(operationalLeaders)} ${operationalLeaders.length === 1 ? "leads" : "share the lead"}`
        : "No documented leader",
      detail: `${operationalLensLabels[operationalLens]} lens, ${operationalRows.length} comparable records`,
    },
    {
      id: "auditability",
      label: viewLabels.auditability,
      value: auditabilityLeaderCount === undefined ? "N/A" : `${auditabilityLeaderCount}/5`,
      unit: "public artifacts",
      headline: auditabilityLeaders.length > 0
        ? `${compactLeaderNames(auditabilityLeaders)} ${auditabilityLeaders.length === 1 ? "leads" : "share the lead"}`
        : "No ranked repository",
      detail: `${sortedAuditability.length} repositories ranked at pinned commits`,
    },
    {
      id: "benchmarks",
      label: viewLabels.benchmarks,
      value: benchmarkFamilyCount,
      unit: benchmarkFamilyCount === 1 ? "benchmark family" : "benchmark families",
      headline: topBenchmark
        ? `Highest observed: ${topBenchmark.name}`
        : "No measured configuration",
      detail: topBenchmark
        ? `${sortedBenchmarks.length} exact configurations. Not a general harness ranking.`
        : "No exact systems are available",
    },
  ];
  const selectedCount = view === "operational"
    ? operationalRows.length
    : view === "auditability"
      ? sortedAuditability.length
      : sortedBenchmarks.length;
  const allRows = view === "operational"
    ? operationalRows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        logo: row.logo,
        score: (row.level / 4) * 100,
        displayValue: architectureLevelAnchors[operationalLens][row.level] ?? "Documented mechanism",
        operationalLevel: row.level,
        meta: `${architectureLevelAnchors[operationalLens][row.level] ?? "Documented mechanism"}, ${row.documentedAxes}/7 layers, ${row.evidenceSources} sources`,
        href: `/harnesses/${row.slug}`,
        external: false,
        benchmarkDetail: "",
      }))
    : view === "auditability"
      ? sortedAuditability.map((row) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          logo: row.logo,
          score: (row.artifactCount / 5) * 100,
          displayValue: `${row.artifactCount}/5`,
          operationalLevel: null,
          meta: `${row.passedSignals}/5 artifacts, ${row.sourceScope === "full-source" ? "full source" : "client source"}`,
          href: `/harnesses/${row.slug}`,
          external: false,
          benchmarkDetail: "",
        }))
      : sortedBenchmarks.map((row) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          logo: row.logo,
          score: row.score,
          displayValue: `${row.score.toFixed(1)}%`,
          operationalLevel: null,
          meta: `${row.model}, harness ${row.harnessVersion}`,
          href: row.resultSourceUrl,
          external: true,
          benchmarkDetail: `95% descriptive interval ${row.intervalLower.toFixed(1)}-${row.intervalUpper.toFixed(1)}. ${row.onParetoFrontier ? "Accuracy/cost Pareto frontier" : "Dominated on accuracy/cost"}. ${row.inTopIntervalGroup ? "Overlaps the top interval" : "Outside the top interval group"}. ${row.totalTrials} trials, $${row.totalCostUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        }));
  const chartRows = allRows.slice(0, view === "benchmarks" ? 6 : 10);
  const description = view === "operational"
    ? "How much documented runtime support each harness provides for the selected mechanism. These ordered levels are never summed into a universal product grade."
    : view === "auditability"
      ? "How many of five public engineering artifacts could be verified at a pinned commit. This measures inspectability, not product quality."
      : "Observed results for exact harness, version, model, effort, budget, and date combinations within one benchmark family. They do not measure overall harness quality.";

  const csvRows = view === "operational"
    ? [
        ["order", "harness", "architecture_layer", "documented_level", "level_anchor", "documented_layers", "evidence_sources", "verified_at"],
        ...operationalRows.map((row, index) => [index + 1, row.name, operationalLensLabels[operationalLens], row.level, architectureLevelAnchors[operationalLens][row.level] ?? "", row.documentedAxes, row.evidenceSources, row.verifiedAt]),
      ]
    : view === "auditability"
      ? [
          ["order", "harness", "public_artifacts_present", "source_scope", "inspected_ref", "repository"],
          ...sortedAuditability.map((row, index) => [index + 1, row.name, row.artifactCount, row.sourceScope, row.inspectedRef, row.repositoryUrl]),
        ]
      : [
          ["rank", "harness", "harness_version", "model", "effort", "accuracy", "standard_error", "interval_95_lower", "interval_95_upper", "pareto_frontier", "top_interval_group", "trials", "cost_usd", "integrity_adjustment_percent", "date", "source"],
          ...sortedBenchmarks.map((row, index) => [index + 1, row.name, row.harnessVersion, row.model, row.reasoningEffort, row.score, row.standardError, row.intervalLower, row.intervalUpper, row.onParetoFrontier, row.inTopIntervalGroup, row.totalTrials, row.totalCostUsd, row.integrityAdjustmentPercent, row.runDate, row.resultSourceUrl]),
        ];
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csvRows.map((row) => row.map(escapeCsv).join(",")).join("\n"))}`;

  const selectTab = (index: number) => {
    const next = views[index];
    if (!next) return;
    setView(next);
    tabRefs.current[index]?.focus();
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectTab((index + 1) % views.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectTab((index - 1 + views.length) % views.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(views.length - 1);
    }
  };

  const topRow = chartRows[0];
  const summary = topRow
    ? `${topRow.name} is first in the selected ${viewLabels[view].toLowerCase()} view: ${topRow.displayValue}.`
    : `No records are available in the selected ${viewLabels[view].toLowerCase()} view.`;

  return (
    <div className="evidence-ranking-tool">
      <header className="evidence-ranking-header">
        <div>
          <h2>Compare the evidence.</h2>
          <p>HarnessMatch recommendations use workflow fit. These views compare documented mechanisms, source auditability, and measured configurations separately, without combining them into one score.</p>
        </div>
        <Link className="text-link" href="/methodology">Definitions and weights</Link>
      </header>

      <div className="evidence-highlight-tabs" role="tablist" aria-label="Evidence highlights">
        {highlightViews.map((item, index) => (
          <button
            type="button"
            role="tab"
            id={`evidence-ranking-tab-${item.id}`}
            aria-controls="evidence-ranking-panel"
            aria-selected={view === item.id}
            tabIndex={view === item.id ? 0 : -1}
            key={item.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            onClick={() => setView(item.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            <span className="evidence-highlight-label">{item.label}</span>
            <span className="evidence-highlight-reading">
              <span className="evidence-highlight-value">
                {typeof item.value === "string" ? <strong>{item.value}</strong> : item.value}
                <small>{item.unit}</small>
              </span>
              <span className="evidence-highlight-copy">
                <b>{item.headline}</b>
                <small>{item.detail}</small>
              </span>
            </span>
            <span className="evidence-highlight-action">
              {view === item.id ? "Viewing ranking" : "View ranking"}
            </span>
          </button>
        ))}
      </div>

      <section
        className="evidence-ranking-panel"
        id="evidence-ranking-panel"
        role="tabpanel"
        aria-labelledby={`evidence-ranking-tab-${view}`}
      >
        <div className="evidence-ranking-context">
          <div className="evidence-ranking-meaning">
            <span>What this view shows</span>
            <p>{description}</p>
          </div>
          {view === "operational" && (
            <label>
              <span>Operational lens</span>
              <select value={operationalLens} onChange={(event) => setOperationalLens(event.target.value as OperationalLens)}>
                {(Object.keys(operationalLensLabels) as OperationalLens[]).map((lens) => (
                  <option value={lens} key={lens}>{operationalLensLabels[lens]}</option>
                ))}
              </select>
            </label>
          )}
          {view === "auditability" && unrankedRepositoryCount > 0 && (
            <p className="ranking-caveat">{unrankedRepositoryCount} support-only repositories are shown on profiles but remain unranked.</p>
          )}
        </div>

        <p className="sr-only" id="evidence-ranking-summary">{summary}</p>
        <div className="evidence-bar-chart" aria-describedby="evidence-ranking-summary">
          <div className="evidence-chart-axis" aria-hidden="true">
            <span>Configuration</span>
            <span>
              {view === "operational"
                ? <><i>Lower support</i><i /><i /><i /><i>Higher support</i></>
                : view === "auditability"
                  ? <><i>0</i><i /><i /><i /><i>5</i></>
                  : <><i>0</i><i>25</i><i>50</i><i>75</i><i>100</i></>}
            </span>
            <span>{view === "benchmarks" ? "Accuracy" : view === "auditability" ? "Artifacts" : "Mechanism"}</span>
          </div>
          <ol>
            {chartRows.map((row) => {
              const content = (
                <>
                  <span className="evidence-row-identity">
                    <HarnessLogo logo={row.logo} name={row.name} size="small" />
                    <span>
                      <strong>{row.name}</strong>
                      <small>
                        {row.meta}
                      </small>
                    </span>
                  </span>
                  <span className="evidence-row-plot" aria-hidden="true">
                    <span style={{ transform: `scaleX(${row.score / 100})` }} />
                  </span>
                  <strong className="evidence-row-score">
                    {row.operationalLevel === null
                      ? row.displayValue
                      : <ArchitectureLevelIndicator axis={operationalLens} level={row.operationalLevel} compact />}
                  </strong>
                </>
              );

              return (
                <li key={row.id}>
                  {row.external
                    ? <a className="evidence-chart-row" href={row.href} target="_blank" rel="noreferrer">{content}</a>
                    : <Link className="evidence-chart-row" href={row.href}>{content}</Link>}
                  {row.benchmarkDetail && <p className="benchmark-row-meta">{row.benchmarkDetail}</p>}
                </li>
              );
            })}
          </ol>
        </div>

        {allRows.length > chartRows.length && (
          <details className="evidence-complete-ranking">
            <summary>Show the complete {allRows.length}-record ranking</summary>
            <ol>
              {allRows.map((row, index) => (
                <li key={row.id}>
                  <span>{index + 1}</span>
                  {row.external
                    ? <a href={row.href} target="_blank" rel="noreferrer">{row.name}</a>
                    : <Link href={row.href}>{row.name}</Link>}
                  <strong>
                    {row.operationalLevel === null
                      ? row.displayValue
                      : <ArchitectureLevelIndicator axis={operationalLens} level={row.operationalLevel} compact />}
                  </strong>
                </li>
              ))}
            </ol>
          </details>
        )}

        <footer className="evidence-ranking-footer">
          <p>{selectedCount} comparable records. Missing evidence is never renormalized into a better result.</p>
          <div>
            <a className="text-link" href={csvHref} download={`harnessmatch-${view}.csv`}>Download CSV</a>
            {view === "benchmarks" && <Link className="text-link" href="/benchmarks">Inspect run metadata</Link>}
          </div>
        </footer>
      </section>
    </div>
  );
}
