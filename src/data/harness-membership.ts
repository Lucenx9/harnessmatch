import type {
  Harness,
  HarnessMembershipAssessment,
  HarnessMembershipCriterion,
  MembershipEvidenceState,
  ProductLayer,
} from "../lib/types";

type CriterionDefinition = {
  state: MembershipEvidenceState;
  sourceTitles: string[];
};

type MembershipDefinition = {
  layer: ProductLayer;
  criteria: Record<HarnessMembershipCriterion, CriterionDefinition>;
  limitation: string;
};

type DocumentedCriterionTitles = Record<HarnessMembershipCriterion, string | string[]>;

const categoryLimitation =
  "Membership establishes category fit only. It does not score quality, safety, autonomy, model capability, or benchmark performance.";

function documentedCodingHarness(criteria: DocumentedCriterionTitles): MembershipDefinition {
  return {
    layer: "coding-harness",
    criteria: Object.fromEntries(
      Object.entries(criteria).map(([criterion, sourceTitles]) => [
        criterion,
        {
          state: "documented",
          sourceTitles: Array.isArray(sourceTitles) ? sourceTitles : [sourceTitles],
        },
      ]),
    ) as MembershipDefinition["criteria"],
    limitation: categoryLimitation,
  };
}

const membershipDefinitions: Record<string, MembershipDefinition> = {
  "claude-code": documentedCodingHarness({
    adaptiveLoop: "How Claude Code works",
    environmentMutation: "Tools reference",
    activeContextManagement: "How Claude Code works",
    runtimeControl: "Permissions",
  }),
  codex: documentedCodingHarness({
    adaptiveLoop: "Codex CLI",
    environmentMutation: "Developer command reference",
    activeContextManagement: "AGENTS.md instructions",
    runtimeControl: "Approvals and security",
  }),
  opencode: documentedCodingHarness({
    adaptiveLoop: "OpenCode introduction",
    environmentMutation: "Built-in and custom tools",
    activeContextManagement: "Agents and permissions",
    runtimeControl: "Permission policy",
  }),
  pi: documentedCodingHarness({
    adaptiveLoop: "Quickstart",
    environmentMutation: "Quickstart",
    activeContextManagement: "Compaction",
    runtimeControl: "RPC mode",
  }),
  omp: documentedCodingHarness({
    adaptiveLoop: "Product overview",
    environmentMutation: "Task subagents",
    activeContextManagement: "Settings reference",
    runtimeControl: "Approval modes",
  }),
  codewhale: documentedCodingHarness({
    adaptiveLoop: "CodeWhale 0.9.3 source snapshot",
    environmentMutation: "CodeWhale 0.9.3 source snapshot",
    activeContextManagement: "Persistent memory",
    runtimeControl: "Authorization order",
  }),
  openharness: documentedCodingHarness({
    adaptiveLoop: "Agent loop implementation",
    environmentMutation: "Repository tool registry",
    activeContextManagement: ["Agent loop implementation", "Runtime settings"],
    runtimeControl: ["Runtime settings", "Permission checker"],
  }),
  "grok-build": documentedCodingHarness({
    adaptiveLoop: "Grok Build overview",
    environmentMutation: "CLI reference",
    activeContextManagement: "Modes and commands",
    runtimeControl: "Permissions",
  }),
  "muse-code": documentedCodingHarness({
    adaptiveLoop: "Working with the agent",
    environmentMutation: "Muse Code overview",
    activeContextManagement: ["Working with the agent", "Configuration and context"],
    runtimeControl: "Permissions and safety",
  }),
  aider: documentedCodingHarness({
    adaptiveLoop: "Aider documentation",
    environmentMutation: "Options reference",
    activeContextManagement: "Repository map",
    runtimeControl: "Options reference",
  }),
  openhands: documentedCodingHarness({
    adaptiveLoop: "OpenHands 1.11.0 source",
    environmentMutation: "Sandbox overview",
    activeContextManagement: "Conversation persistence",
    runtimeControl: "Security and action confirmation",
  }),
  goose: documentedCodingHarness({
    adaptiveLoop: "Session recipes",
    environmentMutation: "Developer extension",
    activeContextManagement: "Smart context management",
    runtimeControl: "Developer extension",
  }),
  cline: documentedCodingHarness({
    adaptiveLoop: "Cline overview",
    environmentMutation: "CLI reference",
    activeContextManagement: "Memory Bank",
    runtimeControl: "Permission handling",
  }),
  "gemini-cli": documentedCodingHarness({
    adaptiveLoop: "Gemini CLI v0.52.0 source",
    environmentMutation: "Gemini CLI v0.52.0 source",
    activeContextManagement: "Persistent context and memory",
    runtimeControl: "Sandboxing",
  }),
  "antigravity-cli": documentedCodingHarness({
    adaptiveLoop: "Antigravity CLI overview",
    environmentMutation: "Antigravity CLI overview",
    activeContextManagement: "Conversation management",
    runtimeControl: "Fine-grained permissions",
  }),
  "copilot-cli": documentedCodingHarness({
    adaptiveLoop: "About GitHub Copilot CLI",
    environmentMutation: "Using Copilot CLI",
    activeContextManagement: "Copilot Memory",
    runtimeControl: "Using Copilot CLI",
  }),
  "cursor-cli": documentedCodingHarness({
    adaptiveLoop: "Cursor CLI overview",
    environmentMutation: "Headless mode",
    activeContextManagement: "Using Agent in the CLI",
    runtimeControl: "CLI permissions",
  }),
  "junie-cli": documentedCodingHarness({
    adaptiveLoop: "Junie CLI quick start",
    environmentMutation: "Junie CLI quick start",
    activeContextManagement: "Guidelines and memory",
    runtimeControl: "Action Allowlist",
  }),
  "factory-droid": documentedCodingHarness({
    adaptiveLoop: "Droid Exec",
    environmentMutation: "Droid CLI reference",
    activeContextManagement: "AGENTS.md instructions",
    runtimeControl: "Autonomy levels",
  }),
  forgecode: documentedCodingHarness({
    adaptiveLoop: "Audited ForgeCode readme",
    environmentMutation: "Built-in implementation agent",
    activeContextManagement: "Built-in agent roles",
    runtimeControl: "Permission policy",
  }),
  "qwen-code": documentedCodingHarness({
    adaptiveLoop: "Qwen Code overview",
    environmentMutation: "Qwen Code 0.21.0 source snapshot",
    activeContextManagement: "Persistent memory",
    runtimeControl: "Approval and settings reference",
  }),
  "continue-cli": documentedCodingHarness({
    adaptiveLoop: "Continue CLI quickstart",
    environmentMutation: "Models, rules, and tools",
    activeContextManagement: "Continue CLI quickstart",
    runtimeControl: "Tool permissions",
  }),
  "mistral-vibe": documentedCodingHarness({
    adaptiveLoop: "Vibe overview",
    environmentMutation: "Work with the CLI",
    activeContextManagement: "Pinned local-session architecture",
    runtimeControl: "Safety, approvals, and permissions",
  }),
  "kimi-code": documentedCodingHarness({
    adaptiveLoop: "Kimi Code documentation",
    environmentMutation: "Built-in tools and swarms",
    activeContextManagement: "Sessions and context",
    runtimeControl: "Command reference",
  }),
  "mimo-code": documentedCodingHarness({
    adaptiveLoop: "MiMo Code 0.1.9 source snapshot",
    environmentMutation: "Built-in tools",
    activeContextManagement: ["MiMo Code 0.1.9 source snapshot", "Sessions and context"],
    runtimeControl: "Permission policy",
  }),
  ante: documentedCodingHarness({
    adaptiveLoop: "Goal-driven sessions",
    environmentMutation: "Tool reference",
    activeContextManagement: "Core concepts and protocol",
    runtimeControl: "Permission configuration",
  }),
  "letta-code": documentedCodingHarness({
    adaptiveLoop: "Letta Code quickstart",
    environmentMutation: "Client tool execution model",
    activeContextManagement: "MemFS",
    runtimeControl: "Permissions",
  }),
  "kilo-code": documentedCodingHarness({
    adaptiveLoop: "Kilo CLI",
    environmentMutation: "Kilo CLI",
    activeContextManagement: "Codebase indexing",
    runtimeControl: "Agent permissions",
  }),
  "command-code": documentedCodingHarness({
    adaptiveLoop: "Goal mode",
    environmentMutation: "CLI reference",
    activeContextManagement: "Memory instructions",
    runtimeControl: "Permissions",
  }),
  codebuff: documentedCodingHarness({
    adaptiveLoop: "How Codebuff works",
    environmentMutation: "How Codebuff works",
    activeContextManagement: "Default autonomy and context management",
    runtimeControl: "Execution modes",
  }),
  crush: documentedCodingHarness({
    adaptiveLoop: "Pinned Crush overview",
    environmentMutation: "Pinned agent tests",
    activeContextManagement: "Pinned session store",
    runtimeControl: "Pinned permission manager",
  }),
  mux: documentedCodingHarness({
    adaptiveLoop: "Xum agents",
    environmentMutation: "Xum agents",
    activeContextManagement: "Instruction files",
    runtimeControl: "Administrative policy file",
  }),
  "coder-agents": documentedCodingHarness({
    adaptiveLoop: "Coder Agents overview",
    environmentMutation: "Built-in tools",
    activeContextManagement: "Coder Agents architecture",
    runtimeControl: "Platform controls",
  }),
  "zoo-code": documentedCodingHarness({
    adaptiveLoop: "Zoo Code documentation overview",
    environmentMutation: "Tool workflow",
    activeContextManagement: "Codebase indexing",
    runtimeControl: "Auto-approval policy at inspected commit",
  }),
  zcode: documentedCodingHarness({
    adaptiveLoop: "ZCode Agent workflow",
    environmentMutation: "ADE tools",
    activeContextManagement: "Task and file management",
    runtimeControl: "Safety confirmation",
  }),
  stagewise: documentedCodingHarness({
    adaptiveLoop: "How agents work",
    environmentMutation: "How agents work",
    activeContextManagement: "Agent context",
    runtimeControl: "Tool approval modes at inspected commit",
  }),
  "hermes-agent": documentedCodingHarness({
    adaptiveLoop: "Persistent goals",
    environmentMutation: "Tools and toolsets",
    activeContextManagement: "Persistent memory",
    runtimeControl: "Security and trust boundaries",
  }),
  openclaw: documentedCodingHarness({
    adaptiveLoop: ["Agent runtime", "Agent loop"],
    environmentMutation: ["Tools overview", "Exec tool"],
    activeContextManagement: ["Persistent memory", "Compaction"],
    runtimeControl: ["Tool configuration and policy", "Security and sandboxing"],
  }),
  "mini-swe-agent": documentedCodingHarness({
    adaptiveLoop: "Control flow",
    environmentMutation: "Control flow",
    activeContextManagement: "Default agent implementation",
    runtimeControl: "CLI modes",
  }),
  amp: documentedCodingHarness({
    adaptiveLoop: "Amp owner’s manual",
    environmentMutation: "Amp owner’s manual",
    activeContextManagement: "Scheduled agents",
    runtimeControl: "Permissions and plugins",
  }),
  "kiro-cli": documentedCodingHarness({
    adaptiveLoop: "Goal loop",
    environmentMutation: "Built-in tools",
    activeContextManagement: "Session management",
    runtimeControl: "Tool permissions",
  }),
  "poolside-cli": documentedCodingHarness({
    adaptiveLoop: "Poolside Agent CLI",
    environmentMutation: "CLI reference",
    activeContextManagement: "Interactive mode",
    runtimeControl: "Tool and path policy reference",
  }),
  plandex: documentedCodingHarness({
    adaptiveLoop: "Repository snapshot and lifecycle notice",
    environmentMutation: "Execution and debugging",
    activeContextManagement: "Context management",
    runtimeControl: "Autonomy levels",
  }),
  wakil: documentedCodingHarness({
    adaptiveLoop: "Wakil repository overview",
    environmentMutation: "Wakil repository overview",
    activeContextManagement: "Wakil durable memory",
    runtimeControl: "Wakil repository overview",
  }),
  "deepagents-code": documentedCodingHarness({
    adaptiveLoop: "Deep Agents Code threat model",
    environmentMutation: "Deep Agents Code threat model",
    activeContextManagement: "Deep Agents Code overview",
    runtimeControl: "Deep Agents Code threat model",
  }),
  opensquilla: documentedCodingHarness({
    adaptiveLoop: "OpenSquilla agents",
    environmentMutation: "OpenSquilla tools and sandbox",
    activeContextManagement: "OpenSquilla sessions",
    runtimeControl: "OpenSquilla approvals and permissions",
  }),
  postqode: documentedCodingHarness({
    adaptiveLoop: "PostQode agent package",
    environmentMutation: "PostQode coding-agent package",
    activeContextManagement: ["PostQode agent package", "PostQode headless-agent package"],
    runtimeControl: ["PostQode agent package", "PostQode headless-agent package"],
  }),
  kern: documentedCodingHarness({
    adaptiveLoop: "Kern overview",
    environmentMutation: "Kern tools",
    activeContextManagement: ["Kern context management", "Kern durable memory"],
    runtimeControl: "Kern configuration",
  }),
  ggcode: documentedCodingHarness({
    adaptiveLoop: "Agent loop implementation",
    environmentMutation: "Built-in tool registry",
    activeContextManagement: ["Context manager implementation", "Project memory"],
    runtimeControl: ["Permission modes", "Providers and endpoints"],
  }),
  reasonix: documentedCodingHarness({
    adaptiveLoop: "Reasonix engineering specification",
    environmentMutation: "Built-in tool contract",
    activeContextManagement: ["Reasonix engineering specification", "Context Engine v2"],
    runtimeControl: ["Permissions and sandbox", "Provider and model routes"],
  }),
  slate: documentedCodingHarness({
    adaptiveLoop: ["Slate product overview", "Slate orchestration and tracing"],
    environmentMutation: ["Slate quickstart", "Slate workspace setup"],
    activeContextManagement: ["Slate product overview", "Slate basics"],
    runtimeControl: "Slate configuration",
  }),
  "spectral-agent": documentedCodingHarness({
    adaptiveLoop: "Loop and goal mode",
    environmentMutation: ["Spectral Agent overview", "Projects and sessions"],
    activeContextManagement: "Observational memory",
    runtimeControl: ["Loop and goal mode", "Spectral subagents"],
  }),
  "deepseek-harness": documentedCodingHarness({
    adaptiveLoop: "Architecture and agent loop",
    environmentMutation: ["Web UI user guide", "Default profile composition"],
    activeContextManagement: ["Compaction subsystem", "Session persistence"],
    runtimeControl: ["Default profile composition", "Process sandbox", "Model provider configuration"],
  }),
};

