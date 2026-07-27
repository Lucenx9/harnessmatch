"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import { recommendationWeights } from "@/lib/recommendation-config";
import type {
  EligibilityFailure,
  FeatureKey,
  HarnessLogo as HarnessLogoData,
  RankRobustness,
  Recommendation,
  RecommendationAnswers,
} from "@/lib/types";

export type WorkflowFitResult = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogoData;
  score: number;
  fitBand: Recommendation["fitBand"];
  robustness: RankRobustness;
  evidenceState: string;
  evidenceCoverage: "high" | "medium" | "limited";
  evidenceSourceCount: number;
  verifiedAt: string;
  why: string;
  watchOut: string;
};

export type WorkflowExcludedResult = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogoData;
  failures: EligibilityFailure[];
};

export type WorkflowFitScenario = {
  id: string;
  label: string;
  description: string;
  answers: RecommendationAnswers;
  results: WorkflowFitResult[];
  excluded: WorkflowExcludedResult[];
};

const interfaceLabels: Record<RecommendationAnswers["interface"], string> = {
  terminal: "Terminal",
  ide: "IDE",
  web: "Web",
  automation: "Automation",
};

const priorityLabels: Record<RecommendationAnswers["priority"], string> = {
  simplicity: "Simplicity",
  flexibility: "Flexibility",
  security: "Execution safety",
  autonomy: "Autonomy",
};

const modelLabels: Record<RecommendationAnswers["modelAccess"], string> = {
  subscription: "Subscription",
  "model-agnostic": "Multiple model providers",
  local: "Local models",
  enterprise: "Enterprise access",
};

const controlLabels: Record<RecommendationAnswers["control"], string> = {
  "approval-heavy": "Review most actions",
  balanced: "Review risky actions",
  "hands-off": "Let it run",
};

const scopeLabels: Record<RecommendationAnswers["changeScope"], string> = {
  focused: "Focused change",
  "cross-file": "Cross-file",
  "large-repo": "Repository-wide",
};

const operatingModeLabels: Record<RecommendationAnswers["operatingMode"], string> = {
  interactive: "Work together",
  ci: "Run unattended",
  parallel: "Split across agents",
};

const featureLabels: Record<FeatureKey, string> = {
  mcp: "External tools (MCP)",
  localModels: "Local models",
  subagents: "Agent parallelism",
  headless: "Runs without an open UI",
  browser: "Browser control",
  sandbox: "Isolated execution",
  checkpoints: "Undo file changes",
};

