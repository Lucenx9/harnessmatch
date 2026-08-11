import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { featureSupportFor } from "../src/data/feature-claims";
import { harnesses } from "../src/data/harnesses";
import { isValidVerificationDate } from "../src/lib/evidence-freshness";

const firstPartyHosts: Record<string, string[]> = {
  "claude-code": ["code.claude.com", "claude.com", "www.anthropic.com", "github.com"],
  codex: ["learn.chatgpt.com", "github.com"],
  opencode: ["opencode.ai", "github.com"],
  pi: ["github.com", "pi.dev"],
  omp: ["github.com", "omp.sh"],
  "grok-build": ["docs.x.ai", "github.com", "x.ai"],
  "muse-code": ["dev.meta.ai", "developer.meta.com"],
  aider: ["aider.chat", "github.com"],
  openhands: ["docs.openhands.dev", "github.com"],
  goose: ["goose-docs.ai", "github.com"],
  cline: ["docs.cline.bot", "github.com"],
  "gemini-cli": ["developers.googleblog.com", "github.com", "geminicli.com"],
  "antigravity-cli": ["antigravity.google", "developers.googleblog.com", "github.com"],
  "copilot-cli": ["docs.github.com", "github.com"],
  "cursor-cli": ["docs.cursor.com", "cursor.com", "github.com"],
  "junie-cli": ["junie.jetbrains.com", "github.com"],
  "factory-droid": ["docs.factory.ai", "factory.ai", "github.com"],
  forgecode: ["forgecode.dev", "github.com"],
  "qwen-code": ["qwenlm.github.io", "github.com"],
  "continue-cli": ["docs.continue.dev", "github.com"],
  "mistral-vibe": ["docs.mistral.ai", "github.com", "mistral.ai"],
  "kimi-code": ["moonshotai.github.io", "github.com"],
  "mimo-code": ["mimo.xiaomi.com", "github.com"],
  "letta-code": ["docs.letta.com", "github.com", "arxiv.org"],
  "kilo-code": ["github.com", "kilo.ai", "blog.kilo.ai"],
  "command-code": ["commandcode.ai", "github.com"],
  codebuff: ["www.codebuff.com", "github.com"],
  crush: ["github.com", "charm.land", "hyper.charm.land"],
  mux: ["mux.coder.com", "github.com"],
  "coder-agents": ["coder.com", "github.com"],
  "zoo-code": ["github.com", "docs.zoocode.dev", "www.zoocode.dev"],
  zcode: ["zcode.z.ai"],
  stagewise: ["stagewise.io", "docs.stagewise.io", "github.com"],
  "hermes-agent": ["github.com", "hermes-agent.nousresearch.com"],
  openclaw: ["docs.openclaw.ai", "github.com"],
  "mini-swe-agent": ["github.com", "mini-swe-agent.com"],
  amp: ["ampcode.com"],
  "kiro-cli": ["kiro.dev"],
  "poolside-cli": ["docs.poolside.ai", "github.com"],
  plandex: ["github.com"],
  wakil: ["github.com"],
  "deepagents-code": ["github.com"],
  opensquilla: ["github.com"],
  postqode: ["postqode.ai", "www.postqode.ai", "www.npmjs.com"],
  kern: ["github.com"],
  ggcode: ["github.com"],
  ante: ["docs.antigma.ai", "github.com"],
  reasonix: ["reasonix.io", "github.com"],
  codewhale: ["github.com"],
  openharness: ["github.com"],
  slate: ["docs.randomlabs.ai", "randomlabs.ai", "registry.npmjs.org"],
  "spectral-agent": ["aexol.ai", "registry.npmjs.org"],
};

const firstPartyLogoHosts: Record<string, string> = {
  "claude-code": "code.claude.com",
  codex: "developers.openai.com",
  opencode: "github.com",
  pi: "pi.dev",
  omp: "omp.sh",
  "grok-build": "media.x.ai",
  "muse-code": "static.xx.fbcdn.net",
  aider: "aider.chat",
  openhands: "github.com",
  goose: "github.com",
  cline: "github.com",
  "gemini-cli": "github.com",
  "antigravity-cli": "github.com",
  "copilot-cli": "github.com",
  "cursor-cli": "cursor.com",
  "junie-cli": "junie.jetbrains.com",
  "factory-droid": "factory.ai",
  forgecode: "forgecode.dev",
  "qwen-code": "qwenlm.github.io",
  "continue-cli": "github.com",
  "mistral-vibe": "github.com",
  "kimi-code": "github.com",
  "mimo-code": "github.com",
  "letta-code": "github.com",
  "kilo-code": "github.com",
  "command-code": "commandcode.ai",
  codebuff: "www.codebuff.com",
  crush: "github.com",
  mux: "mux.coder.com",
  "coder-agents": "coder.com",
  "zoo-code": "github.com",
  zcode: "zcode.z.ai",
  stagewise: "stagewise.io",
  "hermes-agent": "github.com",
  openclaw: "github.com",
  "mini-swe-agent": "github.com",
  amp: "ampcode.com",
  "kiro-cli": "kiro.dev",
  "poolside-cli": "github.com",
  plandex: "github.com",
  wakil: "github.com",
  "deepagents-code": "github.com",
  opensquilla: "github.com",
  postqode: "postqode.ai",
  kern: "github.com",
  ggcode: "github.com",
  ante: "github.com",
  reasonix: "github.com",
  codewhale: "github.com",
  openharness: "github.com",
  slate: "randomlabs.ai",
  "spectral-agent": "aexol.ai",
};

