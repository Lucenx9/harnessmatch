import type {
  AuditabilityRankingRow,
  BenchmarkRankingRow,
  OperationalRankingRow,
} from "../src/components/evidence-ranking-explorer";
import type { LensHarness } from "../src/components/harness-lens-explorer";
import type { CompareHarnessRecord } from "../src/lib/compare-types";
import type { ArchitectureProfile, FeatureClaim, FeatureKey, HarnessLogo } from "../src/lib/types";

/**
 * Minimal but fully typed component inputs. Fixtures stay independent from the
 * published catalog so a test asserts component behaviour rather than the
 * current contents of `src/data`.
 */

const logo: HarnessLogo = {
  src: "/logos/fixture.svg",
  sourceUrl: "https://example.test/brand",
  verifiedAt: "2026-07-30",
};

const featureKeys: FeatureKey[] = [
  "mcp",
  "localModels",
  "subagents",
  "headless",
  "browser",
  "sandbox",
  "checkpoints",
];

const documentedClaim: FeatureClaim = {
  state: "documented",
  scope: "Fixture scope",
  sourceUrls: ["https://example.test/docs"],
  verifiedAt: "2026-07-30",
  limitation: "Fixture limitation",
};

function fullyDocumentedClaims(): Record<FeatureKey, FeatureClaim> {
  return Object.fromEntries(
    featureKeys.map((feature) => [feature, documentedClaim]),
  ) as Record<FeatureKey, FeatureClaim>;
}

function featureSupport(supported: FeatureKey[]): Record<FeatureKey, boolean> {
  return Object.fromEntries(
    featureKeys.map((feature) => [feature, supported.includes(feature)]),
  ) as Record<FeatureKey, boolean>;
}

/** Every architecture layer documented at the same rubric position. */
export function architectureProfile(level: number | null): ArchitectureProfile {
  return {
    execution: level,
    tooling: level,
    context: level,
    lifecycle: level,
    observability: level,
    verification: level,
    governance: level,
  };
}

export function operationalRow(
  overrides: Partial<OperationalRankingRow> & Pick<OperationalRankingRow, "id" | "name">,
): OperationalRankingRow {
  return {
    slug: overrides.id,
    logo,
    levels: architectureProfile(2),
    documentedAxes: 7,
    evidenceSources: 4,
    verifiedAt: "2026-07-30",
    ...overrides,
  };
}

export function auditabilityRow(
  overrides: Partial<AuditabilityRankingRow> & Pick<AuditabilityRankingRow, "id" | "name">,
): AuditabilityRankingRow {
  return {
    slug: overrides.id,
    logo,
    artifactCount: 3,
    sourceScope: "full-source",
    passedSignals: 3,
    repositoryUrl: "https://example.test/repo",
    inspectedRef: "0123456789abcdef",
    ...overrides,
  };
}

export function benchmarkRow(
  overrides: Partial<BenchmarkRankingRow> & Pick<BenchmarkRankingRow, "id" | "name">,
): BenchmarkRankingRow {
  return {
    slug: overrides.id,
    logo,
    score: 50,
    harnessVersion: "1.0.0",
    model: "fixture-model",
    reasoningEffort: "medium",
    totalCostUsd: 12.5,
    standardError: 1.5,
    intervalLower: 47,
    intervalUpper: 53,
    onParetoFrontier: false,
    inTopIntervalGroup: false,
    totalTrials: 100,
    integrityAdjustmentPercent: 0,
    runDate: "2026-07-30",
    resultSourceUrl: "https://example.test/run",
    ...overrides,
  };
}

export function compareRecord(
  overrides: Partial<CompareHarnessRecord> & Pick<CompareHarnessRecord, "id" | "name">,
): CompareHarnessRecord {
  return {
    tagline: `${overrides.name} tagline`,
    logo,
    bestFit: "Fixture best fit",
    interfaces: "Terminal",
    approvalStyle: "Approval prompts",
    modelPortability: "Single vendor",
    featureClaims: fullyDocumentedClaims(),
    measuredRuns: [],
    mainTradeoff: "Fixture trade-off",
    catalogLayer: "Coding harness",
    membershipSummary: "Fixture membership",
    productRole: "Fixture role",
    orchestration: "single-agent",
    runtimePosture: "host-first",
    isolation: "Workspace isolation",
    stateModel: "session-based",
    contextLifecycle: "Managed context",
    verification: "Tool-assisted",
    observability: "Logs/transcripts",
    recovery: "Session resume",
    providerPosture: "Single vendor",
    license: "Proprietary",
    documentedArchitectureLayers: 7,
    repositoryAudit: null,
    ...overrides,
  };
}

export function lensHarness(
  overrides: Partial<LensHarness> & Pick<LensHarness, "id" | "name">,
): LensHarness {
  return {
    slug: overrides.id,
    logo,
    tagline: `${overrides.name} tagline`,
    layer: "coding-harness",
    role: "coding-agent",
    orchestration: "single-agent",
    runtime: "host-first",
    isolation: ["worktree"],
    state: "session-based",
    interfaces: ["terminal"],
    providerStyle: "single-vendor",
    featureSupport: featureSupport(featureKeys),
    evidenceCount: 4,
    verifiedAt: "2026-07-30",
    ...overrides,
  };
}
