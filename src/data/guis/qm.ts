import type { GuiCapabilityClaim, GuiProduct } from "@/lib/gui-types";
import { source, unknown } from "./helpers";

const verifiedAt = "2026-08-02";
const repository = "https://github.com/yc-software/qm";
const commit = "7f2c916360f1797a8ff2a77ce2ce40c5fabab087";
const repositoryBase = `https://github.com/yc-software/qm/blob/${commit}`;
const readme = `${repositoryBase}/README.md`;
const security = `${repositoryBase}/SECURITY.md`;
const deployment = `${repositoryBase}/deployment.md`;

function documented(summary: string, ...sourceUrls: string[]): GuiCapabilityClaim {
  return { state: "documented", summary, sourceUrls, verifiedAt };
}

export const qm: GuiProduct = {
  id: "qm",
  name: "QM",
  logo: {
    src: "/guis/qm.svg",
    sourceUrl: repository,
    verifiedAt,
  },
  url: repository,
  status: "active",
  layer: "multi-harness-workspace",
  sourceAccess: "open-source",
  license: "MIT",
  platforms: ["Browser"],
  supportedHarnesses: ["Claude Code", "Codex", "OpenCode", "Pi"],
  acceptsArbitraryCli: false,
  harnessSupportNote:
    "Four named harness adapters drive the same core. Their own access, model routes, capabilities, and security posture remain independent from QM.",
  summary:
    "A self-hosted web and Slack control plane for scoped, durable agent work across four named harnesses.",
  bestFor:
    "Startups that need personal and shared agent scopes, background work, policy controls, and isolated cloud workspaces in one deployment.",
  limitation:
    "QM is early experimental software, requires an operator-owned cloud deployment, documents material security gaps, and does not currently establish an integrated visual code-review surface or arbitrary-CLI support.",
  capabilities: {
    parallelSessions: documented(
      "The official web-UI example shows concurrent sessions, while the core persists and supervises independent session runs.",
      readme,
    ),
    workspaceIsolation: documented(
      "Each person or room receives a scoped durable sandbox, files, memory, keychain view, permissions, and background jobs.",
      readme,
      security,
    ),
    visualReview: unknown(
      "The current first-party record does not establish an integrated diff, code-review, or merge surface.",
      verifiedAt,
    ),
    remoteExecution: documented(
      "Web and Slack clients steer work in an operator-owned cloud deployment, with durable sandboxes, queues, crons, watches, and background workers.",
      readme,
      deployment,
    ),
    teamCollaboration: documented(
      "Personal scopes coexist with shared Slack channels, group messages, projects, shared skills, and organization policy.",
      readme,
    ),
  },
  evidence: [
    source(
      "QM product and architecture overview",
      readme,
      "official-repository",
      "product-workflow",
      "Web and Slack surfaces, scoped workspaces, durable state, background work, collaboration, deployment model, and security postures.",
      verifiedAt,
    ),
    source(
      "QM harness adapters",
      `${repositoryBase}/src/harness/harness-router.ts`,
      "official-repository",
      "harness-integrations",
      "Runtime selection across the four named Pi, OpenCode, Codex, and Claude Code adapters without an arbitrary-CLI claim.",
      verifiedAt,
    ),
    source(
      "QM security policy",
      security,
      "official-repository",
      "sessions-isolation-review",
      "Scope isolation goals, sandbox and credential boundaries, approvals, screening, auditing, and explicit known limitations.",
      verifiedAt,
    ),
    source(
      "QM deployment guide",
      deployment,
      "official-repository",
      "remote-collaboration",
      "Operator-owned cloud deployment, web and Slack plugins, persistence, sandbox infrastructure, and live verification.",
      verifiedAt,
    ),
  ],
  verifiedAt,
};
