import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const repository = "https://github.com/tiann/hapi";
const commit = "9d07857570bb689b4ae64dcd956afc6ddd7f60b1";
const repositoryBase = `${repository}/blob/${commit}`;
const readme = `${repositoryBase}/README.md`;
const sessionList = `${repositoryBase}/web/src/components/SessionList.tsx`;
const diffView = `${repositoryBase}/web/src/components/DiffView.tsx`;

export const hapi: GuiProduct = {
  id: "hapi",
  name: "HAPI",
  logo: {
    src: "/guis/hapi.svg",
    sourceUrl: `${repositoryBase}/web/public/pwa-64x64.png`,
    verifiedAt,
  },
  url: "https://hapi.run/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "AGPL-3.0",
  platforms: ["Browser"],
  supportedHarnesses: ["Claude Code", "Codex", "Cursor Agent", "Grok Build", "OpenCode"],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "HAPI wraps five named local agent CLIs. Each CLI keeps its own runtime, authentication, history, tools, and provider behavior.",
  summary:
    "A local-first web, PWA, and Telegram control surface for handing off five coding-agent CLIs between terminal and remote devices.",
  bestFor:
    "Developers who want to keep agent execution on their workstation while checking sessions, approvals, files, diffs, and terminals from a browser or phone.",
  limitation:
    "The GUI is browser-based, current sources do not establish automatic worktree isolation, and multi-user shared-workspace behavior is not documented.",
  capabilities: {
    parallelSessions: documentedAt(
      "The web client groups and tracks independent live sessions across projects and connected machines.",
      verifiedAt,
      sessionList,
    ),
    workspaceIsolation: unknown(
      "Scoped workspace roots limit browsing and session start directories, but current sources do not establish automatic branch or worktree isolation.",
      verifiedAt,
    ),
    visualReview: documentedAt(
      "The web client renders file changes in an expandable visual diff with line counts and additions and deletions.",
      verifiedAt,
      diffView,
    ),
    remoteExecution: documentedAt(
      "Web, PWA, and Telegram clients can control the named agents and terminal on the working machine through relay or self-hosted access.",
      verifiedAt,
      readme,
    ),
    teamCollaboration: unknown(
      "Current first-party sources do not establish teammates entering the same live HAPI workspace.",
      verifiedAt,
    ),
  },
  evidence: [
    source(
      "HAPI pinned product record",
      readme,
      "official-repository",
      "product-workflow",
      "Five named agent integrations, terminal handoff, remote control, scoped workspace browsing, relay, and self-hosting.",
      verifiedAt,
    ),
    source(
      "HAPI session-list implementation",
      sessionList,
      "official-repository",
      "sessions-isolation-review",
      "Independent session grouping, machine filters, active-session state, history, and reopening in the browser UI.",
      verifiedAt,
    ),
    source(
      "HAPI diff-view implementation",
      diffView,
      "official-repository",
      "sessions-isolation-review",
      "Inline and dialog diff rendering with line statistics and file paths.",
      verifiedAt,
    ),
  ],
  verifiedAt,
};
