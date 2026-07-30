import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const repository = "https://github.com/nimbalyst/nimbalyst";
const quickstart = "https://docs.nimbalyst.com/getting-started/quickstart";
const sessions = "https://nimbalyst.com/features/session-management/";
const gitTools = "https://nimbalyst.com/features/git/";
const mobile = "https://nimbalyst.com/mobile-agent-management/";
const officialPreview = "https://nimbalyst.com/videos/nimbalyst-demo-dark-20260429.mp4";

export const nimbalyst: GuiProduct = {
  id: "nimbalyst",
  name: "Nimbalyst",
  logo: {
    src: "/guis/nimbalyst.svg",
    sourceUrl: "https://nimbalyst.com/nimbalyst-icon.svg",
    verifiedAt: guiVerifiedAt,
  },
  preview: {
    kind: "video",
    src: "/gui-previews/nimbalyst.mp4",
    poster: "/gui-previews/nimbalyst-poster.webp",
    width: 1280,
    height: 800,
    alt: "Nimbalyst dark interface demonstrating visual files, coding-agent sessions, and project navigation.",
    caption: "Official Nimbalyst dark-mode product demonstration.",
    sourceUrl: officialPreview,
    provenance: "official-media",
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
    parallelSessions: documented("Sessions can run in parallel and be managed from a Kanban view.", repository, sessions),
    workspaceIsolation: documented("The developer workflow includes worktrees and per-session worktree state.", repository, gitTools),
    visualReview: documented("WYSIWYG editors and red/green change review cover code and visual artifacts.", repository, quickstart, gitTools),
    remoteExecution: documented("The mobile app can monitor and respond to Codex and Claude Code sessions running on the desktop host.", repository, mobile),
    teamCollaboration: unknown("Team invites, project sharing, and real-time collaborative documents are implemented, but current evidence does not establish teammates sharing or steering the same live coding-agent session."),
  },
  evidence: [
    source("Nimbalyst official repository", repository, "official-repository", "public-code", "Visual editors, agent sessions, worktrees, mobile app, supported agents, collaboration client mechanisms, telemetry, and MIT licensing."),
    source("Nimbalyst quickstart", quickstart, "official-docs", "product-workflow", "Project persistence, Claude Code and Codex setup, visual editors, diff review, parallel windows, and mobile controls."),
    source("Nimbalyst session manager", sessions, "official-docs", "sessions-isolation-review", "Parallel Claude Code and Codex sessions, status tracking, grouping, and workstream management."),
    source("Nimbalyst Git tools", gitTools, "official-docs", "sessions-isolation-review", "Worktree isolation, per-session file tracking, visual diffs, review, staging, and assisted commits."),
    source("Nimbalyst mobile agent management", mobile, "official-docs", "remote-collaboration", "iOS session monitoring, diff review, prompts, approvals, notifications, and desktop-host execution boundary."),
  ],
  verifiedAt: guiVerifiedAt,
};
