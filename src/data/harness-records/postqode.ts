import type { HarnessRecord } from "./types";

const verifiedAt = "2026-07-28";

export const postqode = {
    id: "postqode",
    slug: "postqode",
    name: "PostQode",
    tagline: "Modular coding-agent stack for IDE, terminal, browser tools, and headless CI.",
    summary:
      "A proprietary product with public versioned npm packages for its multi-turn agent loop, coding tool pack, persistent memory, headless runner, MCP client, browser automation, and lightweight terminal UI, plus an IDE-oriented product surface spanning multiple model providers.",
    logo: {
      src: "/harnesses/postqode.svg",
      sourceUrl: "https://postqode.ai/favicon.svg",
      verifiedAt: verifiedAt,
    },
    status: "active",
    license: "Proprietary",
    classification: {
      role: "extensible-harness",
      orchestration: "single-agent",
      runtime: "host-first",
      isolation: [],
      state: "persistent-memory",
    },
    interfaces: ["terminal", "ide", "automation"],
    providerStyle: "multi-provider",
    supportsSubscription: false,
    supportsEnterpriseAccess: true,
    capabilities: {
      simplicity: 3,
      flexibility: 5,
      security: 3,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 4,
    },
    bestFor: [
      "TypeScript teams assembling a coding agent from public, modular runtime packages",
      "Headless or GitHub Actions workflows that need turn, cost, retry, and session controls",
      "IDE users who need provider choice, MCP, and optional browser automation in one product family",
    ],
    tradeoffs: [
      "The public website still advertises the retired unscoped postqode package; the current installable artifacts use scoped @postqode package names",
      "The repository URL declared by the npm packages was not publicly accessible when checked, so the product is documented from immutable package publications but is not classified as code-verifiable by the repository audit",
      "No execution sandbox is established by the reviewed public packages; filesystem, terminal, browser, and MCP tools therefore enlarge the host-side trust boundary",
      "The product markets a multi-agent architecture, but the public package record establishes a configurable single-agent loop and parallel tools rather than a documented delegated-agent mechanism; subagents therefore remain uncredited",
      "Vendor claims, package tests, and promotional material are not benchmark evidence and do not affect measured comparisons",
    ],
    setup: "Install the current scoped @postqode/agent-tui and @postqode/headless-agent packages at 0.9.0, configure a provider and budgets, and add MCP or browser packages only after reviewing their host permissions.",
    verifiedAt: verifiedAt,
    evidence: [
      {
        title: "PostQode product overview",
        url: "https://postqode.ai/",
        covers: "IDE surfaces, software-engineering agents, provider breadth, multi-agent positioning, MCP, terminal automation, and product installation claims",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "PostQode agent package",
        url: "https://www.npmjs.com/package/@postqode/agent/v/0.9.0",
        covers: "Multi-turn loop, tool contracts, hooks, turn and parallel-tool limits, persistent MEMORY.md store, and package version",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "PostQode coding-agent package",
        url: "https://www.npmjs.com/package/@postqode/coding-agent/v/0.9.0",
        covers: "Default repository read, write, edit, shell, grep and list tools plus prompt and project-instruction composition",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "PostQode headless-agent package",
        url: "https://www.npmjs.com/package/@postqode/headless-agent/v/0.9.0",
        covers: "Non-interactive and CI execution, JSON output, cost and turn budgets, session resume, retry boundaries, and GitHub Actions helpers",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "PostQode terminal UI package",
        url: "https://www.npmjs.com/package/@postqode/agent-tui/v/0.9.0",
        covers: "Stateful terminal conversation, usage display, abort behavior, provider configuration, and per-prompt budgets",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "PostQode MCP package",
        url: "https://www.npmjs.com/package/@postqode/mcp/v/0.9.0",
        covers: "Host-agnostic MCP client, server hub, OAuth, typed resources, prompts, tools, and transport integration",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "PostQode browser package",
        url: "https://www.npmjs.com/package/@postqode/browser/v/0.9.0",
        covers: "Optional browser automation tools, shared sessions, navigation, interaction primitives, and agent integration",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "PostQode enterprise deployment",
        url: "https://www.postqode.ai/enterprise",
        covers: "Enterprise controls, private deployment, provider and model options, workflow governance, and organizational product surface",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
    ],
    discovery: [
      {
        title: "OpenRouter coding app directory",
        url: "https://openrouter.ai/apps/category/coding",
        note: "Used to discover PostQode; the OpenRouter listing is not used to establish product capability.",
        observedAt: verifiedAt,
      },
    ],
  } satisfies HarnessRecord;
