import Link from "next/link";
import type { BenchmarkRun } from "@/data/benchmark-runs";
import {
  repositoryArtifactCount,
  repositoryArtifactLabels,
  type RepositoryAudit,
} from "@/data/repository-audits";
import { benchmarkConfidenceInterval95 } from "@/lib/evaluation";

type HarnessMeasurementSectionProps = {
  repositoryAudit: RepositoryAudit | undefined;
  measuredRuns: BenchmarkRun[];
};

export function HarnessMeasurementSection({ repositoryAudit, measuredRuns }: HarnessMeasurementSectionProps) {
  const artifactCount = repositoryAudit ? repositoryArtifactCount(repositoryAudit) : null;

  return (
    <section className="profile-measurement-grid" aria-label="Public audit and measured configurations">
      <article>
        <h2>Public code audit</h2>
        {!repositoryAudit && <p>No official public repository was located for a code-level audit.</p>}
        {repositoryAudit && (
          <>
            <div className="profile-measurement-value">
              <strong>{artifactCount === null ? "Unranked" : `${artifactCount}/5`}</strong>
              <span>{artifactCount === null ? "support-only repository" : "public artifacts present"}</span>
            </div>
            <dl className="profile-audit-signals">
              {(Object.keys(repositoryArtifactLabels) as Array<keyof typeof repositoryArtifactLabels>).map((signal) => (
                <div key={signal}>
                  <dt>{repositoryArtifactLabels[signal]}</dt>
                  <dd>{repositoryAudit.signals[signal] ? "Present at inspected commit" : "Not found"}</dd>
                </div>
              ))}
            </dl>
            <p>{repositoryAudit.limitation}</p>
            <a className="text-link" href={`${repositoryAudit.repositoryUrl}/tree/${repositoryAudit.inspectedRef}`} target="_blank" rel="noreferrer">Inspect commit {repositoryAudit.inspectedRef}, checked {repositoryAudit.verifiedAt}</a>
          </>
        )}
      </article>
      <article>
        <h2>Measured configurations</h2>
        {measuredRuns.length === 0 && <p>No benchmark run passes the full metadata admission policy for this harness yet. Missing data is not scored as zero.</p>}
        {measuredRuns.map((run) => {
          const interval = benchmarkConfidenceInterval95(run);
          return (
            <div className="profile-benchmark-record" key={run.id}>
              <div className="profile-measurement-value">
                <strong>{run.accuracy.toFixed(2)}%</strong>
                <span>95% descriptive interval {interval.lower.toFixed(1)}-{interval.upper.toFixed(1)}</span>
              </div>
              <p>{run.model}, harness {run.harnessVersion}, {run.reasoningEffort} effort, {run.totalTrials} trials, ${run.totalCostUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}. Result source checked {run.verifiedAt}.</p>
              <a className="text-link" href={run.resultSourceUrl} target="_blank" rel="noreferrer">Open official result</a>
            </div>
          );
        })}
        <Link className="text-link" href="/benchmarks">Benchmark policy and all runs</Link>
      </article>
    </section>
  );
}
