import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const openChamberAudit: GuiRepositoryAudit = {
  guiId: "openchamber",
  repositoryUrl: "https://github.com/openchamber/openchamber",
  inspectedRef: "4de802a0a1a5c229ec25afb30d449a0b0e97b3e9",
  inspectedPaths: [
    "README.md",
    "packages/ui/src/apps/MobileChangesSurface.tsx",
    "packages/ui/src/components/session/NewWorktreeDialog.tsx",
    "packages/web/server/lib/tunnels/index.js",
    "packages/electron/resources/icons/app-icon.svg",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The pinned workspace integrates OpenCode through its SDK and bundled desktop CLI.",
    "Multi-run, new-worktree, and mobile change-review surfaces are implemented in the shared UI.",
    "The web server implements tunnel-backed remote access in addition to documented direct and private-network paths.",
  ],
  limitation: "The audit establishes OpenCode-specific workspace mechanisms, not support for other harnesses or reliable multi-user collaboration.",
};
