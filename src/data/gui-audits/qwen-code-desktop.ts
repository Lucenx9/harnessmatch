import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const qwenCodeDesktopAudit: GuiRepositoryAudit = {
  guiId: "qwen-code-desktop",
  repositoryUrl: "https://github.com/QwenLM/qwen-code",
  inspectedRef: "e1e5b42ce110a16f297cedd15928ca5338a70412",
  inspectedPaths: [
    "README.md",
    "packages/desktop-shell/README.md",
    "docs/design/2026-07-31-desktop-web-shell-release.md",
    "packages/web-shell/client/components/SplitView.tsx",
    "packages/web-shell/client/components/GitModePopover.tsx",
    "packages/web-shell/client/components/dialogs/GitDiffDialog.tsx",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The desktop shell embeds the Qwen Code daemon and reuses the first-party Web Shell.",
    "The Web Shell implements multi-session split view, selectable Git-worktree mode, and a structured Git-diff dialog.",
    "The desktop design constrains the daemon to loopback and the UI to one window and workspace at a time.",
  ],
  limitation: "The audit establishes the current local desktop architecture and UI mechanisms, not task quality, security, or reliable cross-platform behavior.",
};
