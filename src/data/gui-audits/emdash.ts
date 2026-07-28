import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const emdashAudit: GuiRepositoryAudit = {
  guiId: "emdash",
  repositoryUrl: "https://github.com/generalaction/emdash",
  inspectedRef: "5ace464a0c23d64e6d4bb381a231a4305a0dcae1",
  inspectedPaths: [
    "apps/emdash-desktop/src/main/core/projects/worktrees/worktree-service.ts",
    "apps/emdash-desktop/src/main/core/projects/create-project-provider.ts",
    "apps/emdash-desktop/src/main/core/git/worktree/controller.ts",
    "packages/plugins/src/agents/registry.ts",
    "agents/integrations/providers.md",
  ],
  verifiedAt: "2026-07-28",
  sourceScope: "full-source",
  established: [
    "Worktree lifecycle and Git review operations are implemented in the desktop app.",
    "Local and SSH project providers share the workspace abstraction.",
    "The pinned plugin registry registers 35 named CLI providers; integration depth differs by provider and 22 are documented as ACP-capable.",
  ],
  limitation: "The audit establishes implementation presence, not usability, security, or reliable performance under load.",
};
