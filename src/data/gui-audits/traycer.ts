import type { GuiRepositoryAudit } from "@/lib/gui-types";

export const traycerAudit: GuiRepositoryAudit = {
  guiId: "traycer",
  repositoryUrl: "https://github.com/traycerai/traycer",
  inspectedRef: "8f21d506f9945e409f4cd72f32c71e8810a4d236",
  inspectedPaths: [
    "clients/gui-app/src/hooks/worktree/use-worktree-create-mutation.ts",
    "clients/gui-app/src/components/epic-canvas/git-diff/git-diff-panel-body-live.tsx",
    "clients/shared/host-transport/remote/create-remote-transport.ts",
    "clients/gui-app/src/hooks/epic/use-epic-collaborator-mutations.ts",
    "clients/gui-app/src/components/epic-canvas/panels/epic-sharing/panel.tsx",
    "clients/gui-app/src/stores/chats/a2a-open-store.tsx",
  ],
  verifiedAt: "2026-08-05",
  sourceScope: "client-source",
  established: [
    "The desktop client binds worktree creation and worktree-scoped Git diff review into the task interface.",
    "A remote transport connects the client to a reachable execution Host.",
    "Collaborator mutations and the sharing panel implement task access and role management.",
    "The chat store exposes agent-to-agent session state and messaging surfaces.",
  ],
  limitation:
    "The public repository exposes client and protocol code, but not every hosted collaboration or cloud service. The audit does not establish service guarantees, privacy properties, or feature parity across every named integration.",
};
