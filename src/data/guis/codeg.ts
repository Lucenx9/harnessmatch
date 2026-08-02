import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const repository = "https://github.com/xintaofei/codeg";
const commit = "d665f7b1f87e2e41611ea47f289224f0b11c010e";
const repositoryBase = `${repository}/blob/${commit}`;
const readme = `${repositoryBase}/README.md`;
const registry = `${repositoryBase}/src-tauri/src/acp/registry.rs`;

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
    "Gemini CLI",
    "Grok Build",
    "Hermes Agent",
    "Kimi Code",
    "OpenClaw",
    "OpenCode",
    "Pi",
  ],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "Twelve built-in ACP integrations are pinned in the audited registry. Users can register other ACP-compatible agents, but protocol compatibility is distinct from launching an arbitrary CLI.",
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
      "Built-in Git worktree flows create a separate branch, directory, and conversation for parallel work.",
      verifiedAt,
      readme,
    ),
    visualReview: documentedAt(
      "Agent edits appear as live diffs beside conversations, with an editor, Git client, and merge-conflict surface.",
      verifiedAt,
      readme,
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
  ],
  verifiedAt,
};
