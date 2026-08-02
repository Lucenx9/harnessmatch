import type { GuiProduct } from "@/lib/gui-types";
import { contradicted, documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const repository = "https://github.com/QwenLM/qwen-code";
const commit = "e1e5b42ce110a16f297cedd15928ca5338a70412";
const repositoryBase = `${repository}/blob/${commit}`;
const readme = `${repositoryBase}/README.md`;
const splitView = `${repositoryBase}/packages/web-shell/client/components/SplitView.tsx`;
const gitMode = `${repositoryBase}/packages/web-shell/client/components/GitModePopover.tsx`;
const diffDialog = `${repositoryBase}/packages/web-shell/client/components/dialogs/GitDiffDialog.tsx`;
const desktopDesign = `${repositoryBase}/docs/design/2026-07-31-desktop-web-shell-release.md`;
const productDocs = "https://docs.qwencloud.com/developer-guides/clients-and-developer-tools/qwen-code";

export const qwenCodeDesktop: GuiProduct = {
  id: "qwen-code-desktop",
  name: "Qwen Code Desktop",
  logo: {
    src: "/harnesses/qwen-code.png",
    sourceUrl: "https://qwenlm.github.io/qwen-code-docs/favicon.png",
    verifiedAt,
  },
  url: productDocs,
  status: "active",
  layer: "harness-native",
  sourceAccess: "open-source",
  license: "Apache-2.0",
  platforms: ["macOS", "Windows", "Linux"],
  supportedHarnesses: ["Qwen Code"],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "The desktop package embeds the Qwen Code CLI runtime and reuses its Web Shell. Provider breadth inside Qwen Code is model routing, not support for another coding harness.",
  summary:
    "The first-party Qwen Code desktop shell with multi-session and split views, optional worktrees, visual Git diffs, and a bundled local runtime.",
  bestFor:
    "Qwen Code users who want the first-party visual workflow on macOS, Windows, or Linux without installing the CLI separately.",
  limitation:
    "The current thin shell is intentionally local, single-window, and single-workspace at a time; remote backends and shared teammate access are not desktop capabilities.",
  capabilities: {
    parallelSessions: documentedAt(
      "The shared Web Shell can select multiple sessions and display them concurrently in an in-window split view.",
      verifiedAt,
      splitView,
    ),
    workspaceIsolation: documentedAt(
      "The new-session Git-mode control can create a named Git worktree and root the session in that checkout.",
      verifiedAt,
      gitMode,
    ),
    visualReview: documentedAt(
      "The Web Shell includes a dedicated Git diff dialog with file lists, expandable hunks, additions, deletions, and binary states.",
      verifiedAt,
      diffDialog,
    ),
    remoteExecution: contradicted(
      "The current Desktop design starts an authenticated daemon on a random loopback port and intentionally keeps external URLs outside the app.",
      verifiedAt,
      desktopDesign,
    ),
    teamCollaboration: unknown(
      "Current first-party Desktop sources do not establish multiple teammates entering the same live workspace.",
      verifiedAt,
    ),
  },
  evidence: [
    source(
      "QwenCloud Qwen Code Desktop guide",
      productDocs,
      "official-docs",
      "product-workflow",
      "First-party Desktop identity, bundled CLI runtime, shared configuration, and GUI-based provider setup.",
      verifiedAt,
    ),
    source(
      "Qwen Code pinned product record",
      readme,
      "official-repository",
      "public-code",
      "Official Desktop mode, macOS, Windows and Linux availability, repository identity, and Apache license.",
      verifiedAt,
    ),
    source(
      "Qwen Code Web Shell split view",
      splitView,
      "official-repository",
      "sessions-isolation-review",
      "Concurrent rendering and lifecycle of multiple selected sessions in one desktop window.",
      verifiedAt,
    ),
    source(
      "Qwen Code Web Shell worktree control",
      gitMode,
      "official-repository",
      "sessions-isolation-review",
      "User-selectable current-directory, branch, and Git-worktree modes for a new session.",
      verifiedAt,
    ),
    source(
      "Qwen Code Web Shell diff dialog",
      diffDialog,
      "official-repository",
      "sessions-isolation-review",
      "Visual repository diff loading and file-hunk review in the desktop-shared UI.",
      verifiedAt,
    ),
    source(
      "Qwen Code Desktop shell release design",
      desktopDesign,
      "official-repository",
      "remote-collaboration",
      "Loopback-only daemon boundary, single-window and single-workspace scope, external-navigation policy, and signed platform artifacts.",
      verifiedAt,
    ),
  ],
  verifiedAt,
};
