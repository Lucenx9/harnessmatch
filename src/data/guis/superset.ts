import type { GuiProduct } from "@/lib/gui-types";
import { documented, documentedAt, guiVerifiedAt, source } from "./helpers";

const repository = "https://github.com/superset-sh/superset";
const agentDocs = "https://docs.superset.sh/agent-integration";
const remoteDocs = "https://docs.superset.sh/remote-workspaces";
const latestReleaseVerifiedAt = "2026-08-22";
const cloudWorkspaceIntroductionRelease = `${repository}/releases/tag/desktop-v1.23.0`;
const cloudWorkspaceRelease = `${repository}/releases/tag/desktop-v1.24.0`;
const pullRequestReviewRelease = `${repository}/releases/tag/desktop-v1.24.1`;

export const superset: GuiProduct = {
  id: "superset",
  name: "Superset",
  logo: {
    src: "/guis/superset.svg",
    sourceUrl: "https://superset.sh/favicon-192.png",
    verifiedAt: guiVerifiedAt,
  },
  url: "https://superset.sh/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "source-available",
  license: "Elastic License 2.0",
  platforms: ["macOS"],
  supportedHarnesses: ["Amp", "Claude Code", "Codex", "Cursor Agent", "Droid", "Gemini CLI", "GitHub Copilot", "Grok", "Kimi", "Mastra Code", "Mistral Vibe", "OpenCode", "Pi", "Polygraph"],
  acceptsArbitraryCli: true,
  harnessSupportNote: "Fourteen presets are documented, and any other terminal CLI can be configured. Custom agents may have less integrated behavior than built-in presets.",
  summary: "A local desktop code editor for many CLI agents running in isolated Git worktrees.",
  bestFor: "Mac power users and teams who want high concurrency, arbitrary CLI compatibility, local or cloud workspaces, terminals, diffs, and editor handoff.",
  limitation: "Windows and Linux desktop builds are explicitly untested. Local remote access requires an opted-in host and relay; the separate cloud-workspace path is backed by third-party Blaxel sandboxes.",
  capabilities: {
    parallelSessions: documented("The product documents ten or more simultaneous local coding agents.", repository),
    workspaceIsolation: documented("Every task is placed in an isolated Git worktree.", repository),
    visualReview: documentedAt(
      "A built-in diff viewer, editor, terminal, external-editor handoff, and pull-request split view are implemented.",
      latestReleaseVerifiedAt,
      repository,
      pullRequestReviewRelease,
    ),
    remoteExecution: documentedAt(
      "Remote hosts expose full workspaces, terminals, ports, agent runs, and diffs through Superset Relay; version 1.24.0 also exposes cloud-workspace creation, terminals, and agent actions from mobile.",
      latestReleaseVerifiedAt,
      remoteDocs,
      cloudWorkspaceIntroductionRelease,
      cloudWorkspaceRelease,
    ),
    teamCollaboration: documented("Host owners can grant organization teammates access to the same remote workspaces.", remoteDocs),
  },
  evidence: [
    source("Superset agent integration", agentDocs, "official-docs", "harness-integrations", "Fourteen built-in agent presets, arbitrary terminal agents, launch behavior, parallel tasks, and provider configuration."),
    source("Superset remote workspaces", remoteDocs, "official-docs", "remote-collaboration", "Remote hosts, relay access, organization membership, shared workspaces, terminals, agent runs, ports, and diffs."),
    source("Superset official repository", repository, "official-repository", "public-code", "Parallel execution, worktrees, monitoring, review, agent catalog, platform scope, and ELv2 license."),
    source(
      "Superset Desktop 1.23.0 release",
      cloudWorkspaceIntroductionRelease,
      "official-announcement",
      "remote-collaboration",
      "Blaxel-backed cloud workspaces, relay controls, trigger-based automations, raw-CDP browser control, and idempotent session auto-resume.",
      "2026-08-20",
    ),
    source(
      "Superset Desktop 1.24.0 release",
      cloudWorkspaceRelease,
      "official-announcement",
      "remote-collaboration",
      "Mobile creation and operation of cloud workspaces, workspace terminals and agent actions, browser-control skills, account profiles, and large-diff reliability fixes.",
      latestReleaseVerifiedAt,
    ),
    source(
      "Superset Desktop 1.24.1 release",
      pullRequestReviewRelease,
      "official-announcement",
      "sessions-isolation-review",
      "Pull-request split-view review with merge, close, and reopen controls.",
      latestReleaseVerifiedAt,
    ),
  ],
  verifiedAt: latestReleaseVerifiedAt,
};
