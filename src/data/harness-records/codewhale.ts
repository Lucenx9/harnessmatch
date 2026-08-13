import type { HarnessRecord } from "./types";

const verifiedAt = "2026-08-02";
const hooksVerifiedAt = "2026-08-05";
const latestReleaseVerifiedAt = "2026-08-10";
const currentReleaseVerifiedAt = "2026-08-13";
const recordVerifiedAt = currentReleaseVerifiedAt;
const commit = "4f2c97b0d75c039a9b6069ebcf210cc499583376";
const repositoryBase = `https://github.com/Hmbown/CodeWhale/blob/${commit}`;

export const codewhale = {
  id: "codewhale",
  slug: "codewhale",
  name: "CodeWhale",
  tagline: "Model-portable Rust coding agent with governed execution and resumable fleets.",
  summary:
    "An MIT-licensed terminal coding harness with an adaptive tool loop, interactive and headless modes, persistent memory, branchable and resumable session trees, MCP and skills, local-model routes, optional OS or external sandboxes, and ledger-backed multi-worker fleets.",
  logo: {
    src: "/harnesses/codewhale.svg",
    sourceUrl: `${repositoryBase}/web/app/icon.svg`,
    verifiedAt,
  },
  status: "active",
  license: "MIT",
  classification: {
    role: "coding-agent",
    orchestration: "multi-agent-runtime",
    runtime: "host-first",
    isolation: ["os-sandbox", "managed-sandbox", "worktree"],
    state: "persistent-memory",
  },
  interfaces: ["terminal", "web", "automation"],
  providerStyle: "multi-provider",
  supportsSubscription: true,
  capabilities: {
    simplicity: 3,
    flexibility: 5,
    security: 4,
    autonomy: 5,
    automation: 5,
    largeRepo: 4,
    humanControl: 5,
  },
  bestFor: [
    "Terminal or CI workflows that need the same tools across hosted, local, and OpenAI-compatible model routes",
    "Teams that want explicit planning, approval, repository-law, and optional OS-sandbox controls",
    "Longer tasks that benefit from persistent memory, turn restore, and ledger-backed multi-worker resume",
  ],
  tradeoffs: [
    "Local execution is host-first: macOS Seatbelt depends on a successful probe, Linux bubblewrap is opt-in, Windows has no advertised local OS sandbox, and unavailable wrappers fall back unless external policy blocks the run",
    "The strongest approval and lifecycle-hook controls are configurable; Full Access weakens prompts, and TUI hooks do not fire for codewhale exec or other CLI subcommands",
    "The loopback web client is a local control surface rather than remote managed execution, and its one-time token does not turn it into a multi-user service",
    "Fleet workers reuse headless CodeWhale and an append-only ledger; this establishes coordination and resume, not independent quality or task-success evidence",
    "CodeWhale 0.9.5 removes the default 100-step ceiling from headless runs and makes automatic goal continuation unlimited unless configured, so unattended workloads still require explicit turn, time, spend, credential, and network bounds",
    "Fresh 0.9.6 installs enable anonymous aggregate usage counting after a first-run modal; prior opt-outs remain off and the release documents an immediate persistent opt-out",
    "Repository eval and acceptance assets are project-owned development evidence, so no product benchmark score is imported",
  ],
  setup:
    "Install CodeWhale 0.9.6 from npm, Cargo, or a platform archive; select a provider and model; then choose permission, sandbox, memory, telemetry, hook, and fleet settings for the workflow.",
  verifiedAt: recordVerifiedAt,
  evidence: [
    {
      title: "CodeWhale 0.9.3 source snapshot",
      topic: "product-surfaces",
      url: `${repositoryBase}/README.md`,
      covers: "Adaptive coding loop, file and command tools, interactive and headless surfaces, model switching, permission postures, fleet resume, and turn restore",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Provider registry",
      topic: "product-surfaces",
      url: `${repositoryBase}/docs/PROVIDERS.md`,
      covers: "Hosted and local provider routes, explicit model and endpoint selection, OpenAI-compatible gateways, Ollama, vLLM, SGLang, and Codex subscription-token routing",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Authorization order",
      topic: "execution-control",
      url: `${repositoryBase}/docs/AUTHORIZATION_ORDER.md`,
      covers: "Mode, hook, permission, safety-floor, constitution, approval, and sandbox ordering across execution",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "TUI lifecycle hooks",
      topic: "execution-control",
      url: `${repositoryBase}/docs/HOOKS.md`,
      covers: "TUI-only hook scope, lifecycle events, approval and steering behavior, trusted project hooks, and explicit exclusion for codewhale exec and other CLI subcommands",
      kind: "official-repository",
      verifiedAt: hooksVerifiedAt,
    },
    {
      title: "Sandbox threat model",
      topic: "execution-control",
      url: `${repositoryBase}/docs/SANDBOX.md`,
      covers: "Seatbelt, opt-in bubblewrap, external OpenSandbox execution, unsandboxed fallbacks, platform limits, and diagnostic attribution",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Fleet runtime",
      topic: "orchestration-state",
      url: `${repositoryBase}/docs/FLEET.md`,
      covers: "Headless workers, roles, worktree authority, append-only event ledger, budgets, monitoring, cancellation, and resume",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Persistent memory",
      topic: "orchestration-state",
      url: `${repositoryBase}/docs/MEMORY.md`,
      covers: "User and project memory files, loading, writes, trust boundaries, and persistent context across sessions",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "MCP integration",
      topic: "automation-extensions",
      url: `${repositoryBase}/docs/MCP.md`,
      covers: "MCP server configuration, transports, tools, resources, authentication, and execution boundaries",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Skills and subagents",
      topic: "automation-extensions",
      url: `${repositoryBase}/docs/SKILLS.md`,
      covers: "Reusable skill discovery and loading, project trust, invocation, and task-specific instruction packages",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Subagent runtime",
      topic: "automation-extensions",
      url: `${repositoryBase}/docs/SUBAGENTS.md`,
      covers: "Delegated agent profiles, tool and write authority, worktree use, budgets, and result delivery",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Local web client",
      topic: "product-surfaces",
      url: `${repositoryBase}/docs/WEB.md`,
      covers: "Loopback-only browser client, one-time authentication, session handling, and non-remote security boundary",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "CodeWhale 0.9.3 release",
      topic: "releases-code-audit",
      url: "https://github.com/Hmbown/CodeWhale/releases/tag/v0.9.3",
      covers: "Current stable version, publication date, platform artifacts, and release scope",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "CodeWhale 0.9.5 release",
      topic: "orchestration-state",
      url: "https://github.com/Hmbown/CodeWhale/releases/tag/v0.9.5",
      covers:
        "Single-runtime distribution, Runtime API controls, append-only session-tree history, branch, fork and resume commands, durable Fleet receipts, and explicit opt-in execution ceilings",
      kind: "official-announcement",
      verifiedAt: latestReleaseVerifiedAt,
    },
    {
      title: "CodeWhale 0.9.6 runtime and control release",
      topic: "orchestration-state",
      url: "https://github.com/Hmbown/CodeWhale/releases/tag/v0.9.6",
      covers:
        "Mistral provider routing, explicit persistent headless services, hosted Work handoff boundaries, ACP tool turns, policy-filtered tool discovery, cache-stable compaction, immutable child route receipts, and first-run telemetry disclosure",
      kind: "official-announcement",
      verifiedAt: currentReleaseVerifiedAt,
    },
  ],
} satisfies HarnessRecord;
