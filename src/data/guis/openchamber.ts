import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const latestReleaseVerifiedAt = "2026-08-20";
const repository = "https://github.com/openchamber/openchamber";
const commit = "4de802a0a1a5c229ec25afb30d449a0b0e97b3e9";
const readme = `${repository}/blob/${commit}/README.md`;
const productSite = "https://openchamber.dev/";
const latestRelease = `${repository}/releases/tag/v1.19.0`;

export const openChamber: GuiProduct = {
  id: "openchamber",
  name: "OpenChamber",
  logo: {
    src: "/guis/openchamber.svg",
    sourceUrl: `${repository}/blob/${commit}/packages/web/public/logo-dark-512x512.svg`,
    verifiedAt,
  },
  url: productSite,
  status: "active",
  layer: "harness-native",
  sourceAccess: "open-source",
  license: "MIT",
  platforms: ["macOS", "Windows", "Linux", "Browser", "iOS"],
  supportedHarnesses: ["OpenCode"],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "OpenChamber uses the OpenCode SDK and bundles the matching OpenCode CLI in its desktop app. The 1.19.0 Integrations page manages Claude Code, Command Code, and Cursor plugins; it does not establish that OpenChamber launches those coding harnesses.",
  summary:
    "An OpenCode-native workspace across desktop, web, editor, and mobile with multi-run worktrees, diff review, previews, GitHub flows, and remote access.",
  bestFor:
    "OpenCode users who want a cross-device workspace for parallel experiments, visual review, Git operations, scheduling, and private remote access.",
  limitation:
    "It remains an OpenCode-only control surface, and current sources describe cross-device access for a user but not multiple teammates sharing one live workspace.",
  capabilities: {
    parallelSessions: documentedAt(
      "Multi-run gives one task to as many as five model sessions and can compare or fuse their results.",
      verifiedAt,
      readme,
    ),
    workspaceIsolation: documentedAt(
      "Multi-run sessions can receive separate Git worktrees, and worktree management is exposed throughout the workspace.",
      verifiedAt,
      readme,
    ),
    visualReview: documentedAt(
      "The product site documents visual diff review, and the workspace adds guided change walkthroughs, Git actions, previews, and pull-request flows.",
      verifiedAt,
      productSite,
    ),
    remoteExecution: documentedAt(
      "Browser, PWA, mobile, private relay, direct, tunnel, LAN or VPN, and SSH paths can revisit and steer work running elsewhere.",
      verifiedAt,
      productSite,
    ),
    teamCollaboration: unknown(
      "Cross-device access does not by itself establish multiple teammates sharing and steering the same live workspace.",
      verifiedAt,
    ),
  },
  evidence: [
    source(
      "OpenChamber product site",
      productSite,
      "official-docs",
      "remote-collaboration",
      "Desktop, browser, mobile, and editor surfaces; diff review; protected remote access; tunnels; and supported platforms.",
      verifiedAt,
    ),
    source(
      "OpenChamber pinned product record",
      readme,
      "official-repository",
      "product-workflow",
      "OpenCode boundary, multi-run sessions, optional per-run worktrees, change walkthroughs, remote mechanisms, distribution, and license.",
      verifiedAt,
    ),
    source(
      "OpenChamber 1.19.0 release",
      latestRelease,
      "official-announcement",
      "product-workflow",
      "Project knowledge, file uploads, OpenCode configuration preservation, worktree and session recovery, and the boundary between plugin management and harness support.",
      latestReleaseVerifiedAt,
    ),
  ],
  verifiedAt: latestReleaseVerifiedAt,
};
