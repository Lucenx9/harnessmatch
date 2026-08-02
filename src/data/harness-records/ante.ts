import type { HarnessRecord } from "./types";

const verifiedAt = "2026-08-02";
const inspectedRef = "8ce59518ed8a2ddda46c07cbb0b6fb1f528438a3";

export const ante = {
  id: "ante",
  slug: "ante",
  name: "Ante",
  tagline: "Alpha terminal harness with goal loops, local models, persistent memory, and subagents.",
  summary:
    "An alpha terminal coding harness distributed as a self-contained binary, with repository and shell tools, explicit goal loops, automatic context compaction, persistent project memory, delegated subagents, local GGUF inference, MCP, skills, headless runs, and a structured server protocol. Local execution is host-first: permissions and tool filters govern calls but do not establish an operating-system sandbox.",
  logo: {
    src: "/harnesses/ante.png",
    sourceUrl: `https://github.com/AntigmaLabs/ante-preview/blob/${inspectedRef}/docs-site/static/assets/ante.png`,
    verifiedAt,
  },
  status: "active",
  license: "Apache-2.0 components; preview binary terms",
  classification: {
    role: "coding-agent",
    orchestration: "delegated-subagents",
    runtime: "host-first",
    isolation: [],
    state: "persistent-memory",
  },
  interfaces: ["terminal", "automation"],
  providerStyle: "multi-provider",
  supportsSubscription: true,
  capabilities: {
    simplicity: 4,
    flexibility: 5,
    security: 3,
    autonomy: 5,
    automation: 4,
    largeRepo: 4,
    humanControl: 3,
  },
  bestFor: [
    "Terminal workflows that need provider switching, subscription login, or fully local GGUF inference",
    "Longer repository tasks using explicit goal conditions, automatic compaction, persistent memory, and delegated subagents",
    "Scripted or editor-integrated operation through headless JSON events or the long-lived JSONL and WebSocket protocol",
  ],
  tradeoffs: [
    "Ante is an alpha research preview with documented breaking-change and incomplete-functionality risk; binary distribution may change or stop during the preview period",
    "The public repository exposes documentation, protocol and SDK components, a process-execution component, and evaluation adapters, but the core harness remains private and ships as a prebuilt binary",
    "Local tools execute with host privileges and no documented operating-system sandbox; interactive approvals and permission rules are controls over calls rather than process isolation",
    "Headless runs always imply yolo approval, and MCP tools require no approval by default, so unattended use needs restrictive tool filters and an independently constrained runtime",
    "Goal completion and the optional verification pass are product-internal model judgments rather than independent proof of task success; iteration caps and external time or spend limits remain necessary",
    "Persistent memory can influence later sessions, while session resume restores conversation state rather than rolling back files, shell effects, network actions, or external services",
  ],
  setup:
    "Install the Ante binary, connect a supported API or subscription provider or select a local GGUF model, review permission and tool-filter rules, and add external isolation before unattended mutation.",
  verifiedAt,
  evidence: [
    {
      title: "Ante alpha source snapshot",
      topic: "releases-code-audit",
      url: `https://github.com/AntigmaLabs/ante-preview/tree/${inspectedRef}`,
      covers:
        "Immutable public alpha snapshot for documentation, protocol and SDK components, execution library, release history, CI, and project-owned evaluation assets; the core harness remains private",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Ante v0.preview.68 release",
      topic: "releases-code-audit",
      url: "https://github.com/AntigmaLabs/ante-preview/releases/tag/v0.preview.68",
      covers:
        "Current public alpha version boundary, macOS and Linux binary distributions, release date, and shipped preview channel",
      kind: "official-announcement",
      verifiedAt,
    },
    {
      title: "Ante binary preview terms",
      topic: "releases-code-audit",
      url: `https://github.com/AntigmaLabs/ante-preview/blob/${inspectedRef}/BINARY-TERMS.md`,
      covers:
        "Preview binary license grant, redistribution terms, alpha status, discontinuation risk, third-party components, and separate Apache-2.0 source licensing",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Ante quickstart",
      topic: "product-surfaces",
      url: "https://docs.antigma.ai/start/quickstart",
      covers:
        "Binary installation, interactive terminal workflow, tool approvals, headless prompting, provider selection, yolo mode, server mode, and updates",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Core concepts and protocol",
      topic: "orchestration-state",
      url: "https://docs.antigma.ai/reference/core-concepts",
      covers:
        "Project, session, task, turn, and step lifecycle; tool-event loop; interruption; session resume; context budgets; automatic compaction; and permission decisions",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Tool reference",
      topic: "execution-control",
      url: "https://docs.antigma.ai/reference/tools-reference",
      covers:
        "Repository reads, writes, edits, search, shell execution, subagents, web tools, optional browser control, MCP tools, and session-level tool filtering",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Approvals",
      topic: "execution-control",
      url: "https://docs.antigma.ai/usage/approvals",
      covers:
        "Interactive review, rejection, one-time approval, session grants, persisted allow rules, diff preview, and yolo bypass",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Permission configuration",
      topic: "execution-control",
      url: "https://docs.antigma.ai/configuration/permission",
      covers:
        "Allow, ask, and deny policy ordering; scoped tool matchers; dangerous-command classification; session grants; tool filtering; and headless yolo behavior",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Goal-driven sessions",
      topic: "orchestration-state",
      url: "https://docs.antigma.ai/usage/goal-sessions",
      covers:
        "Evaluator-backed continuation turns, explicit success conditions, met and unreachable outcomes, interruption, iteration cap, unattended operation, and protocol control",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Headless mode",
      topic: "automation-extensions",
      url: "https://docs.antigma.ai/usage/headless",
      covers:
        "Non-interactive and CI execution, structured output formats, provider and tool controls, session persistence and resume, verification pass, and implied yolo approval",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Providers",
      topic: "product-surfaces",
      url: "https://docs.antigma.ai/usage/providers",
      covers:
        "Provider-independent runtime interface, built-in and custom providers, API keys, subscription OAuth, OpenRouter, OpenAI-compatible endpoints, and local services",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Persistent memory",
      topic: "orchestration-state",
      url: "https://docs.antigma.ai/extend/memory",
      covers:
        "Per-project persistent memory, automatic loading and updates, TUI and headless defaults, typed topic files, size limits, manual review, and durable prompt influence",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Sub-agents",
      topic: "orchestration-state",
      url: "https://docs.antigma.ai/extend/subagents",
      covers:
        "Built-in and custom delegated agents, independent context, per-agent prompts and tools, optional model overrides, project scopes, discovery, and refresh behavior",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Agent skills",
      topic: "automation-extensions",
      url: "https://docs.antigma.ai/extend/skills",
      covers:
        "Portable Agent Skills, user and project scopes, discovery precedence, invocation, arguments, bundled resources, and compatibility directories",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "MCP servers",
      topic: "automation-extensions",
      url: "https://docs.antigma.ai/extend/mcp",
      covers:
        "Local stdio MCP configuration, subprocess lifecycle, namespaced tool discovery, allowlisting, connection failures, tool filtering, and default approval behavior",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Offline mode",
      topic: "product-surfaces",
      url: "https://docs.antigma.ai/local/offline",
      covers:
        "Local GGUF inference, managed llama.cpp server lifecycle, offline headless use, hardware selection, model discovery, and long-lived server operation",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Server mode",
      topic: "automation-extensions",
      url: "https://docs.antigma.ai/usage/serve",
      covers:
        "Long-lived daemon operation, JSONL and WebSocket transports, explicit sessions, streaming events, approval responses, shutdown, and editor integration surface",
      kind: "official-docs",
      verifiedAt,
    },
  ],
  discovery: [
    {
      title: "OpenRouter CLI agent directory",
      url: "https://openrouter.ai/apps/url/https%3A%2F%2Fdocs.antigma.ai%2F",
      note: "Discovery and usage context only; Ante membership and capabilities are established from first-party documentation and the pinned official repository.",
      observedAt: verifiedAt,
    },
  ],
} satisfies HarnessRecord;
