import type { HarnessRecord } from "./types";

const verifiedAt = "2026-08-02";
const inspectedRef = "c045a9891069000b112079bb10bdc8828d75eb6e";

export const mimoCode = {
  id: "mimo-code",
  slug: "mimo-code",
  name: "MiMo Code",
  tagline: "Open coding harness with persistent memory and structured multi-agent workflows.",
  summary:
    "A multi-provider terminal coding harness with repository tools, persistent project memory, automatic context compaction, primary and delegated agents, bounded workflow orchestration, headless and local web surfaces, MCP, skills, and Git-backed undo. It runs tools on the host: its permission policy and workflow runtime are controls, not an operating-system sandbox.",
  logo: {
    src: "/harnesses/mimo-code.svg",
    sourceUrl: `https://github.com/XiaomiMiMo/MiMo-Code/blob/${inspectedRef}/packages/ui/src/assets/favicon/favicon-v3.svg`,
    verifiedAt,
  },
  status: "active",
  license: "MIT with use restrictions",
  classification: {
    role: "coding-agent",
    orchestration: "multi-agent-runtime",
    runtime: "host-first",
    isolation: ["worktree"],
    state: "persistent-memory",
  },
  interfaces: ["terminal", "ide", "web", "automation"],
  providerStyle: "multi-provider",
  supportsSubscription: true,
  capabilities: {
    simplicity: 4,
    flexibility: 5,
    security: 3,
    autonomy: 5,
    automation: 5,
    largeRepo: 4,
    humanControl: 4,
  },
  bestFor: [
    "Long-running repository work that benefits from persistent project memory and automatic context reconstruction",
    "Multi-provider or local-model workflows using primary agents, subagents, MCP servers, and reusable skills",
    "Headless and structured multi-agent workflows with bounded retries, parallel steps, and optional isolated Git worktrees",
  ],
  tradeoffs: [
    "MiMo Code has no built-in process sandbox; the official security policy describes permissions as a user-experience control and recommends a container or virtual machine for isolation",
    "Most tool permissions default to allow, and the headless CLI can skip permission checks entirely, so unattended use needs an independently constrained runtime",
    "The workflow control script runs in QuickJS, but Bash and other tools still act on the host; worktrees separate repository files without containing processes, credentials, network access, or external side effects",
    "Persistent memory and project instructions can influence later sessions, so durable context and generated workflow assets need review like other repository-controlled instructions",
    "Git-backed undo requires a Git repository, excludes ignored files and untracked files larger than 2 MiB, and cannot reverse shell, network, or other external side effects",
  ],
  setup:
    "Install `@mimo-ai/cli`, connect MiMo or another supported provider, review the permission rules, and use a container or virtual machine when execution isolation is required.",
  verifiedAt,
  evidence: [
    {
      title: "MiMo Code 0.1.9 source snapshot",
      topic: "releases-code-audit",
      url: `https://github.com/XiaomiMiMo/MiMo-Code/tree/${inspectedRef}`,
      covers:
        "Immutable stable-release source for the agent loop, repository tools, memory, workflows, permissions, tests, packaging, and public implementation audit",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "MiMo Code 0.1.9 release",
      topic: "releases-code-audit",
      url: "https://github.com/XiaomiMiMo/MiMo-Code/releases/tag/v0.1.9",
      covers:
        "Stable version boundary, platform distributions, provider changes, subagent fixes, and the distinction between the ended free trial and bring-your-own-key access",
      kind: "official-announcement",
      verifiedAt,
    },
    {
      title: "MiMo Code overview",
      topic: "product-surfaces",
      url: "https://mimo.xiaomi.com/mimocode/start",
      covers:
        "Terminal coding-agent workflow, repository editing, command execution, Git operations, context handling, desktop and IDE entry points, and installation",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Model providers",
      topic: "product-surfaces",
      url: "https://mimo.xiaomi.com/mimocode/models-provider",
      covers:
        "MiMo, OpenAI-compatible and other hosted providers, custom API keys, provider routing, and local-model configuration",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Built-in tools",
      topic: "execution-control",
      url: "https://mimo.xiaomi.com/mimocode/tools",
      covers:
        "Repository reads, writes, patches, search, shell commands, web retrieval, tool permissions, custom tools, and MCP extension points",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Permission policy",
      topic: "execution-control",
      url: "https://mimo.xiaomi.com/mimocode/permissions",
      covers:
        "Allow, ask, and deny rules; command-pattern controls; external-directory handling; default policy; and environment-variable restrictions",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Sessions and context",
      topic: "orchestration-state",
      url: "https://mimo.xiaomi.com/mimocode/sessions",
      covers:
        "Persisted sessions, resume, fork, import and export, automatic compaction, and continuation after context reduction",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Agents",
      topic: "orchestration-state",
      url: "https://mimo.xiaomi.com/mimocode/agents",
      covers:
        "Primary Build and Plan agents, General and Explore subagents, delegated tasks, per-agent tools, prompts, and permissions",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "CLI options",
      topic: "automation-extensions",
      url: "https://mimo.xiaomi.com/mimocode/cli-options",
      covers:
        "Non-interactive runs, structured JSON events, session continuation, permission bypass, local server, web interface, and Agent Client Protocol modes",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "MCP servers",
      topic: "automation-extensions",
      url: "https://mimo.xiaomi.com/mimocode/mcp-servers",
      covers:
        "Local and remote MCP server configuration, transport, authentication, OAuth, tool discovery, enablement, and removal",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Agent skills",
      topic: "automation-extensions",
      url: "https://mimo.xiaomi.com/mimocode/skills",
      covers:
        "Reusable skill discovery, project and user scopes, metadata, loading behavior, and permission controls",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Slash commands",
      topic: "orchestration-state",
      url: "https://mimo.xiaomi.com/mimocode/slash-commands",
      covers:
        "Session controls plus Git-backed undo and redo behavior for reverting file changes",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Pinned security policy",
      topic: "execution-control",
      url: `https://github.com/XiaomiMiMo/MiMo-Code/blob/${inspectedRef}/SECURITY.md`,
      covers:
        "Explicit absence of a sandbox, permission-system limits, recommended container or virtual-machine isolation, and server exposure precautions",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Pinned Git snapshot implementation",
      topic: "orchestration-state",
      url: `https://github.com/XiaomiMiMo/MiMo-Code/blob/${inspectedRef}/packages/opencode/src/snapshot/index.ts`,
      covers:
        "Git-based change tracking, restore and revert behavior, ignored-file exclusion, the 2 MiB untracked-file ceiling, and repository requirement",
      kind: "official-repository",
      verifiedAt,
    },
  ],
  discovery: [
    {
      title: "OpenRouter MiMo Code app",
      url: "https://openrouter.ai/apps/url/https%3A%2F%2Fmimo.xiaomi.com%2Fcoder",
      note: "Discovery and public attribution context only; it does not establish MiMo Code capabilities, quality, safety, or task performance.",
      observedAt: verifiedAt,
    },
  ],
} satisfies HarnessRecord;
