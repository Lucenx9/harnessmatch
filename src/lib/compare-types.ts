import type { FeatureClaim, FeatureKey, HarnessLogo } from "@/lib/types";

export type CompareBenchmarkRecord = {
  id: string;
  accuracy: number;
  standardError: number;
  model: string;
  harnessVersion: string;
};

export type CompareHarnessRecord = {
  id: string;
  name: string;
  tagline: string;
  logo: HarnessLogo;
  bestFit: string;
  interfaces: string;
  approvalStyle: string;
  modelPortability: string;
  featureClaims: Record<FeatureKey, FeatureClaim>;
  measuredRuns: CompareBenchmarkRecord[];
  mainTradeoff: string;
  catalogLayer: string;
  membershipSummary: string;
  productRole: string;
  orchestration: string;
  runtimePosture: string;
  isolation: string;
  stateModel: string;
  contextLifecycle: string;
  verification: string;
  observability: string;
  recovery: string;
  providerPosture: string;
  license: string;
  documentedArchitectureLayers: number;
  repositoryAudit: null | {
    artifactCount: number | null;
    inspectedRef: string;
  };
};
