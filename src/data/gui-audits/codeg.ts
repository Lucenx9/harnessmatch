import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const codegAudit: GuiRepositoryAudit = {
  guiId: "codeg",
  repositoryUrl: "https://github.com/xintaofei/codeg",
  inspectedRef: "d665f7b1f87e2e41611ea47f289224f0b11c010e",
  inspectedPaths: [
    "README.md",
    "src-tauri/src/acp/registry.rs",
    "src-tauri/src/commands/custom_agents.rs",
    "src-tauri/src/work_task/git.rs",
    "src/components/diff/diff-viewer.tsx",
    "src-tauri/src/web/router.rs",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The pinned ACP registry defines 12 built-in agent identities and keeps custom ACP agents on a separate registration path.",
    "Git worktree creation, branch assignment, and cleanup are implemented for parallel work tasks.",
    "The client implements a visual diff viewer and the backend exposes browser and mobile connection routes.",
  ],
  limitation: "The audit establishes implementation presence, not equal feature depth, authentication compatibility, or reliability across the 12 agent integrations.",
};
