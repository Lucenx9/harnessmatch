import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-05";
const installation = "https://docs.runmaestro.ai/installation";
const worktrees = "https://docs.runmaestro.ai/git-worktrees";
const remoteControl = "https://docs.runmaestro.ai/remote-control";
const groupChat = "https://docs.runmaestro.ai/group-chat";
const repositorySnapshot =
  "https://github.com/RunMaestro/Maestro/tree/e3479fe05b3953248bd72b7e2d4b0ace23d18369";

export const maestro: GuiProduct = {
  id: "maestro",
  name: "Maestro",
  logo: {
    src: "/guis/maestro.svg",
    sourceUrl:
      "https://github.com/RunMaestro/Maestro/blob/e3479fe05b3953248bd72b7e2d4b0ace23d18369/src/renderer/assets/icon-wand.png",
    verifiedAt,
  },
  url: "https://runmaestro.ai/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "AGPL-3.0",
  platforms: ["macOS", "Windows", "Linux"],
  supportedHarnesses: [
    "Claude Code",
    "Codex",
    "OpenCode",
    "Factory Droid",
    "GitHub Copilot CLI",
    "Hermes Agent",
    "Pi",
    "Qwen Code",
    "Oh My Pi",
  ],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "The compatibility page marks Claude Code, Codex, OpenCode, and Factory Droid fully supported and five more integrations beta. Gemini CLI is planned, not current; integration depth varies by provider.",
  summary:
    "An open-source desktop workspace for running and coordinating multiple named coding agents across sessions and worktrees.",
  bestFor:
    "Linux, Windows, and macOS users who want parallel agent sessions, worktree isolation, visual diffs, agent group chat, and browser-based remote control.",
  limitation:
    "Group chat coordinates AI agents rather than human teammates, so shared live team operation is not established. Remote access uses a token-bearing URL and an optional Cloudflare tunnel.",
  capabilities: {
    parallelSessions: documentedAt(
      "Multiple agent sessions can run simultaneously, including worktree sub-agents with separate branches and directories.",
      verifiedAt,
      worktrees,
    ),
    workspaceIsolation: documentedAt(
      "Worktree sub-agents operate in isolated directories and branches while the main session remains on its original branch.",
      verifiedAt,
      worktrees,
    ),
    visualReview: documentedAt(
      "The Git view provides a syntax-highlighted, side-by-side diff for the main repository and worktrees.",
      verifiedAt,
      worktrees,
    ),
    remoteExecution: documentedAt(
      "A token-protected web interface can view live sessions and send commands from another device, with an optional Cloudflare tunnel for internet access.",
      verifiedAt,
      remoteControl,
    ),
    teamCollaboration: unknown(
      "Current sources document multi-agent group chat and single-user remote control, but not multiple people sharing or steering one live workspace.",
      verifiedAt,
    ),
  },
  evidence: [
    source(
      "Maestro installation and provider support",
      installation,
      "official-docs",
      "harness-integrations",
      "Desktop platforms, supported and beta coding-agent integrations, planned Gemini CLI support, and provider-specific setup.",
      verifiedAt,
    ),
    source(
      "Maestro Git and worktrees",
      worktrees,
      "official-docs",
      "sessions-isolation-review",
      "Parallel worktree sub-agents, isolated branches and directories, worktree lifecycle, and side-by-side Git diffs.",
      verifiedAt,
    ),
    source(
      "Maestro remote control",
      remoteControl,
      "official-docs",
      "remote-collaboration",
      "Token-based browser access, live session viewing, mobile command input, local-network access, and optional Cloudflare tunneling.",
      verifiedAt,
    ),
    source(
      "Maestro group chat",
      groupChat,
      "official-docs",
      "product-workflow",
      "Moderated conversations among multiple AI agents, including parallel responses, synthesis, and continued rounds.",
      verifiedAt,
    ),
    source(
      "Maestro repository snapshot",
      repositorySnapshot,
      "official-repository",
      "public-code",
      "Pinned implementation snapshot for provider definitions, worktrees, diffs, remote control, group chat, and AGPL licensing.",
      verifiedAt,
    ),
  ],
  verifiedAt,
};
