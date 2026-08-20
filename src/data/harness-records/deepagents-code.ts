import type { HarnessRecord } from "./types";

const verifiedAt = "2026-07-28";
const radarVerifiedAt = "2026-08-20";

export const deepagentsCode = {
    id: "deepagents-code",
    slug: "deepagents-code",
    name: "Deep Agents Code",
    tagline: "Extensible LangGraph coding agent with headless runs and optional remote sandboxes.",
    summary:
      "LangChain's terminal coding product built on Deep Agents and LangGraph, with an interactive TUI, non-interactive pipeline runner, custom subagents, MCP, local session checkpoints, persistent memory, approval gates, and integrations for managed remote sandboxes.",
    logo: {
      src: "/harnesses/deepagents-code.svg",
      sourceUrl: "https://github.com/langchain-ai/deepagents/blob/43eb196cf7faa993f2fa372dcc1fa65572d8a301/.github/images/logo-dark.svg",
      verifiedAt: verifiedAt,
    },
    status: "active",
    license: "MIT",
    classification: {
      role: "extensible-harness",
      orchestration: "delegated-subagents",
      runtime: "host-first",
      isolation: ["managed-sandbox"],
      state: "persistent-memory",
    },
    interfaces: ["terminal", "automation"],
    providerStyle: "multi-provider",
    supportsSubscription: false,
    capabilities: {
      simplicity: 3,
      flexibility: 5,
      security: 4,
      autonomy: 4,
      automation: 5,
      largeRepo: 4,
      humanControl: 5,
    },
    bestFor: [
      "Python and LangGraph teams that want a turnkey CLI they can also extend",
      "CI and scripted coding workflows that need turn limits, sessions, and structured non-interactive output",
      "Untrusted repositories when paired with one of the documented remote sandbox backends",
    ],
    tradeoffs: [
      "Local execution is host-first and trusts the working directory; project artifacts can influence the agent before the first approval prompt",
      "Isolation is an opt-in remote-backend surface whose provider internals and guarantees sit outside the Deep Agents Code repository",
      "The CLI starts a local LangGraph development server and stores sessions in SQLite, adding operational moving parts compared with a small single-binary agent",
      "MCP servers, hooks, skills, and repository instructions expand the trusted computing base and need their own review",
      "The repository includes project-owned eval packages, but they are not treated as independent comparative evidence or imported into product classification",
    ],
    setup: "Install with the official dcode bootstrap command or the deepagents-code package, configure a supported model provider, and select a remote sandbox backend before opening untrusted repositories.",
    verifiedAt: radarVerifiedAt,
    evidence: [
      {
        title: "Deep Agents Code 0.1.57 approval-surface release",
        topic: "execution-control",
        url: "https://github.com/langchain-ai/deepagents/releases/tag/deepagents-code%3D%3D0.1.57",
        covers: "ACP approval modes, multi-select user questions, cold-cache warnings, and the Python 3.12 runtime requirement",
        kind: "official-announcement",
        verifiedAt: radarVerifiedAt,
      },
      {
        title: "Deep Agents Code 0.1.58 recovery release",
        topic: "orchestration-state",
        url: "https://github.com/langchain-ai/deepagents/releases/tag/deepagents-code%3D%3D0.1.58",
        covers: "MCP reauthentication, interruptible tool offloading, hook-pipe draining, and configuration recovery",
        kind: "official-announcement",
        verifiedAt: radarVerifiedAt,
      },
      {
        title: "Deep Agents Code overview",
        url: "https://github.com/langchain-ai/deepagents/blob/43eb196cf7faa993f2fa372dcc1fa65572d8a301/libs/code/README.md",
        covers: "Interactive coding workflow, web search, resume, remote sandboxes, persistent memory, skills, headless mode, approvals, and installation",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
      {
        title: "Deep Agents Code threat model",
        url: "https://github.com/langchain-ai/deepagents/blob/43eb196cf7faa993f2fa372dcc1fa65572d8a301/libs/code/THREAT_MODEL.md",
        covers: "Agent loop, side-effecting tools, pre-approval project reads, MCP, subagents, session persistence, headless execution, hooks, and sandbox boundaries",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
      {
        title: "Deep Agents Code non-interactive runner",
        url: "https://github.com/langchain-ai/deepagents/blob/43eb196cf7faa993f2fa372dcc1fa65572d8a301/libs/code/deepagents_code/client/non_interactive.py",
        covers: "Programmatic prompt execution, streaming events, cancellation, session handling, and non-interactive completion behavior",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
      {
        title: "Deep Agents Code MCP implementation",
        url: "https://github.com/langchain-ai/deepagents/blob/43eb196cf7faa993f2fa372dcc1fa65572d8a301/libs/code/deepagents_code/mcp_tools.py",
        covers: "MCP configuration loading, local and remote server transports, tool filtering, and connection management",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
      {
        title: "Deep Agents Code sandbox factory",
        url: "https://github.com/langchain-ai/deepagents/blob/43eb196cf7faa993f2fa372dcc1fa65572d8a301/libs/code/deepagents_code/integrations/sandbox_factory.py",
        covers: "Selectable integrations for remote execution environments and the boundary between local and managed sandbox modes",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
      {
        title: "Deep Agents inspected source tree",
        url: "https://github.com/langchain-ai/deepagents/tree/43eb196cf7faa993f2fa372dcc1fa65572d8a301",
        covers: "Pinned monorepo source, tests, CI, contributor documentation, packages, examples, and project-owned evaluation assets",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
    ],
    discovery: [
      {
        title: "OpenRouter coding CLI agent directory",
        url: "https://openrouter.ai/apps/category/coding/cli-agent",
        note: "Used to discover Deep Agents Code; all published claims resolve to LangChain-controlled sources.",
        observedAt: verifiedAt,
      },
    ],
  } satisfies HarnessRecord;
