import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const docs = "https://www.conductor.build/docs";
const cloud = "https://www.conductor.build/cloud";

export const conductor: GuiProduct = {
  id: "conductor",
  name: "Conductor",
  logo: {
    src: "/guis/conductor.svg",
    sourceUrl: "https://www.conductor.build/icon.png?icon.7d575655.png",
    verifiedAt: guiVerifiedAt,
  },
  url: docs,
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "proprietary",
  license: "Proprietary",
  platforms: ["macOS"],
  supportedHarnesses: ["Claude Code", "Codex", "Cursor Agent", "OpenCode"],
  acceptsArbitraryCli: false,
  harnessSupportNote: "Four documented integrations. Conductor reuses each CLI's existing login, subscription, or provider configuration.",
  summary: "A Mac workspace for running several coding agents across isolated worktrees.",
  bestFor: "Mac users who want a focused parallel-agent dashboard without changing their existing CLI subscriptions.",
  limitation: "The desktop product is Mac-only. Conductor Cloud is still early access, so it is not admitted here as current remote or shared-team evidence.",
  capabilities: {
    parallelSessions: documented("The app runs Claude Code, Codex, Cursor Agent, and OpenCode in parallel.", docs),
    workspaceIsolation: documented("Each Conductor workspace is a separate Git worktree.", docs),
    visualReview: documented("The product documents agent monitoring followed by review and merge.", docs),
    remoteExecution: unknown("Current first-party documentation does not establish remote-host execution or access."),
    teamCollaboration: unknown("Current first-party documentation does not establish shared live workspace access."),
  },
  evidence: [
    source("Conductor documentation", docs, "official-docs", "product-workflow", "Four supported agents, Mac scope, parallel workspaces, worktrees, review, and merge."),
    source("Conductor Cloud early access", cloud, "official-announcement", "remote-collaboration", "The cloud team-agent product is announced as early access rather than admitted as a current desktop capability."),
  ],
  verifiedAt: guiVerifiedAt,
};
