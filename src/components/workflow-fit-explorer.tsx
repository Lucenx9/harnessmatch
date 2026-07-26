"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import type {
  FeatureKey,
  HarnessLogo as HarnessLogoData,
  RecommendationAnswers,
} from "@/lib/types";

export type WorkflowFitResult = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogoData;
  score: number;
  blockers: FeatureKey[];
  verifiedAt: string;
};

export type WorkflowFitScenario = {
  id: string;
  label: string;
  description: string;
  answers: RecommendationAnswers;
  results: WorkflowFitResult[];
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
  security: "Security",
  autonomy: "Autonomy",
};

const modelLabels: Record<RecommendationAnswers["modelAccess"], string> = {
  subscription: "Subscription",
  "model-agnostic": "Model agnostic",
  local: "Local models",
  enterprise: "Enterprise routing",
};

const controlLabels: Record<RecommendationAnswers["control"], string> = {
  "approval-heavy": "Approval heavy",
  balanced: "Balanced",
  "hands-off": "Hands off",
};

const repoLabels: Record<RecommendationAnswers["repoContext"], string> = {
  small: "Small repository",
  large: "Large repository",
  ci: "CI and automation",
  "multi-agent": "Multi-agent",
};

const featureLabels: Record<FeatureKey, string> = {
  mcp: "MCP",
  localModels: "Local models",
  subagents: "Subagents",
  headless: "Headless",
  browser: "Browser",
  sandbox: "Sandbox",
  checkpoints: "Checkpoints",
};

function escapeCsv(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function scenarioCsv(scenario: WorkflowFitScenario) {
  const rows = [
    ["scenario", "rank", "harness", "fit_points", "required_gaps", "verified_at"],
    ...scenario.results.map((result, index) => [
      scenario.label,
      index + 1,
      result.name,
      result.score,
      result.blockers.map((feature) => featureLabels[feature]).join(", "),
      result.verifiedAt,
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
    ? `${topResult.name} has the highest workflow fit for ${selected.label} at ${topResult.score} points out of 100.`
    : `No active harness data is available for ${selected.label}.`;

  return (
    <div className="workflow-tool">
      <div className="workflow-tool-header">
        <div>
          <h2 id="workflow-fit-title">Workflow fit explorer</h2>
          <p>Select a concrete setup. The bars use sourced harness capabilities and the published recommendation weights.</p>
        </div>
        <span className="workflow-score-unit">Fit points / 100</span>
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
        <div className="workflow-scenario-copy">
          <h3>{selected.label}</h3>
          <p>{selected.description}</p>
        </div>

        <dl className="workflow-factors">
          <div><dt>Interface</dt><dd>{interfaceLabels[selected.answers.interface]}</dd></div>
          <div><dt>Priority</dt><dd>{priorityLabels[selected.answers.priority]}</dd></div>
          <div><dt>Model access</dt><dd>{modelLabels[selected.answers.modelAccess]}</dd></div>
          <div><dt>Control</dt><dd>{controlLabels[selected.answers.control]}</dd></div>
          <div><dt>Repository</dt><dd>{repoLabels[selected.answers.repoContext]}</dd></div>
          <div className="workflow-required-factor">
            <dt>Required</dt>
            <dd>{selected.answers.requiredFeatures.map((feature) => featureLabels[feature]).join(", ") || "None"}</dd>
          </div>
        </dl>

        <p className="sr-only" id="workflow-chart-summary">{chartSummary}</p>
        <div className="workflow-chart" aria-labelledby="workflow-fit-title workflow-chart-summary">
          <div className="workflow-chart-axis" aria-hidden="true">
            <span>Harness</span>
            <span className="workflow-axis-scale"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></span>
            <span>Fit</span>
          </div>
          <ol className="workflow-chart-list">
            {selected.results.map((result) => {
              const gapLabel = result.blockers.length === 0
                ? "No required capability gaps"
                : `${result.blockers.length} required ${result.blockers.length === 1 ? "gap" : "gaps"}: ${result.blockers.map((feature) => featureLabels[feature]).join(", ")}`;

              return (
                <li key={result.id}>
                  <Link
                    className={`workflow-chart-row${result.blockers.length > 0 ? " has-gaps" : ""}`}
                    href={`/harnesses/${result.slug}`}
                    aria-describedby={`workflow-result-${selected.id}-${result.id}`}
                  >
                    <span className="workflow-harness-label">
                      <HarnessLogo logo={result.logo} name={result.name} size="small" />
                      <span>
                        <strong>{result.name}</strong>
                        <small>{result.blockers.length > 0 ? `${result.blockers.length} required ${result.blockers.length === 1 ? "gap" : "gaps"}` : "Requirements met"}</small>
                      </span>
                    </span>
                    <span className="workflow-plot" aria-hidden="true">
                      <span
                        className="workflow-bar-fill"
                        style={{ transform: `scaleX(${result.score / 100})` }}
                      />
                    </span>
                    <strong className="workflow-score">{result.score}</strong>
                  </Link>
                  <span className="sr-only" id={`workflow-result-${selected.id}-${result.id}`}>
                    {result.score} fit points out of 100. {gapLabel}. Opens the evidence profile.
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="workflow-tool-footer">
          <p><strong>Published weights:</strong> interface 20, priority 20, model access 20, control 15, repository context 15, required features 10. Missing requirements subtract 12 points each.</p>
          <div className="workflow-tool-links">
            <a className="text-link" href={csvHref} download={`harnessmatch-${selected.id}.csv`}>Download CSV</a>
            <Link className="text-link" href="/methodology">Methodology</Link>
          </div>
        </div>

        <details className="workflow-table-disclosure">
          <summary>View accessible data table</summary>
          <div className="workflow-table-scroll">
            <table>
              <caption>Workflow fit points for {selected.label}</caption>
              <thead>
                <tr><th scope="col">Rank</th><th scope="col">Harness</th><th scope="col">Fit points</th><th scope="col">Required gaps</th></tr>
              </thead>
              <tbody>
                {selected.results.map((result, index) => (
                  <tr key={result.id}>
                    <td>{index + 1}</td>
                    <th scope="row"><Link href={`/harnesses/${result.slug}`}>{result.name}</Link></th>
                    <td>{result.score}</td>
                    <td>{result.blockers.length > 0 ? result.blockers.map((feature) => featureLabels[feature]).join(", ") : "None"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
