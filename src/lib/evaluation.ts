import { getOperationalProfileRecord } from "../data/operational-profiles";
import { benchmarkRuns } from "../data/benchmark-runs";
import { repositoryAuditForHarness } from "../data/repository-audits";
import { operationalPostureScores } from "./recommendation-config";
import type { BenchmarkRun } from "../data/benchmark-runs";
import type {
  ArchitectureAxis,
  ArchitectureProfile,
  EvidenceStateSummary,
  Harness,
  OperationalAxis,
  OperationalProfile,
} from "./types";

export const operationalReadinessWeights: Record<OperationalAxis, number> = {
  context: 20,
  permissions: 20,
  verification: 20,
  observability: 20,
  recovery: 20,
};

export type OperationalReadiness = {
  score: number | null;
  documentedAxes: number;
  totalAxes: number;
  axisScores: Record<OperationalAxis, number | null>;
};

export function operationalAxisScore(
  profile: OperationalProfile,
  axis: OperationalAxis,
): number | null {
  const posture = profile[axis];
  const scoreTable = operationalPostureScores[axis] as Record<string, number | null>;
  return scoreTable[posture] ?? null;
}

export function operationalReadinessFromProfile(profile: OperationalProfile): OperationalReadiness {
  const axes = Object.keys(operationalReadinessWeights) as OperationalAxis[];
  const axisScores = Object.fromEntries(
    axes.map((axis) => [axis, operationalAxisScore(profile, axis)]),
  ) as Record<OperationalAxis, number | null>;
  const documented = axes.filter((axis) => axisScores[axis] !== null);
  const score = documented.length !== axes.length
    ? null
    : documented.reduce(
        (total, axis) => total + (axisScores[axis] ?? 0) * (operationalReadinessWeights[axis] / 100),
        0,
      );

  return {
    score: score === null ? null : Math.round(score),
    documentedAxes: documented.length,
    totalAxes: axes.length,
    axisScores,
  };
}

export function operationalReadinessFor(harnessId: string): OperationalReadiness {
  return operationalReadinessFromProfile(getOperationalProfileRecord(harnessId).profile);
}

export const architectureAxisLabels: Record<ArchitectureAxis, string> = {
  execution: "Execution & isolation",
  tooling: "Tooling & integrations",
  context: "Context & state",
  lifecycle: "Lifecycle & recovery",
  observability: "Observability",
  verification: "Verification",
  governance: "Governance & permissions",
};

export const architectureLevelAnchors: Record<ArchitectureAxis, Record<number, string>> = {
  execution: { 1: "Host process", 2: "Workspace isolation", 3: "Sandbox available", 4: "Managed isolation" },
  tooling: { 1: "Shell/basic tools", 2: "Built-in tools", 3: "Extensible tools", 4: "Extensible + browser" },
  context: { 1: "Basic session", 2: "Managed context", 3: "Persistent state", 4: "Persistent + managed" },
  lifecycle: { 1: "Manual recovery", 2: "Session resume", 3: "Checkpoint/rewind", 4: "Managed recovery" },
  observability: { 1: "Session only", 2: "Logs/transcripts", 3: "Structured traces", 4: "Trace + intervention" },
  verification: { 1: "Manual", 2: "Tool-assisted", 3: "Workflow-gated", 4: "Independent grader" },
  governance: { 1: "Host access", 2: "Approval prompts", 3: "Policy controls", 4: "Managed policy" },
};

/**
 * A source-backed architecture descriptor, not a quality score. Levels describe
 * the most advanced documented mechanism on each layer and are never summed.
 */
export function architectureProfileFor(harness: Harness): ArchitectureProfile {
  const operational = getOperationalProfileRecord(harness.id).profile;
  const execution = harness.classification.runtime === "managed-first"
    ? 4
    : harness.classification.runtime === "sandbox-first" || harness.classification.isolation.some((mode) => (
        mode === "os-sandbox" || mode === "container" || mode === "managed-sandbox"
      ))
      ? 3
      : harness.classification.isolation.includes("worktree")
        ? 2
        : 1;
  const tooling = harness.features.mcp && harness.features.browser
    ? 4
    : harness.features.mcp
      ? 3
      : Object.values(harness.features).some(Boolean)
        ? 2
        : 1;

  return {
    execution,
    tooling,
    context: operational.context === "unknown"
      ? null
      : operational.context === "persistent"
        ? 3
        : operational.context === "managed"
          ? 2
          : 1,
    lifecycle: operational.recovery === "unknown"
      ? null
      : operational.recovery === "managed-recovery"
        ? 4
        : operational.recovery === "checkpoint"
          ? 3
          : operational.recovery === "session-resume"
            ? 2
            : 1,
    observability: operational.observability === "unknown"
      ? null
      : operational.observability === "traces"
        ? 3
        : operational.observability === "logs"
          ? 2
          : 1,
    verification: operational.verification === "unknown"
      ? null
      : operational.verification === "workflow-gated"
        ? 3
        : operational.verification === "tool-assisted"
          ? 2
          : 1,
    governance: operational.permissions === "unknown"
      ? null
      : operational.permissions === "policy"
        ? 3
        : operational.permissions === "approval"
          ? 2
          : 1,
  };
}

export function evidenceStateFor(harnessId: string): EvidenceStateSummary {
  const audit = repositoryAuditForHarness(harnessId);
  const measured = benchmarkRuns.some((run) => run.harnessId === harnessId);
  const states: EvidenceStateSummary["states"] = ["documented"];

  if (audit && audit.sourceScope !== "support-repository") states.push("code-verifiable");
  if (measured) states.push("independently-measured");

  const labels: Record<EvidenceStateSummary["states"][number], string> = {
    documented: "Documented",
    "code-verifiable": "code-verifiable",
    "independently-measured": "independently measured configuration",
    replicated: "replicated",
  };
  const label = states.map((state) => labels[state]).join(" + ");

  return { states, label };
}

export function benchmarkConfidenceInterval95(run: BenchmarkRun) {
  const margin = 1.96 * run.standardError;
  return {
    lower: Math.max(0, run.accuracy - margin),
    upper: Math.min(100, run.accuracy + margin),
    method: "Normal approximation from the reported standard error" as const,
  };
}

export function costPerSuccessfulTrial(run: BenchmarkRun) {
  const expectedSuccesses = run.totalTrials * (run.accuracy / 100);
  return expectedSuccesses === 0 ? null : run.totalCostUsd / expectedSuccesses;
}

export function benchmarkParetoFrontier(runs: BenchmarkRun[]) {
  return new Set(runs.filter((candidate) => !runs.some((other) => (
    other.id !== candidate.id
    && other.accuracy >= candidate.accuracy
    && other.totalCostUsd <= candidate.totalCostUsd
    && (other.accuracy > candidate.accuracy || other.totalCostUsd < candidate.totalCostUsd)
  ))).map((run) => run.id));
}

export function benchmarkTopIntervalGroup(runs: BenchmarkRun[]) {
  if (runs.length === 0) return new Set<string>();
  const top = [...runs].sort((a, b) => b.accuracy - a.accuracy)[0];
  const topInterval = benchmarkConfidenceInterval95(top);
  return new Set(runs.filter((run) => {
    const interval = benchmarkConfidenceInterval95(run);
    return interval.lower <= topInterval.upper && interval.upper >= topInterval.lower;
  }).map((run) => run.id));
}
