import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source } from "./helpers";

const docs = "https://aq.dev/docs/";

export const aq: GuiProduct = {
  id: "aq",
  name: "AQ",
  logo: {
    src: "/guis/aq.svg",
    sourceUrl: "https://aq.dev/favicon.svg",
    verifiedAt: guiVerifiedAt,
  },
  url: "https://aq.dev/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "proprietary",
  license: "Proprietary",
  platforms: ["Browser", "macOS", "Windows", "Linux"],
  supportedHarnesses: ["Antigravity", "Claude Code", "Codex", "Cursor Agent", "Grok", "Kimi"],
  acceptsArbitraryCli: false,
  harnessSupportNote: "Six named agent CLIs plus plain shells. Each user signs in with their own CLI account or subscription; AQ does not resell agent usage.",
  summary: "A browser-based, multiplayer workspace that runs agent CLIs on a team runner.",
  bestFor: "Teams that need shared terminals, previews, review comments, and persistent remote sessions.",
  limitation: "Execution depends on a connected self-managed or AQ-managed runner, and the GUI implementation is not public.",
  capabilities: {
    parallelSessions: documented("Multiple workspaces and agents can run concurrently.", docs),
    workspaceIsolation: documented("Each workspace receives its own Git worktree and branch.", docs),
    visualReview: documented("The browser workspace includes an editor, live previews, comments, and PR state.", docs),
    remoteExecution: documented("Persistent sessions run on a runner VM and survive browser or laptop disconnects.", docs),
    teamCollaboration: documented("Teammates can enter the same live terminal, editor, and preview.", docs),
  },
  evidence: [source("How AQ works", docs, "official-docs", "Worktrees, persistent sessions, supported agents, shared access, previews, and runners.")],
  verifiedAt: guiVerifiedAt,
};