describe("harness evidence ledger", () => {
  it("keeps CodeWhale's TUI-only hook limitation tied to its pinned source", () => {
    const codeWhale = harnesses.find((harness) => harness.id === "codewhale");
    expect(codeWhale).toBeDefined();
    if (!codeWhale) return;

    const hooks = codeWhale.evidence.find((source) => source.title === "TUI lifecycle hooks");
    expect(hooks).toMatchObject({
      url: "https://github.com/Hmbown/CodeWhale/blob/4f2c97b0d75c039a9b6069ebcf210cc499583376/docs/HOOKS.md",
      verifiedAt: "2026-08-05",
    });
    expect(hooks?.covers).toContain("codewhale exec");
    expect(codeWhale.tradeoffs.join(" ")).toContain("TUI hooks do not fire for codewhale exec");
    expect(codeWhale.verifiedAt).toBe("2026-08-10");
    expect(codeWhale.evidence.find((source) => source.url.endsWith("/v0.9.5"))?.verifiedAt).toBe("2026-08-10");
    expect(codeWhale.tradeoffs.join(" ")).toContain("removes the default 100-step ceiling");
  });

  it("keeps every capability profile backed by multiple current sources", () => {
    for (const harness of harnesses) {
      expect(harness.evidence.length).toBeGreaterThanOrEqual(2);
      expect(harness.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      for (const source of harness.evidence) {
        expect(isValidVerificationDate(source.verifiedAt)).toBe(true);
        expect(source.verifiedAt <= harness.verifiedAt).toBe(true);
        expect(source.covers.length).toBeGreaterThan(12);
        expect(firstPartyHosts[harness.id]).toContain(new URL(source.url).hostname);
      }
    }
  });

  it("records the source-audited capability corrections", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));

    expect(featureSupportFor(byId.get("claude-code")).sandbox).toBe(true);
    expect(byId.get("claude-code")?.classification.isolation).toEqual(expect.arrayContaining(["os-sandbox", "worktree", "managed-sandbox"]));
    expect(byId.get("claude-code")?.classification.state).toBe("persistent-memory");
    expect(byId.get("claude-code")?.capabilities.security).toBe(4);
    expect(featureSupportFor(byId.get("codex")).localModels).toBe(true);
    expect(byId.get("codex")?.providerStyle).toBe("multi-provider");
    expect(byId.get("codex")?.classification).toMatchObject({
      runtime: "sandbox-first",
      isolation: expect.arrayContaining(["os-sandbox", "worktree", "managed-sandbox"]),
      state: "persistent-memory",
    });
    expect(featureSupportFor(byId.get("opencode")).checkpoints).toBe(true);
    expect(featureSupportFor(byId.get("opencode")).sandbox).toBe(false);
    expect(byId.get("opencode")?.capabilities.security).toBe(3);
    expect(featureSupportFor(byId.get("pi")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("pi")).subagents).toBe(false);
    expect(byId.get("pi")?.classification).toMatchObject({ runtime: "host-first", isolation: [], state: "session-based" });
    expect(featureSupportFor(byId.get("omp")).browser).toBe(true);
    expect(featureSupportFor(byId.get("omp")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("omp")).checkpoints).toBe(false);
    expect(byId.get("omp")?.classification).toMatchObject({ isolation: ["worktree"], state: "persistent-memory" });
    expect(byId.get("omp")?.capabilities.humanControl).toBe(3);
    expect(featureSupportFor(byId.get("grok-build")).sandbox).toBe(true);
    expect(featureSupportFor(byId.get("grok-build")).checkpoints).toBe(true);
    expect(byId.get("grok-build")?.classification).toMatchObject({
      isolation: expect.arrayContaining(["os-sandbox", "worktree"]),
      state: "persistent-memory",
    });
    expect(featureSupportFor(byId.get("muse-code"))).toMatchObject({
      mcp: true,
      skills: true,
      localModels: false,
      subagents: true,
      headless: true,
      browser: false,
      sandbox: true,
      checkpoints: false,
    });
    expect(byId.get("muse-code")?.classification).toEqual({
      role: "coding-agent",
      orchestration: "multi-agent-runtime",
      runtime: "sandbox-first",
      isolation: ["os-sandbox", "worktree"],
      state: "persistent-memory",
    });
    expect(byId.get("aider")?.supportsSubscription).toBe(true);
    expect(byId.get("aider")?.interfaces).toEqual(expect.arrayContaining(["web", "automation"]));
    expect(byId.get("openhands")?.supportsSubscription).toBe(true);
    expect(byId.get("openhands")?.classification.state).toBe("persistent-memory");
    expect(byId.get("cline")?.classification.isolation).toEqual(["worktree"]);
    expect(featureSupportFor(byId.get("cline")).sandbox).toBe(false);
    expect(byId.get("cline")?.capabilities).toMatchObject({ security: 3, autonomy: 5 });
    expect(featureSupportFor(byId.get("gemini-cli")).sandbox).toBe(true);
    expect(featureSupportFor(byId.get("gemini-cli")).checkpoints).toBe(true);
    expect(featureSupportFor(byId.get("gemini-cli")).browser).toBe(true);
    expect(byId.get("gemini-cli")?.classification.state).toBe("persistent-memory");
    expect(byId.get("gemini-cli")?.capabilities.security).toBe(4);
    expect(byId.get("gemini-cli")?.supportsSubscription).toBe(false);
    expect(byId.get("gemini-cli")?.supportsEnterpriseAccess).toBe(true);
    expect(byId.get("antigravity-cli")?.providerStyle).toBe("multi-provider");
    expect(byId.get("antigravity-cli")?.supportsSubscription).toBe(true);
    expect(byId.get("antigravity-cli")?.supportsEnterpriseAccess).toBe(true);
    expect(featureSupportFor(byId.get("antigravity-cli"))).toMatchObject({
      mcp: true,
      subagents: true,
      headless: true,
      browser: true,
      sandbox: true,
      checkpoints: false,
    });
    expect(featureSupportFor(byId.get("copilot-cli")).subagents).toBe(true);
    expect(featureSupportFor(byId.get("copilot-cli")).localModels).toBe(true);
    expect(byId.get("copilot-cli")?.classification.state).toBe("persistent-memory");
    expect(featureSupportFor(byId.get("cursor-cli")).subagents).toBe(true);
    expect(featureSupportFor(byId.get("cursor-cli")).sandbox).toBe(true);
    expect(featureSupportFor(byId.get("cursor-cli")).checkpoints).toBe(true);
    expect(byId.get("cursor-cli")?.classification.isolation).toEqual(expect.arrayContaining(["os-sandbox", "worktree"]));
    expect(featureSupportFor(byId.get("junie-cli")).localModels).toBe(true);
    expect(featureSupportFor(byId.get("junie-cli")).sandbox).toBe(false);
    expect(byId.get("junie-cli")?.interfaces).toContain("web");
    expect(featureSupportFor(byId.get("factory-droid")).browser).toBe(true);
    expect(featureSupportFor(byId.get("factory-droid")).sandbox).toBe(true);
    expect(featureSupportFor(byId.get("factory-droid")).checkpoints).toBe(true);
    expect(byId.get("factory-droid")?.classification.isolation).toEqual(expect.arrayContaining(["os-sandbox", "worktree"]));
    expect(featureSupportFor(byId.get("forgecode")).localModels).toBe(true);
    expect(featureSupportFor(byId.get("forgecode")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("forgecode")).checkpoints).toBe(false);
    expect(byId.get("forgecode")?.capabilities.security).toBe(2);
    expect(featureSupportFor(byId.get("qwen-code")).sandbox).toBe(true);
    expect(featureSupportFor(byId.get("qwen-code")).subagents).toBe(true);
    expect(featureSupportFor(byId.get("qwen-code")).browser).toBe(true);
    expect(featureSupportFor(byId.get("qwen-code")).checkpoints).toBe(true);
    expect(byId.get("qwen-code")?.classification.state).toBe("persistent-memory");
    expect(byId.get("qwen-code")?.capabilities.security).toBe(4);
    expect(featureSupportFor(byId.get("continue-cli")).subagents).toBe(false);
    expect(featureSupportFor(byId.get("continue-cli")).sandbox).toBe(false);
    expect(byId.get("continue-cli")?.status).toBe("archived");
    expect(byId.get("mistral-vibe")?.providerStyle).toBe("multi-provider");
    expect(byId.get("mistral-vibe")?.supportsSubscription).toBe(true);
    expect(featureSupportFor(byId.get("mistral-vibe")).localModels).toBe(true);
    expect(featureSupportFor(byId.get("mistral-vibe")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("mistral-vibe")).checkpoints).toBe(true);
    expect(featureSupportFor(byId.get("kimi-code")).subagents).toBe(true);
    expect(featureSupportFor(byId.get("kimi-code")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("mimo-code"))).toMatchObject({
      mcp: true,
      skills: true,
      localModels: true,
      subagents: true,
      headless: true,
      browser: false,
      sandbox: false,
      checkpoints: true,
    });
    expect(byId.get("mimo-code")?.classification).toEqual({
      role: "coding-agent",
      orchestration: "multi-agent-runtime",
      runtime: "host-first",
      isolation: ["worktree"],
      state: "persistent-memory",
    });
    expect(featureSupportFor(byId.get("letta-code")).sandbox).toBe(true);
    expect(byId.get("letta-code")?.classification.runtime).toBe("host-first");
    expect(byId.get("letta-code")?.classification.isolation).toContain("managed-sandbox");
    expect(byId.get("letta-code")?.classification.state).toBe("persistent-memory");
    expect(featureSupportFor(byId.get("command-code")).subagents).toBe(true);
    expect(featureSupportFor(byId.get("command-code")).sandbox).toBe(false);
    expect(byId.get("command-code")?.classification.state).toBe("persistent-memory");
    expect(byId.get("codebuff")?.license).toContain("Apache-2.0");
    expect(byId.get("codebuff")?.providerStyle).toBe("multi-provider");
    expect(featureSupportFor(byId.get("codebuff")).browser).toBe(true);
    expect(featureSupportFor(byId.get("codebuff")).sandbox).toBe(false);
    expect(byId.get("crush")?.license).toBe("FSL-1.1-MIT");
    expect(byId.get("crush")?.supportsSubscription).toBe(true);
    expect(featureSupportFor(byId.get("crush")).subagents).toBe(true);
    expect(featureSupportFor(byId.get("crush")).headless).toBe(true);
    expect(byId.get("crush")?.interfaces).toContain("automation");
    expect(byId.get("mux")?.supportsSubscription).toBe(true);
    expect(featureSupportFor(byId.get("mux")).localModels).toBe(true);
    expect(featureSupportFor(byId.get("mux")).localModels).toBe(true);
    expect(featureSupportFor(byId.get("mux")).browser).toBe(false);
    expect(byId.get("mux")?.classification.state).toBe("persistent-memory");
    expect(featureSupportFor(byId.get("coder-agents")).mcp).toBe(true);
    expect(featureSupportFor(byId.get("coder-agents")).browser).toBe(true);
    expect(featureSupportFor(byId.get("coder-agents")).sandbox).toBe(true);
    expect(featureSupportFor(byId.get("zoo-code")).checkpoints).toBe(true);
    expect(byId.get("zcode")?.interfaces).toContain("automation");
    expect(featureSupportFor(byId.get("zcode"))).toMatchObject({
      subagents: true,
      headless: false,
      browser: true,
      sandbox: true,
      checkpoints: true,
    });
    expect(featureSupportFor(byId.get("stagewise")).localModels).toBe(true);
    expect(byId.get("hermes-agent")?.classification.state).toBe("persistent-memory");
    expect(byId.get("hermes-agent")?.interfaces).toEqual(expect.arrayContaining(["terminal", "ide", "web", "automation"]));
    expect(featureSupportFor(byId.get("hermes-agent")).checkpoints).toBe(true);
    expect(byId.get("openclaw")?.classification).toMatchObject({
      role: "general-agent",
      orchestration: "multi-agent-runtime",
      runtime: "host-first",
      isolation: ["container"],
      state: "persistent-memory",
    });
    expect(featureSupportFor(byId.get("openclaw"))).toMatchObject({
      mcp: true,
      localModels: true,
      subagents: true,
      headless: true,
      browser: true,
      sandbox: true,
      checkpoints: false,
    });
    expect(byId.get("ggcode")?.classification).toEqual({
      role: "coding-agent",
      orchestration: "multi-agent-runtime",
      runtime: "host-first",
      isolation: ["worktree"],
      state: "persistent-memory",
    });
    expect(featureSupportFor(byId.get("ggcode"))).toEqual({
      mcp: true,
      skills: false,
      localModels: true,
      subagents: true,
      headless: true,
      browser: true,
      sandbox: false,
      checkpoints: true,
    });
    expect(featureSupportFor(byId.get("ante"))).toEqual({
      mcp: true,
      skills: true,
      localModels: true,
      subagents: true,
      headless: true,
      browser: true,
      sandbox: false,
      checkpoints: false,
    });
    expect(byId.get("ante")?.classification).toEqual({
      role: "coding-agent",
      orchestration: "delegated-subagents",
      runtime: "host-first",
      isolation: [],
      state: "persistent-memory",
    });
    expect(featureSupportFor(byId.get("reasonix"))).toEqual({
      mcp: true,
      skills: true,
      localModels: true,
      subagents: true,
      headless: true,
      browser: false,
      sandbox: true,
      checkpoints: true,
    });
    expect(byId.get("reasonix")?.classification).toEqual({
      role: "coding-agent",
      orchestration: "delegated-subagents",
      runtime: "sandbox-first",
      isolation: ["os-sandbox"],
      state: "persistent-memory",
    });
  });

  it("admits the OpenRouter-discovered wave only through first-party membership evidence", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));
    for (const id of ["wakil", "deepagents-code", "opensquilla", "postqode", "kern", "ggcode", "mimo-code", "ante", "slate", "spectral-agent"]) {
      const harness = byId.get(id);
      expect(harness, id).toBeDefined();
      expect(harness?.status).toBe("active");
      expect(harness?.discovery?.some((source) => source.url.startsWith("https://openrouter.ai/apps"))).toBe(true);
      expect(harness?.evidence.every((source) => !source.url.includes("openrouter.ai/apps"))).toBe(true);
    }

    expect(featureSupportFor(byId.get("wakil")).sandbox).toBe(true);
    expect(featureSupportFor(byId.get("deepagents-code")).headless).toBe(true);
    expect(featureSupportFor(byId.get("opensquilla")).subagents).toBe(true);
    expect(featureSupportFor(byId.get("postqode")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("postqode")).subagents).toBe(false);
    expect(featureSupportFor(byId.get("kern")).localModels).toBe(true);
    expect(featureSupportFor(byId.get("ggcode")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("mimo-code")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("ante")).sandbox).toBe(false);
    expect(featureSupportFor(byId.get("slate"))).toMatchObject({
      mcp: true,
      skills: true,
      subagents: true,
      headless: true,
      sandbox: false,
      checkpoints: false,
    });
    expect(featureSupportFor(byId.get("spectral-agent"))).toMatchObject({
      mcp: true,
      skills: false,
      subagents: true,
      headless: false,
      sandbox: false,
      checkpoints: false,
    });

    const wakil = byId.get("wakil")!;
    expect(wakil.verifiedAt).toBe("2026-08-02");
    expect(wakil.evidence.map((source) => source.url)).toEqual(expect.arrayContaining([
      "https://github.com/treeol/wakil/blob/25ff56085007d8e8bdbc4d2f8c74ee4f994a0ed9/internal/agent/mashura_command.go",
      "https://github.com/treeol/wakil/blob/25ff56085007d8e8bdbc4d2f8c74ee4f994a0ed9/internal/counsel/oracle.go",
    ]));
    expect(wakil.tradeoffs.join(" ")).toContain("shares successful first-round responses across providers");

    const ggcode = byId.get("ggcode")!;
    expect(ggcode.verifiedAt).toBe("2026-08-04");
    expect(ggcode.evidence.map((source) => source.url)).toEqual(expect.arrayContaining([
      "https://github.com/topcheer/ggcode/releases/tag/v1.3.189",
      "https://github.com/topcheer/ggcode/releases/tag/v1.3.190",
      "https://github.com/topcheer/ggcode/tree/b878385bfd4d0edab137e8d48c18fad512d49f21",
    ]));
    expect(ggcode.evidence.find((source) => source.title === "GGCode v1.3.189 release")?.covers)
      .toContain("agent verification gates");
    expect(ggcode.tradeoffs.join(" ")).toContain("three consecutive approvals");
  });

  it("adds Slate and Spectral only from reviewed first-party runtime evidence", () => {
    const slate = harnesses.find((harness) => harness.id === "slate")!;
    const spectral = harnesses.find((harness) => harness.id === "spectral-agent")!;

    expect(slate).toMatchObject({
      status: "active",
      license: "Proprietary",
      supportsSubscription: true,
      classification: { runtime: "host-first", isolation: [], state: "session-based" },
    });
    expect(slate.evidence).toHaveLength(8);
    expect(slate.evidence.map((source) => source.url)).toEqual(expect.arrayContaining([
      "https://registry.npmjs.org/@randomlabs%2fslate/1.0.44",
      "https://docs.randomlabs.ai/en/using-slate/configuration",
      "https://docs.randomlabs.ai/en/using-slate/orchestration",
    ]));
    expect(slate.tradeoffs.join(" ")).toContain("no operating-system sandbox");
    expect(slate.tradeoffs.join(" ")).toContain("0.0.0.0");

    expect(spectral).toMatchObject({
      status: "active",
      license: "MIT (published npm package)",
      supportsSubscription: false,
      classification: { runtime: "host-first", isolation: [], state: "session-based" },
    });
    expect(spectral.evidence).toHaveLength(7);
    expect(spectral.evidence.map((source) => source.url)).toEqual(expect.arrayContaining([
      "https://registry.npmjs.org/@aexol%2fspectral/0.9.152",
      "https://aexol.ai/docs/agent/loop-and-goal/",
      "https://aexol.ai/docs/agent/memory/",
      "https://aexol.ai/docs/agent/subagents/",
    ]));
    expect(spectral.tradeoffs.join(" ")).toContain("requires sign-in");
    expect(spectral.tradeoffs.join(" ")).toContain("no operating-system sandbox");
  });

  it("adds MiMo Code from first-party evidence while keeping discovery and capability evidence separate", () => {
    const mimo = harnesses.find((harness) => harness.id === "mimo-code")!;
    const urls = mimo.evidence.map((source) => source.url);
    const caveats = mimo.tradeoffs.join(" ");

    expect(mimo.status).toBe("active");
    expect(mimo.verifiedAt).toBe("2026-08-02");
    expect(mimo.license).toBe("MIT with use restrictions");
    expect(mimo.evidence).toHaveLength(14);
    expect(mimo.evidence.every((source) => source.verifiedAt === mimo.verifiedAt)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://github.com/XiaomiMiMo/MiMo-Code/tree/c045a9891069000b112079bb10bdc8828d75eb6e",
      "https://mimo.xiaomi.com/mimocode/tools",
      "https://mimo.xiaomi.com/mimocode/permissions",
      "https://mimo.xiaomi.com/mimocode/sessions",
      "https://mimo.xiaomi.com/mimocode/agents",
      "https://github.com/XiaomiMiMo/MiMo-Code/blob/c045a9891069000b112079bb10bdc8828d75eb6e/SECURITY.md",
    ]));
    expect(mimo.discovery).toEqual([
      expect.objectContaining({
        url: "https://openrouter.ai/apps/url/https%3A%2F%2Fmimo.xiaomi.com%2Fcoder",
      }),
    ]);
    expect(urls.some((url) => url.includes("openrouter.ai"))).toBe(false);
    expect(caveats).toContain("no built-in process sandbox");
    expect(caveats).toContain("untracked files larger than 2 MiB");
  });

  it("adds Muse Code from first-party Meta evidence without transferring Muse Spark model claims", () => {
    const muse = harnesses.find((harness) => harness.id === "muse-code")!;
    const urls = muse.evidence.map((source) => source.url);
    const caveats = muse.tradeoffs.join(" ");

    expect(muse.status).toBe("active");
    expect(muse.verifiedAt).toBe("2026-08-05");
    expect(muse.license).toBe("Proprietary native binary");
    expect(muse.evidence).toHaveLength(17);
    expect(muse.evidence.every((source) => source.verifiedAt === muse.verifiedAt)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://developer.meta.com/ai/products/muse-code/",
      "https://dev.meta.ai/docs/muse-code",
      "https://dev.meta.ai/docs/muse-code/permissions",
      "https://dev.meta.ai/docs/muse-code/interactive",
      "https://dev.meta.ai/docs/muse-code/configuration",
      "https://dev.meta.ai/docs/muse-code/extending",
      "https://dev.meta.ai/docs/cookbook/audit-agent-sessions",
      "https://dev.meta.ai/docs/cookbook/deterministic-replay",
      "https://dev.meta.ai/docs/cookbook/staged-approvals",
      "https://dev.meta.ai/docs/cookbook/contained-execution",
      "https://dev.meta.ai/docs/cookbook/immutable-guardrails",
      "https://dev.meta.ai/docs/cookbook/subagent-fanout",
      "https://dev.meta.ai/docs/cookbook/goal-tracking",
      "https://dev.meta.ai/docs/cookbook/bundled-skills",
      "https://dev.meta.ai/docs/cookbook/loop-and-cron",
      "https://dev.meta.ai/docs/cookbook/side-chats",
    ]));
    expect(muse.providerStyle).toBe("single-vendor");
    expect(muse.supportsSubscription).toBe(false);
    expect(muse.supportsEnterpriseAccess).toBe(true);
    expect(caveats).toContain("model performance and benchmark results do not establish harness quality");
    expect(caveats).toContain("MCP tools run outside the filesystem and network sandbox");
    expect(caveats).toContain("no file checkpoint or rollback mechanism is documented");
    expect(muse.capabilities).toEqual({
      simplicity: 5,
      flexibility: 3,
      security: 5,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 4,
    });
  });

  it("adds Ante from first-party evidence while preserving its alpha and private-core limits", () => {
    const ante = harnesses.find((harness) => harness.id === "ante")!;
    const urls = ante.evidence.map((source) => source.url);
    const caveats = ante.tradeoffs.join(" ");

    expect(ante.status).toBe("active");
    expect(ante.verifiedAt).toBe("2026-08-02");
    expect(ante.license).toBe("Apache-2.0 components; preview binary terms");
    expect(ante.evidence).toHaveLength(17);
    expect(ante.evidence.every((source) => source.verifiedAt === ante.verifiedAt)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://github.com/AntigmaLabs/ante/tree/8ce59518ed8a2ddda46c07cbb0b6fb1f528438a3",
      "https://docs.antigma.ai/reference/tools-reference",
      "https://docs.antigma.ai/reference/core-concepts",
      "https://docs.antigma.ai/configuration/permission",
      "https://docs.antigma.ai/usage/goal-sessions",
      "https://docs.antigma.ai/extend/memory",
    ]));
    expect(ante.discovery).toEqual([
      expect.objectContaining({
        url: "https://openrouter.ai/apps/url/https%3A%2F%2Fdocs.antigma.ai%2F",
      }),
    ]);
    expect(urls.some((url) => url.includes("openrouter.ai"))).toBe(false);
    expect(caveats).toContain("core harness remains private");
    expect(caveats).toContain("Headless runs always imply yolo");
  });

  it("adds Reasonix from a pinned stable source audit without importing marketing performance claims", () => {
    const reasonix = harnesses.find((harness) => harness.id === "reasonix")!;
    const urls = reasonix.evidence.map((source) => source.url);
    const caveats = reasonix.tradeoffs.join(" ");

    expect(reasonix.status).toBe("active");
    expect(reasonix.verifiedAt).toBe("2026-08-10");
    expect(reasonix.license).toBe("MIT");
    expect(reasonix.supportsSubscription).toBe(true);
    expect(reasonix.evidence).toHaveLength(22);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.19.2",
      "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.19.3",
      "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.19.5",
      "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.21.0",
      "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.21.3",
      "https://github.com/esengine/DeepSeek-Reasonix/releases/tag/v1.22.0",
      "https://github.com/esengine/DeepSeek-Reasonix/tree/c46e3af1c2732fe2b3dedb0bd47eb39a629357d2",
      "https://github.com/esengine/DeepSeek-Reasonix/blob/c46e3af1c2732fe2b3dedb0bd47eb39a629357d2/docs/SPEC.md",
      "https://github.com/esengine/DeepSeek-Reasonix/blob/c46e3af1c2732fe2b3dedb0bd47eb39a629357d2/docs/TOOL_CONTRACT.md",
      "https://github.com/esengine/DeepSeek-Reasonix/blob/c46e3af1c2732fe2b3dedb0bd47eb39a629357d2/docs/CHECKPOINTS.md",
      "https://github.com/esengine/DeepSeek-Reasonix/blob/c46e3af1c2732fe2b3dedb0bd47eb39a629357d2/SECURITY.md",
    ]));
    expect(reasonix.discovery).toBeUndefined();
    expect(caveats).toContain("Windows shell commands run without that isolation");
    expect(caveats).toContain("marketing figures are not admitted");
    expect(caveats).toContain("retrieves page content rather than controlling an interactive browser");
    expect(caveats).toContain("removed the desktop Guard and Safe Mode");
  });

  it("separates Gemini CLI enterprise continuity from the Antigravity consumer successor", () => {
    const gemini = harnesses.find((harness) => harness.id === "gemini-cli")!;
    const antigravity = harnesses.find((harness) => harness.id === "antigravity-cli")!;
    const geminiUrls = gemini.evidence.map((source) => source.url);
    const antigravityUrls = antigravity.evidence.map((source) => source.url);
    const caveats = antigravity.tradeoffs.join(" ");

    expect(gemini.status).toBe("active");
    expect(gemini.tradeoffs.join(" ")).toContain("June 18, 2026");
    expect(geminiUrls).toContain(
      "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/",
    );
    expect(geminiUrls).toEqual(expect.arrayContaining([
      "https://geminicli.com/docs/cli/skills/",
      "https://geminicli.com/docs/reference/policy-engine/",
      "https://geminicli.com/docs/hooks/",
      "https://geminicli.com/docs/cli/git-worktrees/",
      "https://geminicli.com/docs/admin/enterprise-controls/",
    ]));
    expect(gemini.tradeoffs.join(" ")).toContain("Workspace tier is currently non-functional");
    expect(antigravity.verifiedAt).toBe("2026-08-10");
    expect(antigravity.evidence.length).toBeGreaterThanOrEqual(12);
    expect(antigravity.classification).toMatchObject({
      orchestration: "multi-agent-runtime",
      runtime: "host-first",
      isolation: ["os-sandbox"],
      state: "session-based",
    });
    expect(antigravityUrls).toEqual(expect.arrayContaining([
      "https://antigravity.google/docs/models?app=cli",
      "https://antigravity.google/docs/cli/permissions",
      "https://antigravity.google/docs/cli/sandbox",
      "https://antigravity.google/docs/cli/subagents",
      "https://antigravity.google/docs/cli/conversations",
      "https://antigravity.google/docs/cli/artifacts",
      "https://antigravity.google/docs/cli/projects",
      "https://github.com/google-antigravity/antigravity-cli/releases/tag/1.1.8",
      "https://github.com/google-antigravity/antigravity-cli/releases/tag/1.1.9",
      "https://github.com/google-antigravity/antigravity-cli/releases/tag/1.1.11",
    ]));
    expect(caveats).toContain("sandboxing is available but off by default");
    expect(caveats).toContain("persists for the rest of the conversation");
    expect(caveats).toContain("not the local Git checkout");
    expect(caveats).toContain("Telemetry is enabled by default");
    expect(caveats).toContain("does not expose the core harness source");
    expect(caveats).toContain("zero-word command allowlists");
  });

  it("qualifies Claude Code's broad automation surface against its local defaults", () => {
    const claude = harnesses.find((harness) => harness.id === "claude-code")!;
    const urls = claude.evidence.map((source) => source.url);
    const caveats = claude.tradeoffs.join(" ");

    expect(claude.verifiedAt).toBe("2026-08-10");
    expect(claude.evidence).toHaveLength(59);
    expect(claude.evidence.find((source) => source.title === "Agent Skills")?.verifiedAt).toBe("2026-08-01");
    expect(claude.evidence.find((source) => source.url.endsWith("/v2.1.224"))?.verifiedAt).toBe(claude.verifiedAt);
    expect(claude.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://code.claude.com/docs/en/overview",
      "https://code.claude.com/docs/en/how-claude-code-works",
      "https://code.claude.com/docs/en/platforms",
      "https://claude.com/product/claude-code",
      "https://code.claude.com/docs/en/cli-reference",
      "https://code.claude.com/docs/en/headless",
      "https://code.claude.com/docs/en/tools-reference",
      "https://code.claude.com/docs/en/skills",
      "https://code.claude.com/docs/en/security",
      "https://code.claude.com/docs/en/sandboxing",
      "https://code.claude.com/docs/en/sandbox-environments",
      "https://code.claude.com/docs/en/devcontainer",
      "https://code.claude.com/docs/en/permissions",
      "https://code.claude.com/docs/en/permission-modes",
      "https://code.claude.com/docs/en/auto-mode-config",
      "https://claude.com/blog/auto-mode",
      "https://www.anthropic.com/engineering/claude-code-auto-mode",
      "https://code.claude.com/docs/en/agents",
      "https://code.claude.com/docs/en/agent-view",
      "https://code.claude.com/docs/en/sub-agents",
      "https://code.claude.com/docs/en/agent-teams",
      "https://code.claude.com/docs/en/workflows",
      "https://code.claude.com/docs/en/worktrees",
      "https://github.com/anthropics/claude-code/releases/tag/v2.1.223",
      "https://github.com/anthropics/claude-code/releases/tag/v2.1.224",
      "https://code.claude.com/docs/en/checkpointing",
      "https://code.claude.com/docs/en/sessions",
      "https://code.claude.com/docs/en/memory",
      "https://code.claude.com/docs/en/hooks",
      "https://code.claude.com/docs/en/mcp",
      "https://code.claude.com/docs/en/managed-mcp",
      "https://code.claude.com/docs/en/plugin-marketplaces",
      "https://code.claude.com/docs/en/chrome",
      "https://code.claude.com/docs/en/computer-use",
      "https://code.claude.com/docs/en/claude-code-on-the-web",
      "https://code.claude.com/docs/en/desktop",
      "https://code.claude.com/docs/en/vs-code",
      "https://code.claude.com/docs/en/jetbrains",
      "https://code.claude.com/docs/en/routines",
      "https://code.claude.com/docs/en/github-actions",
      "https://code.claude.com/docs/en/code-review",
      "https://code.claude.com/docs/en/gitlab-ci-cd",
      "https://code.claude.com/docs/en/settings",
      "https://code.claude.com/docs/en/server-managed-settings",
      "https://code.claude.com/docs/en/admin-setup",
      "https://code.claude.com/docs/en/authentication",
      "https://code.claude.com/docs/en/feature-availability",
      "https://code.claude.com/docs/en/network-config",
      "https://code.claude.com/docs/en/large-codebases",
      "https://code.claude.com/docs/en/monitoring-usage",
      "https://code.claude.com/docs/en/data-usage",
      "https://code.claude.com/docs/en/zero-data-retention",
      "https://code.claude.com/docs/en/agent-sdk/overview",
      "https://code.claude.com/docs/en/agent-sdk/secure-deployment",
      "https://code.claude.com/docs/en/errors",
      "https://code.claude.com/docs/en/changelog",
      "https://github.com/anthropics/claude-code/releases/tag/v2.1.220",
      "https://github.com/anthropics/claude-code/tree/7ef6eec9d9ba84ea6f233f26c45f1df5c5991843",
      "https://github.com/anthropic-experimental/sandbox-runtime",
    ]));
    expect(caveats).toContain("OS sandboxing is disabled by default");
    expect(caveats).toContain("Worktrees isolate file edits rather than processes");
    expect(caveats).toContain("forceRemoteSettingsRefresh");
    expect(caveats).toContain("research previews");
    expect(caveats).toContain("neutral check");
    expect(caveats).toContain("marketplace allowlists");
    expect(caveats).toContain("roughly three hours");
    expect(caveats).toContain("17% false-negative rate on 52 real overeager actions");
    expect(caveats).toContain("Zero Data Retention is a separately enabled option");
    expect(caveats).toContain("excludes web and Cloud sessions");
    expect(caveats).toContain("proprietary core implementation");
    expect(claude.capabilities).toEqual({
      simplicity: 5,
      flexibility: 4,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 5,
      humanControl: 5,
    });
  });

  it("pins Codex's multi-surface controls without inventing checkpoint recovery", () => {
    const codex = harnesses.find((harness) => harness.id === "codex")!;
    const urls = codex.evidence.map((source) => source.url);
    const caveats = codex.tradeoffs.join(" ");

    expect(codex.verifiedAt).toBe("2026-08-10");
    expect(codex.evidence).toHaveLength(47);
    expect(codex.evidence.find((source) => source.url.endsWith("/rust-v0.147.0"))?.verifiedAt).toBe(codex.verifiedAt);
    expect(codex.evidence.find((source) => source.url.includes("/tree/25af12f"))?.verifiedAt).toBe("2026-07-30");
    expect(codex.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(featureSupportFor(codex)).toMatchObject({ mcp: true, localModels: true, subagents: true, headless: true, browser: true, sandbox: true, checkpoints: false });
    expect(urls).toEqual(expect.arrayContaining([
      "https://learn.chatgpt.com/docs/agent-approvals-security",
      "https://learn.chatgpt.com/docs/sandboxing",
      "https://learn.chatgpt.com/docs/sandboxing/auto-review",
      "https://learn.chatgpt.com/docs/permissions",
      "https://learn.chatgpt.com/docs/permission-modes",
      "https://learn.chatgpt.com/docs/agent-configuration/rules",
      "https://learn.chatgpt.com/docs/agent-configuration/subagents",
      "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
      "https://learn.chatgpt.com/docs/customization/memories",
      "https://learn.chatgpt.com/docs/environments/local-environment",
      "https://learn.chatgpt.com/docs/environments/cloud-environment",
      "https://learn.chatgpt.com/docs/environments/git-worktrees",
      "https://learn.chatgpt.com/docs/windows/windows-sandbox",
      "https://learn.chatgpt.com/docs/app",
      "https://learn.chatgpt.com/docs/auth",
      "https://learn.chatgpt.com/docs/remote-connections",
      "https://learn.chatgpt.com/docs/hooks",
      "https://learn.chatgpt.com/docs/skills-and-plugins",
      "https://learn.chatgpt.com/docs/plugins",
      "https://learn.chatgpt.com/docs/automations",
      "https://learn.chatgpt.com/docs/code-review",
      "https://learn.chatgpt.com/docs/third-party/github",
      "https://learn.chatgpt.com/docs/security",
      "https://learn.chatgpt.com/docs/enterprise/admin-setup",
      "https://learn.chatgpt.com/docs/amazon-bedrock",
      "https://learn.chatgpt.com/docs/feature-maturity",
      "https://github.com/openai/codex/releases/tag/rust-v0.147.0",
      "https://learn.chatgpt.com/docs/whats-new",
      "https://github.com/openai/codex/tree/25af12f7e61572b0bc18ddb1008be543b91519b0",
    ]));
    expect(caveats).toContain("permission profiles are beta");
    expect(caveats).toContain("not a deterministic security guarantee");
    expect(caveats).toContain("no product-level file checkpoint");
    expect(caveats).toContain("inherit the connected host's");
    expect(caveats).toContain("model quality and compatibility are separate from the harness");
    expect(caveats).toContain("optional plugin or cloud vulnerability workflow");
    expect(caveats).toContain("not the proprietary IDE extension or Codex cloud service");
    expect(codex.capabilities).toEqual({
      simplicity: 4,
      flexibility: 5,
      security: 5,
      autonomy: 5,
      automation: 5,
      largeRepo: 5,
      humanControl: 4,
    });
  });

  it("treats OpenCode permission policy and Git undo as controls rather than a sandbox", () => {
    const openCode = harnesses.find((harness) => harness.id === "opencode")!;
    const urls = openCode.evidence.map((source) => source.url);
    const caveats = openCode.tradeoffs.join(" ");

    expect(openCode.verifiedAt).toBe("2026-08-02");
    expect(openCode.evidence).toHaveLength(26);
    expect(openCode.evidence.find((source) => source.url.endsWith("/v1.18.11"))?.verifiedAt).toBe("2026-08-02");
    expect(openCode.evidence.find((source) => source.url.includes("/tree/e5cc278"))?.verifiedAt).toBe("2026-07-30");
    expect(openCode.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(openCode.classification).toMatchObject({ runtime: "host-first", isolation: [], state: "session-based" });
    expect(urls).toEqual(expect.arrayContaining([
      "https://opencode.ai/docs/permissions",
      "https://opencode.ai/docs/agents/",
      "https://opencode.ai/docs/server",
      "https://opencode.ai/docs/github",
      "https://github.com/anomalyco/opencode/releases/tag/v1.18.9",
      "https://github.com/anomalyco/opencode/releases/tag/v1.18.11",
      "https://github.com/anomalyco/opencode/blob/e5cc278dec9294a627a7b05f47ce6a564408c1a2/packages/opencode/src/snapshot/index.ts",
      "https://github.com/anomalyco/opencode/tree/e5cc278dec9294a627a7b05f47ce6a564408c1a2",
      "https://github.com/anomalyco/opencode/blob/e5cc278dec9294a627a7b05f47ce6a564408c1a2/SECURITY.md",
    ]));
    expect(caveats).toContain("no built-in OS or container sandbox");
    expect(caveats).toContain("most permission classes default to allow");
    expect(caveats).toContain("untracked files over 2 MB");
    expect(caveats).toContain("has no password unless OPENCODE_SERVER_PASSWORD is set");
    expect(caveats).toContain("full conversation and remains accessible until unshared");
    expect(openCode.capabilities).toEqual({
      simplicity: 4,
      flexibility: 5,
      security: 3,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 4,
    });
  });

  it("keeps Pi intentionally minimal and separates session recovery from file recovery", () => {
    const pi = harnesses.find((harness) => harness.id === "pi")!;
    const urls = pi.evidence.map((source) => source.url);
    const caveats = pi.tradeoffs.join(" ");

    expect(pi.verifiedAt).toBe("2026-08-10");
    expect(pi.evidence.length).toBeGreaterThanOrEqual(18);
    expect(pi.evidence.find((source) => source.url.endsWith("/v0.84.0"))?.verifiedAt).toBe(pi.verifiedAt);
    expect(pi.evidence.find((source) => source.url.includes("/tree/588915e"))?.verifiedAt).toBe("2026-08-05");
    expect(featureSupportFor(pi)).toMatchObject({ mcp: false, subagents: false, browser: false, sandbox: false, checkpoints: false });
    expect(urls).toEqual(expect.arrayContaining([
      "https://pi.dev/docs/latest/security",
      "https://pi.dev/docs/latest/sessions",
      "https://pi.dev/docs/latest/rpc",
      "https://pi.dev/docs/latest/sdk",
      "https://github.com/earendil-works/pi/tree/588915ec71714688cee8b7153339e8bdebb3e82e/packages/evals",
      "https://github.com/earendil-works/pi/releases/tag/v0.84.0",
    ]));
    expect(pi.evidence.find((source) => source.title === "Pi 0.83.0 release")?.covers)
      .toContain("current stable version is sourced from the generated release feed");
    expect(caveats).toContain("project trust only gates project extensions");
    expect(caveats).toContain("do not roll back files");
    expect(caveats).toContain("behavioral and comparative eval assets");
    expect(caveats).toContain("not an independent product benchmark");
  });

  it("records OMP's batteries-included surface without calling context rewind a file checkpoint", () => {
    const omp = harnesses.find((harness) => harness.id === "omp")!;
    const urls = omp.evidence.map((source) => source.url);
    const caveats = omp.tradeoffs.join(" ");

    expect(omp.verifiedAt).toBe("2026-08-02");
    expect(omp.evidence.length).toBeGreaterThanOrEqual(14);
    expect(omp.evidence.find((source) => source.url.endsWith("/v17.2.1"))?.verifiedAt).toBe("2026-07-31");
    expect(omp.evidence.find((source) => source.url.endsWith("/v17.2.4"))?.verifiedAt).toBe("2026-08-02");
    expect(omp.evidence.find((source) => source.url.includes("/tree/d16c6168"))?.verifiedAt).toBe("2026-07-28");
    expect(featureSupportFor(omp)).toMatchObject({ mcp: true, subagents: true, browser: true, sandbox: false, checkpoints: false });
    expect(urls).toEqual(expect.arrayContaining([
      "https://github.com/can1357/oh-my-pi/blob/d16c6168c86f40fc44f25118c2fd06fe160fcb93/docs/approval-mode.md",
      "https://github.com/can1357/oh-my-pi/blob/d16c6168c86f40fc44f25118c2fd06fe160fcb93/docs/tools/task.md",
      "https://github.com/can1357/oh-my-pi/blob/d16c6168c86f40fc44f25118c2fd06fe160fcb93/docs/tools/checkpoint.md",
      "https://github.com/can1357/oh-my-pi/blob/d16c6168c86f40fc44f25118c2fd06fe160fcb93/docs/memory.md",
      "https://github.com/can1357/oh-my-pi/blob/d16c6168c86f40fc44f25118c2fd06fe160fcb93/docs/hooks.md",
      "https://github.com/can1357/oh-my-pi/blob/d16c6168c86f40fc44f25118c2fd06fe160fcb93/docs/extensions.md",
      "https://github.com/can1357/oh-my-pi/blob/d16c6168c86f40fc44f25118c2fd06fe160fcb93/docs/secrets.md",
      "https://github.com/can1357/oh-my-pi/releases/tag/v17.2.1",
      "https://github.com/can1357/oh-my-pi/releases/tag/v17.2.4",
    ]));
    expect(caveats).toContain("subagents also run yolo");
    expect(caveats).toContain("prune conversation context only");
    expect(caveats).toContain("Secret obfuscation is disabled by default");
    expect(caveats).toContain("run in-process without isolation");
    expect(caveats).toContain("revised inputs are schema-revalidated");
    expect(caveats).toContain("no score is imported");
  });

  it("pins Grok Build 1.0's optional isolation and surface-specific code recovery", () => {
    const grokBuild = harnesses.find((harness) => harness.id === "grok-build")!;
    const urls = grokBuild.evidence.map((source) => source.url);
    const caveats = grokBuild.tradeoffs.join(" ");

    expect(grokBuild.verifiedAt).toBe("2026-08-07");
    expect(grokBuild.evidence).toHaveLength(26);
    expect(grokBuild.evidence.find((source) => source.title === "Grok Build changelog")?.verifiedAt).toBe("2026-08-07");
    expect(grokBuild.evidence.find((source) => source.url.includes("/tree/afbc0fb"))?.verifiedAt).toBe("2026-08-07");
    expect(grokBuild.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.x.ai/build/features/sandbox",
      "https://docs.x.ai/build/features/permissions",
      "https://docs.x.ai/build/features/worktrees",
      "https://docs.x.ai/build/features/mcp-servers",
      "https://docs.x.ai/build/settings",
      "https://docs.x.ai/build/cli/reference",
      "https://docs.x.ai/build/enterprise",
      "https://github.com/xai-org/grok-build/commit/393430ee4934bc791b0d538f304a21691c517433",
      "https://github.com/xai-org/grok-build/tree/afbc0fb710320c7add294c2106d447ecc3e3af2e",
      "https://github.com/xai-org/grok-build/blob/afbc0fb710320c7add294c2106d447ecc3e3af2e/crates/codegen/xai-grok-pager/src/app/session_startup.rs",
    ]));
    expect(grokBuild.evidence.find((source) => source.title === "Grok Build changelog")?.covers).toContain("1.0.0");
    expect(caveats).toContain("OS sandbox is off by default");
    expect(caveats).toContain("/rewind now truncates conversation without restoring files");
    expect(caveats).toContain("--worktree --restore-code");
    expect(caveats).not.toContain("remains beta");
    expect(caveats).toContain("Browser review is supplied through plugins or MCP");
    expect(caveats).toContain("model branding, not evidence of harness quality");
    expect(grokBuild.capabilities).toEqual({
      simplicity: 4,
      flexibility: 5,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 5,
    });
  });

  it("expands OpenHands operations while preserving the sandbox-first and unattended-run caveats", () => {
    const openHands = harnesses.find((harness) => harness.id === "openhands")!;
    const urls = openHands.evidence.map((source) => source.url);
    const caveats = openHands.tradeoffs.join(" ");

    expect(openHands.verifiedAt).toBe("2026-07-28");
    expect(openHands.logo.sourceUrl).toBe("https://github.com/OpenHands/OpenHands/blob/main/src/assets/branding/openhands-logo.svg");
    expect(openHands.evidence).toHaveLength(23);
    expect(openHands.evidence.every((source) => source.verifiedAt === openHands.verifiedAt)).toBe(true);
    expect(openHands.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.openhands.dev/openhands/usage/cli/installation",
      "https://docs.openhands.dev/openhands/usage/cli/mcp-servers",
      "https://docs.openhands.dev/openhands/usage/automations/overview",
      "https://docs.openhands.dev/openhands/usage/automations/event-automations",
      "https://docs.openhands.dev/openhands/usage/advanced/custom-sandbox-guide",
      "https://github.com/OpenHands/OpenHands/releases/tag/1.11.0",
    ]));
    expect(caveats).toContain("ProcessSandbox runs directly on the host");
    expect(caveats).toContain("Headless CLI runs in always-approve mode");
    expect(caveats).toContain("stored secrets");
    expect(caveats).toContain("Git-provider credentials");
    expect(openHands.capabilities).toEqual({
      simplicity: 2,
      flexibility: 5,
      security: 5,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 3,
    });
  });

  it("makes Factory's configuration and session-sync defaults visible without changing its ordinal scores", () => {
    const factory = harnesses.find((harness) => harness.id === "factory-droid")!;
    const urls = factory.evidence.map((source) => source.url);
    const caveats = factory.tradeoffs.join(" ");

    expect(factory.verifiedAt).toBe("2026-08-02");
    expect(factory.evidence).toHaveLength(17);
    expect(factory.evidence.find((source) => source.title === "Factory v0.185.0 release notes")?.verifiedAt).toBe("2026-08-02");
    expect(factory.evidence.find((source) => source.url.includes("/tree/7ea5f9c"))?.verifiedAt).toBe("2026-07-30");
    expect(factory.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.factory.ai/droid-cli/settings",
      "https://docs.factory.ai/harness/mcp",
      "https://docs.factory.ai/harness/hooks",
      "https://docs.factory.ai/harness/agents-md",
      "https://docs.factory.ai/autonomy-and-safety/sandbox",
      "https://docs.factory.ai/enterprise/llm-safety-and-agent-controls",
      "https://docs.factory.ai/changelog/release-notes",
    ]));
    expect(caveats).toContain("Private Preview OS sandbox is opt-in");
    expect(caveats).toContain("cloudSessionSync");
    expect(caveats).toContain("enabled by default");
    expect(caveats).toContain("current environment's credentials");
    expect(factory.capabilities).toEqual({
      simplicity: 3,
      flexibility: 5,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 5,
    });
  });

  it("uses the current Letta Harness boundary and separates MCP, client tools, mods, and managed sandboxes", () => {
    const letta = harnesses.find((harness) => harness.id === "letta-code")!;
    const urls = letta.evidence.map((source) => source.url);
    const caveats = letta.tradeoffs.join(" ");

    expect(letta.name).toBe("Letta Harness");
    expect(letta.summary).toContain("formerly called Letta Code");
    expect(letta.verifiedAt).toBe("2026-08-02");
    expect(letta.evidence).toHaveLength(25);
    expect(letta.evidence.find((source) => source.url.endsWith("/v0.30.1"))?.verifiedAt).toBe("2026-08-02");
    expect(letta.evidence.find((source) => source.url.endsWith("/v0.29.9"))?.verifiedAt).toBe("2026-07-28");
    expect(letta.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.letta.com/llms.txt",
      "https://docs.letta.com/v1-sdk/tools/mcp-tools",
      "https://docs.letta.com/v1-sdk/tools/client-tools",
      "https://github.com/letta-ai/letta-code/blob/286a01d10602eab4a356f2b062e817310f992966/src/cli/commands/mcp.ts",
      "https://docs.letta.com/platform/github-action",
      "https://docs.letta.com/configuration/mods",
      "https://docs.letta.com/reference/settings",
      "https://docs.letta.com/reference/changelog",
      "https://docs.letta.com/platform/cli/reference",
      "https://github.com/letta-ai/letta-code/releases/tag/v0.29.9",
      "https://github.com/letta-ai/letta-code/releases/tag/v0.30.1",
    ]));
    expect(caveats).toContain("starts in unrestricted mode");
    expect(caveats).toContain("recommends skills instead of MCP");
    expect(caveats).toContain("fully trusted code inside the harness process");
    expect(featureSupportFor(letta)).toMatchObject({ mcp: true, subagents: true, headless: true, sandbox: true, checkpoints: false });
    expect(letta.capabilities).toEqual({
      simplicity: 3,
      flexibility: 5,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 4,
    });
  });

  it("pins ZCode claims to its current desktop mechanisms without importing model claims", () => {
    const zcode = harnesses.find((harness) => harness.id === "zcode")!;
    const urls = zcode.evidence.map((source) => source.url);

    expect(zcode.verifiedAt).toBe("2026-08-02");
    expect(zcode.evidence.length).toBeGreaterThanOrEqual(15);
    expect(zcode.evidence.find((source) => source.url.endsWith("/changelog"))?.verifiedAt).toBe("2026-08-02");
    expect(zcode.evidence.find((source) => source.url.endsWith("/agents"))?.verifiedAt).toBe("2026-07-27");
    expect(urls).toEqual(expect.arrayContaining([
      "https://zcode.z.ai/en/docs/goal",
      "https://zcode.z.ai/en/docs/subagents",
      "https://zcode.z.ai/en/docs/safety-confirm",
      "https://zcode.z.ai/en/docs/remote-development",
      "https://zcode.z.ai/en/docs/hooks",
      "https://zcode.z.ai/en/docs/skill",
      "https://zcode.z.ai/en/changelog",
    ]));
    expect(zcode.tradeoffs.join(" ")).toContain("No documented headless CLI");
    expect(zcode.tradeoffs.join(" ")).toContain("not independent proof of task success");
  });

  it("pins Hermes Agent's broad surface and qualifies its optional safety controls", () => {
    const hermes = harnesses.find((harness) => harness.id === "hermes-agent")!;
    const urls = hermes.evidence.map((source) => source.url);
    const caveats = hermes.tradeoffs.join(" ");

    expect(hermes.verifiedAt).toBe("2026-07-27");
    expect(hermes.evidence.length).toBeGreaterThanOrEqual(20);
    expect(hermes.evidence.every((source) => source.verifiedAt === hermes.verifiedAt)).toBe(true);
    expect(urls).toEqual(expect.arrayContaining([
      "https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback",
      "https://hermes-agent.nousresearch.com/docs/user-guide/features/goals",
      "https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server/",
      "https://github.com/NousResearch/hermes-agent/blob/0fa5e41c86f022bba147797849f0b44865721476/SECURITY.md",
      "https://github.com/NousResearch/hermes-agent/blob/0fa5e41c86f022bba147797849f0b44865721476/mini_swe_runner.py",
    ]));
    expect(caveats).toContain("default local backend executes with the user's host privileges");
    expect(caveats).toContain("Checkpoints, memory-write review, skill-write review, and whole-process isolation are opt-in");
    expect(caveats).toContain("no score is imported");
  });

  it("classifies OpenClaw as a general-purpose coding harness without importing adapter benchmark scores", () => {
    const openclaw = harnesses.find((harness) => harness.id === "openclaw")!;
    const urls = openclaw.evidence.map((source) => source.url);
    const caveats = openclaw.tradeoffs.join(" ");

    expect(openclaw.verifiedAt).toBe("2026-08-10");
    expect(openclaw.evidence.length).toBeGreaterThanOrEqual(30);
    expect(openclaw.evidence.find((source) => source.url.endsWith("/v2026.6.34"))?.verifiedAt).toBe(openclaw.verifiedAt);
    expect(openclaw.evidence.find((source) => source.url.includes("/tree/4ce534a"))?.verifiedAt).toBe("2026-07-28");
    expect(new Set(urls).size).toBe(urls.length);
    expect(openclaw.classification).toEqual({
      role: "general-agent",
      orchestration: "multi-agent-runtime",
      runtime: "host-first",
      isolation: ["container"],
      state: "persistent-memory",
    });
    expect(openclaw.capabilities).toEqual({
      simplicity: 3,
      flexibility: 5,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 3,
      humanControl: 4,
    });
    expect(featureSupportFor(openclaw)).toMatchObject({
      mcp: true,
      localModels: true,
      subagents: true,
      headless: true,
      browser: true,
      sandbox: true,
      checkpoints: false,
    });
    expect(urls).toEqual(expect.arrayContaining([
      "https://github.com/openclaw/openclaw/releases/tag/v2026.7.1",
      "https://docs.openclaw.ai/agent-loop",
      "https://docs.openclaw.ai/tools/exec",
      "https://docs.openclaw.ai/concepts/memory",
      "https://docs.openclaw.ai/tools/subagents",
      "https://docs.openclaw.ai/gateway/security",
      "https://github.com/openclaw/openclaw/blob/4ce534aec2e3ab0fefe7eb6b131cc7be5023500d/src/agents/embedded-agent-runner/run-loop.ts",
    ]));
    expect(caveats).toContain("sandboxing is off by default");
    expect(caveats).toContain("do not provide repository-file rollback");
    expect(caveats).toContain("imports no product score");
  });

  it("keeps mini-SWE-agent minimal without overstating confirmation as full control", () => {
    const mini = harnesses.find((harness) => harness.id === "mini-swe-agent")!;
    const urls = mini.evidence.map((source) => source.url);
    const caveats = mini.tradeoffs.join(" ");

    expect(mini.verifiedAt).toBe("2026-07-27");
    expect(mini.evidence.length).toBeGreaterThanOrEqual(20);
    expect(mini.evidence.every((source) => source.verifiedAt === mini.verifiedAt)).toBe(true);
    expect(mini.capabilities.humanControl).toBe(3);
    expect(featureSupportFor(mini)).toMatchObject({ mcp: false, subagents: false, browser: false, sandbox: true, checkpoints: false });
    expect(urls).toEqual(expect.arrayContaining([
      "https://github.com/SWE-agent/mini-swe-agent/releases/tag/v2.4.6",
      "https://mini-swe-agent.com/latest/advanced/control_flow/",
      "https://mini-swe-agent.com/latest/models/local_models/",
      "https://mini-swe-agent.com/latest/usage/swebench/",
      "https://github.com/SWE-agent/mini-swe-agent/blob/a83fcae82d2a08f0ee0c688f9d137b3566c097f8/src/minisweagent/agents/interactive.py",
      "https://github.com/SWE-agent/mini-swe-agent/blob/a83fcae82d2a08f0ee0c688f9d137b3566c097f8/src/minisweagent/environments/local.py",
    ]));
    expect(caveats).toContain("host privileges");
    expect(caveats).toContain("not a scoped permission policy");
    expect(caveats).toContain("no rollback checkpoint");
    expect(caveats).toContain("trajectories are written only after a task completes");
  });

  it("separates Amp's managed orbs from its permissive local default", () => {
    const amp = harnesses.find((harness) => harness.id === "amp")!;
    const urls = amp.evidence.map((source) => source.url);
    const caveats = amp.tradeoffs.join(" ");

    expect(amp.verifiedAt).toBe("2026-08-02");
    expect(amp.evidence.length).toBeGreaterThanOrEqual(21);
    expect(amp.evidence.find((source) => source.url.endsWith("/event-driven-orbs"))?.verifiedAt).toBe("2026-08-02");
    expect(amp.evidence.find((source) => source.url.endsWith("/manual"))?.verifiedAt).toBe("2026-07-27");
    expect(amp.classification).toMatchObject({ runtime: "host-first", isolation: ["managed-sandbox"], state: "session-based" });
    expect(featureSupportFor(amp)).toMatchObject({ sandbox: true, checkpoints: false, headless: true, subagents: true, browser: true });
    expect(amp.capabilities).toMatchObject({ security: 3, largeRepo: 4, humanControl: 3 });
    expect(urls).toEqual(expect.arrayContaining([
      "https://ampcode.com/manual#orbs",
      "https://ampcode.com/manual#permissions",
      "https://ampcode.com/manual#schedules",
      "https://ampcode.com/manual/plugin-api",
      "https://ampcode.com/manual/sdk/typescript",
      "https://ampcode.com/security",
      "https://ampcode.com/news/agents-anywhere",
      "https://ampcode.com/news/event-driven-orbs",
      "https://ampcode.com/news/multiplayer",
    ]));
    expect(caveats).toContain("without approval by default");
    expect(caveats).toContain("paid managed cloud sandboxes");
    expect(caveats).toContain("No harness checkpoint or file rollback");
    expect(caveats).toContain("not self-hostable");
    expect(caveats).toContain("webhook URLs are credentials");
    expect(caveats).toContain("shared terminal");
  });

  it("keeps Kiro 2.x stable capabilities separate from the opt-in v3 harness", () => {
    const kiro = harnesses.find((harness) => harness.id === "kiro-cli")!;
    const urls = kiro.evidence.map((source) => source.url);
    const caveats = kiro.tradeoffs.join(" ");

    expect(kiro.verifiedAt).toBe("2026-08-02");
    expect(kiro.evidence).toHaveLength(21);
    expect(kiro.evidence.find((source) => source.url.endsWith("/2-15/"))?.verifiedAt).toBe("2026-08-02");
    expect(kiro.evidence.find((source) => source.url.endsWith("/headless/"))?.verifiedAt).toBe("2026-07-27");
    expect(kiro.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(featureSupportFor(kiro)).toMatchObject({ headless: true, subagents: true, mcp: true, checkpoints: true, sandbox: false });
    expect(kiro.capabilities.automation).toBe(4);
    expect(urls).toEqual(expect.arrayContaining([
      "https://kiro.dev/changelog/cli/2-15/",
      "https://kiro.dev/docs/cli/headless/",
      "https://kiro.dev/docs/cli/chat/goal/",
      "https://kiro.dev/docs/cli/experimental/checkpointing/",
      "https://kiro.dev/docs/cli/chat/subagents/",
      "https://kiro.dev/docs/cli/v3/",
      "https://kiro.dev/docs/cli/privacy-and-security/",
      "https://kiro.dev/docs/cli/v3/permissions/",
    ]));
    expect(caveats).toContain("no built-in execution sandbox");
    expect(caveats).toContain("review behavior rather than capability, isolation, or access control");
    expect(caveats).toContain("pre-trusted tool categories");
    expect(caveats).toContain("Classic checkpoints are experimental and session-scoped");
    expect(caveats).toContain("CLI 3.0 is early access");
    expect(caveats).toContain("not treated as the stable 2.x default");
    expect(caveats).toContain("not independent evidence");
    expect(kiro.capabilities).toEqual({
      simplicity: 4,
      flexibility: 4,
      security: 4,
      autonomy: 5,
      automation: 4,
      largeRepo: 4,
      humanControl: 4,
    });
  });

  it("recognizes Poolside's provider flexibility without mistaking rewind for a checkpoint", () => {
    const pool = harnesses.find((harness) => harness.id === "poolside-cli")!;
    const urls = pool.evidence.map((source) => source.url);
    const caveats = pool.tradeoffs.join(" ");

    expect(pool.verifiedAt).toBe("2026-07-30");
    expect(pool.evidence.length).toBeGreaterThanOrEqual(15);
    expect(pool.evidence.every((source) => source.verifiedAt === pool.verifiedAt)).toBe(true);
    expect(pool.providerStyle).toBe("multi-provider");
    expect(featureSupportFor(pool).localModels).toBe(true);
    expect(featureSupportFor(pool)).toMatchObject({ localModels: true, sandbox: true, checkpoints: false, subagents: false });
    expect(pool.classification.isolation).toEqual(["container", "worktree"]);
    expect(pool.capabilities).toMatchObject({ flexibility: 5, security: 4, automation: 4, humanControl: 4 });
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.poolside.ai/cli/interactive-mode",
      "https://docs.poolside.ai/settings-file-reference",
      "https://docs.poolside.ai/sandboxes",
      "https://github.com/poolsideai/pool/releases/tag/v1.0.13",
      "https://github.com/poolsideai/pool/blob/39e9094bd5d49d2dc4df780753cc6da37fc88eb6/README.md",
    ]));
    expect(caveats).toContain("Local container sandbox isolation must be explicitly configured");
    expect(caveats).toContain("Remote HTTP or SSE MCP servers");
    expect(caveats).toContain("does not restore files");
    expect(caveats).toContain("v1.0.13 tag points to a tree whose changelog still says 1.0.12");
    expect(urls).not.toContain("https://docs.poolside.ai/organization/permissions-reference");
    expect(urls).not.toContain("https://docs.poolside.ai/managed-agents");
    expect(urls).not.toContain("https://docs.poolside.ai/repositories");
  });

  it("keeps goose claims granular and qualifies its default execution posture", () => {
    const goose = harnesses.find((harness) => harness.id === "goose")!;
    const urls = goose.evidence.map((source) => source.url);
    const caveats = goose.tradeoffs.join(" ");

    expect(goose.verifiedAt).toBe("2026-08-01");
    expect(goose.evidence).toHaveLength(20);
    expect(goose.evidence.find((source) => source.title === "goose v1.45.0 release")?.verifiedAt).toBe(goose.verifiedAt);
    expect(goose.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://goose-docs.ai/docs/getting-started/providers/",
      "https://goose-docs.ai/docs/guides/context-engineering/subagents/",
      "https://goose-docs.ai/docs/tutorials/headless-goose/",
      "https://goose-docs.ai/docs/mcp/developer-mcp/",
      "https://goose-docs.ai/blog/2026/02/23/goose-v1-25-0/",
      "https://goose-docs.ai/docs/guides/codebase-analysis/",
      "https://goose-docs.ai/docs/guides/security/",
      "https://goose-docs.ai/docs/guides/security/adversary-mode/",
      "https://goose-docs.ai/docs/guides/security/prompt-injection-detection/",
      "https://goose-docs.ai/docs/guides/security/classification-api-spec/",
      "https://github.com/aaif-goose/goose/blob/main/SECURITY.md",
      "https://github.com/aaif-goose/goose/releases/tag/v1.44.0",
      "https://github.com/aaif-goose/goose/releases/tag/v1.45.0",
      "https://github.com/aaif-goose/goose/security/advisories/GHSA-r5pp-p5r8-466r",
    ]));
    expect(caveats).toContain("user privileges by default");
    expect(caveats).toContain("specific to goose Desktop on macOS");
    expect(caveats).toContain("fails open");
    expect(caveats).toContain("configured classifier endpoint");
    expect(caveats).toContain("before 1.44.0");
    expect(caveats).toContain("Built-in skills can be disabled");
    expect(featureSupportFor(goose).skills).toBe(true);
    expect(goose.evidence.find((source) => source.title === "goose v1.44.0 release")?.covers)
      .toContain("current stable version is sourced from the generated release feed");
    expect(goose.capabilities).toEqual({
      simplicity: 4,
      flexibility: 5,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 3,
      humanControl: 4,
    });
  });

  it("separates Mux runtime availability from its default host execution", () => {
    const mux = harnesses.find((harness) => harness.id === "mux")!;
    const urls = mux.evidence.map((source) => source.url);
    const caveats = mux.tradeoffs.join(" ");

    expect(mux.verifiedAt).toBe("2026-07-27");
    expect(mux.evidence).toHaveLength(26);
    expect(mux.evidence.every((source) => source.verifiedAt === mux.verifiedAt)).toBe(true);
    expect(mux.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(mux.classification).toMatchObject({
      runtime: "host-first",
      isolation: ["worktree", "container"],
      state: "persistent-memory",
    });
    expect(urls).toEqual(expect.arrayContaining([
      "https://mux.coder.com/runtime/local",
      "https://mux.coder.com/runtime/docker",
      "https://mux.coder.com/runtime/devcontainer",
      "https://mux.coder.com/runtime/worktree",
      "https://mux.coder.com/runtime/ssh",
      "https://mux.coder.com/runtime/coder",
      "https://mux.coder.com/hooks/tools",
      "https://mux.coder.com/hooks/init",
      "https://mux.coder.com/guides/github-actions",
      "https://mux.coder.com/integrations/acp",
      "https://mux.coder.com/integrations/vscode-extension",
      "https://mux.coder.com/agents/instruction-files",
      "https://mux.coder.com/agents/plan-mode",
      "https://mux.coder.com/install",
      "https://mux.coder.com/config/server-access",
    ]));
    expect(caveats).toContain("default local runtime has no filesystem or process isolation");
    expect(caveats).toContain("Tool hooks");
    expect(caveats).toContain("--no-auth");
    expect(mux.capabilities).toEqual({
      simplicity: 3,
      flexibility: 5,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 5,
      humanControl: 4,
    });
  });

  it("expands Cursor CLI coverage without treating source volume as a score change", () => {
    const cursor = harnesses.find((harness) => harness.id === "cursor-cli")!;
    const urls = cursor.evidence.map((source) => source.url);
    const caveats = cursor.tradeoffs.join(" ");

    expect(cursor.verifiedAt).toBe("2026-08-01");
    expect(cursor.evidence).toHaveLength(16);
    expect(cursor.evidence.find((source) => source.title === "Agent Skills")?.verifiedAt).toBe(cursor.verifiedAt);
    expect(cursor.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://cursor.com/docs/cli/installation",
      "https://cursor.com/docs/cli/using",
      "https://cursor.com/docs/cli/mcp",
      "https://cursor.com/docs/cli/shell-mode",
      "https://cursor.com/docs/cli/reference/authentication",
      "https://cursor.com/docs/skills",
    ]));
    expect(urls).not.toContain("https://cursor.com/docs/cli/capabilities");
    expect(caveats).toContain("worktrees isolate files only");
    expect(caveats).toContain("Global MCP servers are auto-approved");
    expect(caveats).toContain("cannot undo network or other external side effects");
    expect(cursor.capabilities).toEqual({
      simplicity: 5,
      flexibility: 3,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 5,
    });
  });

  it("fills Command Code's workflow ledger without converting internal verification into independent evidence", () => {
    const command = harnesses.find((harness) => harness.id === "command-code")!;
    const urls = command.evidence.map((source) => source.url);
    const caveats = command.tradeoffs.join(" ");

    expect(command.verifiedAt).toBe("2026-07-30");
    expect(command.evidence).toHaveLength(20);
    expect(command.evidence.every((source) => source.verifiedAt === command.verifiedAt)).toBe(true);
    expect(command.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://commandcode.ai/docs/worktrees",
      "https://commandcode.ai/docs/sessions",
      "https://commandcode.ai/docs/goal",
      "https://commandcode.ai/docs/memory",
      "https://commandcode.ai/docs/taste",
      "https://commandcode.ai/docs/settings",
      "https://commandcode.ai/docs/plan-mode",
      "https://commandcode.ai/docs/interactive-mode",
      "https://commandcode.ai/docs/background-tasks",
      "https://commandcode.ai/docs/whats-new",
      "https://commandcode.ai/docs/mods",
      "https://commandcode.ai/docs/studio",
    ]));
    expect(command.evidence.find((source) => source.title === "Headless mode")?.covers).toContain("100-turn default");
    expect(caveats).toContain("do not provide an OS security boundary");
    expect(caveats).toContain("Goal completion is judged inside the product workflow");
    expect(caveats).toContain("inherit the host execution boundary");
    expect(command.capabilities).toEqual({
      simplicity: 4,
      flexibility: 5,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 5,
      humanControl: 5,
    });
  });

  it("records Qwen Code's constrained background workflows and daemon limits", () => {
    const qwen = harnesses.find((harness) => harness.id === "qwen-code")!;
    const urls = qwen.evidence.map((source) => source.url);
    const caveats = qwen.tradeoffs.join(" ");

    expect(qwen.verifiedAt).toBe("2026-08-10");
    expect(qwen.evidence).toHaveLength(22);
    expect(qwen.evidence.filter((source) => source.verifiedAt === qwen.verifiedAt)).toHaveLength(2);
    expect(qwen.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://qwenlm.github.io/qwen-code-docs/en/users/overview/",
      "https://qwenlm.github.io/qwen-code-docs/en/developers/tools/mcp-server/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/extension/introduction/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/qwen-serve/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/integration-jetbrains/",
      "https://qwenlm.github.io/qwen-code-docs/en/blog/updates/weekly-update-2026-07-09/",
      "https://github.com/QwenLM/qwen-code/releases/tag/v0.21.3",
      "https://github.com/QwenLM/qwen-code/pull/8303",
      "https://github.com/QwenLM/qwen-code/pull/8056",
      "https://github.com/QwenLM/qwen-code/releases/tag/v0.21.7",
      "https://github.com/QwenLM/qwen-code/releases/tag/v0.21.8",
    ]));
    expect(caveats).toContain("exact-workspace isolation is opt-in");
    expect(caveats).toContain("remain blocked on parent approval");
    expect(caveats).toContain("cancelled when the owning process exits");
    expect(caveats).toContain("support cooperative pause and resume but not restart recovery");
    expect(caveats).toContain("loopback starts without authentication");
    expect(caveats).toContain("fails closed without a bearer token");
    expect(caveats).toContain("production-grade multi-client");
    expect(qwen.capabilities).toEqual({
      simplicity: 4,
      flexibility: 5,
      security: 4,
      autonomy: 5,
      automation: 5,
      largeRepo: 4,
      humanControl: 4,
    });
  });

  it("adds Aider privacy and release provenance without inferring a sandbox", () => {
    const aider = harnesses.find((harness) => harness.id === "aider")!;
    const urls = aider.evidence.map((source) => source.url);
    const caveats = aider.tradeoffs.join(" ");

    expect(aider.verifiedAt).toBe("2026-07-27");
    expect(aider.evidence).toHaveLength(18);
    expect(aider.evidence.every((source) => source.verifiedAt === aider.verifiedAt)).toBe(true);
    expect(aider.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://aider.chat/docs/legal/privacy.html",
      "https://aider.chat/HISTORY.html",
      "https://aider.chat/docs/faq.html",
      "https://github.com/Aider-AI/aider/tree/253f0368b873ba30d8ee26e463718f0c03614ddf",
    ]));
    expect(caveats).toContain("no built-in OS or container sandbox");
    expect(caveats).toContain("GitHub Releases stops at v0.86.0");
    expect(caveats).toContain("audited source commit explicitly bumps the package to v0.86.2");
    expect(aider.capabilities).toEqual({
      simplicity: 5,
      flexibility: 5,
      security: 3,
      autonomy: 3,
      automation: 4,
      largeRepo: 4,
      humanControl: 5,
    });
  });

  it("keeps codebuff claims granular and separates autonomy from isolation", () => {
    const codebuff = harnesses.find((harness) => harness.id === "codebuff")!;
    const urls = codebuff.evidence.map((source) => source.url);

    expect(codebuff.verifiedAt).toBe("2026-07-27");
    expect(codebuff.evidence.length).toBeGreaterThanOrEqual(12);
    expect(codebuff.evidence.every((source) => source.verifiedAt === codebuff.verifiedAt)).toBe(true);
    expect(urls).toEqual(expect.arrayContaining([
      "https://www.codebuff.com/docs/tips/what-makes-codebuff-unique",
      "https://www.codebuff.com/docs/advanced/sdk",
      "https://www.codebuff.com/docs/help/faq",
      "https://github.com/CodebuffAI/freebuff/blob/672b784b42112d0eaf236e63b1005588e3c36711/agents/browser-use/browser-use.ts",
      "https://github.com/CodebuffAI/freebuff/blob/672b784b42112d0eaf236e63b1005588e3c36711/docs/agents-and-tools.md",
      "https://github.com/CodebuffAI/freebuff/blob/672b784b42112d0eaf236e63b1005588e3c36711/evals/buffbench/README.md",
    ]));
    expect(codebuff.tradeoffs.join(" ")).toContain("without per-command permission prompts");
    expect(codebuff.tradeoffs.join(" ")).toContain("no built-in sandbox");
  });

  it("keeps Coder Agents claims granular and exposes conditional controls", () => {
    const coderAgents = harnesses.find((harness) => harness.id === "coder-agents")!;
    const urls = coderAgents.evidence.map((source) => source.url);
    const caveats = coderAgents.tradeoffs.join(" ");

    expect(coderAgents.verifiedAt).toBe("2026-07-27");
    expect(coderAgents.evidence.length).toBeGreaterThanOrEqual(18);
    expect(coderAgents.evidence.every((source) => source.verifiedAt === coderAgents.verifiedAt)).toBe(true);
    expect(urls).toEqual(expect.arrayContaining([
      "https://coder.com/docs/ai-coder/agents/models",
      "https://coder.com/docs/ai-coder/agents/platform-controls/mcp-servers",
      "https://coder.com/docs/reference/api/chats",
      "https://coder.com/docs/ai-coder/agents/platform-controls/chat-debug-logging",
      "https://coder.com/docs/ai-coder/agents/platform-controls/virtual-desktop",
      "https://github.com/coder/coder/blob/6120fb59886517f7e08dc89f053b32e2371cf877/coderd/x/chatd/ARCHITECTURE.md",
      "https://github.com/coder/coder/blob/6120fb59886517f7e08dc89f053b32e2371cf877/coderd/x/chatd/chattool/mcpworkspace.go",
    ]));
    expect(caveats).toContain("isolation depends on the selected template");
    expect(caveats).toContain("experimental");
    expect(caveats).toContain("no first-class file checkpoint");
  });

  it("keeps Crush claims granular and separates delegation from safety isolation", () => {
    const crush = harnesses.find((harness) => harness.id === "crush")!;
    const urls = crush.evidence.map((source) => source.url);
    const caveats = crush.tradeoffs.join(" ");

    expect(crush.verifiedAt).toBe("2026-07-27");
    expect(crush.evidence.length).toBeGreaterThanOrEqual(18);
    expect(crush.evidence.every((source) => source.verifiedAt === crush.verifiedAt)).toBe(true);
    expect(urls).toEqual(expect.arrayContaining([
      "https://hyper.charm.land/",
      "https://github.com/charmbracelet/crush/releases/tag/v0.87.0",
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/internal/cmd/run.go",
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/internal/agent/agent_tool.go",
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/docs/hooks/README.md",
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/.github/workflows/build.yml",
    ]));
    expect(caveats).toContain("read-only search");
    expect(caveats).toContain("do not intercept tools used inside the task agent");
    expect(caveats).toContain("No first-party execution sandbox");
    expect(caveats).toContain("--yolo");
  });

  it("keeps ForgeCode claims granular and exposes the defaults a non-expert could misread", () => {
    const forgeCode = harnesses.find((harness) => harness.id === "forgecode")!;
    const urls = forgeCode.evidence.map((source) => source.url);
    const caveats = forgeCode.tradeoffs.join(" ");

    expect(forgeCode.verifiedAt).toBe("2026-07-27");
    expect(forgeCode.evidence.length).toBeGreaterThanOrEqual(20);
    expect(forgeCode.evidence.every((source) => source.verifiedAt === forgeCode.verifiedAt)).toBe(true);
    expect(urls).toEqual(expect.arrayContaining([
      "https://forgecode.dev/docs/custom-providers/",
      "https://forgecode.dev/docs/mcp-integration/",
      "https://forgecode.dev/docs/permissions/",
      "https://forgecode.dev/docs/forge-services/",
      "https://github.com/tailcallhq/forgecode/releases/tag/v2.13.19",
      "https://github.com/tailcallhq/forgecode/blob/1ca089a52fd2d11ec3b0e84fa0eba154bbb81270/crates/forge_main/src/sandbox.rs",
      "https://github.com/tailcallhq/forgecode/blob/1ca089a52fd2d11ec3b0e84fa0eba154bbb81270/crates/forge_snaps/src/service.rs",
      "https://github.com/tailcallhq/forgecode/blob/1ca089a52fd2d11ec3b0e84fa0eba154bbb81270/benchmarks/README.md",
    ]));
    expect(caveats).toContain("commands still run on the host");
    expect(caveats).toContain("Restricted permissions are off by default");
    expect(caveats).toContain("MCP tools bypass it");
    expect(caveats).toContain("rather than a project checkpoint");
    expect(forgeCode.bestFor.join(" ")).toContain("Vibe coders");
    expect(forgeCode.evidence.find((source) => source.title === "ForgeCode v2.13.19 release")?.covers)
      .toContain("current stable version is sourced from the generated release feed");
  });

  it("keeps Kilo Code claims granular and separates shipped controls from their defaults", () => {
    const kilo = harnesses.find((harness) => harness.id === "kilo-code")!;
    const urls = kilo.evidence.map((source) => source.url);
    const caveats = kilo.tradeoffs.join(" ");

    expect(kilo.verifiedAt).toBe("2026-07-27");
    expect(kilo.evidence).toHaveLength(27);
    expect(kilo.evidence.every((source) => source.verifiedAt === kilo.verifiedAt)).toBe(true);
    expect(kilo.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(kilo.classification.orchestration).toBe("delegated-subagents");
    expect(kilo.classification.isolation).toEqual(expect.arrayContaining(["os-sandbox", "managed-sandbox", "worktree"]));
    expect(featureSupportFor(kilo)).toMatchObject({ subagents: true, sandbox: true, checkpoints: true });
    expect(urls).toEqual(expect.arrayContaining([
      "https://kilo.ai/docs/customize/custom-subagents",
      "https://kilo.ai/docs/getting-started/settings/sandboxing",
      "https://kilo.ai/docs/code-with-ai/features/checkpoints",
      "https://kilo.ai/docs/code-with-ai/platforms/cli",
      "https://kilo.ai/docs/ai-providers/openai-chatgpt-plus-pro",
      "https://github.com/Kilo-Org/kilocode/releases/tag/v7.4.16",
      "https://github.com/Kilo-Org/kilocode/blob/a19d44c3ef9fd71fb15291af9c7d87906c06f056/.github/workflows/smoke-test.yml",
      "https://github.com/Kilo-Org/kilocode/blob/a19d44c3ef9fd71fb15291af9c7d87906c06f056/packages/opencode/src/kilocode/sandbox/config.ts",
      "https://blog.kilo.ai/p/kilo-sandbox-run-auto-mode-without",
      "https://kilo.ai/cli",
      "https://kilo.ai/docs/contributing/architecture/cloud-security",
    ]));
    expect(kilo.evidence.find((source) => source.title === "Kilo Code v7.4.16 release")?.covers)
      .toContain("current stable version is sourced from the generated release feed");
    expect(caveats).toContain("disabled by default");
    expect(caveats).toContain("unavailable on Windows");
    expect(caveats).toContain("rather than filesystem reads");
    expect(caveats).toContain("not a privacy boundary or a complete firewall");
    expect(caveats).toContain("disables permission prompts");
    expect(caveats).toContain("rather than backups");
    expect(caveats).toContain("separate managed Cloudflare sandbox architecture");
    expect(kilo.capabilities).toEqual({
      simplicity: 4,
      flexibility: 5,
      security: 4,
      autonomy: 4,
      automation: 5,
      largeRepo: 4,
      humanControl: 4,
    });
    expect(kilo.bestFor.join(" ")).toContain("Vibe coders");
  });

  it("keeps Mistral Vibe CLI capabilities separate from its managed web surface", () => {
    const vibe = harnesses.find((harness) => harness.id === "mistral-vibe")!;
    const urls = vibe.evidence.map((source) => source.url);
    const caveats = vibe.tradeoffs.join(" ");

    expect(vibe.verifiedAt).toBe("2026-07-31");
    expect(vibe.evidence.length).toBeGreaterThanOrEqual(24);
    expect(vibe.evidence.find((source) => source.url.endsWith("/v2.23.2"))?.verifiedAt).toBe("2026-07-31");
    expect(vibe.evidence.find((source) => source.url.includes("/tree/89350a4"))?.verifiedAt).toBe("2026-07-28");
    expect(vibe.interfaces).toEqual(expect.arrayContaining(["terminal", "ide", "automation"]));
    expect(vibe.interfaces).not.toContain("web");
    expect(vibe.providerStyle).toBe("multi-provider");
    expect(vibe.supportsSubscription).toBe(true);
    expect(featureSupportFor(vibe).localModels).toBe(true);
    expect(featureSupportFor(vibe)).toMatchObject({ mcp: true, localModels: true, subagents: true, headless: true, sandbox: false, checkpoints: true });
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.mistral.ai/vibe/code/cli/install-setup",
      "https://docs.mistral.ai/vibe/code/safety-approvals-permissions",
      "https://docs.mistral.ai/vibe/code/cli/offline-models",
      "https://docs.mistral.ai/vibe/code/vibe-code-web/sandbox-environment",
      "https://github.com/mistralai/mistral-vibe/releases/tag/v2.22.0",
      "https://github.com/mistralai/mistral-vibe/releases/tag/v2.23.0",
      "https://github.com/mistralai/mistral-vibe/releases/tag/v2.23.2",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/vibe/core/config/vibe_schema.py",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/vibe/core/rewind/manager.py",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/.github/workflows/ci.yml",
    ]));
    expect(caveats).toContain("local CLI executes on the host");
    expect(caveats).toContain("separate surface");
    expect(caveats).toContain("enabled by default");
    expect(caveats).toContain("release-level evidence until a fresh source audit");
    expect(caveats).toContain("no built-in browser automation");
    expect(vibe.bestFor.join(" ")).toContain("Vibe coders");
    expect(vibe.discovery?.at(0)?.note).toContain("modified Mistral Vibe fork");
    expect(vibe.discovery?.at(0)?.note).toContain("no score is imported");
  });

  it("keeps Plandex researchable while excluding its dormant deployment path", () => {
    const plandex = harnesses.find((harness) => harness.id === "plandex")!;
    const urls = plandex.evidence.map((source) => source.url);
    const caveats = plandex.tradeoffs.join(" ");

    expect(plandex.status).toBe("dormant");
    expect(plandex.verifiedAt).toBe("2026-07-27");
    expect(plandex.evidence.length).toBeGreaterThanOrEqual(24);
    expect(plandex.evidence.every((source) => source.verifiedAt === plandex.verifiedAt)).toBe(true);
    expect(plandex.interfaces).toEqual(expect.arrayContaining(["terminal", "automation"]));
    expect(plandex.providerStyle).toBe("multi-provider");
    expect(plandex.supportsSubscription).toBe(true);
    expect(featureSupportFor(plandex).localModels).toBe(true);
    expect(featureSupportFor(plandex)).toMatchObject({
      mcp: false,
      localModels: true,
      subagents: false,
      headless: true,
      browser: true,
      sandbox: false,
      checkpoints: true,
    });
    expect(urls).toEqual(expect.arrayContaining([
      "https://github.com/plandex-ai/plandex/releases/tag/cli%2Fv2.2.1",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/docs/docs/core-concepts/autonomy.md",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/docs/docs/core-concepts/execution-and-debugging.md",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/docs/docs/models/claude-subscription.md",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/docs/docs/models/ollama.md",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/app/cli/lib/apply_cgroup_linux.go",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/app/cli/cmd/browser.go",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/test/evals/promptfoo-poc/README.md",
    ]));
    expect(caveats).toContain("no later commit");
    expect(caveats).toContain("falls back to no isolation");
    expect(caveats).toContain("potentially destructive commands");
    expect(caveats).toContain("no documented CI contract");
    expect(caveats).toContain("no independent Plandex benchmark");
    expect(caveats).toContain("all-local pack is experimental");
  });

  it("keeps Stagewise browser, recovery, and parallelism claims within the shipped desktop product", () => {
    const stagewise = harnesses.find((harness) => harness.id === "stagewise")!;
    const urls = stagewise.evidence.map((source) => source.url);
    const caveats = stagewise.tradeoffs.join(" ");

    expect(stagewise.status).toBe("active");
    expect(stagewise.verifiedAt).toBe("2026-07-27");
    expect(stagewise.evidence.length).toBeGreaterThanOrEqual(24);
    expect(stagewise.evidence.every((source) => source.verifiedAt === stagewise.verifiedAt)).toBe(true);
    expect(stagewise.interfaces).toEqual(["ide", "web"]);
    expect(featureSupportFor(stagewise)).toMatchObject({
      mcp: false,
      localModels: true,
      subagents: true,
      headless: false,
      browser: true,
      sandbox: false,
      checkpoints: true,
    });
    expect(stagewise.capabilities.automation).toBe(1);
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.stagewise.io/core-concepts/browser-and-agent.md",
      "https://docs.stagewise.io/core-concepts/diff-review.md",
      "https://docs.stagewise.io/core-concepts/workspaces.md",
      "https://docs.stagewise.io/reference/custom-providers.md",
      "https://github.com/stagewise-io/stagewise/releases/tag/stagewise%401.25.0",
      "https://github.com/stagewise-io/stagewise/blob/cb38225c2b0de27e85c10f26ed46123f487fb6f8/packages/agent-core/src/types/tool-approval.ts",
      "https://github.com/stagewise-io/stagewise/blob/cb38225c2b0de27e85c10f26ed46123f487fb6f8/apps/stagewise-cli/README.md",
      "https://github.com/stagewise-io/stagewise/blob/cb38225c2b0de27e85c10f26ed46123f487fb6f8/.agents/skills/copywriting/evals/evals.json",
    ]));
    expect(stagewise.evidence.find((source) => source.title === "Stagewise 1.25.0 release")?.covers)
      .toContain("current stable version is sourced from the generated release feed");
    expect(caveats).toContain("host filesystem");
    expect(caveats).toContain("private smoke-test CLI");
    expect(caveats).toContain("separate top-level agent sessions");
    expect(caveats).toContain("No shipped MCP integration");
    expect(caveats).toContain("87.6% average cache-hit rate");
    expect(caveats).toContain("no independent Stagewise harness benchmark");
  });

  it("keeps Zoo Code's shipped extension separate from its private inherited CLI", () => {
    const zoo = harnesses.find((harness) => harness.id === "zoo-code")!;
    const urls = zoo.evidence.map((source) => source.url);
    const caveats = zoo.tradeoffs.join(" ");

    expect(zoo.verifiedAt).toBe("2026-08-10");
    expect(zoo.evidence.length).toBeGreaterThanOrEqual(24);
    expect(zoo.evidence.find((source) => source.url.endsWith("/v3.76.0"))?.verifiedAt).toBe(zoo.verifiedAt);
    expect(zoo.evidence.find((source) => source.url.includes("/blob/d27153a"))?.verifiedAt).toBe("2026-07-27");
    expect(zoo.interfaces).toEqual(["ide"]);
    expect(zoo.classification.isolation).toEqual(["worktree"]);
    expect(featureSupportFor(zoo)).toMatchObject({
      mcp: true,
      localModels: true,
      subagents: true,
      headless: false,
      browser: false,
      sandbox: false,
      checkpoints: true,
    });
    expect(zoo.capabilities).toMatchObject({ automation: 1, autonomy: 4, largeRepo: 4, humanControl: 4 });
    expect(urls).toEqual(expect.arrayContaining([
      "https://www.zoocode.dev/",
      "https://docs.zoocode.dev/features/codebase-indexing",
      "https://docs.zoocode.dev/features/checkpoints",
      "https://docs.zoocode.dev/features/worktrees",
      "https://docs.zoocode.dev/features/message-queueing",
      "https://github.com/Zoo-Code-Org/Zoo-Code/releases/tag/v3.72.0",
      "https://github.com/Zoo-Code-Org/Zoo-Code/releases/tag/v3.76.0",
      "https://github.com/Zoo-Code-Org/Zoo-Code/blob/d27153a251d2051b6a8e73d305b06ffbc5ac6970/src/core/tools/NewTaskTool.ts",
      "https://github.com/Zoo-Code-Org/Zoo-Code/blob/d27153a251d2051b6a8e73d305b06ffbc5ac6970/apps/cli/package.json",
    ]));
    expect(caveats).toContain("host permissions");
    expect(caveats).toContain("implicitly approves");
    expect(caveats).toContain("not created before commands");
    expect(caveats).toContain("sole active task");
    expect(caveats).toContain("no Zoo-owned CLI release asset");
    expect(caveats).toContain("No built-in browser controller");
    expect(caveats).toContain("no coding-harness evaluation suite");
  });

  it("records the current source corrections for Letta, Command Code, Copilot, Cursor, Junie, and Kimi", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));
    const urlsFor = (id: string) => byId.get(id)!.evidence.map((source) => source.url);

    const letta = byId.get("letta-code")!;
    expect(letta.summary).not.toContain("hooks");
    expect(letta.tradeoffs.join(" ")).toContain("starts in unrestricted mode");
    expect(letta.evidence.find((source) => source.title === "Letta Code 0.29.9 strict-mode release")?.covers)
      .toContain("current stable version comes from the generated release feed");
    expect(urlsFor("letta-code")).toEqual(expect.arrayContaining([
      "https://docs.letta.com/concepts/memfs",
      "https://docs.letta.com/configuration/permissions",
      "https://docs.letta.com/platform/computers/cloud-sandboxes",
      "https://docs.letta.com/configuration/subagents",
      "https://docs.letta.com/platform/cli/headless",
      "https://docs.letta.com/configuration/schedules",
    ]));

    expect(urlsFor("command-code")).toEqual(expect.arrayContaining([
      "https://commandcode.ai/docs/hooks",
      "https://commandcode.ai/docs/skills",
    ]));
    expect(urlsFor("copilot-cli")).toEqual(expect.arrayContaining([
      "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot",
      "https://docs.github.com/en/copilot/concepts/agents/hooks",
      "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview",
      "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents",
      "https://docs.github.com/en/copilot/reference/hooks-reference",
      "https://github.com/github/copilot-cli/releases/tag/v1.0.77",
      "https://github.com/github/copilot-cli/releases/tag/v1.0.78",
    ]));
    expect(byId.get("copilot-cli")!.tradeoffs.join(" ")).toContain("whose contents still match its last write");
    expect(byId.get("copilot-cli")!.tradeoffs.join(" ")).toContain("forceRemoteSettingsRefresh");
    expect(urlsFor("cursor-cli")).toContain(
      "https://github.com/cursor/cursor/tree/654b1b4775ca67aef473bd31a14c8c04a1abde2d",
    );
    expect(urlsFor("junie-cli")).toEqual(expect.arrayContaining([
      "https://junie.jetbrains.com/docs/junie-cli-remote-mode.html",
      "https://junie.jetbrains.com/docs/agent-skills.html",
      "https://junie.jetbrains.com/docs/junie-cli-configuration.html",
      "https://junie.jetbrains.com/docs/junie-cli-hooks.html",
      "https://junie.jetbrains.com/docs/junie-cli-acp.html",
      "https://github.com/JetBrains/junie/tree/9b3fe80b5779f0fc0f9b0ee4eeba50cc071948a5",
      "https://github.com/JetBrains/junie/releases/tag/2518.1",
    ]));
    expect(byId.get("junie-cli")!.tradeoffs.join(" ")).toContain("machine must remain awake");
    expect(byId.get("junie-cli")!.tradeoffs.join(" ")).toContain("disabled rollout toggle");
    expect(urlsFor("cline")).toEqual(expect.arrayContaining([
      "https://docs.cline.bot/sdk/plugins",
      "https://docs.cline.bot/customization/plugins",
      "https://docs.cline.bot/enterprise-solutions/configuration/infrastructure-configuration/control-other-cline-features/mcp-server-controls",
      "https://docs.cline.bot/enterprise-solutions/configuration/infrastructure-configuration/control-other-cline-features/yolo-mode",
      "https://github.com/cline/cline/releases/tag/v4.1.0",
      "https://github.com/cline/cline/releases/tag/v4.1.3",
      "https://github.com/cline/cline/releases/tag/v4.1.7",
    ]));
    expect(byId.get("cline")!.verifiedAt).toBe("2026-08-10");
    expect(byId.get("cline")!.evidence.find((source) => source.url.endsWith("/v4.1.3"))?.verifiedAt)
      .toBe("2026-08-02");
    expect(byId.get("cline")!.evidence.find((source) => source.url.endsWith("/v4.1.7"))?.verifiedAt)
      .toBe("2026-08-10");
    expect(byId.get("cline")!.tradeoffs.join(" ")).toContain("staged remote rollout");
    expect(urlsFor("kimi-code")).toEqual(expect.arrayContaining([
      "https://github.com/MoonshotAI/kimi-code/tree/8a45f10eddbb35c317047e82e567cdb59a220b4f",
      "https://github.com/MoonshotAI/kimi-code/releases/tag/%40moonshot-ai%2Fkimi-code%400.29.2",
      "https://github.com/MoonshotAI/kimi-code/releases/tag/%40moonshot-ai%2Fkimi-code%400.34.0",
      "https://moonshotai.github.io/kimi-code/en/customization/skills",
      "https://moonshotai.github.io/kimi-code/en/customization/agents",
      "https://moonshotai.github.io/kimi-code/en/customization/mcp",
      "https://moonshotai.github.io/kimi-code/en/customization/plugins.html",
      "https://moonshotai.github.io/kimi-code/en/configuration/data-locations.html",
      "https://moonshotai.github.io/kimi-code/en/configuration/env-vars.html",
    ]));
    expect(byId.get("kimi-code")!.tradeoffs.join(" ")).toContain("system-prompt instructions");
    expect(byId.get("kimi-code")!.verifiedAt).toBe("2026-08-10");
    expect(featureSupportFor(byId.get("kimi-code"))).toMatchObject({ browser: true });
  });

  it("keeps every product logo local and traceable to a first-party asset", () => {
    for (const harness of harnesses) {
      expect(isValidVerificationDate(harness.logo.verifiedAt)).toBe(true);
      expect(new URL(harness.logo.sourceUrl).hostname).toBe(firstPartyLogoHosts[harness.id]);
      expect(harness.logo.src).toMatch(/^\/harnesses\//);
      expect(existsSync(join(process.cwd(), "public", harness.logo.src.replace(/^\//, "")))).toBe(true);
    }
  });
});
