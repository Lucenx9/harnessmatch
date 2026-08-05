import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source } from "./helpers";

const verifiedAt = "2026-08-05";
const codingAgents = "https://docs.traycer.ai/agents-and-models/coding-agents";
const agentToAgent = "https://docs.traycer.ai/concepts/agent-to-agent";
const worktrees = "https://docs.traycer.ai/concepts/worktrees";
const gitDiff = "https://docs.traycer.ai/panels/git-diff";
const hosts = "https://docs.traycer.ai/concepts/hosts";
const sharing = "https://docs.traycer.ai/panels/sharing";
const repositorySnapshot =
  "https://github.com/traycerai/traycer/tree/8f21d506f9945e409f4cd72f32c71e8810a4d236";

export const traycer: GuiProduct = {
  id: "traycer",
  name: "Traycer",
  logo: {
    src: "/guis/traycer.svg",
    sourceUrl:
      "https://github.com/traycerai/traycer/blob/8f21d506f9945e409f4cd72f32c71e8810a4d236/clients/desktop/resources/bundle/icon.png",
    verifiedAt,
  },
  url: "https://traycer.ai/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "MIT",
  platforms: ["macOS", "Windows", "Linux"],
  supportedHarnesses: [
    "Claude Code",
    "Codex",
    "OpenCode",
    "Traycer",
    "Cursor Agent",
    "Grok",
    "Qwen Code",
    "Kiro",
    "Factory Droid",
    "Kimi",
    "GitHub Copilot CLI",
    "Kilo Code",
    "OpenRouter",
    "Amp",
    "Devin",
    "Pi",
  ],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "Sixteen named coding-agent paths are listed in the chat interface. Only Claude Code, Codex, and OpenCode are also listed for the terminal interface, with different agent-to-agent message support.",
  summary:
    "An open-source desktop control plane for multi-provider agent tasks with shared context, worktrees, diffs, remote hosts, and team access.",
  bestFor:
    "Teams that need shared agent tasks, agent-to-agent delegation, isolated worktrees, visual review, and access to a reachable execution host.",
  limitation:
    "Most named integrations are chat-only, and agent-to-agent delivery varies by interface. Live terminals, files, diffs, and agent processes remain on the original Host; cross-device Hosts are marked coming soon.",
  capabilities: {
    parallelSessions: documentedAt(
      "A Task can contain parent and child agents with independent sessions and run state, including parallel fire-and-forget instructions.",
      verifiedAt,
      agentToAgent,
    ),
    workspaceIsolation: documentedAt(
      "Agents can use separate Git worktrees, each with its own checkout, directory, branch, and diff scope.",
      verifiedAt,
      worktrees,
    ),
    visualReview: documentedAt(
      "The Git Diff panel shows changed files for the selected worktree with search, summaries, grouping, and explicit loading or error states.",
      verifiedAt,
      gitDiff,
    ),
    remoteExecution: documentedAt(
      "The desktop client can connect to a reachable Host that owns the workspace, terminal, files, diffs, and agent processes.",
      verifiedAt,
      hosts,
    ),
    teamCollaboration: documentedAt(
      "Task-level sharing gives invited collaborators access to the same task, agents, artifacts, files, diffs, and comments according to their access.",
      verifiedAt,
      sharing,
    ),
  },
  evidence: [
    source(
      "Traycer coding-agent support",
      codingAgents,
      "official-docs",
      "harness-integrations",
      "Sixteen named chat integrations, the smaller terminal-integration set, interface differences, and authentication notes.",
      verifiedAt,
    ),
    source(
      "Traycer agent-to-agent communication",
      agentToAgent,
      "official-docs",
      "product-workflow",
      "Child-agent creation, instructions, replies, transcripts, independent session state, and interface-specific delivery limits.",
      verifiedAt,
    ),
    source(
      "Traycer worktrees",
      worktrees,
      "official-docs",
      "sessions-isolation-review",
      "Separate checkouts, isolated directories and branches, per-agent worktree selection, and worktree-scoped diffs.",
      verifiedAt,
    ),
    source(
      "Traycer Git Diff panel",
      gitDiff,
      "official-docs",
      "sessions-isolation-review",
      "Changed-file review, search, summaries, grouping, and worktree selection.",
      verifiedAt,
    ),
    source(
      "Traycer Hosts",
      hosts,
      "official-docs",
      "remote-collaboration",
      "Host ownership of live execution surfaces, reachable-machine connections, cloud-synced task data, and cross-device limitations.",
      verifiedAt,
    ),
    source(
      "Traycer task sharing",
      sharing,
      "official-docs",
      "remote-collaboration",
      "Task-level access, shared agents and artifacts, files, diffs, and comments.",
      verifiedAt,
    ),
    source(
      "Traycer repository snapshot",
      repositorySnapshot,
      "official-repository",
      "public-code",
      "Pinned client implementation snapshot for worktrees, diffs, remote host transport, sharing, agent-to-agent surfaces, and MIT licensing.",
      verifiedAt,
    ),
  ],
  verifiedAt,
};
