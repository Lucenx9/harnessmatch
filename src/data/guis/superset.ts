import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source } from "./helpers";

const repository = "https://github.com/superset-sh/superset";
const agentDocs = "https://docs.superset.sh/agent-integration";
const remoteDocs = "https://docs.superset.sh/remote-workspaces";

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
  bestFor: "Mac power users and teams who want high concurrency, arbitrary CLI compatibility, remote hosts, terminals, diffs, and editor handoff.",
  limitation: "Windows and Linux desktop builds are explicitly untested. Remote access requires an opted-in host and relay, with dedicated-host isolation recommended for shared use.",
  capabilities: {
    parallelSessions: documented("The product documents ten or more simultaneous local coding agents.", repository),
    workspaceIsolation: documented("Every task is placed in an isolated Git worktree.", repository),
    visualReview: documented("A built-in diff viewer, editor, terminal, and external-editor handoff are implemented.", repository),
    remoteExecution: documented("Remote hosts expose full workspaces, terminals, ports, agent runs, and diffs through Superset Relay.", remoteDocs),
    teamCollaboration: documented("Host owners can grant organization teammates access to the same remote workspaces.", remoteDocs),
  },
  evidence: [
    source("Superset agent integration", agentDocs, "official-docs", "Fourteen built-in agent presets, arbitrary terminal agents, launch behavior, parallel tasks, and provider configuration."),
    source("Superset remote workspaces", remoteDocs, "official-docs", "Remote hosts, relay access, organization membership, shared workspaces, terminals, agent runs, ports, and diffs."),
    source("Superset official repository", repository, "official-repository", "Parallel execution, worktrees, monitoring, review, agent catalog, platform scope, and ELv2 license."),
  ],
  verifiedAt: guiVerifiedAt,
};
