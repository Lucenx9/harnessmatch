import type { GuiProduct } from "@/lib/gui-types";
import { documented, guiVerifiedAt, source, unknown } from "./helpers";

const docs = "https://t3.codes/";
const repository = "https://github.com/pingdotgg/t3code";

export const t3Code: GuiProduct = {
  id: "t3-code",
  name: "T3 Code",
  logo: {
    src: "/guis/t3-code.svg",
    sourceUrl: "https://github.com/pingdotgg/t3code/blob/887dd6e455bb969c1a0c9659a6bdf2baceac030d/assets/prod/logo.svg",
    verifiedAt: guiVerifiedAt,
  },
  preview: {
    kind: "image",
    src: "/gui-previews/t3-code-clean.webp",
    width: 2316,
    height: 1574,
    alt: "T3 Code new-thread view with the HarnessMatch project selected and the coding-agent composer open.",
    caption: "Current T3 Code new-thread workspace, captured in the HarnessMatch repository.",
    sourceUrl: docs,
    provenance: "editorial-capture",
    verifiedAt: guiVerifiedAt,
  },
  url: docs,
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "MIT",
  platforms: ["macOS", "Windows", "Linux", "Browser", "iOS"],
  supportedHarnesses: ["Claude Code", "Codex", "Cursor Agent", "Grok", "OpenCode"],
  acceptsArbitraryCli: false,
  harnessSupportNote: "Five built-in drivers. You bring the existing subscriptions and credentials for each provider; T3 Code does not resell keys or tokens.",
  summary: "A minimal web and desktop GUI that presents five coding harnesses through one session model.",
  bestFor: "People who want a lightweight multi-harness interface with worktrees, diffs, checkpoints, and remote access.",
  limitation: "The project calls itself early-stage, and current first-party evidence does not establish live multi-user collaboration.",
  capabilities: {
    parallelSessions: documented("The orchestration contracts model multiple threads and independent provider runtimes.", repository),
    workspaceIsolation: documented("The server creates and removes Git worktrees for threads.", repository),
    visualReview: documented("Checkpoint diffs and Git review operations are part of the GUI workflow.", repository),
    remoteExecution: documented("Official user documentation covers remote access, relay connections, and mobile clients.", repository),
    teamCollaboration: unknown("The current official record does not establish shared live teammate access to one thread."),
  },
  evidence: [
    source("T3 Code product documentation", docs, "official-docs", "Five supported providers, bring-your-own subscriptions, authentication commands, platforms, and remote access."),
    source("T3 Code official repository", repository, "official-repository", "Built-in provider drivers, installation, worktrees, diffs, remote access, and MIT license."),
  ],
  verifiedAt: guiVerifiedAt,
};
