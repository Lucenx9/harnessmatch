import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { harnesses } from "../src/data/harnesses";

const firstPartyHosts: Record<string, string[]> = {
  "claude-code": ["code.claude.com", "claude.com", "www.anthropic.com", "github.com"],
  codex: ["developers.openai.com", "github.com"],
  opencode: ["opencode.ai", "github.com"],
  pi: ["github.com", "pi.dev"],
  omp: ["github.com", "omp.sh"],
  "grok-build": ["docs.x.ai", "github.com", "x.ai"],
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
  "mini-swe-agent": ["github.com", "mini-swe-agent.com"],
  amp: ["ampcode.com"],
  "kiro-cli": ["kiro.dev"],
  "poolside-cli": ["docs.poolside.ai", "github.com"],
  plandex: ["github.com"],
};

const firstPartyLogoHosts: Record<string, string> = {
  "claude-code": "code.claude.com",
  codex: "developers.openai.com",
  opencode: "github.com",
  pi: "pi.dev",
  omp: "omp.sh",
  "grok-build": "media.x.ai",
  aider: "aider.chat",
  openhands: "github.com",
  goose: "github.com",
  cline: "github.com",
  "gemini-cli": "github.com",
  "antigravity-cli": "github.com",
  "copilot-cli": "github.com",
  "cursor-cli": "cursor.com",
  "junie-cli": "junie.jetbrains.com",
  "factory-droid": "docs.factory.ai",
  forgecode: "forgecode.dev",
  "qwen-code": "qwenlm.github.io",
  "continue-cli": "github.com",
  "mistral-vibe": "github.com",
  "kimi-code": "github.com",
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
  "mini-swe-agent": "github.com",
  amp: "ampcode.com",
  "kiro-cli": "kiro.dev",
  "poolside-cli": "github.com",
  plandex: "github.com",
};

