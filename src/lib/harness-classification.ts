import { featureClaimFor, featureClaimSupportsRequirement } from "@/data/feature-claims";
import type {
  Harness,
  HarnessMembershipCriterion,
  HarnessRole,
  IsolationMode,
  ModelPortability,
  OrchestrationModel,
  ProductLayer,
  RuntimePosture,
  StateModel,
} from "./types";

export const productLayerLabels: Record<ProductLayer, string> = {
  "coding-harness": "Coding harness",
  "external-harness-orchestrator": "External harness orchestrator",
  "framework-runtime": "Framework or runtime",
  "adjacent-tool": "Adjacent tool",
};

export const membershipCriterionLabels: Record<HarnessMembershipCriterion, string> = {
  adaptiveLoop: "Adaptive agent loop",
  environmentMutation: "Repository tool execution",
  activeContextManagement: "Task-aware context management",
  runtimeControl: "Model-independent runtime control",
};

export const membershipCriterionDescriptions: Record<HarnessMembershipCriterion, string> = {
  adaptiveLoop: "The system repeatedly observes results and chooses the next action instead of following a fixed one-pass graph.",
  environmentMutation: "The system can use tools to inspect and change a repository or its execution environment.",
  activeContextManagement: "The runtime assembles, updates, compacts, retrieves, or persists task-relevant context while work proceeds.",
  runtimeControl: "Permissions, budgets, interruption, policy, or stop controls operate outside the model's own text generation.",
};

export const harnessRoleLabels: Record<HarnessRole, string> = {
  "pair-programmer": "Pair programmer",
  "coding-agent": "Coding agent",
  "general-agent": "General-purpose agent",
  "agent-platform": "Agent platform",
  "extensible-harness": "Extensible harness",
};

export const orchestrationLabels: Record<OrchestrationModel, string> = {
  "single-agent": "Single-agent loop",
  "delegated-subagents": "Delegated subagents",
  "multi-agent-runtime": "Multi-agent runtime",
};

export const runtimePostureLabels: Record<RuntimePosture, string> = {
  "host-first": "Host-first",
  "sandbox-first": "Sandbox-first",
  "managed-first": "Managed-first",
};

export const isolationModeLabels: Record<IsolationMode, string> = {
  "os-sandbox": "OS sandbox",
  container: "Container",
  "managed-sandbox": "Managed sandbox",
  worktree: "Git worktree",
};

export const stateModelLabels: Record<StateModel, string> = {
  "session-based": "Session-based",
  "persistent-memory": "Persistent memory",
};

export const modelPortabilityLabels: Record<ModelPortability, string> = {
  "vendor-specific": "Vendor-specific",
  "managed-routing": "Managed routing",
  "provider-choice": "Provider choice",
  "provider-and-local": "Provider + local",
};

export const modelPortabilityDescriptions: Record<ModelPortability, string> = {
  "vendor-specific": "The documented product path is tied to one vendor's model access.",
  "managed-routing": "An organization controls the documented provider or deployment routes.",
  "provider-choice": "The harness documents more than one provider, without a current local-model claim.",
  "provider-and-local": "The harness documents multiple providers and a local or self-hosted model path.",
};

export function modelPortabilityFor(
  harness: Pick<Harness, "providerStyle" | "featureClaims">,
): ModelPortability {
  if (harness.providerStyle === "single-vendor") return "vendor-specific";
  if (harness.providerStyle === "enterprise-routing") return "managed-routing";
  if (featureClaimSupportsRequirement(featureClaimFor(harness, "localModels"))) {
    return "provider-and-local";
  }
  return "provider-choice";
}

export function formatIsolationModes(modes: IsolationMode[]) {
  if (modes.length === 0) return "No first-party isolation";
  return modes.map((mode) => isolationModeLabels[mode]).join(", ");
}

export const classificationAxes = [
  {
    label: "Catalog layer",
    description:
      "Whether the product owns a coding-agent loop, coordinates external harnesses, supplies a framework or runtime, or is an adjacent tool. Only the first layer enters the default recommender.",
  },
  {
    label: "Product role",
    description:
      "Whether the product is a focused pair programmer, a coding agent, a broader agent, an extensible harness, or a platform that hosts agents.",
  },
  {
    label: "Agent organization",
    description:
      "Whether work stays in one agent loop, can be delegated to subagents, or is coordinated by a multi-agent runtime.",
  },
  {
    label: "Interaction surfaces",
    description:
      "Where the product is actually available: terminal, IDE, web or desktop, and automation.",
  },
  {
    label: "Runtime and isolation",
    description:
      "Whether execution is host-, sandbox-, or managed-first, followed by the documented isolation paths available to the user.",
  },
  {
    label: "State and recovery",
    description:
      "Whether the product is session-based or maintains persistent agent memory, and whether file rollback or restore is first-class.",
  },
  {
    label: "Model access",
    description:
      "Whether access is tied to one vendor, supports multiple providers or local models, or targets enterprise routing.",
  },
  {
    label: "Controls and verification",
    description:
      "Approval posture, permissions, hooks, isolation, recovery, and verification signals are compared separately from model capability.",
  },
] as const;
