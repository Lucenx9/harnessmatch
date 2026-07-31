import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source } from "./helpers";

const docs = "https://www.conductor.build/docs";
const worktreeDocs = "https://www.conductor.build/docs/concepts/git-worktrees";
const cloudAnnouncement = "https://www.conductor.build/changelog/0.78.0-introducing-conductor-cloud";
const conductorVerifiedAt = "2026-07-31";

export const conductor: GuiProduct = {
  id: "conductor",
  name: "Conductor",
  logo: {
    src: "/guis/conductor.svg",
    sourceUrl: "https://www.conductor.build/icon.png?icon.7d575655.png",
    verifiedAt: guiVerifiedAt,
  },
  url: docs,
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "proprietary",
  license: "Proprietary",
  platforms: ["macOS"],
  supportedHarnesses: ["Claude Code", "Codex", "Cursor Agent", "OpenCode"],
  acceptsArbitraryCli: false,
  harnessSupportNote: "Four documented integrations. Conductor reuses each CLI's existing login, subscription, or provider configuration.",
  summary: "A Mac control plane for parallel coding agents in local worktrees or isolated cloud microVMs.",
  bestFor: "Mac users and teams that want one parallel-agent dashboard across local and persistent cloud workspaces.",
  limitation: "The desktop product is Mac-only, Conductor Cloud requires Pro, and the programmatic API remains beta. Named integrations do not establish arbitrary-CLI support.",
  capabilities: {
    parallelSessions: documented("The app runs Claude Code, Codex, Cursor Agent, and OpenCode in parallel.", docs),
    workspaceIsolation: {
      state: "documented",
      summary: "Local workspaces use separate Git worktrees for development isolation, not a security boundary; Conductor Cloud uses isolated microVM sandboxes.",
      sourceUrls: [worktreeDocs, cloudAnnouncement],
      verifiedAt: conductorVerifiedAt,
    },
    visualReview: documented("The product documents agent monitoring followed by review and merge.", docs),
    remoteExecution: {
      state: "documented",
      summary: "Cloud workspaces run on isolated microVMs, continue after the Mac app closes, and can be created or steered through the API.",
      sourceUrls: [cloudAnnouncement],
      verifiedAt: conductorVerifiedAt,
    },
    teamCollaboration: {
      state: "documented",
      summary: "Teammates can open shared workspace links, see who is active, follow work, and prompt agents together in real time.",
      sourceUrls: [cloudAnnouncement],
      verifiedAt: conductorVerifiedAt,
    },
  },
  evidence: [
    source("Conductor documentation", docs, "official-docs", "product-workflow", "Four supported agents, Mac scope, parallel workspaces, worktrees, review, and merge."),
    source(
      "Conductor Git worktrees",
      worktreeDocs,
      "official-docs",
      "sessions-isolation-review",
      "Local workspaces use separate Git working trees for development isolation rather than as a security boundary.",
      conductorVerifiedAt,
    ),
    source(
      "Conductor 0.78.0 Cloud launch",
      cloudAnnouncement,
      "official-announcement",
      "remote-collaboration",
      "Pro cloud workspaces on isolated microVMs, persistent remote execution, shared live workspaces, and a beta management API.",
      conductorVerifiedAt,
    ),
  ],
  verifiedAt: conductorVerifiedAt,
};
