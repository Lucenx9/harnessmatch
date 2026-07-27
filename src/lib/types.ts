export type InterfaceType = "terminal" | "ide" | "web" | "automation";
export type Priority = "simplicity" | "flexibility" | "security" | "autonomy";
export type ModelAccess = "subscription" | "model-agnostic" | "local" | "enterprise";
export type ControlStyle = "approval-heavy" | "balanced" | "hands-off";
export type ChangeScope = "focused" | "cross-file" | "large-repo";
export type OperatingMode = "interactive" | "ci" | "parallel";
export type HarnessRole =
  | "pair-programmer"
  | "coding-agent"
  | "general-agent"
  | "agent-platform"
  | "extensible-harness";
export type OrchestrationModel =
  | "single-agent"
  | "delegated-subagents"
  | "multi-agent-runtime";
export type RuntimePosture = "host-first" | "sandbox-first" | "managed-first";
export type IsolationMode =
  | "os-sandbox"
  | "container"
  | "managed-sandbox"
  | "worktree";
export type StateModel = "session-based" | "persistent-memory";
export type ProductLayer =
  | "coding-harness"
  | "external-harness-orchestrator"
  | "framework-runtime"
  | "adjacent-tool";
export type ModelPortability =
  | "vendor-specific"
  | "managed-routing"
  | "provider-choice"
  | "provider-and-local";
export type HarnessMembershipCriterion =
  | "adaptiveLoop"
  | "environmentMutation"
  | "activeContextManagement"
  | "runtimeControl";
export type MembershipEvidenceState = "documented" | "contradicted" | "unknown";

export type MembershipCriterionAssessment = {
  state: MembershipEvidenceState;
  sourceUrls: string[];
};

export type HarnessMembershipAssessment = {
  layer: ProductLayer;
  criteria: Record<HarnessMembershipCriterion, MembershipCriterionAssessment>;
  verifiedAt: string;
  limitation: string;
};
export type FeatureKey =
  | "mcp"
  | "localModels"
  | "subagents"
  | "headless"
  | "browser"
  | "sandbox"
  | "checkpoints";

export type ContextManagement = "basic" | "managed" | "persistent" | "unknown";
export type PermissionPosture = "host" | "approval" | "policy" | "unknown";
export type VerificationPosture = "manual" | "tool-assisted" | "workflow-gated" | "unknown";
export type ObservabilityPosture = "session" | "logs" | "traces" | "unknown";
export type RecoveryPosture =
  | "manual"
  | "session-resume"
  | "checkpoint"
  | "managed-recovery"
  | "unknown";

export type OperationalProfile = {
  context: ContextManagement;
  permissions: PermissionPosture;
  verification: VerificationPosture;
  observability: ObservabilityPosture;
  recovery: RecoveryPosture;
};

export type OperationalAxis = keyof OperationalProfile;

export type OperationalProfileRecord = {
  profile: OperationalProfile;
  sourceUrls: string[];
  verifiedAt: string;
  limitation: string;
};

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
  topic?:
    | "product-surfaces"
    | "execution-control"
    | "orchestration-state"
    | "automation-extensions"
    | "enterprise-operations"
    | "releases-code-audit";
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

export type DiscoverySource = {
  title: string;
  url: string;
  note: string;
  observedAt: string;
};

export type Harness = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  logo: HarnessLogo;
  status: "active" | "dormant" | "archived";
  license: string;
  membership?: HarnessMembershipAssessment;
  classification: {
    role: HarnessRole;
    orchestration: OrchestrationModel;
    runtime: RuntimePosture;
    isolation: IsolationMode[];
    state: StateModel;
  };
  interfaces: InterfaceType[];
  providerStyle: "single-vendor" | "multi-provider" | "enterprise-routing";
  supportsSubscription: boolean;
  supportsEnterpriseAccess?: boolean;
  localModels: boolean;
  features: Record<FeatureKey, boolean>;
  capabilities: CapabilityScores;
  bestFor: string[];
  tradeoffs: string[];
  setup: string;
  verifiedAt: string;
  evidence: EvidenceSource[];
  discovery?: DiscoverySource[];
};

export type RecommendationAnswers = {
  interface: InterfaceType;
  priority: Priority;
  modelAccess: ModelAccess;
  control: ControlStyle;
  changeScope: ChangeScope;
  operatingMode: OperatingMode;
  requiredFeatures: FeatureKey[];
};

export type Recommendation = {
  harness: Harness;
  score: number;
  fitBand: "strong" | "good" | "conditional" | "weak";
  robustness: RankRobustness;
  evidenceState: EvidenceStateSummary;
  evidenceCoverage: "high" | "medium" | "limited";
  evidenceSourceCount: number;
  reasons: string[];
  compromises: string[];
  scoreBreakdown: Record<RecommendationFactor, number>;
};


export type RecommendationFactor =
  | "priority"
  | "control"
  | "changeScope"
  | "operatingMode";

export type RankRobustness = {
  scenarioCount: number;
  topRankFrequency: number;
  topThreeFrequency: number;
  bestRank: number;
  worstRank: number;
  meanRank: number;
};

export type EvidenceState =
  | "documented"
  | "code-verifiable"
  | "independently-measured"
  | "replicated";

export type EvidenceStateSummary = {
  states: EvidenceState[];
  label: string;
};

export type EligibilityFailure =
  | { kind: "product-layer"; layer: ProductLayer; label: string }
  | {
      kind: "membership";
      criterion?: HarnessMembershipCriterion;
      state?: MembershipEvidenceState;
      label: string;
    }
  | { kind: "interface"; label: string }
  | { kind: "model-access"; label: string }
  | { kind: "feature"; feature: FeatureKey; label: string };

export type EligibilityAssessment = {
  state: "eligible" | "not-eligible-on-current-evidence";
  label: "Eligible" | "Not eligible on current evidence";
  failures: EligibilityFailure[];
};

export type ArchitectureAxis =
  | "execution"
  | "tooling"
  | "context"
  | "lifecycle"
  | "observability"
  | "verification"
  | "governance";

export type ArchitectureProfile = Record<ArchitectureAxis, number | null>;
