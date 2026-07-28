import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const repository = "https://github.com/windmill-labs/webmux";
const inspectedRef = "99cb139eac4bdc11efbb4c7e3045fa16dc4e0252";
const snapshot = `${repository}/tree/${inspectedRef}`;
const worktreeService = `${repository}/blob/${inspectedRef}/backend/src/services/worktree-service.ts`;
const agentRegistry = `${repository}/blob/${inspectedRef}/backend/src/services/agent-registry.ts`;
const agentUiService = `${repository}/blob/${inspectedRef}/backend/src/services/agents-ui-service.ts`;
const officialPreview = `${repository}/blob/${inspectedRef}/site/static/videos/demo.gif`;

export const webmux: GuiProduct = {
  id: "webmux",
  name: "webmux",
  logo: {
    src: "/guis/webmux.svg",
    sourceUrl: "https://github.com/windmill-labs/webmux/blob/99cb139eac4bdc11efbb4c7e3045fa16dc4e0252/frontend/public/icon.svg",
    verifiedAt: guiVerifiedAt,
  },
  preview: {
    kind: "video",
    src: "/gui-previews/webmux.mp4",
    poster: "/gui-previews/webmux-poster.webp",
    width: 800,
    height: 500,
    alt: "webmux browser dashboard demonstrating agent sessions, worktrees, terminals, and project controls.",
    caption: "Official webmux product demo from the same source commit used for the implementation audit.",
    sourceUrl: officialPreview,
    provenance: "official-media",
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
    parallelSessions: documented("One dashboard manages parallel worktree and tmux agent sessions.", snapshot, worktreeService),
    workspaceIsolation: documented("The service creates Git worktrees and can add Docker sandbox isolation.", snapshot, worktreeService),
    visualReview: documented("The dashboard surfaces PRs, CI checks, comments, services, and session state.", snapshot, agentUiService),
    remoteExecution: documented("A browser and mobile-oriented chat UI reconnect to persistent host sessions.", snapshot, agentUiService),
    teamCollaboration: unknown("The current official record does not establish multi-user access controls or shared steering."),
  },
  evidence: [
    source("webmux inspected source snapshot", snapshot, "official-repository", "Pinned implementation boundary for worktrees, terminals, browser and mobile UI, review state, containers, agents, and MIT licensing."),
    source("webmux worktree service", worktreeService, "official-repository", "Worktree and tmux lifecycle, rollback handling, workspace services, and optional container setup."),
    source("webmux agent registry", agentRegistry, "official-repository", "First-class Codex and Claude adapters plus command-configurable custom agent definitions."),
    source("webmux agent UI service", agentUiService, "official-repository", "Chat-capability checks, persistent session state, interrupt and resume integration, and terminal-first custom-agent boundary."),
  ],
  verifiedAt: guiVerifiedAt,
};
