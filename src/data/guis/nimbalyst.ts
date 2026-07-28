import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const repository = "https://github.com/nimbalyst/nimbalyst";

export const nimbalyst: GuiProduct = {
  id: "nimbalyst",
  name: "Nimbalyst",
  logo: {
    src: "/guis/nimbalyst.svg",
    sourceUrl: "https://nimbalyst.com/nimbalyst-icon.svg",
    verifiedAt: guiVerifiedAt,
  },
  url: "https://nimbalyst.com/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "MIT",
  platforms: ["macOS", "Windows", "Linux", "iOS"],
  supportedHarnesses: ["Codex", "Claude Code", "OpenCode", "GitHub Copilot"],
  acceptsArbitraryCli: false,
  harnessSupportNote: "Codex and Claude Code are the primary integrations; OpenCode and GitHub Copilot are explicitly marked alpha.",
  summary: "A visual editor and session manager for agent work across documents, mockups, code, tasks, and Git.",
  bestFor: "Visual workflows that need rich file editors, agent sessions, worktrees, and mobile follow-up in one project space.",
  limitation: "OpenCode and Copilot support are marked alpha. The collaboration server is a separate project and is not established by this repository audit.",
  capabilities: {
    parallelSessions: documented("Sessions can run in parallel and be managed from a Kanban view.", repository),
    workspaceIsolation: documented("The developer workflow includes worktrees and per-session worktree state.", repository),
    visualReview: documented("WYSIWYG editors and red/green change review cover code and visual artifacts.", repository),
    remoteExecution: documented("The mobile app can monitor and respond to Codex and Claude Code sessions running on the desktop host.", repository),
    teamCollaboration: unknown("Team invites, project sharing, and real-time collaborative documents are implemented, but current evidence does not establish teammates sharing or steering the same live coding-agent session."),
  },
  evidence: [source("Nimbalyst official repository", repository, "official-repository", "Visual editors, agent sessions, worktrees, mobile app, supported agents, collaboration client mechanisms, telemetry, and MIT licensing.")],
  verifiedAt: guiVerifiedAt,
};
