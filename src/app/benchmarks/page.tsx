import type { Metadata } from "next";
import Link from "next/link";
import { HarnessLogo } from "@/components/harness-logo";
import { benchmarkRuns } from "@/data/benchmark-runs";
import { harnesses } from "@/data/harnesses";
import { researchSources } from "@/data/research";
import {
  benchmarkConfidenceInterval95,
  benchmarkParetoFrontier,
  benchmarkTopIntervalGroup,
  costPerSuccessfulTrial,
} from "@/lib/evaluation";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Measured systems",
  description:
    "Compare measured AI coding configurations with exact harness and model versions, budgets, environments, attempts, costs, and sources.",
  path: "/benchmarks",
});

const requiredFields = [
  "Exact harness version and model",
  "Benchmark and dataset version",
  "Reasoning effort and token usage",
  "Sandbox, network, and budget policy",
  "Tasks, attempts, and total trials",
  "Cost, duration, run date, and primary source",
  "Integrity review and disqualified trials",
];

const benchmarkResearchUrls = new Set([
  "https://arxiv.org/abs/2601.11868",
  "https://arxiv.org/abs/2605.13357",
  "https://arxiv.org/abs/2602.22480",
  "https://openreview.net/forum?id=vUaY1t64ZZ",
  "https://arxiv.org/abs/2505.20411",
]);

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function BenchmarksPage() {
  const harnessById = new Map(harnesses.map((harness) => [harness.id, harness]));
  const sortedRuns = [...benchmarkRuns].sort((a, b) => b.accuracy - a.accuracy);
  const paretoFrontier = benchmarkParetoFrontier(sortedRuns);
  const topIntervalGroup = benchmarkTopIntervalGroup(sortedRuns);
  const benchmarkResearch = researchSources.filter((source) => benchmarkResearchUrls.has(source.url));

  return (
    <section className="section page-section benchmark-page">
      <div className="wide-shell shell">
        <header className="page-intro benchmark-intro">
          <h1>Compare measured configurations.</h1>
          <p>Results belong to an exact model, harness version, environment, budget, and run policy.</p>
        </header>

        <section className="benchmark-ranking" aria-labelledby="benchmark-ranking-title">
          <div className="benchmark-ranking-heading">
            <div>
              <h2 id="benchmark-ranking-title">Terminal-Bench 2.1</h2>
              <p>Accuracy after integrity review. 89 tasks, five attempts per task, 445 trials per configuration.</p>
            </div>
            <a className="text-link" href="https://www.tbench.ai/leaderboard/terminal-bench/2.1" target="_blank" rel="noreferrer">Official leaderboard</a>
          </div>

          <div className="benchmark-chart">
            <div className="evidence-chart-axis" aria-hidden="true">
              <span>System configuration</span>
              <span><i>0</i><i>25</i><i>50</i><i>75</i><i>100</i></span>
              <span>Accuracy</span>
            </div>
            <ol>
              {sortedRuns.map((run) => {
                const harness = harnessById.get(run.harnessId);
                if (!harness) return null;
                const interval = benchmarkConfidenceInterval95(run);
                return (
                  <li key={run.id}>
                    <a className="evidence-chart-row" href={run.resultSourceUrl} target="_blank" rel="noreferrer">
                      <span className="evidence-row-identity">
                        <HarnessLogo logo={harness.logo} name={harness.name} size="small" />
                        <span>
                          <strong>{harness.name}</strong>
                          <small>{run.model}, harness {run.harnessVersion}</small>
                        </span>
                      </span>
                      <span className="evidence-row-plot" aria-hidden="true">
                        <span style={{ transform: `scaleX(${run.accuracy / 100})` }} />
                        <i
                          className="benchmark-confidence-range"
                          style={{ left: `${interval.lower}%`, width: `${interval.upper - interval.lower}%` }}
                        />
                      </span>
                      <strong className="evidence-row-score">{run.accuracy.toFixed(2)}</strong>
                    </a>
                    <p className="benchmark-row-meta">95% descriptive interval {interval.lower.toFixed(1)}-{interval.upper.toFixed(1)}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="benchmark-record-section" aria-labelledby="benchmark-record-title">
          <div className="benchmark-ranking-heading">
            <div>
              <h2 id="benchmark-record-title">Reproducibility records</h2>
              <p>Open a record to inspect budget, environment, token use, source, and integrity handling.</p>
            </div>
          </div>
          <div className="benchmark-record-list">
            {sortedRuns.map((run) => {
              const harness = harnessById.get(run.harnessId);
              if (!harness) return null;
              const interval = benchmarkConfidenceInterval95(run);
              const costPerSuccess = costPerSuccessfulTrial(run);
              return (
                <details key={run.id}>
                  <summary>
                    <span>{harness.name} {run.harnessVersion}</span>
                    <strong>{run.accuracy.toFixed(2)}%, 95% interval {interval.lower.toFixed(1)}-{interval.upper.toFixed(1)}</strong>
                  </summary>
                  <div className="benchmark-record-body">
                    <dl>
                      <div><dt>Model</dt><dd>{run.model}</dd></div>
                      <div><dt>Reasoning effort</dt><dd>{run.reasoningEffort}</dd></div>
                      <div><dt>Benchmark</dt><dd>{run.benchmark} {run.benchmarkVersion}</dd></div>
                      <div><dt>Attempts</dt><dd>{run.taskCount} tasks × {run.attemptsPerTask} = {run.totalTrials} trials</dd></div>
                      <div><dt>Cost</dt><dd>${run.totalCostUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</dd></div>
                      <div><dt>Cost / observed success</dt><dd>{costPerSuccess === null ? "N/A" : `$${costPerSuccess.toFixed(2)}`}</dd></div>
                      <div><dt>Accuracy/cost frontier</dt><dd>{paretoFrontier.has(run.id) ? "Non-dominated" : "Dominated by another admitted system"}</dd></div>
                      <div><dt>Top interval group</dt><dd>{topIntervalGroup.has(run.id) ? "Overlaps leading 95% interval" : "Does not overlap leading interval"}</dd></div>
                      <div><dt>Average duration</dt><dd>{run.averageTrialDurationSeconds.toFixed(1)} seconds per trial</dd></div>
                      <div><dt>Tokens</dt><dd>{formatNumber(run.tokenUsage.uncachedInput)} input, {formatNumber(run.tokenUsage.cachedInput)} cached, {formatNumber(run.tokenUsage.output)} output</dd></div>
                      <div><dt>Integrity review</dt><dd>{run.disqualifiedTrials} disqualified trials, {run.integrityAdjustmentPercent.toFixed(2)}% adjustment</dd></div>
                      <div><dt>Run date</dt><dd>{run.runDate}</dd></div>
                      <div><dt>Verified</dt><dd>{run.verifiedAt}</dd></div>
                    </dl>
                    <div className="benchmark-protocol-copy">
                      <p><strong>Environment:</strong> {run.environment}</p>
                      <p><strong>Network:</strong> {run.networkPolicy}</p>
                      <p><strong>Budget:</strong> {run.budgetPolicy}</p>
                    </div>
                    <div className="benchmark-source-links">
                      <a className="text-link" href={run.resultSourceUrl} target="_blank" rel="noreferrer">Result JSON</a>
                      <a className="text-link" href={run.submissionUrl} target="_blank" rel="noreferrer">Submission review</a>
                      <a className="text-link" href={run.benchmarkSourceUrl} target="_blank" rel="noreferrer">Dataset repository</a>
                      <Link className="text-link" href={`/harnesses/${harness.slug}`}>Harness profile</Link>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <section className="benchmark-policy-grid">
          <div>
            <h2>Admission fields</h2>
            <ul className="check-list large-list">
              {requiredFields.map((field) => <li key={field}>{field}</li>)}
            </ul>
          </div>
          <div>
            <h2>Claim boundary</h2>
            <p>The same harness can move when the model, effort, version, task set, budget, or integrity policy changes.</p>
            <div className="formula">result = model × harness × config × environment × budget</div>
            <p>HarnessMatch never copies this accuracy into workflow fit, operational readiness, or code auditability.</p>
            <p>The displayed 95% interval is a normal approximation from the reported standard error. It is descriptive, not a task-cluster-corrected equivalence test.</p>
          </div>
        </section>

        <section className="prose-section benchmark-research">
          <h2>Research behind the policy</h2>
          <p>These papers define reproducibility, episode traces, cost-aware evaluation, versioning, and contamination controls.</p>
          <div className="evidence-list">
            {benchmarkResearch.map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                <span>
                  <strong>{source.title}</strong>
                  <small>{source.supports}</small>
                </span>
                <span className="evidence-kind">{source.venue}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
