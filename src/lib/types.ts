export type InterfaceType = "terminal" | "ide" | "web" | "automation";
export type Priority = "simplicity" | "flexibility" | "security" | "autonomy";
export type ModelAccess = "subscription" | "model-agnostic" | "local" | "enterprise" | "no-preference";
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

export type FeatureClaimState =
  | "default"
  | "documented"
  | "optional"
  | "surface-specific"
  | "not-documented"
  | "explicitly-absent"
  | "deprecated";

/**
 * A feature claim describes what the first-party record actually establishes.
 * Availability, default state, product surface, provenance, and limitations are
 * separate facts; no parallel boolean is kept as a second source of truth.
 */
export type FeatureClaim = {
  state: FeatureClaimState;
  scope: string;
  sourceUrls: string[];
  verifiedAt: string;
  limitation: string;
};

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

/**
 * A dated view of traffic publicly attributed to an app on OpenRouter.
 * This is ecosystem context, not first-party capability evidence or a quality
 * measure, and therefore lives outside the Harness record and recommendation.
 */
export type OpenRouterAttributionSnapshot = {
  harnessId: string;
  appSlug: string;
  appId: number;
  sourceUrl: string;
  integrationUrl?: string;
  attributedTokens: number;
  dailyGlobalRank: number | null;
  modelsObserved: number;
  observedAt: string;
  windows: Record<OpenRouterUsageWindowKey, OpenRouterUsageWindow>;
};

export type OpenRouterUsageWindowKey = "day" | "week" | "month";

export type OpenRouterUsageWindow = {
  category: "coding";
  days: 1 | 7 | 30;
  rank: number | null;
  attributedTokens: number | null;
  attributedRequests: number | null;
  windowStart: string;
  windowEnd: string;
  observedAt: string;
  datasetVersion: string;
  sourceUrl: string;
};

/**
 * Public distribution and repository signals. Each source keeps its native
 * unit and population; these records must never be combined into one score.
 */
export type EcosystemSignalSnapshot =
  | HomebrewUsageSignal
  | NpmUsageSignal
  | VsCodeUsageSignal
  | OpenVsxUsageSignal
  | JetBrainsUsageSignal
  | GitHubReleaseDownloadSignal
  | GitHubInterestSignal;

type EcosystemSignalBase = {
  harnessId: string;
  observedAt: string;
  artifactId: string;
  artifactUrl: string;
  sourceUrl: string;
};

export type HomebrewUsageSignal = EcosystemSignalBase & {
  source: "homebrew";
  metric: "install-events";
  artifactKind: "formula" | "cask";
  value: number;
  windowDays: 30;
  windowStart: string;
  windowEnd: string;
};

export type NpmUsageSignal = EcosystemSignalBase & {
  source: "npm";
  metric: "downloads";
  value: number;
  windowDays: 30;
  windowStart: string;
  windowEnd: string;
};

export type VsCodeUsageSignal = EcosystemSignalBase & {
  source: "vscode";
  metric: "installs";
  value: number;
};

export type OpenVsxUsageSignal = EcosystemSignalBase & {
  source: "openvsx";
  metric: "downloads";
  value: number;
  latestVersion: string;
};

export type JetBrainsUsageSignal = EcosystemSignalBase & {
  source: "jetbrains";
  metric: "downloads";
  value: number;
  pluginId: number;
};

export type GitHubReleaseDownloadSignal = EcosystemSignalBase & {
  source: "github-releases";
  metric: "asset-downloads";
  value: number;
  assetCount: number;
  releaseCount: number;
  recentReleaseCount: number;
  recentReleaseWindowDays: number;
  latestVersion: string;
  latestReleaseAt: string;
  latestReleaseUrl: string;
  artifactScope: string;
  repositoryScope: "full-source" | "client-source" | "support-repository";
};

export type HarnessReleaseSnapshot = {
  harnessId: string;
  repository: string;
  repositoryScope: "full-source" | "client-source" | "support-repository";
  latestVersion: string;
  latestReleaseAt: string;
  latestReleaseUrl: string;
  recentReleaseCount: number;
  recentReleaseWindowDays: number;
  observedAt: string;
  sourceUrl: string;
};

export type GitHubInterestSignal = EcosystemSignalBase & {
  source: "github";
  metric: "stars";
  value: number;
  forks: number;
  repositoryScope: "full-source" | "client-source" | "support-repository";
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
  featureClaims: Record<FeatureKey, FeatureClaim>;
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
