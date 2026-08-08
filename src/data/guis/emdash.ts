import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const repository = "https://github.com/generalaction/emdash";
const providerDocs = "https://emdash.com/docs/providers";

export const emdash: GuiProduct = {
  id: "emdash",
  name: "Emdash",
  logo: {
    src: "/guis/emdash.svg",
    sourceUrl: "https://emdash.com/icon.svg?icon.ccc521cf.svg",
    verifiedAt: guiVerifiedAt,
  },
  url: "https://emdash.com/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "Apache-2.0",
  platforms: ["macOS", "Windows", "Linux"],
  supportedHarnesses: [
    "Amp", "Antigravity", "Auggie", "Autohand Code", "Charm", "Claude Code", "Cline",
    "CodeBuddy Code", "Codebuff", "Codex", "Command Code", "Continue", "Cursor Agent", "Devin",
    "Droid", "Freebuff", "GitHub Copilot", "Goose", "Grok", "Hermes Agent", "Jules", "Junie",
    "Kilocode", "Kimi", "Kiro", "Letta", "MiMo Code", "Mistral Vibe", "Oh My Pi", "OpenCode",
    "Pi", "Qoder CLI", "Qwen Code", "Rovo Dev", "Zero",
  ],
  acceptsArbitraryCli: false,
  harnessSupportNote: "The audited registry contains 35 named CLI integrations; the live provider page currently lists 34 because CodeBuddy is present in code but not yet on that page. Capabilities vary by provider, and every CLI needs its own product access.",
  summary: "A local-first desktop environment for parallel coding agents, review, and issue-to-agent workflows.",
  bestFor: "Developers who need cross-platform local and SSH projects with broad agent and issue-tracker support.",
  limitation: "The supported provider set has provider-specific behavior, and shared teammate access is not established by the current record.",
  capabilities: {
    parallelSessions: documented("The desktop app runs multiple coding agents in parallel.", repository),
    workspaceIsolation: documented("Each task receives a Git worktree and branch.", repository),
    visualReview: documented("Diff review, PR creation, CI inspection, and merge are available in one surface.", repository),
    remoteExecution: documented("Remote projects run on user-controlled machines over SSH and SFTP.", repository),
    teamCollaboration: unknown("The current official record does not establish multiple teammates sharing one live workspace."),
  },
  evidence: [
    source("Emdash provider documentation", providerDocs, "official-docs", "harness-integrations", "Named CLI integrations, provider-specific capabilities, authentication prerequisites, and unsupported-provider requests."),
    source("Emdash official repository", repository, "official-repository", "public-code", "Current provider registry, platforms, worktrees, review, issue integrations, SSH projects, privacy, and license."),
  ],
  verifiedAt: guiVerifiedAt,
};
