import type { HarnessRecord } from "./types";

const verifiedAt = "2026-08-08";

export const spectralAgent = {
  id: "spectral-agent",
  slug: "spectral-agent",
  name: "Spectral Agent",
  tagline: "Local coding harness with goal loops, managed context, subagents, and browser relay access.",
  summary:
    "A local coding harness from Aexol that reads and writes repository files, runs shell and Git commands, iterates toward explicit goals, compacts and recalls session context, delegates work to isolated-context subagents, and connects either through a terminal UI or a browser relay. Execution is host-first: the reviewed documentation does not establish an operating-system sandbox or a general tool-permission policy.",
  logo: {
    src: "/harnesses/spectral-agent.svg",
    sourceUrl: "https://aexol.ai/favicon.png",
    verifiedAt,
  },
  status: "active",
  license: "MIT (published npm package)",
  classification: {
    role: "coding-agent",
    orchestration: "delegated-subagents",
    runtime: "host-first",
    isolation: [],
    state: "session-based",
  },
  interfaces: ["terminal", "web"],
  providerStyle: "multi-provider",
  supportsSubscription: false,
  capabilities: {
    simplicity: 4,
    flexibility: 4,
    security: 1,
    autonomy: 4,
    automation: 2,
    largeRepo: 4,
    humanControl: 2,
  },
  bestFor: [
    "Repository tasks that benefit from explicit goal loops with bounded iterations and clean user interruption",
    "Long terminal or browser-relay sessions using automatic compaction, recall, and locally persisted session history",
    "Delegating focused work to project or user-defined subagents with separate context, filtered tools, and optional model overrides",
  ],
  tradeoffs: [
    "The npm package declares an MIT license and a GitLab repository, but that repository currently requires sign-in, so HarnessMatch could not pin and inspect the implementation",
    "File, shell, Git, extension, and local MCP tools execute on the host; the reviewed documentation establishes no operating-system sandbox or general allow, ask, and deny policy",
    "Project-local subagent definitions prompt for confirmation in interactive local use, but that confirmation is bypassed in headless or relay mode",
    "The relay routes browser traffic and stores identity metadata; in relay mode the inference proxy holds provider keys, while local TUI mode stores keys in the local Spectral configuration",
    "Loop completion is decided inside the agent from progress toward the goal, not by an independent correctness gate; iteration, time, and spend limits remain necessary",
    "Compaction, recall, and session reconnection preserve conversational work but do not establish file rollback or reversal of shell, Git, network, or external-service side effects",
  ],
  setup:
    "Install @aexol/spectral 0.9.152, authenticate, choose local TUI or browser-relay mode, define a project directory, review subagent and MCP configuration, and add external isolation before running untrusted or unattended work.",
  verifiedAt,
  evidence: [
    {
      title: "Spectral Agent 0.9.152 package metadata",
      topic: "releases-code-audit",
      url: "https://registry.npmjs.org/@aexol%2fspectral/0.9.152",
      covers:
        "Immutable published package version, package name, MIT license declaration, tarball, homepage, and sign-in-restricted GitLab repository metadata",
      kind: "official-announcement",
      verifiedAt,
    },
    {
      title: "Spectral Agent overview",
      topic: "product-surfaces",
      url: "https://aexol.ai/docs/agent/",
      covers:
        "Installation, local file and shell execution, Git access, terminal and browser-relay modes, local session storage, reconnection, privacy boundaries, and loop controls",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Projects and sessions",
      topic: "orchestration-state",
      url: "https://aexol.ai/docs/agent/projects-and-sessions/",
      covers:
        "Directory-bound projects, repository file and shell access, locally persistent messages and tool activity, Fork and Compact, and session reconnection",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Observational memory",
      topic: "orchestration-state",
      url: "https://aexol.ai/docs/agent/memory/",
      covers:
        "Observations, reflections, automatic and deliberate context compaction, original-detail recall, context budgets, and long-session behavior",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Loop and goal mode",
      topic: "orchestration-state",
      url: "https://aexol.ai/docs/agent/loop-and-goal/",
      covers:
        "Think, act, observe, evaluate, and repeat lifecycle; explicit goals; maximum iterations; progress-based continuation; and user interruption",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Spectral subagents",
      topic: "orchestration-state",
      url: "https://aexol.ai/docs/agent/subagents/",
      covers:
        "Built-in and custom subagents, isolated context windows, filtered tool sets, optional model overrides, parallel and chained delegation, and project-agent confirmation behavior",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Spectral MCP servers",
      topic: "automation-extensions",
      url: "https://aexol.ai/docs/agent/mcp/",
      covers:
        "Local stdio and remote HTTP MCP servers, global and project configuration, imported client configurations, tool discovery, OAuth, and diagnostic logging",
      kind: "official-docs",
      verifiedAt,
    },
  ],
  discovery: [
    {
      title: "OpenRouter Aexol Studio app profile",
      url: "https://openrouter.ai/apps/url/https%3A%2F%2Faexol.ai%2F",
      note: "Discovery only: the app identifies as Aexol Studio, so its usage is not attributed to Spectral Agent. Membership and capabilities are established from Aexol documentation and immutable package metadata.",
      observedAt: verifiedAt,
    },
  ],
} satisfies HarnessRecord;
