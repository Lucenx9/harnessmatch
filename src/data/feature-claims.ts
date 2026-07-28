import type {
  EvidenceSource,
  FeatureClaim,
  FeatureClaimState,
  FeatureKey,
  Harness,
} from "@/lib/types";

export const featureClaimStateLabels: Record<FeatureClaimState, string> = {
  default: "Available by default",
  documented: "Documented",
  optional: "Optional",
  "surface-specific": "Depends on surface",
  "not-documented": "Not documented",
  "explicitly-absent": "No built-in support",
  deprecated: "Deprecated",
};

export const featureKeys: FeatureKey[] = [
  "mcp",
  "localModels",
  "subagents",
  "headless",
  "browser",
  "sandbox",
  "checkpoints",
];

const featureScopes: Record<FeatureKey, string> = {
  mcp: "Product-supported MCP integration",
  localModels: "Local or self-hosted model path",
  subagents: "Delegated or parallel agent workflow",
  headless: "Non-interactive or automation surface",
  browser: "Built-in or product-supported browser control",
  sandbox: "Documented execution-isolation mechanism",
  checkpoints: "Product-supported file or session rollback",
};

const evidencePatterns: Record<FeatureKey, RegExp> = {
  mcp: /\bmcp\b|model context protocol/i,
  localModels: /local[^,.]{0,30}(?:model|inference|provider|runtime|llm)|ollama|lm studio|llama\.cpp|self-hosted|openai-compatible|custom (?:endpoint|model)/i,
  subagents: /sub.?agent|multi.?agent|parallel agent|delegat|agent team|swarm/i,
  headless: /headless|non.?interactive|automation|\bci\b|execute mode|one-shot|json event|rpc mode|runner|scriptable|structured output|print mode/i,
  browser: /\bbrowser\b|computer-use|desktop interaction|web control/i,
  sandbox: /sandbox|isolation|container|docker|bubblewrap|gvisor|nsjail|seatbelt|managed machine|workspace template/i,
  checkpoints: /checkpoint|rollback|rewind|undo|snapshot restoration|file snapshot/i,
};

type ClaimOverride = Partial<Pick<FeatureClaim, "state" | "scope" | "limitation">> & {
  sourceTitles?: string[];
};

const overrides: Record<string, Partial<Record<FeatureKey, ClaimOverride>>> = {
  "claude-code": {
    sandbox: {
      state: "optional",
      scope: "Optional OS sandbox locally; managed isolation on cloud surfaces",
      limitation: "Local sandbox coverage depends on configuration and does not contain every process or side effect.",
    },
  },
  codex: {
    sandbox: {
      state: "default",
      scope: "Sandbox-first local CLI and managed cloud execution",
      limitation: "The effective boundary still depends on the selected sandbox and approval policy.",
    },
  },
  opencode: {
    sandbox: {
      state: "explicitly-absent",
      scope: "Host execution; permission rules are not process isolation",
      sourceTitles: ["Pinned security policy"],
      limitation: "The official security policy explicitly states that OpenCode has no sandbox.",
    },
  },
  pi: {
    sandbox: {
      state: "explicitly-absent",
      scope: "Host execution; external containerization is user-supplied",
      sourceTitles: ["Security"],
      limitation: "The official security guide documents no built-in permission prompts or sandbox.",
    },
  },
  "grok-build": {
    sandbox: {
      state: "optional",
      scope: "Optional OS sandbox profiles; disabled by default",
      limitation: "Network and filesystem coverage varies by platform and selected profile.",
    },
  },
  "gemini-cli": {
    sandbox: {
      state: "optional",
      scope: "Optional OS or container sandbox profiles",
      limitation: "Profiles and platform support change the effective filesystem and network boundary.",
    },
  },
  "antigravity-cli": {
    sandbox: {
      state: "optional",
      scope: "Optional OS or container isolation",
    },
  },
  "copilot-cli": {
    sandbox: {
      state: "optional",
      scope: "Optional sandboxed execution mode",
    },
  },
  "cursor-cli": {
    sandbox: {
      state: "optional",
      scope: "Optional sandbox policy for command execution",
    },
  },
  "factory-droid": {
    sandbox: {
      state: "optional",
      scope: "Beta OS sandbox; opt-in",
      limitation: "Per-command mode contains shell children while the main Droid process remains outside the boundary.",
    },
    checkpoints: {
      sourceTitles: ["Droid CLI reference"],
      scope: "Interactive session rewind",
      limitation: "Rewind does not reverse external side effects.",
    },
  },
  "qwen-code": {
    sandbox: {
      state: "optional",
      scope: "Optional OS or container sandbox",
    },
  },
  "letta-code": {
    sandbox: {
      state: "surface-specific",
      scope: "Managed cloud sandbox; local tools remain host-executed",
    },
  },
  "kilo-code": {
    sandbox: {
      state: "surface-specific",
      scope: "Opt-in locally; managed isolation on cloud surfaces",
    },
  },
  mux: {
    sandbox: {
      state: "surface-specific",
      scope: "Container or devcontainer modes; host execution remains available",
    },
  },
  "coder-agents": {
    sandbox: {
      state: "surface-specific",
      scope: "Isolation depends on the selected workspace template",
    },
    browser: {
      state: "optional",
      scope: "Experimental computer-use subagent in desktop-enabled workspaces",
      sourceTitles: ["Virtual desktop"],
    },
  },
  amp: {
    sandbox: {
      state: "surface-specific",
      scope: "Managed cloud orbs; local tools run on the host",
      sourceTitles: ["Cloud orbs", "Agents in Orbs announcement"],
    },
    browser: {
      scope: "Browser-capable local or managed agent workflow",
      sourceTitles: ["Amp owner’s manual"],
    },
  },
  "poolside-cli": {
    sandbox: {
      state: "surface-specific",
      scope: "Isolation depends on the managed or configured execution surface",
    },
  },
};

function sourceText(source: EvidenceSource) {
  return `${source.title} ${source.covers}`;
}

function sourcesForClaim(harness: Harness, feature: FeatureKey, override?: ClaimOverride) {
  if (override?.sourceTitles) {
    const titles = new Set(override.sourceTitles);
    return harness.evidence.filter((source) => titles.has(source.title));
  }

  return harness.evidence.filter((source) => evidencePatterns[feature].test(sourceText(source))).slice(0, 2);
}

export function featureClaimSupportsRequirement(claim: FeatureClaim): boolean {
  return claim.state === "default"
    || claim.state === "documented"
    || claim.state === "optional"
    || claim.state === "surface-specific";
}

export function featureClaimFor(harness: Harness, feature: FeatureKey): FeatureClaim {
  const override = overrides[harness.id]?.[feature];
  const legacySupport = harness.features[feature];
  const state = override?.state ?? (legacySupport ? "documented" : "not-documented");
  const sources = legacySupport || override?.sourceTitles
    ? sourcesForClaim(harness, feature, override)
    : [];

  return {
    state,
    scope: override?.scope ?? (legacySupport
      ? featureScopes[feature]
      : "No first-class support established by the current record"),
    sourceUrls: sources.map((source) => source.url),
    verifiedAt: harness.verifiedAt,
    limitation: override?.limitation ?? (legacySupport
      ? "The source establishes the mechanism, not its quality or availability in every mode."
      : "Absence of current documentation is not proof that the capability is impossible."),
  };
}
