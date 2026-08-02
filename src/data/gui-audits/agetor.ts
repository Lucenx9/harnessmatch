import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const agetorAudit: GuiRepositoryAudit = {
  guiId: "agetor",
  repositoryUrl: "https://github.com/alamops/agetor",
  inspectedRef: "03b2328009b66563a4e164d82eaa14621bf3d247",
  inspectedPaths: [
    "README.md",
    "src/shared/types.ts",
    "src/bun/codex-tmux.ts",
    "src/bun/worktree.ts",
    "src/mainview/components/kanban/DiffDialog.tsx",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The pinned runtime implements separate Claude Code and Codex harness kinds, including account and binary aliases.",
    "Task creation and cleanup implement dedicated Git branches and worktrees.",
    "The desktop client implements a structured task-diff dialog and local approval flow.",
  ],
  limitation: "The audit establishes implementation presence at the pinned commit, not integration reliability, usability, security, or task quality.",
};
