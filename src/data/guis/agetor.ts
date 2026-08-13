import type { GuiProduct } from "@/lib/gui-types";
import { contradicted, documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const latestReleaseVerifiedAt = "2026-08-10";
const currentReleaseVerifiedAt = "2026-08-13";
const repository = "https://github.com/alamops/agetor";
const commit = "03b2328009b66563a4e164d82eaa14621bf3d247";
const repositoryBase = `${repository}/blob/${commit}`;
const readme = `${repositoryBase}/README.md`;
const diffDialog = `${repositoryBase}/src/mainview/components/kanban/DiffDialog.tsx`;
const productSite = "https://www.agetor.dev/";

export const agetor: GuiProduct = {
  id: "agetor",
  name: "Agetor",
  logo: {
    src: "/guis/agetor.svg",
    sourceUrl: `${repositoryBase}/src/assets/agetor.iconset/icon_32x32.png`,
    verifiedAt,
  },
  url: productSite,
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "MIT",
  platforms: ["macOS"],
  supportedHarnesses: ["Claude Code", "Codex", "Cursor Agent", "Gemini CLI"],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "The pinned source implements Claude Code and Codex. Release 0.0.18 adds experimental, disabled-by-default Cursor Agent, while 0.1.0 adds Gemini CLI as a built-in harness; account or binary aliases do not establish additional integrations.",
  summary:
    "A local kanban control plane for parallel Claude Code, Codex, experimental Cursor Agent, and Gemini CLI tasks, isolated worktrees, structured approvals, and review.",
  bestFor:
    "macOS developers coordinating several local tasks or accounts across repositories while keeping each task on its own branch and worktree.",
  limitation:
    "The packaged app is Apple-silicon macOS only, Codex support is newer than the public-site copy, and the product explicitly provides no cloud relay or remote sandbox.",
  capabilities: {
    parallelSessions: documentedAt(
      "Independent harness tasks can run in parallel across repositories, worktrees, and account-specific homes.",
      verifiedAt,
      readme,
    ),
    workspaceIsolation: documentedAt(
      "Git repositories use a pinned base commit and a dedicated branch and worktree per task by default.",
      verifiedAt,
      readme,
    ),
    visualReview: documentedAt(
      "The desktop board exposes task diffs in a dedicated dialog alongside run output and approval cards.",
      verifiedAt,
      diffDialog,
    ),
    remoteExecution: contradicted(
      "The current product record says execution stays on the local machine and provides no cloud relay or remote sandbox.",
      verifiedAt,
      readme,
    ),
    teamCollaboration: unknown(
      "The current first-party record does not establish teammates entering the same live Agetor workspace.",
      verifiedAt,
    ),
  },
  evidence: [
    source(
      "Agetor 0.1.0 Gemini CLI release",
      "https://github.com/alamops/agetor/releases/tag/v0.1.0",
      "official-announcement",
      "harness-integrations",
      "Built-in Gemini CLI harness support alongside saved prompts, message reuse, task-stream tool-call folding, and Cursor plan approval handling.",
      currentReleaseVerifiedAt,
    ),
    source(
      "Agetor 0.0.18 Cursor Agent release",
      "https://github.com/alamops/agetor/releases/tag/v0.0.18",
      "official-announcement",
      "harness-integrations",
      "Experimental Cursor Agent integration through cursor-agent CLI, disabled by default, alongside worktree cleanup, PR workflow, diff-review, and background-agent lifecycle changes.",
      latestReleaseVerifiedAt,
    ),
    source(
      "Agetor pinned product and architecture record",
      readme,
      "official-repository",
      "product-workflow",
      "Current Claude Code and Codex drivers, parallel task model, worktree isolation, local-only boundary, packaging, and license.",
      verifiedAt,
    ),
    source(
      "Agetor task diff dialog",
      diffDialog,
      "official-repository",
      "sessions-isolation-review",
      "Dedicated visual diff loading, file navigation, hunk rendering, and review states in the desktop UI.",
      verifiedAt,
    ),
    source(
      "Agetor product site",
      productSite,
      "official-docs",
      "harness-integrations",
      "Packaged macOS availability and the older public harness copy that still describes Codex as forthcoming.",
      verifiedAt,
    ),
  ],
  verifiedAt: currentReleaseVerifiedAt,
};
