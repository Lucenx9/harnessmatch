import type { HarnessRecord } from "./types";

const verifiedAt = "2026-08-02";
const releaseReviewAt = "2026-08-04";
const latestReleaseReviewAt = "2026-08-10";
const recordVerifiedAt = latestReleaseReviewAt;
const inspectedRef = "c46e3af1c2732fe2b3dedb0bd47eb39a629357d2";
const repositoryBase = `https://github.com/esengine/DeepSeek-Reasonix/blob/${inspectedRef}`;

export const reasonix = {
  id: "reasonix",
  slug: "reasonix",
  name: "Reasonix",
  tagline:
    "Multi-provider coding harness with durable context, delegated agents, and policy controls.",
  summary:
    "An MIT-licensed coding harness whose Rust runtime implements an adaptive model-and-tool loop, repository and shell mutation, automatic and transaction-safe context maintenance, durable project memory, delegated agents, MCP, skills, policy rules, OS shell sandboxing on supported platforms, persistent checkpoints, and structured headless execution. The same core is exposed through terminal, desktop, local web, editor, and automation surfaces.",
  logo: {
    src: "/harnesses/reasonix.svg",
    sourceUrl: `${repositoryBase}/site/public/favicon.svg`,
    verifiedAt,
  },
  status: "active",
  license: "MIT",
  classification: {
    role: "coding-agent",
    orchestration: "delegated-subagents",
    runtime: "sandbox-first",
    isolation: ["os-sandbox"],
    state: "persistent-memory",
  },
  interfaces: ["terminal", "ide", "web", "automation"],
  providerStyle: "multi-provider",
  supportsSubscription: true,
  capabilities: {
    simplicity: 4,
    flexibility: 5,
    security: 4,
    autonomy: 5,
    automation: 4,
    largeRepo: 4,
    humanControl: 4,
  },
  bestFor: [
    "Multi-provider or self-hosted endpoint workflows that need one harness across terminal, desktop, web, and editor clients",
    "Long repository tasks that benefit from automatic compaction, durable project memory, resumable goals, and delegated subagents",
    "Local macOS or Linux execution that needs explicit permission policy, OS shell sandboxing, structured events, and file checkpoints",
  ],
  tradeoffs: [
    "The cache-oriented design is documented, but the project's cost and cache-hit marketing figures are not admitted as independent product measurements",
    "The OS sandbox is enabled by default for Bash on macOS and supported Linux installations, but Windows shell commands run without that isolation; network access is allowed by default, and users can disable the sandbox",
    "Workspace file tools remain path-confined, but installed MCP servers, hooks, plugins, language servers, and other trusted extensions have separate execution boundaries; MCP tool calls do not receive Reasonix's per-tool approval flow",
    "Checkpoints cover previewable Reasonix file-edit tools and conversation state, not Bash, move operations, remote services, or other external side effects; rewind can overwrite file changes made outside Reasonix after the snapshot",
    "Headless writes require an explicit automatic permission mode; deny rules still apply, but unattended use removes interactive approval and needs independent time, spend, credential, and network limits",
    "Self-hosted model support means connecting an OpenAI-compatible or Anthropic-compatible endpoint; Reasonix does not bundle a local model runtime",
    "The local web server binds to loopback without authentication by default; remote exposure requires an explicit token or password and an appropriate network boundary",
    "Reasonix 1.19.3 removed the desktop Guard and Safe Mode startup behaviors; recovery now relies on atomic versioned updates, explicit workspace-conflict actions, logs, and updater recovery paths rather than a Safe Mode boundary",
    "The built-in web tool retrieves page content rather than controlling an interactive browser; browser automation would require a separately trusted extension such as an MCP server",
  ],
  setup:
    "Install the stable Reasonix CLI, configure a supported provider or compatible endpoint, review workspace permissions and platform-specific sandbox coverage, then enable headless auto mode, MCP servers, plugins, hooks, or remote web access only inside an independently bounded environment.",
  verifiedAt: recordVerifiedAt,
  evidence: [
    {
      title: "Reasonix v1.19.2 release",
      topic: "releases-code-audit",
      url: "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.19.2",
      covers:
        "Stable version boundary, release date, source tag, platform-specific CLI and desktop archives, checksums, and package metadata",
      kind: "official-announcement",
      verifiedAt,
    },
    {
      title: "Reasonix v1.19.3 release",
      topic: "enterprise-operations",
      url: "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.19.3",
      covers:
        "Removal of Guard and Safe Mode, atomic versioned desktop updates, workspace-writer conflict recovery actions, and consolidation onto one stable release channel",
      kind: "official-announcement",
      verifiedAt: releaseReviewAt,
    },
    {
      title: "Reasonix v1.19.5 release",
      topic: "enterprise-operations",
      url: "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.19.5",
      covers:
        "Bounded event-log replay, preserved load failures, workspace-confined project prompt paths, updater recovery routes, usage records, and configurable context-compaction thresholds",
      kind: "official-announcement",
      verifiedAt: releaseReviewAt,
    },
    {
      title: "Reasonix v1.21.0 release",
      topic: "enterprise-operations",
      url: "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.21.0",
      covers:
        "Structured shell outcomes, atomic provider-stream replay, session-scoped Bash temporary files, machine-session resume, and removal of the Goal token hard stop",
      kind: "official-announcement",
      verifiedAt: latestReleaseReviewAt,
    },
    {
      title: "Reasonix v1.21.3 release",
      topic: "orchestration-state",
      url: "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.21.3",
      covers:
        "Adaptive no-progress detection, retry-aware compaction decisions, visible storage paths, and explicit Kimi K3 reasoning through custom gateways",
      kind: "official-announcement",
      verifiedAt: latestReleaseReviewAt,
    },
    {
      title: "Reasonix v1.22.0 release",
      topic: "orchestration-state",
      url: "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.22.0",
      covers:
        "Atomic fsync-backed session sidecars, cross-process locking, idempotent context cleanup, atomic summary transactions, CLI-to-web handoff, and bounded shell output",
      kind: "official-announcement",
      verifiedAt: latestReleaseReviewAt,
    },
    {
      title: "Reasonix product overview",
      topic: "product-surfaces",
      url: "https://reasonix.io/",
      covers:
        "Coding-agent identity, shared terminal and desktop engine, provider routing, context engine, permission modes, subagents, skills, MCP, and supported surfaces",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Reasonix inspected source tree",
      topic: "releases-code-audit",
      url: `https://github.com/esengine/DeepSeek-Reasonix/tree/${inspectedRef}`,
      covers:
        "Exact stable-release source snapshot, MIT license, runtime and clients, 26 workflows, 837 test-like paths, and project-owned benchmark tasks",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Reasonix engineering specification",
      topic: "releases-code-audit",
      url: `${repositoryBase}/docs/SPEC.md`,
      covers:
        "Adaptive provider and tool loop, step bounds, provider registry, model selection, built-in and MCP tools, context compaction, memory, and session persistence",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Built-in tool contract",
      topic: "execution-control",
      url: `${repositoryBase}/docs/TOOL_CONTRACT.md`,
      covers:
        "Repository reads, writes, edits, moves, search, code index, shell execution, web retrieval, tool schemas, and error behavior",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Permissions and sandbox",
      topic: "execution-control",
      url: `${repositoryBase}/docs/GUIDE.md#permissions--sandbox`,
      covers:
        "Allow, ask, and deny precedence; headless fail-closed behavior; workspace path confinement; macOS Seatbelt and Linux bubblewrap; Windows limitation; network and extension boundaries",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Provider and model routes",
      topic: "product-surfaces",
      url: `${repositoryBase}/docs/GUIDE.md#custom-openai-compatible-providers`,
      covers:
        "OpenAI-compatible and Anthropic-compatible endpoints, self-hosted services, provider presets, model selection, API-key setup, and coding-plan routes",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Context Engine v2",
      topic: "orchestration-state",
      url: `${repositoryBase}/docs/SESSION_MEMORY_RETRIEVAL.md`,
      covers:
        "Hierarchical repository instructions, automatic context reconstruction, durable facts and revisions, retrieval, persistence, and memory scope",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Subagent profiles",
      topic: "orchestration-state",
      url: `${repositoryBase}/docs/SUBAGENT_PROFILES.md`,
      covers:
        "Isolated delegated agents, profile-specific prompts and tools, task and fleet execution, configurable concurrency, and parallel-writer controls",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Goal and AutoResearch",
      topic: "orchestration-state",
      url: `${repositoryBase}/docs/GUIDE.md#goal-and-autoresearch`,
      covers:
        "Durable long-running task state, iterative evidence, requirement audits, stall detection, pivoting, continuation, and stopping behavior",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Headless CLI and structured events",
      topic: "automation-extensions",
      url: `${repositoryBase}/docs/CLI.md`,
      covers:
        "Non-interactive runs, JSON and stream-JSON output, JSONL event logs, permission modes, session continuation, and machine-readable task controls",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "MCP integration and trust boundary",
      topic: "automation-extensions",
      url: `${repositoryBase}/docs/GUIDE.md#plugins-mcp`,
      covers:
        "Stdio, HTTP, and SSE MCP servers, tool discovery, configuration, installation authorization, direct tool execution, and explicit trust limitations",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Skills and plugin packages",
      topic: "automation-extensions",
      url: `${repositoryBase}/docs/PLUGIN_PACKAGES.md`,
      covers:
        "Reusable skills, hooks, MCP bundles, package manifests, installation, enablement, validation, updates, and trust considerations",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "ACP editor integration",
      topic: "product-surfaces",
      url: `${repositoryBase}/docs/ACP.md`,
      covers:
        "Agent Client Protocol transport, editor launch configuration, shared runtime behavior, sessions, capabilities, authentication, and diagnostics",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Checkpoints and rewind",
      topic: "orchestration-state",
      url: `${repositoryBase}/docs/CHECKPOINTS.md`,
      covers:
        "Persistent code and conversation snapshots, preview, restore, session survival, supported edit tools, exclusions, and overwrite risks",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Security policy",
      topic: "execution-control",
      url: `${repositoryBase}/SECURITY.md`,
      covers:
        "Supported security controls, workspace confinement, permissions, shell sandboxing, secret handling, local-server protections, and trusted extension boundaries",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Recovery in the inspected v1.19.2 source snapshot",
      topic: "enterprise-operations",
      url: `${repositoryBase}/docs/RECOVERY.md`,
      covers:
        "Historical v1.19.2 crash recovery, Safe Mode startup, configuration reset, update rollback, session repair, logs, and recovery limitations before the 1.19.3 removal",
      kind: "official-repository",
      verifiedAt,
    },
  ],
} satisfies HarnessRecord;
