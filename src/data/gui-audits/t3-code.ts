import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const t3CodeAudit: GuiRepositoryAudit = {
  guiId: "t3-code",
  repositoryUrl: "https://github.com/pingdotgg/t3code",
  inspectedRef: "887dd6e455bb969c1a0c9659a6bdf2baceac030d",
  inspectedPaths: [
    "apps/server/src/provider/builtInDrivers.ts",
    "apps/server/src/provider/Drivers/GrokDriver.ts",
    "apps/server/src/provider/Drivers/OpenCodeDriver.ts",
    "apps/server/src/vcs/GitVcsDriverCore.ts",
    "apps/server/src/checkpointing/CheckpointDiffQuery.ts",
    "docs/user/remote-access.md",
  ],
  verifiedAt: "2026-07-28",
  sourceScope: "full-source",
  established: [
    "The server registers five built-in provider drivers: Codex, Claude Code, Cursor Agent, Grok, and OpenCode.",
    "Git worktree creation, removal, checkpoint diffs, and remote access are implemented.",
    "The GUI supervises external coding harnesses rather than replacing their agent loops.",
  ],
  limitation: "The project describes itself as early-stage; inspected mechanisms do not establish product stability or parity across every client.",
};
