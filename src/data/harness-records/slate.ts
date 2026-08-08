import type { HarnessRecord } from "./types";

const verifiedAt = "2026-08-08";

export const slate = {
  id: "slate",
  slug: "slate",
  name: "Slate",
  tagline: "Proprietary terminal harness for long tasks, parallel agents, skills, and headless execution.",
  summary:
    "A proprietary coding harness from Random Labs for repository-scale terminal work, with provider and model-slot selection, granular tool permissions, session steering and resume, parallel and background subagents, reusable skills, MCP, long-running shells, headless structured output, and an HTTP server mode. Execution is host-first: permissions govern tool calls but the reviewed documentation does not establish an operating-system sandbox.",
  logo: {
    src: "/harnesses/slate.svg",
    sourceUrl: "https://randomlabs.ai/favicon.svg",
    verifiedAt,
  },
  status: "active",
  license: "Proprietary",
  classification: {
    role: "coding-agent",
    orchestration: "multi-agent-runtime",
    runtime: "host-first",
    isolation: [],
    state: "session-based",
  },
  interfaces: ["terminal", "automation"],
  providerStyle: "multi-provider",
  supportsSubscription: true,
  capabilities: {
    simplicity: 4,
    flexibility: 5,
    security: 3,
    autonomy: 5,
    automation: 3,
    largeRepo: 4,
    humanControl: 3,
  },
  bestFor: [
    "Long repository tasks that need deliberate context management, project instructions, session continuation, and active steering",
    "Parallel research, implementation, and verification workflows using child sessions, background agents, and trace views",
    "A shared interactive and scripted workflow through the TUI, one-shot structured headless runs, queues, or the HTTP server",
  ],
  tradeoffs: [
    "Slate is proprietary and the published npm package exposes no official public source repository, so HarnessMatch could not perform an immutable implementation audit",
    "Shells, workspace paths, and local MCP subprocesses execute on the host; no operating-system sandbox is documented, and --yolo bypasses every permission check",
    "Server mode binds to 0.0.0.0 by default according to the current documentation, so remote exposure requires deliberate password, network, and host controls",
    "External workspaces, long-running shells, environment variables, skills, and MCP servers widen the trusted input and execution boundary and need separate review",
    "Documented tests, reviewer agents, trace cards, and changed-file summaries support inspection but do not independently prove task success or benchmark quality",
    "Session resume and queue persistence restore interaction state rather than rolling back files, shell effects, network actions, or external services; no checkpoint mechanism is documented",
    "The quickstart warns that Windows may not work and recommends WSL, and it reports significant terminal flicker when Slate runs inside tmux",
  ],
  setup:
    "Install @randomlabs/slate 1.0.44, authenticate with Random Labs, choose a subscription or credit-backed model source, review project and global permission rules, avoid --yolo for untrusted work, and constrain any server or headless deployment externally.",
  verifiedAt,
  evidence: [
    {
      title: "Slate 1.0.44 package metadata",
      topic: "releases-code-audit",
      url: "https://registry.npmjs.org/@randomlabs%2fslate/1.0.44",
      covers:
        "Immutable published package version, package name, proprietary license declaration, distribution tarball, and absence of public repository metadata",
      kind: "official-announcement",
      verifiedAt,
    },
    {
      title: "Slate product overview",
      topic: "orchestration-state",
      url: "https://randomlabs.ai/",
      covers:
        "Open-beta positioning, repository-level long tasks, exploration and implementation loops, builds and test repair, parallel agents, and built-in context compaction",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Slate quickstart",
      topic: "product-surfaces",
      url: "https://docs.randomlabs.ai/en/getting-started/quickstart",
      covers:
        "npm installation, project startup, device authentication, subscription and credit-backed model sources, repository-wide analysis, and platform caveats",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Slate basics",
      topic: "orchestration-state",
      url: "https://docs.randomlabs.ai/en/using-slate",
      covers:
        "Session switching, cancellation, hard interruption, message steering and queues, direct shell commands, workspace directories, file context, and persistent drafts",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Slate configuration",
      topic: "execution-control",
      url: "https://docs.randomlabs.ai/en/using-slate/configuration",
      covers:
        "Allow, ask, and deny tool policy; bypass behavior; provider and model slots; MCP; privacy controls; session resume; queues; structured headless output; and HTTP server mode",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Slate orchestration and tracing",
      topic: "orchestration-state",
      url: "https://docs.randomlabs.ai/en/using-slate/orchestration",
      covers:
        "Parallel subagents, child sessions, background agents, built-in programs, parent and child trace activity, changed-file summaries, and run inspection",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Slate workspace setup",
      topic: "execution-control",
      url: "https://docs.randomlabs.ai/en/using-slate/workspace_setup",
      covers:
        "Long-running shell access, repository and global instruction files, build and test workflows, integration testing, environment variables, and workspace guidance",
      kind: "official-docs",
      verifiedAt,
    },
    {
      title: "Slate skills",
      topic: "automation-extensions",
      url: "https://docs.randomlabs.ai/en/using-slate/skills",
      covers:
        "Reusable SKILL.md packages, project and global discovery, compatibility paths, custom paths, interactive review, autonomous activation, and subagent routing",
      kind: "official-docs",
      verifiedAt,
    },
  ],
  discovery: [
    {
      title: "OpenRouter app profile",
      url: "https://openrouter.ai/apps/url/https%3A%2F%2Frandomlabs.ai%2F",
      note: "Discovery and usage context only; Slate membership and capabilities are established from Random Labs documentation and immutable package metadata.",
      observedAt: verifiedAt,
    },
  ],
} satisfies HarnessRecord;
