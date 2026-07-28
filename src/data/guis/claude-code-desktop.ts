import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const docs = "https://code.claude.com/docs/en/desktop";

export const claudeCodeDesktop: GuiProduct = {
  id: "claude-code-desktop",
  name: "Claude Code Desktop",
  logo: {
    src: "/harnesses/claude-code.png",
    sourceUrl: "https://code.claude.com/docs/_mintlify/favicons/claude-code/pLsy-mRpNksna2sx/_generated/favicon/android-chrome-192x192.png",
    verifiedAt: guiVerifiedAt,
  },
  url: docs,
  status: "active",
  layer: "harness-native",
  sourceAccess: "proprietary",
  license: "Proprietary",
  platforms: ["macOS", "Windows", "Linux"],
  supportedHarnesses: ["Claude Code"],
  acceptsArbitraryCli: false,
  harnessSupportNote: "Claude Code only. The desktop Code tab requires an eligible Anthropic account or subscription, and cloud sessions count against its usage limits.",
  summary: "The Code tab in Claude Desktop, using the Claude Code engine with dedicated developer panes.",
  bestFor: "Claude Code users who want one native surface for chat, diffs, terminals, previews, and remote sessions.",
  limitation: "It is tied to Claude Code and Anthropic account availability; the desktop GUI source is not public.",
  capabilities: {
    parallelSessions: documented("The session sidebar runs multiple independent sessions in parallel.", docs),
    workspaceIsolation: documented("Parallel sessions can use automatic Git worktree isolation.", docs),
    visualReview: documented("Diff comments, code review, CI monitoring, file editing, terminal, and previews are built in.", docs),
    remoteExecution: documented("Sessions can run locally, in Anthropic cloud, or over SSH.", docs),
    teamCollaboration: unknown("The current desktop reference does not establish a shared live coding session for multiple teammates."),
  },
  evidence: [source("Claude Code desktop application", docs, "official-docs", "Code-tab scope, parallel sessions, isolation, review panes, permissions, cloud, and SSH.")],
  verifiedAt: guiVerifiedAt,
};
