export type InterfaceType = "terminal" | "ide" | "web" | "automation";
export type Priority = "simplicity" | "flexibility" | "security" | "autonomy";
export type ModelAccess = "subscription" | "model-agnostic" | "local" | "enterprise";
export type ControlStyle = "approval-heavy" | "balanced" | "hands-off";
export type RepoContext = "small" | "large" | "ci" | "multi-agent";
export type FeatureKey =
  | "mcp"
  | "localModels"
  | "subagents"
  | "headless"
  | "browser"
  | "sandbox"
  | "checkpoints";

export type CapabilityScores = {
  simplicity: number;
  flexibility: number;
  security: number;
  autonomy: number;
  automation: number;
  largeRepo: number;
  humanControl: number;
};

export type EvidenceSource = {
  title: string;
  url: string;
  covers: string;
  kind: "official-docs" | "official-repository" | "official-announcement";
  verifiedAt: string;
};

export type HarnessLogo = {
  src: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type Harness = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  logo: HarnessLogo;
  status: "active" | "archived";
  license: string;
  category: string;
  interfaces: InterfaceType[];
  providerStyle: "single-vendor" | "multi-provider" | "enterprise-routing";
  supportsSubscription: boolean;
  localModels: boolean;
  features: Record<FeatureKey, boolean>;
  capabilities: CapabilityScores;
  bestFor: string[];
  tradeoffs: string[];
  setup: string;
  verifiedAt: string;
  evidence: EvidenceSource[];
};

export type RecommendationAnswers = {
  interface: InterfaceType;
  priority: Priority;
  modelAccess: ModelAccess;
  control: ControlStyle;
  repoContext: RepoContext;
  requiredFeatures: FeatureKey[];
};

export type Recommendation = {
  harness: Harness;
  score: number;
  confidence: "high" | "medium" | "low";
  reasons: string[];
  compromises: string[];
  blockers: FeatureKey[];
};
