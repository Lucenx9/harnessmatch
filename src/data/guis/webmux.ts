import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const repository = "https://github.com/windmill-labs/webmux";

export const webmux: GuiProduct = {
  id: "webmux",
  name: "webmux",
  logo: {
    src: "/guis/webmux.svg",
    sourceUrl: "https://github.com/windmill-labs/webmux/blob/99cb139eac4bdc11efbb4c7e3045fa16dc4e0252/frontend/public/icon.svg",
    verifiedAt: guiVerifiedAt,
  },
  url: repository,
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "MIT",
  platforms: ["Browser", "macOS", "Linux"],
  supportedHarnesses: ["Codex", "Claude Code", "Custom CLI"],
  acceptsArbitraryCli: true,
  harnessSupportNote: "Codex and Claude Code receive full in-app chat, history, interrupt, and resume controls. Custom CLIs are terminal-first and can optionally define a resume command.",
  summary: "A self-hosted browser dashboard that owns worktrees, tmux layouts, agent events, services, and optional containers.",
  bestFor: "Developers who want a hackable web control plane on their own machine or server, including mobile check-ins.",
  limitation: "Deployment and secure network exposure are the user's responsibility, and full in-app chat features are limited for custom agents.",
  capabilities: {
    parallelSessions: documented("One dashboard manages parallel worktree and tmux agent sessions.", repository),
    workspaceIsolation: documented("The service creates Git worktrees and can add Docker sandbox isolation.", repository),
    visualReview: documented("The dashboard surfaces PRs, CI checks, comments, services, and session state.", repository),
    remoteExecution: documented("A browser and mobile-oriented chat UI reconnect to persistent host sessions.", repository),
    teamCollaboration: unknown("The current official record does not establish multi-user access controls or shared steering."),
  },
  evidence: [source("webmux official repository", repository, "official-repository", "Worktree lifecycle, terminals, mobile UI, PR and CI state, containers, agent registry, and MIT license.")],
  verifiedAt: guiVerifiedAt,
};
