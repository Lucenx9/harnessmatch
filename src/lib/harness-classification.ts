import type {
  ExecutionBoundary,
  HarnessRole,
  OrchestrationModel,
} from "./types";

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

export const executionBoundaryLabels: Record<ExecutionBoundary, string> = {
  "host-process": "Host process",
  "native-sandbox": "Native sandbox path",
  "managed-runtime": "Managed runtime",
};

export const classificationAxes = [
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
    label: "Execution boundary",
    description:
      "Whether tools run on the host, have a first-party sandbox path, or execute through a selectable local, container, or remote runtime.",
  },
] as const;
