import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const qmAudit: GuiRepositoryAudit = {
  guiId: "qm",
  repositoryUrl: "https://github.com/yc-software/qm",
  inspectedRef: "7f2c916360f1797a8ff2a77ce2ce40c5fabab087",
  inspectedPaths: [
    "README.md",
    "SECURITY.md",
    "deployment.md",
    "src/core/orchestrator.ts",
    "src/harness/harness-router.ts",
    "src/runs/worker.ts",
    "src/sandbox/sandbox-routing.ts",
    "plugins/web-ui/README.md",
  ],
  verifiedAt: "2026-08-02",
  sourceScope: "full-source",
  established: [
    "The core supervises durable session runs and routes them to four named harness adapters.",
    "Scope-specific state, policy, persistence, sandbox routing, background workers, and web or Slack surfaces are implemented in the pinned tree.",
    "The public code establishes workflow mechanisms but not arbitrary-CLI support, visual-review completeness, security guarantees, or task-success rates.",
  ],
  limitation:
    "QM calls itself early experimental software and documents material gaps in command policy, browser approval coverage, screening, egress enforcement, governance, and data retention. The audit confirms implementation presence rather than operational safety or reliability.",
};
