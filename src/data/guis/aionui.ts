import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const repository = "https://github.com/iOfficeAI/AionUi";
const commit = "2bca547018428aeef08cedbe8da613e17d5e9d93";
const repositoryBase = `${repository}/blob/${commit}`;
const readme = `${repositoryBase}/readme.md`;
const webUiGuide = `${repositoryBase}/docs/guides/webui.md`;
const diffViewer = `${repositoryBase}/packages/desktop/src/renderer/pages/conversation/Preview/components/viewers/DiffViewer.tsx`;

export const aionUi: GuiProduct = {
  id: "aionui",
  name: "AionUi",
  logo: {
    src: "/guis/aionui.svg",
    sourceUrl: `${repositoryBase}/resources/aionui_logo_black_bg.svg`,
    verifiedAt,
  },
  url: "https://www.aionui.com/",
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "Apache-2.0",
  platforms: ["macOS", "Windows", "Linux", "Browser"],
  supportedHarnesses: [
    "Aion CLI",
    "Augment Code",
    "Claude Code",
    "CodeBuddy",
    "Codex",
    "Cursor Agent",
    "Factory Droid",
    "GitHub Copilot",
    "Goose AI",
    "Hermes Agent",
    "Kimi CLI",
    "Mistral Vibe",
    "Nanobot",
    "OpenClaw",
    "OpenCode",
    "Qoder CLI",
    "Qwen Code",
    "Snow CLI",
  ],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "The pinned product record names 18 external CLI integrations and also ships a built-in agent. Additional backends must speak its supported ACP path; that is not evidence that an arbitrary CLI can be launched.",
  summary:
    "A cross-platform Cowork app for many named coding agents, parallel sessions, visual file changes, automation, and browser access.",
  bestFor:
    "Users who want broad named-agent coverage, a built-in agent, desktop and browser surfaces, and remote access from their own machine or server.",
  limitation:
    "Its Team Mode coordinates agents rather than human teammates, and the documented shared-folder model does not establish per-session worktree isolation.",
  capabilities: {
    parallelSessions: documentedAt(
      "Multi-Agent Mode runs multiple agents simultaneously with independent conversation context.",
      verifiedAt,
      readme,
    ),
    workspaceIsolation: unknown(
      "Current first-party sources do not establish automatic branch or worktree isolation; Team Mode explicitly uses one shared folder.",
      verifiedAt,
    ),
    visualReview: documentedAt(
      "The desktop implementation renders file-change summaries and a dedicated side-by-side or line diff viewer.",
      verifiedAt,
      diffViewer,
    ),
    remoteExecution: documentedAt(
      "WebUI mode exposes the application in a browser, supports remote devices on the network, and can run headlessly on a server.",
      verifiedAt,
      webUiGuide,
    ),
    teamCollaboration: unknown(
      "Agent-to-agent Team Mode does not establish multiple human teammates entering the same live workspace.",
      verifiedAt,
    ),
  },
  evidence: [
    source(
      "AionUi pinned product record",
      readme,
      "official-repository",
      "product-workflow",
      "Named CLI integrations, parallel sessions, agent Team Mode, platforms, distribution, and license.",
      verifiedAt,
    ),
    source(
      "AionUi WebUI guide",
      webUiGuide,
      "official-repository",
      "remote-collaboration",
      "Browser, LAN, remote-device, headless-server, and platform-specific WebUI startup paths.",
      verifiedAt,
    ),
    source(
      "AionUi diff viewer implementation",
      diffViewer,
      "official-repository",
      "sessions-isolation-review",
      "Visual diff rendering used by the conversation preview surface.",
      verifiedAt,
    ),
  ],
  verifiedAt,
};
