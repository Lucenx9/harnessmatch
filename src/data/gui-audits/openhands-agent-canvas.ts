import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const openHandsAgentCanvasAudit: GuiRepositoryAudit = {
  guiId: "openhands-agent-canvas",
  repositoryUrl: "https://github.com/OpenHands/OpenHands",
  inspectedRef: "1708efc446082894e244c78af3c67da780d33369",
  inspectedPaths: [
    "README.md",
    "docs/ACP_AGENTS.md",
    "docs/TESTING_MATRIX.md",
    "src/routes/changes-tab.tsx",
    "src/hooks/query/use-unified-git-diff.ts",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The current Agent Canvas repository documents OpenHands, Claude Code, Codex, Gemini CLI, and custom stdio ACP configuration.",
    "The client implements a dedicated repository-changes route backed by a unified Git-diff query.",
    "The testing matrix records current credential, subscription-login, and platform coverage gaps for ACP providers.",
  ],
  limitation: "The audit establishes integration and review mechanisms at the pinned commit; its own test matrix prevents treating presence as cross-provider reliability evidence.",
};
