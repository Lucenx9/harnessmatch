import type {
  EvidenceSource,
  FeatureClaim,
  FeatureClaimState,
  FeatureKey,
  Harness,
} from "@/lib/types";
export { featureClaimStateLabels } from "@/lib/feature-claim-labels";

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

const documentedLimitation =
  "The source establishes the mechanism, not its quality or availability in every mode.";
const undocumentedScope = "No first-class support established by the current record";
const undocumentedLimitation =
  "Absence of current documentation is not proof that the capability is impossible.";

type FeatureClaimSeed = {
  state: Exclude<FeatureClaimState, "not-documented">;
  sourceTitles: string[];
  scope?: string;
  limitation?: string;
};

const documented = (...sourceTitles: string[]): FeatureClaimSeed => ({
  state: "documented",
  sourceTitles,
});

const configuredClaim = (
  state: FeatureClaimSeed["state"],
  sourceTitles: string[],
  scope: string,
  limitation?: string,
): FeatureClaimSeed => ({
  state,
  sourceTitles,
  scope,
  ...(limitation ? { limitation } : {}),
});

/**
 * Native capability ledger. Source titles are explicit foreign keys into each
 * harness evidence ledger; omitted features resolve to `not-documented`.
 */
const featureClaimSeedsByHarness = {
  "claude-code": {
    mcp: documented("Claude Code overview", "CLI reference"),
    subagents: documented("Parallel agents", "Subagents"),
    headless: documented("Claude Code overview", "Platforms and integrations"),
    browser: documented("Chrome integration", "Computer use"),
    sandbox: configuredClaim(
      "optional",
      ["Security", "Sandboxing"],
      "Optional OS sandbox locally; managed isolation on cloud surfaces",
      "Local sandbox coverage depends on configuration and does not contain every process or side effect.",
    ),
    checkpoints: documented("Checkpointing and rewind"),
  },
  codex: {
    mcp: documented("Model Context Protocol", "Skills and plugins"),
    localModels: documented("Developer command reference", "Admin rollout guide"),
    subagents: documented("Subagents", "Codex cloud"),
    headless: documented("Non-interactive mode", "Codex GitHub Action"),
    browser: documented("Browser", "ChatGPT desktop app"),
    sandbox: configuredClaim(
      "default",
      ["Developer command reference", "Approvals and security"],
      "Sandbox-first local CLI and managed cloud execution",
      "The effective boundary still depends on the selected sandbox and approval policy.",
    ),
  },
  opencode: {
    mcp: documented("Built-in and custom tools", "MCP servers"),
    localModels: documented("Providers", "Models"),
    subagents: documented("Agents and permissions"),
    headless: documented("Command-line interface", "Headless server"),
    sandbox: configuredClaim(
      "explicitly-absent",
      ["Pinned security policy"],
      "Host execution; permission rules are not process isolation",
      "The official security policy explicitly states that OpenCode has no sandbox.",
    ),
    checkpoints: documented("Terminal interface", "Session revert implementation"),
  },
  pi: {
    localModels: documented("Providers", "Local llama.cpp models"),
    headless: documented("JSON event stream", "RPC mode"),
    sandbox: configuredClaim(
      "explicitly-absent",
      ["Security"],
      "Host execution; external containerization is user-supplied",
      "The official security guide documents no built-in permission prompts or sandbox.",
    ),
  },
  omp: {
    mcp: documented("Settings reference", "MCP configuration"),
    localModels: documented("Provider reference"),
    subagents: documented("Oh My Pi repository", "Approval modes"),
    headless: documented("RPC protocol reference", "ACP implementation"),
    browser: documented("Oh My Pi repository", "Browser tool"),
  },
  "grok-build": {
    mcp: documented("Subagents and extensions", "Settings reference"),
    localModels: documented("Grok Build overview", "Open-source announcement"),
    subagents: documented("Worktrees", "Subagents and extensions"),
    headless: documented("Grok Build overview", "Headless and scripting"),
    sandbox: configuredClaim(
      "optional",
      ["Permissions and sandbox", "Worktrees"],
      "Optional OS sandbox profiles; disabled by default",
      "Network and filesystem coverage varies by platform and selected profile.",
    ),
    checkpoints: documented("Modes and commands", "Session and rewind guide"),
  },
  aider: {
    localModels: documented("Model connections", "Local models with Ollama"),
    headless: documented("Options reference", "Scripting Aider"),
    checkpoints: documented("Git integration and undo"),
  },
  openhands: {
    mcp: documented("Model Context Protocol", "CLI MCP server management"),
    localModels: documented("Local LLMs"),
    subagents: documented("Task Tool Set"),
    headless: documented("OpenHands 1.11.0 source", "Headless mode"),
    browser: documented("Browser use"),
    sandbox: documented("Sandbox overview", "Docker sandbox"),
  },
  goose: {
    mcp: documented("Computer Controller extension", "Security guide"),
    localModels: documented("Supported LLM providers", "Classification API specification"),
    subagents: documented("Subagents", "Codebase analysis"),
    headless: documented("Headless goose", "Session recipes"),
    browser: documented("Computer Controller extension"),
    sandbox: documented("goose v1.25.0 sandbox"),
  },
  cline: {
    mcp: documented("CLI reference", "MCP"),
    localModels: documented("Local models"),
    subagents: documented("Kanban", "Subagents"),
    headless: documented("Cline overview", "CLI overview"),
    browser: documented("Cline overview"),
    checkpoints: documented("Checkpoints"),
  },
  "gemini-cli": {
    mcp: documented("Trusted folders", "MCP integration"),
    subagents: documented("Subagents and browser agent", "Experimental Git worktrees"),
    headless: documented("Headless mode", "Policy engine"),
    browser: documented("Subagents and browser agent"),
    sandbox: configuredClaim(
      "optional",
      ["Sandboxing", "Subagents and browser agent"],
      "Optional OS or container sandbox profiles",
      "Profiles and platform support change the effective filesystem and network boundary.",
    ),
    checkpoints: documented("Checkpointing"),
  },
  "antigravity-cli": {
    mcp: documented("Fine-grained permissions", "Plugins and skills"),
    subagents: documented("Execution modes", "Background tasks and subagents"),
    headless: documented("Antigravity CLI overview", "CLI settings reference"),
    browser: documented("Fine-grained permissions"),
    sandbox: configuredClaim(
      "optional",
      ["Native terminal sandbox", "CLI settings reference"],
      "Optional OS or container isolation",
    ),
  },
  "copilot-cli": {
    mcp: documented("About GitHub Copilot CLI", "MCP configuration"),
    localModels: documented("About GitHub Copilot CLI", "Custom providers"),
    subagents: documented("Fleet subagents", "Copilot hooks"),
    headless: documented("Programmatic reference"),
    sandbox: configuredClaim(
      "optional",
      ["Cloud and local sandboxes", "Fleet subagents"],
      "Optional sandboxed execution mode",
    ),
    checkpoints: documented("Session rollback"),
  },
  "cursor-cli": {
    mcp: documented("Cursor CLI overview", "Parameters and isolation controls"),
    subagents: documented("CLI changelog"),
    headless: documented("Headless mode", "Parameters and isolation controls"),
    sandbox: configuredClaim(
      "optional",
      ["Parameters and isolation controls", "CLI configuration"],
      "Optional sandbox policy for command execution",
    ),
    checkpoints: documented("CLI configuration", "CLI changelog"),
  },
  "junie-cli": {
    mcp: documented("Action Allowlist", "MCP configuration"),
    localModels: documented("Ollama integration"),
    subagents: documented("Custom subagents"),
    headless: documented("Headless mode", "Junie CLI configuration"),
  },
  "factory-droid": {
    mcp: documented("Droid CLI reference", "Droid settings"),
    localModels: documented("Bring Your Own Key"),
    subagents: documented("Subagents", "Droid hooks"),
    headless: documented("Droid CLI reference", "Droid hooks"),
    browser: documented("Droid Control"),
    sandbox: configuredClaim(
      "optional",
      ["OS sandbox", "Terminal-Bench methodology"],
      "Private Preview OS sandbox; opt-in",
      "Per-command mode contains shell children while the main Droid process remains outside the boundary.",
    ),
    checkpoints: configuredClaim(
      "documented",
      ["Droid CLI reference"],
      "Interactive session rewind",
      "Rewind does not reverse external side effects.",
    ),
  },
  forgecode: {
    mcp: documented("Audited ForgeCode readme", "MCP integration"),
    localModels: documented("Installation and setup", "Custom and local providers"),
    subagents: documented("Delegated task tool"),
    headless: documented("Audited ForgeCode readme", "CLI implementation"),
  },
  "qwen-code": {
    mcp: documented("Built-in Computer Use release", "MCP server integration"),
    localModels: documented("Model providers"),
    subagents: documented("OpenTelemetry observability", "Nested subagent release"),
    headless: documented("Headless safety and budgets"),
    browser: documented("Built-in Computer Use release"),
    sandbox: configuredClaim(
      "optional",
      ["Sandbox", "Headless safety and budgets"],
      "Optional OS or container sandbox",
    ),
    checkpoints: documented("Checkpointing", "Commands and recovery"),
  },
  "continue-cli": {
    mcp: documented("Continue CLI quickstart", "Models, rules, and tools"),
    localModels: documented("Models, rules, and tools"),
    headless: documented("Continue CLI quickstart", "Tool permissions"),
  },
  "mistral-vibe": {
    mcp: documented("MCP servers", "Pinned changelog"),
    localModels: documented("Offline and local models", "Pinned shipped defaults"),
    subagents: documented("Agents and subagents", "Lifecycle hooks"),
    headless: documented("Work with the CLI", "Pinned CLI entrypoint"),
    checkpoints: documented("Pinned checkpoint and rewind manager", "Pinned local-session architecture"),
  },
  "kimi-code": {
    mcp: documented("Kimi Code documentation", "Model Context Protocol"),
    localModels: documented("Providers and models"),
    subagents: documented("Kimi Code documentation", "Configuration defaults"),
    headless: documented("Command reference"),
  },
  "letta-code": {
    mcp: documented("MCP tool execution model", "Pinned CLI MCP implementation"),
    localModels: documented("Supported model-provider types"),
    subagents: documented("Subagents"),
    headless: documented("Letta Code quickstart", "Headless mode"),
    sandbox: configuredClaim(
      "surface-specific",
      ["Execution environments", "Cloud sandboxes"],
      "Managed cloud sandbox; local tools remain host-executed",
    ),
  },
  "kilo-code": {
    mcp: documented("Browser use", "MCP configuration"),
    localModels: documented("AI providers", "Ollama local models"),
    subagents: documented("Custom subagents", "Agent permissions"),
    headless: documented("Browser use", "Kilo CLI product surface"),
    browser: documented("Cloud Agent", "Browser use"),
    sandbox: configuredClaim(
      "surface-specific",
      ["Cloud Agent", "OS sandboxing"],
      "Opt-in locally; managed isolation on cloud surfaces",
    ),
    checkpoints: documented("Checkpoint recovery"),
  },
  "command-code": {
    mcp: documented("MCP integration", "Settings and configuration"),
    subagents: documented("Custom agents", "Background tasks and scheduling"),
    headless: documented("CLI reference", "Permissions"),
    checkpoints: documented("Sessions and checkpoints"),
  },
  codebuff: {
    mcp: documented("Pinned browser agent", "Pinned MCP client"),
    subagents: documented("Agent overview", "How Codebuff works"),
    headless: documented("SDK and programmatic access", "Local chat history and troubleshooting"),
    browser: documented("Pinned public implementation", "Pinned browser agent"),
  },
  crush: {
    mcp: documented("Pinned Crush overview", "Crush configuration schema"),
    localModels: documented("Pinned Crush overview"),
    subagents: documented("Pinned task-agent implementation", "Pinned task-agent instructions"),
    headless: documented("Pinned non-interactive run command", "Pinned cross-platform CI workflow"),
  },
  mux: {
    mcp: documented("Mux MCP servers", "Administrative policy file"),
    localModels: documented("Model providers", "Local runtime"),
    subagents: documented("Mux agents", "ACP editor integrations"),
    headless: documented("Mux agents", "Mux MCP servers"),
    sandbox: configuredClaim(
      "surface-specific",
      ["Mux runtimes", "Local runtime"],
      "Container or devcontainer modes; host execution remains available",
    ),
  },
  "coder-agents": {
    mcp: documented("Platform controls", "MCP server controls"),
    localModels: documented("Coder Agents overview", "Models and providers"),
    subagents: documented("Coder Agents overview", "Virtual desktop"),
    headless: documented("Coder Agents getting started", "Workspace execution implementation at inspected commit"),
    browser: configuredClaim(
      "optional",
      ["Virtual desktop"],
      "Experimental computer-use subagent in desktop-enabled workspaces",
    ),
    sandbox: configuredClaim(
      "surface-specific",
      ["Coder Agents architecture"],
      "Isolation depends on the selected workspace template",
    ),
  },
  "zoo-code": {
    mcp: documented("Zoo Code product page", "MCP integration"),
    localModels: documented("Using local models"),
    subagents: documented("Modes and orchestrator", "Tool workflow"),
    checkpoints: documented("Checkpoints"),
  },
  zcode: {
    mcp: documented("MCP servers", "Plugin system"),
    subagents: documented("Subagents", "Plugin system"),
    browser: documented("ZCode Agent workflow", "ADE tools"),
    sandbox: documented("ADE tools", "Remote development"),
    checkpoints: documented("Safety confirmation"),
  },
  stagewise: {
    localModels: documented("Models and providers", "Custom providers"),
    subagents: documented("stagewise product overview", "Product chat agent at inspected commit"),
    browser: documented("Install stagewise", "Browser and agent"),
    checkpoints: documented("Diff review", "Diff history service at inspected commit"),
  },
  "hermes-agent": {
    mcp: documented("Hermes documentation overview", "MCP integration"),
    localModels: documented("API server", "Desktop app"),
    subagents: documented("Hermes Agent 0.19.0 release", "Hermes documentation overview"),
    headless: documented("Hermes documentation overview", "Tools and toolsets"),
    browser: documented("Hermes documentation overview", "Tools and toolsets"),
    sandbox: documented("Security and trust boundaries", "Terminal backend configuration"),
    checkpoints: documented("Checkpoint and rollback", "Checkpoint implementation at inspected commit"),
  },
  openclaw: {
    mcp: documented("MCP"),
    localModels: documented("Local models"),
    subagents: documented("Sub-agents", "Multi-agent routing"),
    headless: documented("Automation overview", "Background task ledger"),
    browser: documented("Managed browser"),
    sandbox: configuredClaim(
      "optional",
      ["Security and sandboxing", "Docker installation"],
      "Optional container isolation when sandboxing is deliberately enabled",
      "The normal local runtime remains host-first and unsandboxed by default.",
    ),
  },
  "mini-swe-agent": {
    localModels: documented("Local model configuration"),
    headless: documented("SWE-bench runner", "ProgramBench runner"),
    sandbox: documented("Execution environments", "Experimental Bubblewrap environment"),
  },
  amp: {
    mcp: documented("MCP and workspace trust"),
    subagents: documented("Subagents and review", "Permissions and plugins"),
    headless: documented("Remote runners", "CLI execute mode"),
    browser: configuredClaim(
      "documented",
      ["Amp owner’s manual"],
      "Browser-capable local or managed agent workflow",
    ),
    sandbox: configuredClaim(
      "surface-specific",
      ["Cloud orbs", "Agents in Orbs announcement"],
      "Managed cloud orbs; local tools run on the host",
    ),
  },
  "kiro-cli": {
    mcp: documented("CLI quickstart", "Headless mode"),
    subagents: documented("Subagents", "Built-in tools"),
    headless: documented("Tool permissions", "Headless mode"),
    checkpoints: documented("Conversation rewind", "Classic checkpointing"),
  },
  "poolside-cli": {
    mcp: documented("CLI reference", "Tool and path policy reference"),
    localModels: documented("Release repository readme at inspected commit"),
    headless: documented("Poolside Agent CLI", "Automated mode"),
    sandbox: configuredClaim(
      "surface-specific",
      ["Tool and path policy reference", "Local sandboxes"],
      "Configured local container isolation for user-managed runs",
    ),
  },
  plandex: {
    localModels: documented("Claude Pro and Max subscriptions", "Ollama local models"),
    headless: documented("CLI reference", "Browser debugging source"),
    browser: documented("Execution and debugging", "Browser debugging source"),
    checkpoints: documented("CLI reference", "Autonomy defaults in source"),
  },
  wakil: {
    mcp: documented("Wakil repository overview", "Wakil configuration example"),
    localModels: documented("Wakil repository overview", "Wakil configuration example"),
    subagents: documented("Wakil repository overview", "Wakil durable memory"),
    browser: configuredClaim(
      "optional",
      ["Wakil repository overview", "Wakil configuration example"],
      "Optional headless-browser tools; host URL opening remains outside the container",
    ),
    sandbox: configuredClaim(
      "default",
      ["Wakil repository overview", "Wakil configuration example"],
      "Hardened persistent Docker container by default; direct host mode is available",
      "Isolation weakens materially when direct mode or host Docker-socket access is enabled.",
    ),
  },
  "deepagents-code": {
    mcp: documented("Deep Agents Code threat model", "Deep Agents Code MCP implementation"),
    subagents: documented("Deep Agents Code threat model", "Deep Agents Code overview"),
    headless: documented("Deep Agents Code overview", "Deep Agents Code non-interactive runner"),
    sandbox: configuredClaim(
      "optional",
      ["Deep Agents Code overview", "Deep Agents Code sandbox factory"],
      "Optional managed remote sandbox backends; local execution trusts the host working directory",
    ),
  },
  opensquilla: {
    mcp: documented("OpenSquilla MCP server"),
    localModels: documented("OpenSquilla overview"),
    subagents: documented("OpenSquilla sessions", "OpenSquilla agents"),
    headless: documented("OpenSquilla CLI"),
    sandbox: configuredClaim(
      "surface-specific",
      ["OpenSquilla tools and sandbox", "OpenSquilla approvals and permissions"],
      "OS- and permission-mode-dependent execution isolation",
      "Availability and enforcement vary by platform; bypass and full-access modes deliberately weaken the boundary.",
    ),
  },
  postqode: {
    mcp: documented("PostQode product overview", "PostQode MCP package"),
    localModels: configuredClaim(
      "surface-specific",
      ["PostQode enterprise deployment"],
      "Private or self-hosted model paths on enterprise deployments",
    ),
    headless: documented("PostQode headless-agent package"),
    browser: configuredClaim(
      "optional",
      ["PostQode browser package"],
      "Optional browser-automation tool package",
    ),
  },
  kern: {
    mcp: documented("Kern MCP", "Kern configuration"),
    localModels: documented("Kern overview", "Kern configuration"),
    subagents: documented("Kern tools", "Kern subagents"),
    headless: configuredClaim(
      "documented",
      ["Kern overview"],
      "Long-running background agent service with automation and channel surfaces",
    ),
    sandbox: configuredClaim(
      "surface-specific",
      ["Kern Docker deployment"],
      "Optional whole-service container deployment",
      "Docker isolates the deployed service; it is not a disposable per-task sandbox.",
    ),
  },
  ggcode: {
    mcp: documented("MCP servers"),
    localModels: documented("Providers and endpoints"),
    subagents: documented("Multi-agent execution modes"),
    headless: documented("CLI and daemon modes"),
    browser: documented("Built-in tool registry", "Browser tool implementation"),
    checkpoints: configuredClaim(
      "documented",
      ["File checkpoints and undo"],
      "In-process checkpoints for file edits made through GGCode tools",
      "File checkpoints do not reverse shell, Git, browser, messaging, or external-service side effects.",
    ),
  },
} satisfies Record<string, Partial<Record<FeatureKey, FeatureClaimSeed>>>;

