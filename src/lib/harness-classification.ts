import type {
  HarnessRole,
  IsolationMode,
  OrchestrationModel,
  RuntimePosture,
  StateModel,
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

export function formatIsolationModes(modes: IsolationMode[]) {
  if (modes.length === 0) return "No first-party isolation";
  return modes.map((mode) => isolationModeLabels[mode]).join(", ");
}

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
