import type { HarnessRecord } from "./types";

const verifiedAt = "2026-07-27";

export const continueCli = {
    id: "continue-cli",
    slug: "continue-cli",
    name: "Continue CLI",
    tagline: "Configurable terminal agent with explicit headless permissions.",
    summary:
      "Continue's Apache-2.0 agent runs in the terminal, VS Code, and JetBrains with interactive or headless execution, reusable model and MCP configuration, and allow, ask, or exclude policies for every tool.",
    logo: {
      src: "/harnesses/continue.svg",
      sourceUrl: "https://github.com/continuedev/continue/blob/main/docs/logo/light.svg",
      verifiedAt: verifiedAt,
    },
    status: "archived",
    license: "Apache-2.0",
    classification: {
      role: "coding-agent",
      orchestration: "single-agent",
      runtime: "host-first",
      isolation: [],
      state: "session-based",
    },
    interfaces: ["terminal", "ide", "automation"],
    providerStyle: "multi-provider",
    supportsSubscription: true,
    capabilities: {
      simplicity: 4,
      flexibility: 5,
      security: 3,
      autonomy: 4,
      automation: 5,
      largeRepo: 4,
      humanControl: 5,
    },
    bestFor: [
      "Teams sharing models, rules, MCP servers, and agent configuration across IDE and CLI surfaces",
      "Headless scripts that need an explicit allowlist of write, edit, and shell tools",
      "Developers who want hosted or local models without abandoning editor integrations",
    ],
    tradeoffs: [
      "Tool permissions govern agent actions but do not provide an OS-level sandbox",
      "No delegated subagent or file-checkpoint system is documented for the current CLI",
      "The official repository is read-only and no longer actively maintained",
    ],
    setup: "Install Continue CLI, authenticate or load a local config, then use `cn` interactively or `cn -p` with explicit `--allow` flags.",
    verifiedAt: verifiedAt,
    evidence: [
      {
        title: "Continue CLI quickstart",
        url: "https://docs.continue.dev/cli/quickstart",
        covers: "Terminal agent, interactive and headless modes, authentication, configuration, models, MCP, and automation flags",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "Tool permissions",
        url: "https://docs.continue.dev/cli/tool-permissions",
        covers: "Allow, ask, and exclude policies, safe headless defaults, persistent permissions, and CLI overrides",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "Models, rules, and tools",
        url: "https://docs.continue.dev/guides/configuring-models-rules-tools",
        covers: "Reusable local and shared models, behavioral rules, MCP tools, and configuration composition",
        kind: "official-docs",
        verifiedAt: verifiedAt,
      },
      {
        title: "Final Continue source snapshot",
        url: "https://github.com/continuedev/continue/tree/5522c6f44ca0ac3528b37244818fbfa39b5af470",
        covers: "Immutable final Apache-2.0 source snapshot and explicit notice that the repository is read-only and no longer actively maintained",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
    ],
  } satisfies HarnessRecord;
