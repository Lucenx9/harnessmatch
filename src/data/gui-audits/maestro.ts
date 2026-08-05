import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const maestroAudit: GuiRepositoryAudit = {
  guiId: "maestro",
  repositoryUrl: "https://github.com/RunMaestro/Maestro",
  inspectedRef: "e3479fe05b3953248bd72b7e2d4b0ace23d18369",
  inspectedPaths: [
    "src/main/agents/definitions.ts",
    "src/main/agents/capabilities.ts",
    "src/renderer/hooks/worktree/useWorktreeHandlers.ts",
    "src/renderer/components/GitDiffViewer.tsx",
    "src/main/web-server/WebServer.ts",
    "src/main/group-chat/group-chat-moderator.ts",
  ],
  verifiedAt: "2026-08-05",
  sourceScope: "full-source",
  established: [
    "Provider definitions and capability gates implement a named set of coding-agent integrations rather than unrestricted CLI discovery.",
    "The renderer implements worktree lifecycle controls and a dedicated Git diff surface.",
    "The desktop process exposes token-gated web access to live sessions and command input.",
    "Group chat moderates conversations among AI-agent participants, not human collaborators sharing one live workspace.",
  ],
  limitation:
    "The pinned implementation and live compatibility page do not fully align on every beta integration. This audit therefore does not establish implementation parity across the published provider list or human multi-user collaboration.",
};
