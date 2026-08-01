import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source } from "./helpers";

const docs = "https://aq.dev/docs/";
const product = "https://aq.dev/";
const parallelGuide = "https://aq.dev/guides/run-multiple-claude-code-sessions-in-parallel/";
const remoteGuide = "https://aq.dev/guides/keep-claude-code-running-after-closing-laptop/";

export const aq: GuiProduct = {
  id: "aq",
  name: "AQ",
  logo: {
    src: "/guis/aq.svg",
    sourceUrl: product,
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
    parallelSessions: documented("Multiple workspaces and agents can run concurrently.", docs, parallelGuide),
    workspaceIsolation: documented("Each workspace receives its own Git worktree and branch.", docs, parallelGuide),
    visualReview: documented("The browser workspace includes an editor, live previews, comments, and PR state.", docs, product),
    remoteExecution: documented("Persistent sessions run on a runner VM and survive browser or laptop disconnects.", docs, remoteGuide),
    teamCollaboration: documented("Teammates can enter the same live terminal, editor, and preview.", docs, product),
  },
  evidence: [
    source("How AQ works", docs, "official-docs", "product-workflow", "Worktrees, persistent sessions, supported agents, shared access, previews, and runners."),
    source("AQ product surface", product, "official-docs", "harness-integrations", "Browser workspace, team access, agent CLIs, previews, runner choices, and bring-your-own credentials."),
    source("Parallel Claude Code sessions", parallelGuide, "official-docs", "sessions-isolation-review", "Per-task worktrees, persistent tmux sessions, automatic setup, preview ports, collaboration, and cleanup."),
    source("Persistent remote sessions", remoteGuide, "official-docs", "remote-collaboration", "Runner custody, persistent terminals, remote reconnection, per-user authentication, worktrees, and shared steering."),
  ],
  verifiedAt: guiVerifiedAt,
};
