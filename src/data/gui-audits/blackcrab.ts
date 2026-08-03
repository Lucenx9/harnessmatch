import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const blackcrabAudit: GuiRepositoryAudit = {
  guiId: "blackcrab",
  repositoryUrl: "https://github.com/BonJenn/blackcrab",
  inspectedRef: "6ab00e0a286ed2fa6e97736bfd5935f0e195c9d2",
  inspectedPaths: [
    "README.md",
    "src/App.tsx",
    "src/LivePanel.tsx",
    "src-tauri/src/lib.rs",
    "docs/mobile-remote.md",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The native process boundary launches and resumes locally installed Claude Code sessions.",
    "The desktop grid implements multiple live panels, worktree-aware state, terminal, preview, and structured transcript views.",
    "The mobile-remote document describes an experimental companion path and explicitly records incomplete host connectivity.",
  ],
  limitation: "The audit establishes mechanisms in an early, macOS-first codebase; it does not establish cross-platform reliability or a production-ready remote path.",
};
