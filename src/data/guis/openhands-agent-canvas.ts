import type { GuiProduct } from "@/lib/gui-types";
import { documentedAt, source } from "./helpers";

const verifiedAt = "2026-08-02";
const repository = "https://github.com/OpenHands/OpenHands";
const commit = "1708efc446082894e244c78af3c67da780d33369";
const repositoryBase = `${repository}/blob/${commit}`;
const readme = `${repositoryBase}/README.md`;
const changesTab = `${repositoryBase}/src/routes/changes-tab.tsx`;
const testingMatrix = `${repositoryBase}/docs/TESTING_MATRIX.md`;
const productPage = "https://www.openhands.dev/product/canvas";
const acpDocs = "https://docs.openhands.dev/openhands/usage/agent-canvas/acp-agents";

export const openHandsAgentCanvas: GuiProduct = {
  id: "openhands-agent-canvas",
  name: "OpenHands Agent Canvas",
  logo: {
    src: "/harnesses/openhands.svg",
    sourceUrl: `${repositoryBase}/src/assets/branding/openhands-logo.svg`,
    verifiedAt,
  },
  url: productPage,
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "MIT",
  platforms: ["macOS", "Windows", "Linux", "Browser"],
  supportedHarnesses: ["Claude Code", "Codex", "Gemini CLI", "OpenHands"],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "Four providers are documented directly, and a custom stdio ACP server can be configured. The external harness keeps its own model, tools, execution, and credentials; ACP compatibility is not arbitrary-CLI support.",
  summary:
    "A visual OpenHands workspace for parallel agents, per-conversation worktrees, diffs, local or remote backends, automations, and ACP harnesses.",
  bestFor:
    "Teams or individuals who want one open interface across OpenHands and three external harnesses, with self-hosted or managed execution backends.",
  limitation:
    "The pinned testing matrix does not yet cover real external-harness credentials, subscription-login paths, macOS, or Windows in CI, so integration presence is not reliability evidence.",
  capabilities: {
    parallelSessions: documentedAt(
      "Agent Canvas runs multiple agents simultaneously and keeps their conversations visible in one interface.",
      verifiedAt,
      productPage,
    ),
    workspaceIsolation: documentedAt(
      "The product page documents a separate Git worktree for each parallel agent.",
      verifiedAt,
      productPage,
    ),
    visualReview: documentedAt(
      "The current client implements a dedicated Changes route that loads and renders repository diffs for the active conversation.",
      verifiedAt,
      changesTab,
    ),
    remoteExecution: documentedAt(
      "The same frontend switches among local agent servers, self-hosted remote VMs, and OpenHands Cloud backends.",
      verifiedAt,
      productPage,
    ),
    teamCollaboration: documentedAt(
      "Official sources describe team-shared Agent Server access and team sharing through the managed cloud backend.",
      verifiedAt,
      productPage,
    ),
  },
  evidence: [
    source(
      "OpenHands Agent Canvas product page",
      productPage,
      "official-docs",
      "product-workflow",
      "Parallel agents, worktree isolation, named harnesses, local and remote backends, cloud team sharing, and platforms.",
      verifiedAt,
    ),
    source(
      "OpenHands ACP-agent guide",
      acpDocs,
      "official-docs",
      "harness-integrations",
      "Named providers, custom stdio ACP servers, process ownership, authentication, and the boundary between Canvas and each external harness.",
      verifiedAt,
    ),
    source(
      "OpenHands Agent Canvas pinned repository overview",
      readme,
      "official-repository",
      "public-code",
      "Current Agent Canvas identity, backend topology, repository location, self-hosting, and open-source distribution.",
      verifiedAt,
    ),
    source(
      "OpenHands Changes route",
      changesTab,
      "official-repository",
      "sessions-isolation-review",
      "Dedicated repository-change and diff surface in the current Agent Canvas client.",
      verifiedAt,
    ),
    source(
      "OpenHands Agent Canvas testing matrix",
      testingMatrix,
      "official-repository",
      "harness-integrations",
      "Current automated and manual coverage gaps for external ACP credentials, subscriptions, and platforms.",
      verifiedAt,
    ),
  ],
  verifiedAt,
};
