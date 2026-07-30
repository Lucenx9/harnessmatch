import type { ArchitectureAxis } from "./types";

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
  execution: {
    1: "Host process",
    2: "Workspace isolation",
    3: "Sandbox available",
    4: "Managed isolation",
  },
  tooling: {
    1: "Shell/basic tools",
    2: "Built-in tools",
    3: "Extensible tools",
    4: "Extensible + browser",
  },
  context: {
    1: "Basic session",
    2: "Managed context",
    3: "Persistent state",
    4: "Persistent + managed",
  },
  lifecycle: {
    1: "Manual recovery",
    2: "Session resume",
    3: "Checkpoint/rewind",
    4: "Managed recovery",
  },
  observability: {
    1: "Session only",
    2: "Logs/transcripts",
    3: "Structured traces",
    4: "Trace + intervention",
  },
  verification: {
    1: "Manual",
    2: "Tool-assisted",
    3: "Workflow-gated",
    4: "Independent grader",
  },
  governance: {
    1: "Host access",
    2: "Approval prompts",
    3: "Policy controls",
    4: "Managed policy",
  },
};
