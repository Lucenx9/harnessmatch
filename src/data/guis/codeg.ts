import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const latestReleaseVerifiedAt = "2026-08-22";
const repository = "https://github.com/xintaofei/codeg";
const commit = "d665f7b1f87e2e41611ea47f289224f0b11c010e";
const repositoryBase = `${repository}/blob/${commit}`;
const readme = `${repositoryBase}/README.md`;
const registry = `${repositoryBase}/src-tauri/src/acp/registry.rs`;
const deepSeekRelease = `${repository}/releases/tag/v0.26.2`;
const latestRelease = `${repository}/releases/tag/v0.27.0`;

export const codeg: GuiProduct = {
  id: "codeg",
  name: "Codeg",
  logo: {
    src: "/guis/codeg.svg",
    sourceUrl: `${repositoryBase}/public/icon.svg`,
    verifiedAt,
  },
  url: "https://docs.codeg.app/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "Apache-2.0",
  platforms: ["macOS", "Windows", "Linux", "Browser", "iOS", "Android"],
  supportedHarnesses: [
    "Claude Code",
    "Cline",
    "CodeBuddy Code",
    "Codex",
    "Cursor Agent",
    "DeepSeek Harness",
    "Gemini CLI",
    "Grok Build",
    "Hermes Agent",
    "Kimi Code",
    "OpenClaw",
    "OpenCode",
    "Pi",
    "Qoder",
  ],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "Twelve built-in ACP integrations are pinned in the audited registry; releases 0.26.2 and 0.27.0 add DeepSeek Harness and Qoder as the thirteenth and fourteenth bundled agents. Users can register other ACP-compatible agents, but protocol compatibility is distinct from launching an arbitrary CLI.",
  summary:
    "A desktop, server, browser, and mobile workspace for many ACP coding agents, delegation, split views, worktrees, Git, and diffs.",
  bestFor:
    "Developers who want broad ACP-agent coverage, searchable cross-agent history, parallel worktrees, and remote control from browser or mobile clients.",
  limitation:
    "Integration depth and authentication remain agent-specific, custom integrations must implement ACP, and the native iOS and Android clients are described as still in testing.",
  capabilities: {
    parallelSessions: documentedAt(
      "Split views and cross-agent delegation run independent sessions side by side inside one workspace.",
      verifiedAt,
      readme,
    ),
    workspaceIsolation: documentedAt(
      "Built-in Git worktree flows create a separate branch, directory, and conversation for parallel work; repository issues and pull requests can also start isolated agent worktrees.",
      latestReleaseVerifiedAt,
      readme,
      latestRelease,
    ),
    visualReview: documentedAt(
      "Agent edits appear as live diffs beside conversations, with an editor, Git client, merge-conflict surface, and review flow for repository-issued worktree tasks.",
      latestReleaseVerifiedAt,
      readme,
      latestRelease,
    ),
    remoteExecution: documentedAt(
      "A standalone server and Docker mode expose the workspace in a browser, while mobile clients connect to the desktop web service or server.",
      verifiedAt,
      readme,
    ),
    teamCollaboration: unknown(
      "Multi-agent delegation does not establish multiple human teammates sharing the same live workspace.",
      verifiedAt,
    ),
  },
  evidence: [
    source(
      "Codeg pinned product record",
      readme,
      "official-repository",
      "product-workflow",
      "Twelve named agents, custom ACP registration, delegation, split views, worktrees, diffs, server and mobile surfaces, platforms, and license.",
      verifiedAt,
    ),
    source(
      "Codeg pinned ACP registry",
      registry,
      "official-repository",
      "harness-integrations",
      "The exact twelve built-in agent identities and the separation between built-in and custom ACP agents.",
      verifiedAt,
    ),
    source(
      "Codeg 0.26.2 release",
      deepSeekRelease,
      "official-announcement",
      "harness-integrations",
      "DeepSeek Harness as a bundled agent, session ownership checks, history retention, remote-workspace entry points, and multi-view turn recovery.",
      "2026-08-20",
    ),
    source(
      "Codeg 0.27.0 release",
      latestRelease,
      "official-announcement",
      "harness-integrations",
      "Qoder as a bundled agent and a repository panel that turns GitHub or GitLab issues and pull requests into isolated agent worktrees with review and no automatic merge.",
      latestReleaseVerifiedAt,
    ),
  ],
  verifiedAt: latestReleaseVerifiedAt,
};
