import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const supersetAudit: GuiRepositoryAudit = {
  guiId: "superset",
  repositoryUrl: "https://github.com/superset-sh/superset",
  inspectedRef: "961322195d80bd636e1fc9613a91b7f72cafeeec",
  inspectedPaths: [
    "apps/desktop/src/lib/trpc/routers/workspaces/procedures/create.ts",
    "apps/desktop/src/lib/trpc/routers/workspaces/utils/git.ts",
    "apps/desktop/src/renderer/screens/main/components/WorkspaceView/ChangesContent/components/FileDiffSection/FileDiffSection.tsx",
    "packages/shared/src/agent-catalog.ts",
    "packages/shared/src/builtin-terminal-agents.ts",
    "apps/docs/content/docs/remote-workspaces.mdx",
  ],
  verifiedAt: "2026-07-28",
  sourceScope: "full-source",
  established: [
    "Workspace creation is backed by Git worktrees.",
    "The desktop renderer contains a file-level diff review surface.",
    "Fourteen terminal-agent presets are documented, while custom agents can supply their own commands.",
    "Remote-host relay and teammate membership flows expose terminals, ports, agent runs, and diffs to authorized organization members.",
  ],
  limitation: "The repository is source-available under Elastic License 2.0, not OSI open source; Windows and Linux desktop builds remain explicitly untested.",
};
