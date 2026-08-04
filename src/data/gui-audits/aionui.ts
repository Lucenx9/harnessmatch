import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const aionUiAudit: GuiRepositoryAudit = {
  guiId: "aionui",
  repositoryUrl: "https://github.com/iOfficeAI/AionUi",
  inspectedRef: "0f7635b2f8a62e0a757eff60aea210e502726f92",
  inspectedPaths: [
    "readme.md",
    "docs/guides/webui.md",
    "packages/desktop/src/renderer/components/base/FileChangesPanel.tsx",
    "packages/desktop/src/renderer/pages/conversation/Preview/components/viewers/DiffViewer.tsx",
    "packages/desktop/src/renderer/pages/team/TeamPage.tsx",
    "tests/e2e/features/conversations/antigravity/basic-flow.e2e.ts",
  ],
  verifiedAt: "2026-08-04",
  sourceScope: "full-source",
  established: [
    "The pinned product record plus the 2.1.46 release establish 19 external CLI integrations and separate them from its built-in agent.",
    "The pinned Antigravity E2E path exercises selection, direct-CLI startup, first-turn delivery, model options, and reported token usage without transferring Antigravity capability claims to AionUi.",
    "Multi-Agent and Team Mode surfaces are implemented, with Team Mode coordinating agents over a shared folder.",
    "The desktop client implements file-change and visual-diff surfaces, while WebUI supports browser and headless-server access.",
  ],
  limitation: "Agent-to-agent Team Mode is not evidence of human-team collaboration, and implementation presence does not establish integration parity or reliability.",
};
