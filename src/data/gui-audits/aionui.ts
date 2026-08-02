import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const aionUiAudit: GuiRepositoryAudit = {
  guiId: "aionui",
  repositoryUrl: "https://github.com/iOfficeAI/AionUi",
  inspectedRef: "2bca547018428aeef08cedbe8da613e17d5e9d93",
  inspectedPaths: [
    "readme.md",
    "docs/guides/webui.md",
    "packages/desktop/src/renderer/components/base/FileChangesPanel.tsx",
    "packages/desktop/src/renderer/pages/conversation/Preview/components/viewers/DiffViewer.tsx",
    "packages/desktop/src/renderer/pages/team/TeamPage.tsx",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The pinned product record names 18 external CLI integrations and separates them from its built-in agent.",
    "Multi-Agent and Team Mode surfaces are implemented, with Team Mode coordinating agents over a shared folder.",
    "The desktop client implements file-change and visual-diff surfaces, while WebUI supports browser and headless-server access.",
  ],
  limitation: "Agent-to-agent Team Mode is not evidence of human-team collaboration, and implementation presence does not establish integration parity or reliability.",
};