export const featureClaimHarnessIds = Object.keys(featureClaimSeedsByHarness);

type FeatureClaimHarnessRecord = {
  id: string;
  verifiedAt: string;
  evidence: EvidenceSource[];
};

function sourceUrlsForTitles(harness: FeatureClaimHarnessRecord, sourceTitles: string[]) {
  return sourceTitles.map((title) => {
    const matchingSources = harness.evidence.filter((source) => source.title === title);
    const matchingSource = matchingSources.at(0);
    if (matchingSources.length !== 1 || !matchingSource) {
      throw new Error(
        `${harness.id}: capability source title ${JSON.stringify(title)} matched ${matchingSources.length} evidence records`,
      );
    }
    return matchingSource.url;
  });
}

export function featureClaimsForHarness(
  harness: FeatureClaimHarnessRecord,
): Record<FeatureKey, FeatureClaim> {
  const seeds = featureClaimSeedsByHarness[harness.id as keyof typeof featureClaimSeedsByHarness];
  if (!seeds) throw new Error(`${harness.id}: missing native capability ledger`);

  return Object.fromEntries(featureKeys.map((feature) => {
    const seed = (seeds as Partial<Record<FeatureKey, FeatureClaimSeed>>)[feature];
    if (!seed) {
      return [feature, {
        state: "not-documented",
        scope: undocumentedScope,
        sourceUrls: [],
        verifiedAt: harness.verifiedAt,
        limitation: undocumentedLimitation,
      } satisfies FeatureClaim];
    }

    return [feature, {
      state: seed.state,
      scope: seed.scope ?? featureScopes[feature],
      sourceUrls: sourceUrlsForTitles(harness, seed.sourceTitles),
      verifiedAt: harness.verifiedAt,
      limitation: seed.limitation ?? documentedLimitation,
    } satisfies FeatureClaim];
  })) as Record<FeatureKey, FeatureClaim>;
}

export function featureClaimSupportsRequirement(claim: FeatureClaim): boolean {
  return claim.state === "default"
    || claim.state === "documented"
    || claim.state === "optional"
    || claim.state === "surface-specific";
}

export function featureClaimFor(
  harness: Pick<Harness, "featureClaims">,
  feature: FeatureKey,
): FeatureClaim {
  return harness.featureClaims[feature];
}

/** Derived compatibility view for filtering and assertions; never persisted. */
export function featureSupportFor(
  harness: Pick<Harness, "featureClaims"> | null | undefined,
): Record<FeatureKey, boolean> {
  if (!harness) throw new Error("Cannot derive feature support for a missing harness");
  return Object.fromEntries(featureKeys.map((feature) => [
    feature,
    featureClaimSupportsRequirement(featureClaimFor(harness, feature)),
  ])) as Record<FeatureKey, boolean>;
}
