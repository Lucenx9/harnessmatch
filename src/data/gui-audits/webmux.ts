import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const webmuxAudit: GuiRepositoryAudit = {
  guiId: "webmux",
  repositoryUrl: "https://github.com/windmill-labs/webmux",
  inspectedRef: "99cb139eac4bdc11efbb4c7e3045fa16dc4e0252",
  inspectedPaths: [
    "backend/src/services/worktree-service.ts",
    "backend/src/services/agent-registry.ts",
    "backend/src/services/agents-ui-service.ts",
    "backend/src/adapters/agent-runtime.ts",
  ],
  verifiedAt: "2026-07-28",
  sourceScope: "full-source",
  established: [
    "The backend owns worktree and tmux session lifecycle with rollback behavior.",
    "Codex and Claude have first-class chat, interrupt, history, and resume capabilities.",
    "Custom agents are command-configurable but terminal-first, without the same built-in chat, history, and interrupt integration.",
    "The browser and mobile-oriented views derive their state from managed worktree sessions.",
  ],
  limitation: "The audit does not establish secure internet exposure; the documented deployment remains a service on infrastructure the user controls.",
};
