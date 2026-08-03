import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const hapiAudit: GuiRepositoryAudit = {
  guiId: "hapi",
  repositoryUrl: "https://github.com/tiann/hapi",
  inspectedRef: "9d07857570bb689b4ae64dcd956afc6ddd7f60b1",
  inspectedPaths: [
    "README.md",
    "shared/src/flavors.ts",
    "web/src/components/SessionList.tsx",
    "web/src/components/DiffView.tsx",
    "hub/src/web/server.ts",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The shared flavor registry implements five named coding-agent CLI integrations.",
    "The web client groups live sessions by project and machine and implements structured visual diffs.",
    "The hub implements the browser-facing control surface used for relay and self-hosted access.",
  ],
  limitation: "Session grouping is evidence of concurrent-session control, not automatic worktree isolation or shared human-team workspaces.",
};
