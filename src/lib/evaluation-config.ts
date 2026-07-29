import type {
  CapabilityScores,
  ContextManagement,
  ObservabilityPosture,
  PermissionPosture,
  RecoveryPosture,
  VerificationPosture,
} from "./types";

export type CapabilityLevel = 1 | 2 | 3 | 4 | 5;

export const capabilityAxisLabels: Record<keyof CapabilityScores, string> = {
  simplicity: "Simplicity",
  flexibility: "Flexibility",
  security: "Execution safety",
  autonomy: "Autonomy",
  automation: "Automation",
  largeRepo: "Large-repository support",
  humanControl: "Human control",
};

export const capabilityLevelAnchors: Record<
  keyof CapabilityScores,
  Record<CapabilityLevel, string>
> = {
  simplicity: {
    1: "Routine use requires extensive manual setup or several coordinated components.",
    2: "The main path is documented, but setup or routine operation still requires substantial configuration.",
    3: "Installation and the normal task loop are documented, with several choices or dependencies to manage.",
    4: "A short setup path and focused defaults cover normal use; advanced configuration is optional.",
    5: "A direct onboarding path and focused defaults support useful work with minimal required configuration.",
  },
  flexibility: {
    1: "One prescribed provider and workflow, with little documented extension.",
    2: "A small set of documented provider, tool, or workflow choices.",
    3: "Several documented choices within a primary workflow.",
    4: "Multiple providers plus documented tool or workflow extension points.",
    5: "Broad provider choice and programmable extension across tools, agents, and operating modes.",
  },
  security: {
    1: "Host execution with no documented approval or isolation mechanism.",
    2: "Basic confirmations or restrictions, while broad host access remains the normal posture.",
    3: "Documented approvals or optional isolation for sensitive actions.",
    4: "Granular permissions plus documented isolation or policy controls.",
    5: "Enforced policy and isolation controls with explicit boundaries for execution and access.",
  },
  autonomy: {
    1: "Turn-by-turn assistance that depends on continuous user direction.",
    2: "Short multi-step work with frequent user intervention.",
    3: "Multi-step tasks with documented planning, continuation, or session recovery.",
    4: "Longer task loops that can use tools with limited intervention.",
    5: "Durable autonomous orchestration with delegation, recovery, and an explicit task lifecycle.",
  },
  automation: {
    1: "Interactive use only, with no documented programmatic entry point.",
    2: "Callable or scriptable operation that still expects an attended session.",
    3: "A documented headless or non-interactive execution path.",
    4: "CI, scheduled, or API-driven execution with structured inputs or outputs.",
    5: "Durable automation with triggers, orchestration, monitoring, and recovery mechanisms.",
  },
  largeRepo: {
    1: "A narrow working set selected manually, with no documented repository-wide mechanism.",
    2: "Manual context selection or basic repository search supports broader work.",
    3: "Documented repository search and cross-file context support.",
    4: "Managed indexing, context compression, or delegation supports broad repository work.",
    5: "Repository-scale context has documented refresh, partitioning, or durable lifecycle mechanisms.",
  },
  humanControl: {
    1: "Few documented controls for intervention, review, or recovery.",
    2: "Coarse confirmation or post-change review with limited reversal support.",
    3: "Approvals or diff review are documented for common actions.",
    4: "Granular approvals are combined with checkpoints, rollback, or scoped permissions.",
    5: "Policy-level controls provide auditable actions and a reversible change workflow.",
  },
};

export const operationalPostureScores = {
  context: {
    basic: 40,
    managed: 82,
    persistent: 100,
    unknown: null,
  } satisfies Record<ContextManagement, number | null>,
  permissions: {
    host: 35,
    approval: 75,
    policy: 100,
    unknown: null,
  } satisfies Record<PermissionPosture, number | null>,
  verification: {
    manual: 35,
    "tool-assisted": 75,
    "workflow-gated": 100,
    unknown: null,
  } satisfies Record<VerificationPosture, number | null>,
  observability: {
    session: 45,
    logs: 78,
    traces: 100,
    unknown: null,
  } satisfies Record<ObservabilityPosture, number | null>,
  recovery: {
    manual: 25,
    "session-resume": 60,
    checkpoint: 85,
    "managed-recovery": 100,
    unknown: null,
  } satisfies Record<RecoveryPosture, number | null>,
} as const;
