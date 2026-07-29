import type { HarnessRecord } from "./types";

const verifiedAt = "2026-07-28";

export const wakil = {
    id: "wakil",
    slug: "wakil",
    name: "Wakil",
    tagline: "Container-first terminal agent with bounded subagents and gated durable memory.",
    summary:
      "An early-stage, model-agnostic terminal coding agent that defaults to a hardened Docker container, supports direct host execution, coordinates bounded subagents, connects MCP and optional browser tools, and separates session state from a provenance-aware durable memory store.",
    logo: {
      src: "/harnesses/wakil.png",
      sourceUrl: "https://github.com/treeol.png",
      verifiedAt: verifiedAt,
    },
    status: "active",
    license: "Apache-2.0",
    classification: {
      role: "coding-agent",
      orchestration: "delegated-subagents",
      runtime: "sandbox-first",
      isolation: ["container"],
      state: "persistent-memory",
    },
    interfaces: ["terminal"],
    providerStyle: "multi-provider",
    supportsSubscription: false,
    capabilities: {
      simplicity: 2,
      flexibility: 5,
      security: 4,
      autonomy: 4,
      automation: 2,
      largeRepo: 4,
      humanControl: 5,
    },
    bestFor: [
      "Developers who want container isolation to be the default rather than an add-on",
      "Local-model and OpenAI-compatible workflows with explicit endpoint control",
      "Research-heavy coding tasks that benefit from bounded parallel subagents and durable memory",
    ],
    tradeoffs: [
      "The project is young and source-oriented; setup requires building its Docker image and managing configuration rather than installing a mature signed desktop product",
      "Direct mode executes tools on the host, while opting into the Docker socket gives the container control of the host Docker daemon and materially weakens isolation",
      "Durable memory is intentionally an injection channel: subagents can propose entries and some TTL-scoped writes become active without main-agent review, so untrusted work still requires the gate and memory auditing",
      "Browser tools are optional and disabled by default; opening a URL in the host browser is explicitly outside the sandbox",
      "Repository tests and evaluation-like assets are project-owned engineering evidence, not independent product-performance measurements",
    ],
    setup: "Build the wakil-dev image, build or install the Go binary, point an endpoint at an OpenAI-compatible service, and keep the default Docker execution mode and confirmation gate enabled for untrusted work.",
    verifiedAt: verifiedAt,
    evidence: [
      {
        title: "Wakil repository overview",
        url: "https://github.com/treeol/wakil/blob/4d2e4f9d38860905fb41593beca87dc40f28fe51/README.md",
        covers: "Agent loop, repository tools, Docker-first execution, approvals, providers, subagents, MCP, optional browser tools, sessions, traces, and setup",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
      {
        title: "Wakil durable memory",
        url: "https://github.com/treeol/wakil/blob/4d2e4f9d38860905fb41593beca87dc40f28fe51/docs/memory.md",
        covers: "SQLite-backed cross-session memory, provenance, subagent proposal gates, retrieval, promotion, expiry, and injection risks",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
      {
        title: "Wakil inspected source tree",
        url: "https://github.com/treeol/wakil/tree/4d2e4f9d38860905fb41593beca87dc40f28fe51",
        covers: "Pinned source, tests, workflows, security policy, contributor documentation, and project-owned evaluation assets",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
      {
        title: "Wakil configuration example",
        url: "https://github.com/treeol/wakil/blob/4d2e4f9d38860905fb41593beca87dc40f28fe51/config.example.json",
        covers: "Endpoint routing, execution mode, resource limits, subagent configuration, browser gate, and MCP servers",
        kind: "official-repository",
        verifiedAt: verifiedAt,
      },
    ],
    discovery: [
      {
        title: "OpenRouter coding CLI agent directory",
        url: "https://openrouter.ai/apps/category/coding/cli-agent",
        note: "Used to discover Wakil; OpenRouter is not evidence for capability claims.",
        observedAt: verifiedAt,
      },
    ],
  } satisfies HarnessRecord;
