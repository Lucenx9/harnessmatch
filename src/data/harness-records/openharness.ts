import type { HarnessRecord } from "./types";

const verifiedAt = "2026-08-02";
const commit = "9b2efd795c6aa09f88b0c257d269a9e518da6ae7";
const repositoryBase = `https://github.com/HKUDS/OpenHarness/blob/${commit}`;
const repositoryTreeBase = `https://github.com/HKUDS/OpenHarness/tree/${commit}`;

export const openHarness = {
  id: "openharness",
  slug: "openharness",
  name: "OpenHarness",
  tagline: "Python coding harness with skills, memory, governed tools, and agent teams.",
  summary:
    "An MIT-licensed Python harness that owns a streaming tool loop, repository tools, compaction and persistent memory, permissions and hooks, optional OS or Docker sandboxes, provider and subscription routing, headless output, and multi-agent coordination.",
  logo: {
    src: "/harnesses/openharness.svg",
    sourceUrl: `${repositoryBase}/assets/logo.png`,
    verifiedAt,
  },
  status: "active",
  license: "MIT",
  classification: {
    role: "extensible-harness",
    orchestration: "multi-agent-runtime",
    runtime: "host-first",
    isolation: ["os-sandbox", "container", "worktree"],
    state: "persistent-memory",
  },
  interfaces: ["terminal", "automation"],
  providerStyle: "multi-provider",
  supportsSubscription: true,
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
    "Python users who want a Claude-style coding loop with portable skills, plugins, hooks, and MCP",
    "Multi-provider workflows spanning API keys, local OpenAI-compatible endpoints, Copilot OAuth, and Claude or Codex subscription credentials",
    "Interactive, scripted, scheduled, or delegated tasks that need compaction, persistent memory, and resumable sessions",
  ],
  tradeoffs: [
    "Sandboxing is disabled and fail-open by default; the OS wrapper requires Anthropic's separate sandbox-runtime package, and Docker isolation requires explicit configuration and a usable daemon",
    "The permissive full-auto mode and dangerous skip flag bypass normal confirmations, while path and command rules remain policy controls rather than isolation",
    "Subscription bridges reuse local Claude or Codex credentials as model routes; they do not transfer the capabilities, security posture, or UI of those external harnesses",
    "The bundled ohmo personal agent adds messaging gateways and autonomous repository work, but those surfaces should not be assumed for every OpenHarness embedding",
    "The public repository has broad automated tests but no admitted independent product benchmark or repository security policy at the inspected commit",
  ],
  setup:
    "Install openharness-ai 0.1.9, run oh setup to select an API, local, Copilot, Claude-subscription, or Codex-subscription profile, then configure permissions, optional sandboxing, memory, skills, MCP, and agent-team limits.",
  verifiedAt,
  evidence: [
    {
      title: "OpenHarness 0.1.9 source snapshot",
      topic: "product-surfaces",
      url: `${repositoryBase}/README.md`,
      covers: "Agent loop, 43-tool surface, coding tools, providers, permissions, memory, compaction, sessions, headless output, skills, MCP, and agent teams",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Agent loop implementation",
      topic: "orchestration-state",
      url: `${repositoryBase}/src/openharness/engine/query_engine.py`,
      covers: "Tool-aware streaming query engine, bounded turns, conversation history, continuation, compaction inputs, and persistent memory updates",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Repository tool registry",
      topic: "execution-control",
      url: `${repositoryTreeBase}/src/openharness/tools`,
      covers: "File, shell, search, web, task, notebook, worktree, and MCP tool implementations with validation and permission integration",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Runtime settings",
      topic: "execution-control",
      url: `${repositoryBase}/src/openharness/config/settings.py`,
      covers: "Provider profiles, turn limits, permissions, hooks, memory, sandbox defaults, skills, MCP, compaction, and environment overrides",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Permission checker",
      topic: "execution-control",
      url: `${repositoryBase}/src/openharness/permissions/checker.py`,
      covers: "Sensitive-path denials, allow and deny rules, plan, default-confirmation, and full-auto behavior",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Optional sandbox adapter",
      topic: "execution-control",
      url: `${repositoryBase}/src/openharness/sandbox/adapter.py`,
      covers: "Optional sandbox-runtime wrapper, platform checks, filesystem and network policy, availability reporting, and fail-open or fail-closed selection",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Docker sandbox backend",
      topic: "execution-control",
      url: `${repositoryBase}/src/openharness/sandbox/docker_backend.py`,
      covers: "Per-session container lifecycle, no-network default, resource limits, workspace mounts, and explicit availability checks",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Skills, plugins, and MCP",
      topic: "automation-extensions",
      url: `${repositoryBase}/README.md#-features`,
      covers: "On-demand skills, Claude-style plugin compatibility, lifecycle hooks, MCP tools, and project-skill trust controls",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "Provider and subscription workflows",
      topic: "product-surfaces",
      url: `${repositoryBase}/README.md#-provider-compatibility`,
      covers: "Anthropic- and OpenAI-compatible APIs, local endpoints, Copilot OAuth, and Claude or Codex subscription credential bridges",
      kind: "official-repository",
      verifiedAt,
    },
    {
      title: "OpenHarness 0.1.9 release notes",
      topic: "releases-code-audit",
      url: `${repositoryBase}/RELEASE_NOTES_v0.1.9.md`,
      covers: "Stable package version, skill workflow changes, provider-key fixes, and installation command",
      kind: "official-repository",
      verifiedAt,
    },
  ],
} satisfies HarnessRecord;