function escapeCsv(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function eligibilityFailureLabel(failure: EligibilityFailure) {
  if (failure.kind === "product-layer") return `Catalog scope: ${failure.label}`;
  if (failure.kind === "membership") return `Membership evidence: ${failure.label}`;
  return `Workflow requirement: ${failure.label}`;
}

function scenarioCsv(scenario: WorkflowFitScenario) {
  const rows = [
    ["scenario", "status", "rank", "harness", "reference_preference_index", "fit_band", "top_3_sensitivity_percent", "mean_rank", "why", "evidence_state", "evidence_sources", "verified_at", "failed_gates"],
    ...scenario.results.map((result, index) => [
      scenario.label,
      "eligible",
      index + 1,
      result.name,
      result.score,
      result.fitBand,
      result.robustness.topThreeFrequency,
      result.robustness.meanRank,
      result.why,
      result.evidenceState,
      result.evidenceSourceCount,
      result.verifiedAt,
      "",
    ]),
    ...scenario.excluded.map((result) => [
      scenario.label,
      "not-eligible-on-current-evidence",
      "",
      result.name,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      result.failures.map(eligibilityFailureLabel).join(", "),
    ]),
  ];

  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

export function WorkflowFitExplorer({ scenarios }: { scenarios: WorkflowFitScenario[] }) {
  const [selectedId, setSelectedId] = useState(scenarios[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0];

  if (!selected) return null;

  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(scenarioCsv(selected))}`;
  const chartResults = selected.results.slice(0, 7);
  const totalProducts = selected.results.length + selected.excluded.length;

  const selectTab = (index: number) => {
    const next = scenarios[index];
    if (!next) return;
    setSelectedId(next.id);
    tabRefs.current[index]?.focus();
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectTab((index + 1) % scenarios.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectTab((index - 1 + scenarios.length) % scenarios.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(scenarios.length - 1);
    }
  };

  const topResult = selected.results[0];
  const chartSummary = topResult
    ? `${topResult.name} is the strongest match for this workflow and stays in the top three in ${topResult.robustness.topThreeFrequency} percent of tested priority variations.`
    : `No active harness data is available for ${selected.label}.`;

  return (
    <div className="workflow-tool">
      <div className="workflow-tool-header">
        <div>
          <h2 id="workflow-fit-title">Choose a workflow</h2>
          <p>Start with a familiar setup. See the strongest match and what to check before choosing.</p>
        </div>
      </div>

      <div className="workflow-tabs" role="tablist" aria-label="Workflow scenarios">
        {scenarios.map((scenario, index) => (
          <button
            type="button"
            role="tab"
            id={`workflow-tab-${scenario.id}`}
            aria-controls="workflow-fit-panel"
            aria-selected={selected.id === scenario.id}
            tabIndex={selected.id === scenario.id ? 0 : -1}
            key={scenario.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            onClick={() => setSelectedId(scenario.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            {scenario.label}
          </button>
        ))}
      </div>

      <div
        className="workflow-panel"
        id="workflow-fit-panel"
        role="tabpanel"
        aria-labelledby={`workflow-tab-${selected.id}`}
      >
        <div className="workflow-scenario-overview">
          <p>{selected.description}</p>
        </div>

        <dl className="workflow-quick-facts" aria-label="Key workflow assumptions">
          <div><dt>Interface</dt><dd>{interfaceLabels[selected.answers.interface]}</dd></div>
          <div><dt>Model access</dt><dd>{modelLabels[selected.answers.modelAccess]}</dd></div>
          <div><dt>Control</dt><dd>{controlLabels[selected.answers.control]}</dd></div>
        </dl>

        {topResult && (
          <section className="workflow-decision-summary" aria-label={`Recommended starting point: ${topResult.name}`}>
            <div className="workflow-decision-product">
              <span>Start here</span>
              <Link href={`/harnesses/${topResult.slug}`}>
                <HarnessLogo logo={topResult.logo} name={topResult.name} size="small" />
                <strong>{topResult.name}</strong>
              </Link>
              <small>{topResult.fitBand} workflow match. Top three in {topResult.robustness.topThreeFrequency}% of priority variations.</small>
            </div>
            <div>
              <span>Why it fits</span>
              <p>{topResult.why}</p>
            </div>
            <div>
              <span>Check before choosing</span>
              <p>{topResult.watchOut}</p>
            </div>
          </section>
        )}

        <p className="sr-only" id="workflow-chart-summary">{chartSummary}</p>
        <section className="workflow-chart" aria-labelledby="workflow-fit-title workflow-chart-summary">
          <div className="workflow-chart-axis" aria-hidden="true">
            <span>Harness</span>
            <span className="workflow-axis-scale"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></span>
            <span>Stays top 3</span>
          </div>
          <ol className="workflow-chart-list">
            {chartResults.map((result) => {
              return (
                <li key={result.id}>
                  <Link
                    className="workflow-chart-row"
                    href={`/harnesses/${result.slug}`}
                    aria-describedby={`workflow-result-${selected.id}-${result.id}`}
                  >
                    <span className="workflow-harness-label">
                      <HarnessLogo logo={result.logo} name={result.name} size="small" />
                      <span>
                        <strong>{result.name}</strong>
                        <small>{result.fitBand} match, evidence: {result.evidenceState}</small>
                      </span>
                    </span>
                    <span className="workflow-plot" aria-hidden="true">
                      <span
                        className="workflow-bar-fill"
                        style={{ transform: `scaleX(${result.robustness.topThreeFrequency / 100})` }}
                      />
                    </span>
                    <strong className="workflow-score">{result.robustness.topThreeFrequency}%</strong>
                  </Link>
                  <span className="sr-only" id={`workflow-result-${selected.id}-${result.id}`}>
                    {result.fitBand} match. Top three in {result.robustness.topThreeFrequency} percent of 512 tested priority variations, with rank range {result.robustness.bestRank} to {result.robustness.worstRank}. Catalog membership and every must-have have current supporting documentation. Evidence state: {result.evidenceState}. Opens the evidence profile.
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="workflow-progressive-disclosures">
          <details className="workflow-assumptions">
            <summary>
              <strong>View all 7 assumptions</strong>
              <span>Priority, scope, work mode, and must-haves</span>
            </summary>
            <dl className="workflow-factors">
              <div><dt>Interface</dt><dd>{interfaceLabels[selected.answers.interface]}</dd></div>
              <div><dt>Priority</dt><dd>{priorityLabels[selected.answers.priority]}</dd></div>
              <div><dt>Model access</dt><dd>{modelLabels[selected.answers.modelAccess]}</dd></div>
              <div><dt>Control</dt><dd>{controlLabels[selected.answers.control]}</dd></div>
              <div><dt>Change scope</dt><dd>{scopeLabels[selected.answers.changeScope]}</dd></div>
              <div><dt>Operating mode</dt><dd>{operatingModeLabels[selected.answers.operatingMode]}</dd></div>
              <div className="workflow-required-factor">
                <dt>Required</dt>
                <dd>{selected.answers.requiredFeatures.map((feature) => featureLabels[feature]).join(", ") || "None"}</dd>
              </div>
            </dl>
          </details>

          <details className="workflow-explainer">
            <summary>
              <strong>How this ranking works</strong>
              <span>Ordering, stability, and deal-breakers</span>
            </summary>
            <section className="workflow-reading-key" aria-label="How to read the ranking">
              <p><strong>Why this order</strong><span>Tools that fit your priorities appear first.</span></p>
              <p><strong>Stability</strong><span>How often a tool stays near the top when your priorities change slightly.</span></p>
              <p><strong>Deal-breakers</strong><span>Neighboring product layers and tools without current evidence for one are left out instead of receiving a lower score.</span></p>
            </section>
            <p className="workflow-method-copy">
              We first require documented coding-harness membership, then remove tools without current documentation for a must-have. The remaining products are ordered using published reference weights: main priority {recommendationWeights.priority}, approval style {recommendationWeights.control}, change size {recommendationWeights.changeScope}, and work mode {recommendationWeights.operatingMode}. We then vary those priorities 512 ways. The percentage is a stability check, not a task success rate.
            </p>
          </details>
        </div>

        <div className="workflow-tool-footer">
          <div className="workflow-tool-links">
            <Link className="text-link" href="/recommend">Answer 7 quick questions</Link>
            <a className="text-link" href={csvHref} download={`harnessmatch-${selected.id}.csv`}>Download CSV</a>
            <Link className="text-link" href="/methodology">Methodology</Link>
          </div>
        </div>

        <details className="complete-ranking ranking-disclosure">
          <summary className="complete-ranking-header">
            <div>
              <h3>See all {selected.results.length} eligible harnesses</h3>
              <p>{selected.results.length} of {totalProducts} active catalog entries pass coding-harness membership and every must-have in this workflow.</p>
            </div>
            <span className="ranking-disclosure-label" aria-hidden="true" />
          </summary>
          <ol className="ranking-list">
            {selected.results.map((result, index) => (
              <li key={result.id}>
                <Link className="ranking-row" href={`/harnesses/${result.slug}`}>
                  <span className="ranking-rank">{index + 1}</span>
                  <span className="ranking-identity">
                    <HarnessLogo logo={result.logo} name={result.name} size="small" />
                    <strong>{result.name}</strong>
                  </span>
                  <span className="ranking-why">{result.why}</span>
                  <strong className="ranking-score">Top 3 in {result.robustness.topThreeFrequency}%</strong>
                  <span className="ranking-evidence">{result.fitBand} match, average position {result.robustness.meanRank}, {result.evidenceState}</span>
                </Link>
              </li>
            ))}
          </ol>
        </details>

        {selected.excluded.length > 0 && (
          <details className="ranking-exclusions">
            <summary>Why {selected.excluded.length} harnesses do not match</summary>
            <p>These products are not ranked because they are outside the default coding-harness layer or at least one required condition is not currently documented.</p>
            <ul className="exclusion-list">
              {selected.excluded.map((result) => (
                <li key={result.id}>
                  <Link href={`/harnesses/${result.slug}`}>
                    <span className="ranking-identity">
                      <HarnessLogo logo={result.logo} name={result.name} size="small" />
                      <strong>{result.name}</strong>
                    </span>
                    <span>{result.failures.map(eligibilityFailureLabel).join("; ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
