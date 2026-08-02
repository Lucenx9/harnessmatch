import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const repository = "https://github.com/BonJenn/blackcrab";
const commit = "6ab00e0a286ed2fa6e97736bfd5935f0e195c9d2";
const repositoryBase = `${repository}/blob/${commit}`;
const readme = `${repositoryBase}/README.md`;
const mobileRemote = `${repositoryBase}/docs/mobile-remote.md`;
const productSite = "https://www.blackcrab.app/";

export const blackcrab: GuiProduct = {
  id: "blackcrab",
  name: "Blackcrab",
  logo: {
    src: "/guis/blackcrab.svg",
    sourceUrl: `${repositoryBase}/src-tauri/icons/32x32.png`,
    verifiedAt,
  },
  url: productSite,
  status: "active",
  layer: "harness-native",
  sourceAccess: "open-source",
  license: "Apache-2.0",
  platforms: ["macOS", "Windows", "Linux"],
  supportedHarnesses: ["Claude Code"],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "Blackcrab wraps the locally installed Claude Code CLI and indexes its saved sessions. It does not establish support for another harness.",
  summary:
    "A native Claude Code workspace with searchable local history, up to six live panels, worktree-aware grids, diffs, terminal, and preview.",
  bestFor:
    "Claude Code users who want several local sessions visible together with transcript inspection, Git context, usage reporting, and verification tools.",
  limitation:
    "The project calls itself early and macOS-first even though official downloads cover three desktop platforms; mobile remote work is still described as an unfinished companion path.",
  capabilities: {
    parallelSessions: documentedAt(
      "The tileable grid can run and retain up to six live Claude Code panels with separate subprocess and UI state.",
      verifiedAt,
      productSite,
    ),
    workspaceIsolation: documentedAt(
      "New grid panels can use Claude Code worktree mode so parallel work receives a separate checkout.",
      verifiedAt,
      productSite,
    ),
    visualReview: documentedAt(
      "Structured transcripts render diffs and the workspace keeps a terminal and native preview beside the task.",
      verifiedAt,
      productSite,
    ),
    remoteExecution: unknown(
      "The pinned repository contains an experimental mobile-remote path, but its own product record says the companion is not yet connected to a host.",
      verifiedAt,
    ),
    teamCollaboration: unknown(
      "Current first-party sources do not establish teammates sharing one live Blackcrab workspace.",
      verifiedAt,
    ),
  },
  evidence: [
    source(
      "Blackcrab product site",
      productSite,
      "official-docs",
      "product-workflow",
      "Parallel panel grid, worktree-aware sessions, structured transcripts, verification surfaces, and three-platform downloads.",
      verifiedAt,
    ),
    source(
      "Blackcrab pinned repository overview",
      readme,
      "official-repository",
      "public-code",
      "Claude Code process boundary, early and macOS-first status, repository map, privacy model, and license.",
      verifiedAt,
    ),
    source(
      "Blackcrab mobile remote design",
      mobileRemote,
      "official-repository",
      "remote-collaboration",
      "Experimental phone companion architecture, current boundaries, and explicit remote-surface non-goals.",
      verifiedAt,
    ),
  ],
  verifiedAt,
};