describe("harness evidence ledger", () => {
  it("keeps every capability profile backed by multiple current sources", () => {
    for (const harness of harnesses) {
      expect(harness.evidence.length).toBeGreaterThanOrEqual(2);
      expect(harness.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      for (const source of harness.evidence) {
        expect(source.verifiedAt).toBe(harness.verifiedAt);
        expect(source.covers.length).toBeGreaterThan(12);
        expect(firstPartyHosts[harness.id]).toContain(new URL(source.url).hostname);
      }
    }
  });

  it("records the source-audited capability corrections", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));

    expect(byId.get("claude-code")?.features.sandbox).toBe(true);
    expect(byId.get("claude-code")?.classification.isolation).toEqual(expect.arrayContaining(["os-sandbox", "worktree", "managed-sandbox"]));
    expect(byId.get("claude-code")?.classification.state).toBe("persistent-memory");
    expect(byId.get("claude-code")?.capabilities.security).toBe(4);
    expect(byId.get("codex")?.localModels).toBe(true);
    expect(byId.get("codex")?.providerStyle).toBe("multi-provider");
    expect(byId.get("codex")?.classification).toMatchObject({
      runtime: "sandbox-first",
      isolation: expect.arrayContaining(["os-sandbox", "worktree", "managed-sandbox"]),
      state: "persistent-memory",
    });
    expect(byId.get("opencode")?.features.checkpoints).toBe(true);
    expect(byId.get("opencode")?.features.sandbox).toBe(false);
    expect(byId.get("opencode")?.capabilities.security).toBe(3);
    expect(byId.get("pi")?.features.sandbox).toBe(false);
    expect(byId.get("pi")?.features.subagents).toBe(false);
    expect(byId.get("pi")?.classification).toMatchObject({ runtime: "host-first", isolation: [], state: "session-based" });
    expect(byId.get("omp")?.features.browser).toBe(true);
    expect(byId.get("omp")?.features.sandbox).toBe(false);
    expect(byId.get("omp")?.features.checkpoints).toBe(false);
    expect(byId.get("omp")?.classification).toMatchObject({ isolation: ["worktree"], state: "persistent-memory" });
    expect(byId.get("omp")?.capabilities.humanControl).toBe(3);
    expect(byId.get("grok-build")?.features.sandbox).toBe(true);
    expect(byId.get("grok-build")?.features.checkpoints).toBe(true);
    expect(byId.get("grok-build")?.classification).toMatchObject({
      isolation: expect.arrayContaining(["os-sandbox", "worktree"]),
      state: "persistent-memory",
    });
    expect(byId.get("aider")?.supportsSubscription).toBe(true);
    expect(byId.get("aider")?.interfaces).toEqual(expect.arrayContaining(["web", "automation"]));
    expect(byId.get("openhands")?.supportsSubscription).toBe(true);
    expect(byId.get("openhands")?.classification.state).toBe("persistent-memory");
    expect(byId.get("cline")?.classification.isolation).toEqual(["worktree"]);
    expect(byId.get("cline")?.features.sandbox).toBe(false);
    expect(byId.get("cline")?.capabilities).toMatchObject({ security: 3, autonomy: 5 });
    expect(byId.get("gemini-cli")?.features.sandbox).toBe(true);
    expect(byId.get("gemini-cli")?.features.checkpoints).toBe(true);
    expect(byId.get("gemini-cli")?.features.browser).toBe(true);
    expect(byId.get("gemini-cli")?.classification.state).toBe("persistent-memory");
    expect(byId.get("gemini-cli")?.capabilities.security).toBe(4);
    expect(byId.get("gemini-cli")?.supportsSubscription).toBe(false);
    expect(byId.get("gemini-cli")?.supportsEnterpriseAccess).toBe(true);
    expect(byId.get("antigravity-cli")?.providerStyle).toBe("multi-provider");
    expect(byId.get("antigravity-cli")?.supportsSubscription).toBe(true);
    expect(byId.get("antigravity-cli")?.supportsEnterpriseAccess).toBe(true);
    expect(byId.get("antigravity-cli")?.features).toMatchObject({
      mcp: true,
      subagents: true,
      headless: true,
      browser: true,
      sandbox: true,
      checkpoints: false,
    });
    expect(byId.get("copilot-cli")?.features.subagents).toBe(true);
    expect(byId.get("copilot-cli")?.localModels).toBe(true);
    expect(byId.get("copilot-cli")?.classification.state).toBe("persistent-memory");
    expect(byId.get("cursor-cli")?.features.subagents).toBe(true);
    expect(byId.get("cursor-cli")?.features.sandbox).toBe(true);
    expect(byId.get("cursor-cli")?.features.checkpoints).toBe(true);
    expect(byId.get("cursor-cli")?.classification.isolation).toEqual(expect.arrayContaining(["os-sandbox", "worktree"]));
    expect(byId.get("junie-cli")?.localModels).toBe(true);
    expect(byId.get("junie-cli")?.features.sandbox).toBe(false);
    expect(byId.get("junie-cli")?.interfaces).toContain("web");
    expect(byId.get("factory-droid")?.features.browser).toBe(true);
    expect(byId.get("factory-droid")?.features.sandbox).toBe(true);
    expect(byId.get("factory-droid")?.features.checkpoints).toBe(true);
    expect(byId.get("factory-droid")?.classification.isolation).toEqual(expect.arrayContaining(["os-sandbox", "worktree"]));
    expect(byId.get("forgecode")?.localModels).toBe(true);
    expect(byId.get("forgecode")?.features.sandbox).toBe(false);
    expect(byId.get("forgecode")?.features.checkpoints).toBe(false);
    expect(byId.get("forgecode")?.capabilities.security).toBe(2);
    expect(byId.get("qwen-code")?.features.sandbox).toBe(true);
    expect(byId.get("qwen-code")?.features.subagents).toBe(true);
    expect(byId.get("qwen-code")?.features.browser).toBe(true);
    expect(byId.get("qwen-code")?.features.checkpoints).toBe(true);
    expect(byId.get("qwen-code")?.classification.state).toBe("persistent-memory");
    expect(byId.get("qwen-code")?.capabilities.security).toBe(4);
    expect(byId.get("continue-cli")?.features.subagents).toBe(false);
    expect(byId.get("continue-cli")?.features.sandbox).toBe(false);
    expect(byId.get("continue-cli")?.status).toBe("archived");
    expect(byId.get("mistral-vibe")?.providerStyle).toBe("multi-provider");
    expect(byId.get("mistral-vibe")?.supportsSubscription).toBe(true);
    expect(byId.get("mistral-vibe")?.localModels).toBe(true);
    expect(byId.get("mistral-vibe")?.features.sandbox).toBe(false);
    expect(byId.get("mistral-vibe")?.features.checkpoints).toBe(true);
    expect(byId.get("kimi-code")?.features.subagents).toBe(true);
    expect(byId.get("kimi-code")?.features.sandbox).toBe(false);
    expect(byId.get("letta-code")?.features.sandbox).toBe(true);
    expect(byId.get("letta-code")?.classification.runtime).toBe("host-first");
    expect(byId.get("letta-code")?.classification.isolation).toContain("managed-sandbox");
    expect(byId.get("letta-code")?.classification.state).toBe("persistent-memory");
    expect(byId.get("command-code")?.features.subagents).toBe(true);
    expect(byId.get("command-code")?.features.sandbox).toBe(false);
    expect(byId.get("command-code")?.classification.state).toBe("persistent-memory");
    expect(byId.get("codebuff")?.license).toContain("Apache-2.0");
    expect(byId.get("codebuff")?.providerStyle).toBe("multi-provider");
    expect(byId.get("codebuff")?.features.browser).toBe(true);
    expect(byId.get("codebuff")?.features.sandbox).toBe(false);
    expect(byId.get("crush")?.license).toBe("FSL-1.1-MIT");
    expect(byId.get("crush")?.supportsSubscription).toBe(true);
    expect(byId.get("crush")?.features.subagents).toBe(true);
    expect(byId.get("crush")?.features.headless).toBe(true);
    expect(byId.get("crush")?.interfaces).toContain("automation");
    expect(byId.get("mux")?.supportsSubscription).toBe(true);
    expect(byId.get("mux")?.localModels).toBe(true);
    expect(byId.get("mux")?.features.localModels).toBe(true);
    expect(byId.get("mux")?.features.browser).toBe(false);
    expect(byId.get("mux")?.classification.state).toBe("persistent-memory");
    expect(byId.get("coder-agents")?.features.mcp).toBe(true);
    expect(byId.get("coder-agents")?.features.browser).toBe(true);
    expect(byId.get("coder-agents")?.features.sandbox).toBe(true);
    expect(byId.get("zoo-code")?.features.checkpoints).toBe(true);
    expect(byId.get("zcode")?.interfaces).toContain("automation");
    expect(byId.get("zcode")?.features).toMatchObject({
      subagents: true,
      headless: false,
      browser: true,
      sandbox: true,
      checkpoints: true,
    });
    expect(byId.get("stagewise")?.localModels).toBe(true);
    expect(byId.get("hermes-agent")?.classification.state).toBe("persistent-memory");
    expect(byId.get("hermes-agent")?.interfaces).toEqual(expect.arrayContaining(["terminal", "ide", "web", "automation"]));
    expect(byId.get("hermes-agent")?.features.checkpoints).toBe(true);
  });

  it("separates Gemini CLI enterprise continuity from the Antigravity consumer successor", () => {
    const gemini = harnesses.find((harness) => harness.id === "gemini-cli")!;
    const antigravity = harnesses.find((harness) => harness.id === "antigravity-cli")!;
    const antigravityUrls = antigravity.evidence.map((source) => source.url);
    const caveats = antigravity.tradeoffs.join(" ");

    expect(gemini.status).toBe("active");
    expect(gemini.tradeoffs.join(" ")).toContain("June 18, 2026");
    expect(gemini.evidence.map((source) => source.url)).toContain(
      "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/",
    );
    expect(antigravity.verifiedAt).toBe("2026-07-27");
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
      "https://github.com/google-antigravity/antigravity-cli/releases/tag/1.1.7",
    ]));
    expect(caveats).toContain("sandboxing is available but off by default");
    expect(caveats).toContain("not the local Git checkout");
    expect(caveats).toContain("Telemetry is enabled by default");
    expect(caveats).toContain("does not expose the core harness source");
  });

  it("qualifies Claude Code's broad automation surface against its local defaults", () => {
    const claude = harnesses.find((harness) => harness.id === "claude-code")!;
    const urls = claude.evidence.map((source) => source.url);
    const caveats = claude.tradeoffs.join(" ");

    expect(claude.verifiedAt).toBe("2026-07-27");
    expect(claude.evidence).toHaveLength(56);
    expect(claude.evidence.every((source) => source.verifiedAt === claude.verifiedAt)).toBe(true);
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

    expect(codex.verifiedAt).toBe("2026-07-27");
    expect(codex.evidence).toHaveLength(46);
    expect(codex.evidence.every((source) => source.verifiedAt === codex.verifiedAt)).toBe(true);
    expect(codex.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(codex.features).toMatchObject({ mcp: true, localModels: true, subagents: true, headless: true, browser: true, sandbox: true, checkpoints: false });
    expect(urls).toEqual(expect.arrayContaining([
      "https://developers.openai.com/codex/agent-approvals-security",
      "https://developers.openai.com/codex/sandboxing",
      "https://developers.openai.com/codex/sandboxing/auto-review",
      "https://developers.openai.com/codex/permissions",
      "https://developers.openai.com/codex/permission-modes",
      "https://developers.openai.com/codex/agent-configuration/rules",
      "https://developers.openai.com/codex/agent-configuration/subagents",
      "https://developers.openai.com/codex/agent-configuration/agents-md",
      "https://developers.openai.com/codex/customization/memories",
      "https://developers.openai.com/codex/environments/local-environment",
      "https://developers.openai.com/codex/environments/cloud-environment",
      "https://developers.openai.com/codex/environments/git-worktrees",
      "https://developers.openai.com/codex/windows/windows-sandbox",
      "https://developers.openai.com/codex/app",
      "https://developers.openai.com/codex/auth",
      "https://developers.openai.com/codex/remote-connections",
      "https://developers.openai.com/codex/hooks",
      "https://developers.openai.com/codex/skills-and-plugins",
      "https://developers.openai.com/codex/plugins",
      "https://developers.openai.com/codex/automations",
      "https://developers.openai.com/codex/code-review",
      "https://developers.openai.com/codex/third-party/github",
      "https://developers.openai.com/codex/security",
      "https://developers.openai.com/codex/enterprise/admin-setup",
      "https://developers.openai.com/codex/amazon-bedrock",
      "https://developers.openai.com/codex/feature-maturity",
      "https://developers.openai.com/codex/whats-new",
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

    expect(openCode.verifiedAt).toBe("2026-07-27");
    expect(openCode.evidence).toHaveLength(25);
    expect(openCode.evidence.every((source) => source.verifiedAt === openCode.verifiedAt)).toBe(true);
    expect(openCode.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(openCode.classification).toMatchObject({ runtime: "host-first", isolation: [], state: "session-based" });
    expect(urls).toEqual(expect.arrayContaining([
      "https://opencode.ai/docs/permissions",
      "https://opencode.ai/docs/agents/",
      "https://opencode.ai/docs/server",
      "https://opencode.ai/docs/github",
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

    expect(pi.verifiedAt).toBe("2026-07-27");
    expect(pi.evidence.length).toBeGreaterThanOrEqual(18);
    expect(pi.evidence.every((source) => source.verifiedAt === pi.verifiedAt)).toBe(true);
    expect(pi.features).toMatchObject({ mcp: false, subagents: false, browser: false, sandbox: false, checkpoints: false });
    expect(urls).toEqual(expect.arrayContaining([
      "https://pi.dev/docs/latest/security",
      "https://pi.dev/docs/latest/sessions",
      "https://pi.dev/docs/latest/rpc",
      "https://pi.dev/docs/latest/sdk",
      "https://github.com/earendil-works/pi/tree/b4f293684bba718d59cc1157679bcf6157b3a7f5/packages/evals",
    ]));
    expect(caveats).toContain("project trust only gates project extensions");
    expect(caveats).toContain("do not roll back files");
    expect(caveats).toContain("not an independent product benchmark");
  });

  it("records OMP's batteries-included surface without calling context rewind a file checkpoint", () => {
    const omp = harnesses.find((harness) => harness.id === "omp")!;
    const urls = omp.evidence.map((source) => source.url);
    const caveats = omp.tradeoffs.join(" ");

    expect(omp.verifiedAt).toBe("2026-07-27");
    expect(omp.evidence.length).toBeGreaterThanOrEqual(14);
    expect(omp.evidence.every((source) => source.verifiedAt === omp.verifiedAt)).toBe(true);
    expect(omp.features).toMatchObject({ mcp: true, subagents: true, browser: true, sandbox: false, checkpoints: false });
    expect(urls).toEqual(expect.arrayContaining([
      "https://github.com/can1357/oh-my-pi/blob/f8dbb3669fe31512be748f73de5b9a163151d278/docs/approval-mode.md",
      "https://github.com/can1357/oh-my-pi/blob/f8dbb3669fe31512be748f73de5b9a163151d278/docs/tools/task.md",
      "https://github.com/can1357/oh-my-pi/blob/f8dbb3669fe31512be748f73de5b9a163151d278/docs/tools/checkpoint.md",
      "https://github.com/can1357/oh-my-pi/blob/f8dbb3669fe31512be748f73de5b9a163151d278/docs/memory.md",
    ]));
    expect(caveats).toContain("subagents also run yolo");
    expect(caveats).toContain("prune conversation context only");
    expect(caveats).toContain("no score is imported");
  });

  it("pins Grok Build's optional isolation and beta source boundary", () => {
    const grokBuild = harnesses.find((harness) => harness.id === "grok-build")!;
    const urls = grokBuild.evidence.map((source) => source.url);
    const caveats = grokBuild.tradeoffs.join(" ");

    expect(grokBuild.verifiedAt).toBe("2026-07-27");
    expect(grokBuild.evidence).toHaveLength(24);
    expect(grokBuild.evidence.every((source) => source.verifiedAt === grokBuild.verifiedAt)).toBe(true);
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
      "https://github.com/xai-org/grok-build/tree/b41c75a578f98bddbd326ab02cd53618451d97ee",
    ]));
    expect(caveats).toContain("OS sandbox is off by default");
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

    expect(openHands.verifiedAt).toBe("2026-07-27");
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

    expect(factory.verifiedAt).toBe("2026-07-27");
    expect(factory.evidence).toHaveLength(15);
    expect(factory.evidence.every((source) => source.verifiedAt === factory.verifiedAt)).toBe(true);
    expect(factory.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.factory.ai/cli/configuration/settings",
      "https://docs.factory.ai/cli/configuration/mcp",
      "https://docs.factory.ai/changelog/release-notes",
    ]));
    expect(caveats).toContain("Beta OS sandbox is opt-in");
    expect(caveats).toContain("cloudSessionSync");
    expect(caveats).toContain("enabled by default");
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
    expect(letta.verifiedAt).toBe("2026-07-27");
    expect(letta.evidence).toHaveLength(23);
    expect(letta.evidence.every((source) => source.verifiedAt === letta.verifiedAt)).toBe(true);
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
    ]));
    expect(caveats).toContain("starts in unrestricted mode");
    expect(caveats).toContain("recommends skills instead of MCP");
    expect(caveats).toContain("fully trusted code inside the harness process");
    expect(letta.features).toMatchObject({ mcp: true, subagents: true, headless: true, sandbox: true, checkpoints: false });
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

    expect(zcode.verifiedAt).toBe("2026-07-27");
    expect(zcode.evidence.length).toBeGreaterThanOrEqual(15);
    expect(zcode.evidence.every((source) => source.verifiedAt === zcode.verifiedAt)).toBe(true);
    expect(urls).toEqual(expect.arrayContaining([
      "https://zcode.z.ai/en/docs/goal",
      "https://zcode.z.ai/en/docs/subagents",
      "https://zcode.z.ai/en/docs/safety-confirm",
      "https://zcode.z.ai/en/docs/remote-development",
      "https://zcode.z.ai/en/docs/hooks",
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

  it("keeps mini-SWE-agent minimal without overstating confirmation as full control", () => {
    const mini = harnesses.find((harness) => harness.id === "mini-swe-agent")!;
    const urls = mini.evidence.map((source) => source.url);
    const caveats = mini.tradeoffs.join(" ");

    expect(mini.verifiedAt).toBe("2026-07-27");
    expect(mini.evidence.length).toBeGreaterThanOrEqual(20);
    expect(mini.evidence.every((source) => source.verifiedAt === mini.verifiedAt)).toBe(true);
    expect(mini.capabilities.humanControl).toBe(3);
    expect(mini.features).toMatchObject({ mcp: false, subagents: false, browser: false, sandbox: true, checkpoints: false });
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

    expect(amp.verifiedAt).toBe("2026-07-27");
    expect(amp.evidence.length).toBeGreaterThanOrEqual(18);
    expect(amp.evidence.every((source) => source.verifiedAt === amp.verifiedAt)).toBe(true);
    expect(amp.classification).toMatchObject({ runtime: "host-first", isolation: ["managed-sandbox"], state: "session-based" });
    expect(amp.features).toMatchObject({ sandbox: true, checkpoints: false, headless: true, subagents: true, browser: true });
    expect(amp.capabilities).toMatchObject({ security: 3, largeRepo: 4, humanControl: 3 });
    expect(urls).toEqual(expect.arrayContaining([
      "https://ampcode.com/manual#orbs",
      "https://ampcode.com/manual#permissions",
      "https://ampcode.com/manual#schedules",
      "https://ampcode.com/manual/plugin-api",
      "https://ampcode.com/manual/sdk/typescript",
      "https://ampcode.com/security",
      "https://ampcode.com/news/agents-anywhere",
    ]));
    expect(caveats).toContain("without approval by default");
    expect(caveats).toContain("paid managed cloud sandboxes");
    expect(caveats).toContain("No harness checkpoint or file rollback");
    expect(caveats).toContain("not self-hostable");
  });

  it("keeps Kiro 2.x stable capabilities separate from the opt-in v3 harness", () => {
    const kiro = harnesses.find((harness) => harness.id === "kiro-cli")!;
    const urls = kiro.evidence.map((source) => source.url);
    const caveats = kiro.tradeoffs.join(" ");

    expect(kiro.verifiedAt).toBe("2026-07-27");
    expect(kiro.evidence).toHaveLength(21);
    expect(kiro.evidence.every((source) => source.verifiedAt === kiro.verifiedAt)).toBe(true);
    expect(kiro.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(kiro.features).toMatchObject({ headless: true, subagents: true, mcp: true, checkpoints: true, sandbox: false });
    expect(kiro.capabilities.automation).toBe(4);
    expect(urls).toEqual(expect.arrayContaining([
      "https://kiro.dev/changelog/cli/2-14/",
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

    expect(pool.verifiedAt).toBe("2026-07-27");
    expect(pool.evidence.length).toBeGreaterThanOrEqual(18);
    expect(pool.evidence.every((source) => source.verifiedAt === pool.verifiedAt)).toBe(true);
    expect(pool.providerStyle).toBe("multi-provider");
    expect(pool.localModels).toBe(true);
    expect(pool.features).toMatchObject({ localModels: true, sandbox: true, checkpoints: false, subagents: false });
    expect(pool.classification.isolation).toEqual(expect.arrayContaining(["container", "managed-sandbox", "worktree"]));
    expect(pool.capabilities).toMatchObject({ flexibility: 5, security: 4, automation: 4, humanControl: 4 });
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.poolside.ai/cli/interactive-mode",
      "https://docs.poolside.ai/settings-file-reference",
      "https://docs.poolside.ai/sandboxes",
      "https://github.com/poolsideai/pool/releases/tag/v1.0.13",
      "https://github.com/poolsideai/pool/blob/39e9094bd5d49d2dc4df780753cc6da37fc88eb6/README.md",
    ]));
    expect(caveats).toContain("local environment is enabled by default");
    expect(caveats).toContain("Remote HTTP or SSE MCP servers");
    expect(caveats).toContain("does not restore files");
    expect(caveats).toContain("v1.0.13 tag points to a tree whose changelog still says 1.0.12");
  });

  it("keeps goose claims granular and qualifies its default execution posture", () => {
    const goose = harnesses.find((harness) => harness.id === "goose")!;
    const urls = goose.evidence.map((source) => source.url);
    const caveats = goose.tradeoffs.join(" ");

    expect(goose.verifiedAt).toBe("2026-07-27");
    expect(goose.evidence).toHaveLength(19);
    expect(goose.evidence.every((source) => source.verifiedAt === goose.verifiedAt)).toBe(true);
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
      "https://github.com/aaif-goose/goose/security/advisories/GHSA-r5pp-p5r8-466r",
    ]));
    expect(caveats).toContain("user privileges by default");
    expect(caveats).toContain("specific to goose Desktop on macOS");
    expect(caveats).toContain("fails open");
    expect(caveats).toContain("configured classifier endpoint");
    expect(caveats).toContain("before 1.44.0");
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

    expect(cursor.verifiedAt).toBe("2026-07-27");
    expect(cursor.evidence).toHaveLength(15);
    expect(cursor.evidence.every((source) => source.verifiedAt === cursor.verifiedAt)).toBe(true);
    expect(cursor.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://cursor.com/docs/cli/installation",
      "https://cursor.com/docs/cli/using",
      "https://cursor.com/docs/cli/mcp",
      "https://cursor.com/docs/cli/shell-mode",
      "https://cursor.com/docs/cli/reference/authentication",
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

    expect(command.verifiedAt).toBe("2026-07-27");
    expect(command.evidence).toHaveLength(21);
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

  it("records Qwen Code's daemon and extension surfaces while keeping alpha limits visible", () => {
    const qwen = harnesses.find((harness) => harness.id === "qwen-code")!;
    const urls = qwen.evidence.map((source) => source.url);
    const caveats = qwen.tradeoffs.join(" ");

    expect(qwen.verifiedAt).toBe("2026-07-27");
    expect(qwen.evidence).toHaveLength(17);
    expect(qwen.evidence.every((source) => source.verifiedAt === qwen.verifiedAt)).toBe(true);
    expect(qwen.evidence.every((source) => source.topic !== undefined)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([
      "https://qwenlm.github.io/qwen-code-docs/en/users/overview/",
      "https://qwenlm.github.io/qwen-code-docs/en/developers/tools/mcp-server/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/extension/introduction/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/qwen-serve/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/integration-jetbrains/",
      "https://qwenlm.github.io/qwen-code-docs/en/blog/updates/weekly-update-2026-07-09/",
    ]));
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
      "https://github.com/CodebuffAI/codebuff/blob/672b784b42112d0eaf236e63b1005588e3c36711/agents/browser-use/browser-use.ts",
      "https://github.com/CodebuffAI/codebuff/blob/672b784b42112d0eaf236e63b1005588e3c36711/evals/buffbench/README.md",
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
    expect(kilo.features).toMatchObject({ subagents: true, sandbox: true, checkpoints: true });
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

    expect(vibe.verifiedAt).toBe("2026-07-27");
    expect(vibe.evidence.length).toBeGreaterThanOrEqual(24);
    expect(vibe.evidence.every((source) => source.verifiedAt === vibe.verifiedAt)).toBe(true);
    expect(vibe.interfaces).toEqual(expect.arrayContaining(["terminal", "ide", "automation"]));
    expect(vibe.interfaces).not.toContain("web");
    expect(vibe.providerStyle).toBe("multi-provider");
    expect(vibe.supportsSubscription).toBe(true);
    expect(vibe.localModels).toBe(true);
    expect(vibe.features).toMatchObject({ mcp: true, localModels: true, subagents: true, headless: true, sandbox: false, checkpoints: true });
    expect(urls).toEqual(expect.arrayContaining([
      "https://docs.mistral.ai/vibe/code/cli/install-setup",
      "https://docs.mistral.ai/vibe/code/safety-approvals-permissions",
      "https://docs.mistral.ai/vibe/code/cli/offline-models",
      "https://docs.mistral.ai/vibe/code/vibe-code-web/sandbox-environment",
      "https://github.com/mistralai/mistral-vibe/releases/tag/v2.22.0",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/vibe/core/config/vibe_schema.py",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/vibe/core/rewind/manager.py",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/.github/workflows/ci.yml",
    ]));
    expect(caveats).toContain("local CLI executes on the host");
    expect(caveats).toContain("separate surface");
    expect(caveats).toContain("enabled by default");
    expect(caveats).toContain("docs currently lag");
    expect(caveats).toContain("no built-in browser automation");
    expect(vibe.bestFor.join(" ")).toContain("Vibe coders");
    expect(vibe.discovery?.[0].note).toContain("modified Mistral Vibe fork");
    expect(vibe.discovery?.[0].note).toContain("no score is imported");
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
    expect(plandex.localModels).toBe(true);
    expect(plandex.features).toMatchObject({
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
    expect(stagewise.features).toMatchObject({
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

    expect(zoo.verifiedAt).toBe("2026-07-27");
    expect(zoo.evidence.length).toBeGreaterThanOrEqual(24);
    expect(zoo.evidence.every((source) => source.verifiedAt === zoo.verifiedAt)).toBe(true);
    expect(zoo.interfaces).toEqual(["ide"]);
    expect(zoo.classification.isolation).toEqual(["worktree"]);
    expect(zoo.features).toMatchObject({
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
    ]));
    expect(urlsFor("cursor-cli")).toContain(
      "https://github.com/cursor/cursor/tree/654b1b4775ca67aef473bd31a14c8c04a1abde2d",
    );
    expect(urlsFor("junie-cli")).toEqual(expect.arrayContaining([
      "https://junie.jetbrains.com/docs/junie-cli-remote-mode.html",
      "https://junie.jetbrains.com/docs/agent-skills.html",
      "https://github.com/JetBrains/junie/tree/9b3fe80b5779f0fc0f9b0ee4eeba50cc071948a5",
      "https://github.com/JetBrains/junie/releases/tag/2518.1",
    ]));
    expect(byId.get("junie-cli")!.tradeoffs.join(" ")).toContain("machine must remain awake");
    expect(urlsFor("kimi-code")).toEqual(expect.arrayContaining([
      "https://github.com/MoonshotAI/kimi-code/tree/8a45f10eddbb35c317047e82e567cdb59a220b4f",
      "https://github.com/MoonshotAI/kimi-code/releases/tag/%40moonshot-ai%2Fkimi-code%400.29.2",
      "https://moonshotai.github.io/kimi-code/en/customization/skills",
      "https://moonshotai.github.io/kimi-code/en/customization/agents",
      "https://moonshotai.github.io/kimi-code/en/customization/mcp",
    ]));
  });

  it("keeps every product logo local and traceable to a first-party asset", () => {
    for (const harness of harnesses) {
      expect(harness.logo.verifiedAt).toBe(harness.verifiedAt);
      expect(new URL(harness.logo.sourceUrl).hostname).toBe(firstPartyLogoHosts[harness.id]);
      if (harness.logo.src.startsWith("/")) {
        expect(existsSync(join(process.cwd(), "public", harness.logo.src.replace(/^\//, "")))).toBe(true);
      } else {
        expect(new URL(harness.logo.src).protocol).toBe("https:");
      }
    }
  });
});
