import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const nimbalystAudit: GuiRepositoryAudit = {
  guiId: "nimbalyst",
  repositoryUrl: "https://github.com/nimbalyst/nimbalyst",
  inspectedRef: "d80ecefe0e11736b5a3dbbed231d957e286a7bf5",
  inspectedPaths: [
    "packages/electron/src/main/services/WorktreeStore.ts",
    "packages/electron/src/main/services/CLIManager.ts",
    "packages/electron/src/preload/index.ts",
    "packages/runtime/src/sync/CollabV3Sync.ts",
    "packages/collab-protocol/src/teamRoom.ts",
    "docs/COLLABORATION_GUIDE.md",
    "LICENSING.md",
  ],
  verifiedAt: "2026-07-28",
  sourceScope: "full-source",
  established: [
    "The Electron bridge exposes session, provider, worktree, diff, and terminal operations.",
    "CLI discovery covers Codex, Claude Code, and additional providers.",
    "Mobile synchronization carries session and worktree state.",
    "Team invitations, project sharing, and collaborative-document awareness exist in the client and protocol code.",
  ],
  limitation: "The repository is MIT licensed, but its collaboration server is a separate project. Client mechanisms do not establish that teammates can share or steer one live coding-agent session.",
};