export function getHarnessMembershipAssessment(
  harness: Harness,
): HarnessMembershipAssessment | null {
  if (harness.membership) return harness.membership;
  const definition = membershipDefinitions[harness.id];
  if (!definition) return null;

  const evidenceByTitle = new Map(harness.evidence.map((source) => [source.title, source.url]));
  const criteria = Object.fromEntries(
    Object.entries(definition.criteria).map(([criterion, assessment]) => {
      const sourceUrls = assessment.sourceTitles.flatMap((title) => {
        const url = evidenceByTitle.get(title);
        return url ? [url] : [];
      });
      const state = assessment.state === "documented"
        && sourceUrls.length !== assessment.sourceTitles.length
        ? "unknown"
        : assessment.state;
      return [criterion, { state, sourceUrls }];
    }),
  ) as HarnessMembershipAssessment["criteria"];

  return {
    layer: definition.layer,
    criteria,
    verifiedAt: harness.verifiedAt,
    limitation: definition.limitation,
  };
}

export function requireHarnessMembershipAssessment(harness: Harness): HarnessMembershipAssessment {
  const assessment = getHarnessMembershipAssessment(harness);
  if (!assessment) throw new Error(`Missing membership assessment for ${harness.id}`);
  return assessment;
}

export function hasDocumentedCodingHarnessMembership(harness: Harness) {
  const assessment = getHarnessMembershipAssessment(harness);
  return assessment?.layer === "coding-harness"
    && Object.values(assessment.criteria).every((criterion) => criterion.state === "documented");
}
