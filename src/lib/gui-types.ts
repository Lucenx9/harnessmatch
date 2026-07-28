export type GuiLayer = "harness-native" | "multi-harness-workspace";

export type GuiSourceAccess = "open-source" | "source-available" | "proprietary";

export type GuiPlatform = "macOS" | "Windows" | "Linux" | "Browser" | "iOS";

export type GuiLogo = {
  src: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type GuiCapabilityKey =
  | "parallelSessions"
  | "workspaceIsolation"
  | "visualReview"
  | "remoteExecution"
  | "teamCollaboration";

export type GuiClaimState = "documented" | "unknown" | "contradicted";

export type GuiCapabilityClaim = {
  state: GuiClaimState;
  summary: string;
  sourceUrls: string[];
  verifiedAt: string;
};

export type GuiEvidenceSource = {
  title: string;
  url: string;
  kind: "official-docs" | "official-repository" | "official-announcement";
  covers: string;
  verifiedAt: string;
};

export type GuiProduct = {
  id: string;
  name: string;
  logo: GuiLogo;
  url: string;
  status: "active" | "dormant" | "archived";
  layer: GuiLayer;
  sourceAccess: GuiSourceAccess;
  license: string;
  platforms: GuiPlatform[];
  supportedHarnesses: string[];
  acceptsArbitraryCli: boolean;
  harnessSupportNote: string;
  summary: string;
  bestFor: string;
  limitation: string;
  capabilities: Record<GuiCapabilityKey, GuiCapabilityClaim>;
  evidence: GuiEvidenceSource[];
  verifiedAt: string;
};

export type GuiWorkflowId =
  | "focused-review"
  | "parallel-local"
  | "remote-control"
  | "team-workspace";

export type GuiWorkflow = {
  id: GuiWorkflowId;
  label: string;
  description: string;
  required: GuiCapabilityKey[];
  preferred: GuiCapabilityKey[];
};

export type GuiFitBand = "strong" | "good" | "conditional" | "not-eligible";

export type GuiFitResult = {
  product: GuiProduct;
  fitBand: GuiFitBand;
  why: string;
  watchOut: string;
  missingRequired: GuiCapabilityKey[];
  missingPreferred: GuiCapabilityKey[];
};

export type GuiRepositoryAudit = {
  guiId: string;
  repositoryUrl: string;
  inspectedRef: string;
  inspectedPaths: string[];
  verifiedAt: string;
  sourceScope: "full-source" | "client-source";
  established: string[];
  limitation: string;
};

export type GuiExclusion = {
  id: string;
  name: string;
  reason: string;
  sourceUrl: string;
  verifiedAt: string;
};
