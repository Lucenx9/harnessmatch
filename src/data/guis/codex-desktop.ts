import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const appDocs = "https://learn.chatgpt.com/docs/app";
const worktreeDocs = "https://learn.chatgpt.com/docs/environments/git-worktrees";
const remoteDocs = "https://learn.chatgpt.com/docs/remote-connections";

export const codexDesktop: GuiProduct = {
  id: "codex-desktop",
  name: "Codex in ChatGPT Desktop",
  logo: {
    src: "/harnesses/codex.png",
    sourceUrl: "https://developers.openai.com/favicon.png",
    verifiedAt: guiVerifiedAt,
  },
  preview: {
    kind: "video",
    src: "/gui-previews/codex-desktop.mp4",
    poster: "/gui-previews/codex-desktop-poster.webp",
    width: 1280,
    height: 720,
    alt: "First-party ChatGPT desktop app workflow showing a task running across connected work tools.",
    caption: "First-party ChatGPT desktop workflow; Codex is available as a dedicated mode in the same app.",
    sourceUrl: appDocs,
    provenance: "official-media",
    verifiedAt: guiVerifiedAt,
  },
  url: appDocs,
  status: "active",
  layer: "harness-native",
  sourceAccess: "proprietary",
  license: "Proprietary",
  platforms: ["macOS", "Windows"],
  supportedHarnesses: ["Codex"],
  acceptsArbitraryCli: false,
  harnessSupportNote: "Codex only. Local desktop use accepts ChatGPT sign-in or an OpenAI API key, with the corresponding plan or API billing.",
  summary: "The dedicated Codex coding experience inside the ChatGPT desktop app.",
  bestFor: "Codex users who want developer details, inline diff editing, PR review, and remote handoff in the first-party app.",
  limitation: "It is a Codex-only GUI; the open Codex CLI repository does not make the proprietary desktop interface code-verifiable.",
  capabilities: {
    parallelSessions: documented("The desktop Codex experience can run multiple independent chats in one project.", worktreeDocs),
    workspaceIsolation: documented("Codex can create a managed Git worktree for each independent desktop chat.", worktreeDocs),
    visualReview: documented("The coding surface includes inline diff editing and pull-request review.", appDocs),
    remoteExecution: documented("Chat handoff moves a chat and Git state between local and connected remote hosts.", remoteDocs),
    teamCollaboration: unknown("Current first-party desktop documentation does not establish shared live teammate access to one task."),
  },
  evidence: [
    source("ChatGPT desktop app", appDocs, "official-docs", "Codex surface, developer details, diffs, PR review, and platform availability."),
    source("Codex worktrees", worktreeDocs, "official-docs", "Parallel desktop chats, managed worktree isolation, handoff, and cleanup."),
    source("Remote connections", remoteDocs, "official-docs", "Remote-host handoff and Git worktree transfer."),
  ],
  verifiedAt: guiVerifiedAt,
};
