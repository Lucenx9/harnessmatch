import type { OperationalProfile, OperationalProfileRecord } from "../lib/types";

const verifiedAt = "2026-07-27";
const defaultLimitation =
  "Documentation-derived posture. It describes exposed harness mechanisms, not task success or model capability.";

const unknownProfile: OperationalProfile = {
  context: "unknown",
  permissions: "unknown",
  verification: "unknown",
  observability: "unknown",
  recovery: "unknown",
};

function record(
  profile: OperationalProfile,
  sourceUrls: string[],
  limitation = defaultLimitation,
): OperationalProfileRecord {
  return { profile, sourceUrls, verifiedAt, limitation };
}

export const operationalProfileRecords: Partial<Record<string, OperationalProfileRecord>> = {
  "claude-code": record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "checkpoint" },
    [
      "https://code.claude.com/docs/en/memory",
      "https://code.claude.com/docs/en/permissions",
      "https://code.claude.com/docs/en/permission-modes",
      "https://code.claude.com/docs/en/security",
      "https://code.claude.com/docs/en/sandbox-environments",
      "https://code.claude.com/docs/en/hooks",
      "https://code.claude.com/docs/en/monitoring-usage",
      "https://code.claude.com/docs/en/checkpointing",
      "https://code.claude.com/docs/en/agent-view",
      "https://code.claude.com/docs/en/code-review",
      "https://code.claude.com/docs/en/errors",
    ],
    "Auto memory persists local project knowledge, JSONL transcripts and optional OpenTelemetry improve traceability, and policy plus permission modes and hooks can gate tools. Agent view adds local research-preview background sessions, while managed Code Review reports a neutral check rather than an enforced workflow gate. The local Bash sandbox remains opt-in and fail-open by default and does not isolate file tools, MCP, or hooks unless a broader runtime, container, or web VM is used; checkpoint recovery excludes Bash-created changes and remote side effects, and unattended retries still need external time and spend limits.",
  ),
  codex: record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "session-resume" },
    [
      "https://developers.openai.com/codex/customization/memories",
      "https://developers.openai.com/codex/agent-approvals-security",
      "https://developers.openai.com/codex/permissions",
      "https://developers.openai.com/codex/hooks",
      "https://developers.openai.com/codex/config-file/config-advanced",
      "https://github.com/openai/codex/tree/25af12f7e61572b0bc18ddb1008be543b91519b0/codex-rs/rollout-trace",
    ],
    "Local memories persist project context; JSONL rollouts, lifecycle hooks, and optional OpenTelemetry expose trace-level evidence. Recovery is session resume plus Git review/revert rather than a harness checkpoint, so shell and external side effects remain outside rollback.",
  ),
  opencode: record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "checkpoint" },
    [
      "https://opencode.ai/docs/agents/",
      "https://opencode.ai/docs/permissions",
      "https://opencode.ai/docs/tui/",
      "https://opencode.ai/docs/server",
      "https://github.com/anomalyco/opencode/blob/e5cc278dec9294a627a7b05f47ce6a564408c1a2/packages/opencode/src/snapshot/index.ts",
    ],
    "Sessions, child-agent navigation, server events, and logs expose execution history; granular permission rules are configurable policy but most defaults are permissive and no OS sandbox is present. Git snapshot recovery excludes ignored files, large untracked files, and external side effects.",
  ),
  pi: record(
    { context: "managed", permissions: "host", verification: "manual", observability: "session", recovery: "session-resume" },
    ["https://pi.dev/docs/latest/security", "https://pi.dev/docs/latest/sessions", "https://pi.dev/docs/latest/compaction", "https://pi.dev/docs/latest/json"],
    "Pi manages conversation trees and compaction but intentionally provides no permission gate or sandbox. JSON events and session files support inspection, while recovery resumes or branches transcript state rather than restoring files or external side effects.",
  ),
  omp: record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://github.com/can1357/oh-my-pi/blob/f8dbb3669fe31512be748f73de5b9a163151d278/docs/approval-mode.md",
      "https://github.com/can1357/oh-my-pi/blob/f8dbb3669fe31512be748f73de5b9a163151d278/docs/memory.md",
      "https://github.com/can1357/oh-my-pi/blob/f8dbb3669fe31512be748f73de5b9a163151d278/docs/rpc.md",
      "https://github.com/can1357/oh-my-pi/blob/f8dbb3669fe31512be748f73de5b9a163151d278/docs/tools/rewind.md",
    ],
    "Optional memory persists project knowledge and per-tool policy is granular, but memory is off and approval defaults to yolo; subagents also run yolo. Logs, stats, and session JSONL aid inspection. Checkpoint/rewind only reshapes transcript context, so recovery remains session resume.",
  ),
  "grok-build": record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "checkpoint" },
    [
      "https://docs.x.ai/build/features/permissions",
      "https://docs.x.ai/build/features/sandbox",
      "https://docs.x.ai/build/modes-and-commands",
      "https://docs.x.ai/build/enterprise",
      "https://github.com/xai-org/grok-build/blob/b41c75a578f98bddbd326ab02cd53618451d97ee/crates/codegen/xai-grok-pager/docs/user-guide/13-memory.md",
      "https://github.com/xai-org/grok-build/blob/b41c75a578f98bddbd326ab02cd53618451d97ee/crates/codegen/xai-grok-pager/docs/user-guide/24-monitoring-usage.md",
    ],
    "Optional cross-session memory and rewind checkpoints are available; external OpenTelemetry is opt-in and session artifacts remain local by default. The OS sandbox is off by default and macOS child-network enforcement is incomplete, while recovery cannot undo external side effects.",
  ),
  aider: record(
    { context: "managed", permissions: "approval", verification: "tool-assisted", observability: "session", recovery: "checkpoint" },
    ["https://aider.chat/docs/repomap.html", "https://aider.chat/docs/git.html", "https://aider.chat/docs/usage/lint-test.html", "https://aider.chat/docs/config/options.html"],
    "Repository maps, lint and test commands, local chat history, and Git commits provide a strong inspected editing loop. Recovery is file-oriented: /undo cannot reverse shell or external side effects, and --yes-always can remove the approval boundary.",
  ),
  openhands: record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "session-resume" },
    ["https://docs.openhands.dev/sdk/guides/persistent-memory", "https://docs.openhands.dev/sdk/guides/security", "https://docs.openhands.dev/sdk/guides/observability", "https://docs.openhands.dev/sdk/guides/convo-persistence"],
    "Persistent memory is opt-in and distinct from resumable conversation storage. Confirmation policies, analyzers, critic/tool verification, metrics, and OpenTelemetry are available, but headless mode always approves and direct execute_tool calls bypass the analyzer.",
  ),
  goose: record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://goose-docs.ai/docs/guides/sessions/smart-context-management/",
      "https://goose-docs.ai/docs/mcp/developer-mcp/",
      "https://goose-docs.ai/docs/guides/recipes/session-recipes/",
      "https://goose-docs.ai/docs/guides/logs/",
      "https://goose-docs.ai/docs/guides/sessions/session-management/",
      "https://goose-docs.ai/blog/2026/02/23/goose-v1-25-0/",
    ],
  ),
  cline: record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "checkpoint" },
    ["https://docs.cline.bot/cli/cli-reference", "https://docs.cline.bot/core-workflows/checkpoints", "https://docs.cline.bot/cli/agent-teams", "https://docs.cline.bot/enterprise-solutions/monitoring/opentelemetry"],
    "Rules, command allow/deny policy, manual Memory Bank context, session/team state, shadow-Git checkpoints, and OTLP logs support control and inspection. The CLI prompt path defaults to auto-approve, so this is policy-governed rather than approval-first overall.",
  ),
  "gemini-cli": record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "checkpoint" },
    ["https://geminicli.com/docs/cli/auto-memory/", "https://geminicli.com/docs/cli/sandbox/", "https://geminicli.com/docs/cli/checkpointing/", "https://geminicli.com/docs/cli/telemetry/"],
    "Persistent memory and Auto Memory are reviewable but Auto Memory is experimental and off by default. Policy, optional OS/container isolation, project eval tools, OpenTelemetry, and shadow-Git checkpoints support inspection and recovery; external side effects remain outside rewind.",
  ),
  "antigravity-cli": record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://antigravity.google/docs/cli/overview",
      "https://antigravity.google/docs/cli/permissions",
      "https://antigravity.google/docs/cli/sandbox",
      "https://antigravity.google/docs/cli/subagents",
      "https://antigravity.google/docs/cli/conversations",
      "https://antigravity.google/docs/cli/reference",
    ],
    "Workspace-scoped history, visible agent and task logs, artifact review, and policy rules support inspection and session resume. Native sandboxing is off by default, workspace file access is auto-allowed by default, and rewind or fork changes conversation state rather than restoring the filesystem.",
  ),
  "copilot-cli": record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "checkpoint" },
    ["https://docs.github.com/en/copilot/concepts/agents/copilot-memory", "https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference", "https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes", "https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes", "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot", "https://docs.github.com/en/copilot/concepts/agents/hooks"],
    "Copilot Memory provides hosted, preview repository facts and user preferences with retention rules. Granular policy, pre-tool hooks, optional preview sandboxes, usage/session logs, bounded autopilot continuation, and Git or tools-based rewind are documented; the closed product exposes no independent product eval suite.",
  ),
  "cursor-cli": record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "checkpoint" },
    ["https://cursor.com/docs/cli/reference/parameters", "https://cursor.com/docs/cli/reference/permissions", "https://cursor.com/docs/cli/reference/configuration", "https://cursor.com/docs/cli/changelog"],
    "Rules, allow/deny tokens, auto-review, optional process sandboxing, worktrees, local transcripts, subagent checkpoints, and default-on rewind are documented. The binary is closed, has no immutable public release ref, and Run Everything/--yolo removes the interactive approval boundary.",
  ),
  "junie-cli": record(
    { context: "managed", permissions: "approval", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://junie.jetbrains.com/docs/junie-cli.html",
      "https://junie.jetbrains.com/docs/junie-headless.html",
      "https://junie.jetbrains.com/docs/junie-cli-worktrees.html",
      "https://junie.jetbrains.com/docs/action-allowlist-junie-cli.html",
      "https://junie.jetbrains.com/docs/junie-cli-remote-mode.html",
    ],
    "Approval controls, worktree isolation, resumable session logs, headless execution, and a tethered remote web UI are documented. Brave On removes approvals; worktrees are not an OS boundary; Remote mode still depends on the local CLI process and does not expose the full terminal surface.",
  ),
  "factory-droid": record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "checkpoint" },
    ["https://docs.factory.ai/cli/configuration/sandbox", "https://docs.factory.ai/cli/user-guides/auto-run", "https://docs.factory.ai/reference/cli-reference", "https://docs.factory.ai/enterprise/telemetry-export"],
    "Autonomy policy, opt-in fail-closed OS isolation, read-only headless defaults, tool-assisted verification, OTLP export, session rewind, and file snapshots are documented. The default per-command sandbox leaves the main Droid process outside the OS boundary and recovery excludes external side effects.",
  ),
  forgecode: record(
    { context: "managed", permissions: "host", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://forgecode.dev/docs/permissions/",
      "https://forgecode.dev/docs/forgecode-config/",
      "https://github.com/tailcallhq/forgecode/blob/1ca089a52fd2d11ec3b0e84fa0eba154bbb81270/crates/forge_main/src/cli.rs",
      "https://github.com/tailcallhq/forgecode/blob/1ca089a52fd2d11ec3b0e84fa0eba154bbb81270/crates/forge_repo/src/agents/forge.md",
      "https://github.com/tailcallhq/forgecode/blob/1ca089a52fd2d11ec3b0e84fa0eba154bbb81270/crates/forge_main/src/logs.rs",
      "https://github.com/tailcallhq/forgecode/blob/1ca089a52fd2d11ec3b0e84fa0eba154bbb81270/crates/forge_snaps/src/service.rs",
    ],
    "Default posture is host access because restricted mode is off and its generated policy allows built-in actions. Logs, session resume, and file undo are documented mechanisms, not proof of safe execution or task success.",
  ),
  "qwen-code": record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "checkpoint" },
    [
      "https://qwenlm.github.io/qwen-code-docs/en/users/features/memory/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/configuration/settings/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/features/headless/",
      "https://qwenlm.github.io/qwen-code-docs/en/users/features/checkpointing/",
      "https://qwenlm.github.io/qwen-code-docs/en/developers/development/telemetry/",
    ],
    "Default-on auto-memory persists reviewed user and project knowledge, while optional OpenTelemetry exposes logs, metrics, and spans. Approval policy is granular, but the OS/container sandbox and shadow-Git checkpoints are both disabled by default; yolo does not enable isolation, and rollback cannot undo external side effects.",
  ),
  "continue-cli": record(
    { context: "managed", permissions: "approval", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    ["https://docs.continue.dev/cli/tool-permissions", "https://github.com/continuedev/continue"],
    "Historical documentation-derived posture. The official repository is read-only and no longer actively maintained.",
  ),
  "mistral-vibe": record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "checkpoint" },
    [
      "https://docs.mistral.ai/vibe/code/cli/work-with-cli",
      "https://docs.mistral.ai/vibe/code/safety-approvals-permissions",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/vibe/core/config/vibe_schema.py",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/vibe/core/rewind/manager.py",
      "https://github.com/mistralai/mistral-vibe/blob/89350a4064ca90e4732271dcc27688e5d684871d/docs/adr/0006-local-sessions.md",
    ],
    "The profile records managed compaction, granular policies, optional OpenTelemetry, and message-level file rewind. OTEL is off by default; the local CLI remains a host process, and these mechanisms do not establish task success.",
  ),
  "kimi-code": record(
    { context: "managed", permissions: "approval", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://moonshotai.github.io/kimi-code/en/configuration/config-files.html",
      "https://moonshotai.github.io/kimi-code/en/reference/kimi-command.html",
      "https://moonshotai.github.io/kimi-code/en/reference/tools.html",
      "https://moonshotai.github.io/kimi-code/en/guides/sessions.html",
      "https://moonshotai.github.io/kimi-code/en/customization/hooks",
      "https://moonshotai.github.io/kimi-code/en/customization/agents",
      "https://moonshotai.github.io/kimi-code/en/customization/mcp",
    ],
    "Interactive sessions default to manual approval and persist replayable JSONL event streams, but this is resumable session state rather than learned memory or file rollback. Print mode uses unattended auto permission, can leave background work effectively unbounded, anonymous telemetry defaults on, hooks fail open, and all local tools remain host-privileged.",
  ),
  "letta-code": record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "managed-recovery" },
    [
      "https://github.com/letta-ai/letta-code/tree/286a01d10602eab4a356f2b062e817310f992966",
      "https://docs.letta.com/concepts/memfs",
      "https://docs.letta.com/configuration/permissions",
      "https://docs.letta.com/platform/computers",
      "https://docs.letta.com/platform/computers/cloud-sandboxes",
      "https://docs.letta.com/platform/cli/headless",
      "https://docs.letta.com/configuration/schedules",
    ],
    "Agent memory and conversations persist across clients and environments, with Git-tracked MemFS providing inspectable context history. Fine-grained policy is available, but the interactive CLI currently starts unrestricted; local tools use the selected computer's shell, files, credentials, and installed software. Managed recovery describes durable agent, schedule, and cloud-environment continuity, not project-file rollback or reversal of external effects.",
  ),
  "kilo-code": record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "checkpoint" },
    [
      "https://kilo.ai/docs/code-with-ai/platforms/cli",
      "https://kilo.ai/docs/customize/agent-permissions",
      "https://kilo.ai/docs/getting-started/settings/sandboxing",
      "https://kilo.ai/docs/code-with-ai/features/checkpoints",
      "https://kilo.ai/docs/customize/context/codebase-indexing",
    ],
    "The profile records the strongest documented mechanism: granular policies, optional OTLP traces, and Git snapshots. The local sandbox is still off by default, does not restrict reads, and is unavailable on Windows; these mechanisms do not prove task success.",
  ),
  "command-code": record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "checkpoint" },
    [
      "https://commandcode.ai/docs/reference/cli",
      "https://commandcode.ai/docs/resources/security",
      "https://commandcode.ai/docs/core-concepts/headless",
      "https://commandcode.ai/docs/core-concepts/checkpoints",
      "https://commandcode.ai/docs/hooks",
    ],
    "Local taste rules persist learned preferences and sessions are resumable. Interactive writes and shell require approval by default, while headless runs deny both unless yolo grants both. Pre-tool and stop hooks can enforce deterministic checks but remain user-authored local processes. Per-session checkpoints omit files over 10 MB and cannot reverse shell or external-service effects; the closed implementation is not source-auditable.",
  ),
  codebuff: record(
    { context: "managed", permissions: "host", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://www.codebuff.com/docs/tips/what-makes-codebuff-unique",
      "https://www.codebuff.com/docs/advanced/sdk",
      "https://www.codebuff.com/docs/tips/modes",
      "https://www.codebuff.com/docs/tips/knowledge-files",
      "https://www.codebuff.com/docs/advanced/troubleshooting",
    ],
    "Documentation-derived posture. Codebuff explicitly favors autonomous host execution without permission prompts; optional Docker scoping is not a built-in sandbox.",
  ),
  crush: record(
    { context: "managed", permissions: "approval", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/README.md",
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/internal/cmd/run.go",
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/internal/permission/permission.go",
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/internal/cmd/logs.go",
      "https://github.com/charmbracelet/crush/blob/def12cc6d8e162d6f48a7db260dde5ea3cc5f906/internal/session/session.go",
    ],
    "Documentation-derived posture. Logs and SQLite session resume improve inspection and continuity, but they are not structured traces or file checkpoints; execution remains on the host and --yolo bypasses approval prompts.",
  ),
  mux: record(
    { context: "persistent", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "session-resume" },
    [
      "https://github.com/coder/mux/tree/8ec0e299022677a22c53f994c8d8d5ee0fe4ef22",
      "https://mux.coder.com/agents",
      "https://mux.coder.com/workspaces",
      "https://mux.coder.com/runtime",
      "https://mux.coder.com/config/policy-file",
      "https://mux.coder.com/reference/telemetry",
    ],
    "Built-in workspace, project, and global memory survives sessions and is consolidated by a guarded background agent. Admin policy fails closed and retains the last known good configuration, but the default local runtime has no isolation and worktrees are only file separation; anonymous product telemetry defaults on and session resume is not project-file rollback.",
  ),
  "coder-agents": record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "managed-recovery" },
    [
      "https://coder.com/docs/ai-coder/agents/architecture",
      "https://coder.com/docs/ai-coder/agents/tools",
      "https://coder.com/docs/ai-coder/agents/platform-controls",
      "https://coder.com/docs/ai-coder/agents/getting-started",
      "https://coder.com/docs/ai-coder/agents/platform-controls/chat-debug-logging",
    ],
    "Documentation-derived posture. Structured debug traces are optional and off by default; workspace isolation inherits the selected template, while managed recovery means database-backed chat resume rather than file checkpointing.",
  ),
  "zoo-code": record(
    { context: "managed", permissions: "approval", verification: "tool-assisted", observability: "logs", recovery: "checkpoint" },
    [
      "https://docs.zoocode.dev/features/codebase-indexing",
      "https://docs.zoocode.dev/basic-usage/how-tools-work",
      "https://docs.zoocode.dev/features/checkpoints",
      "https://docs.zoocode.dev/features/rooignore",
      "https://docs.zoocode.dev/features/message-queueing",
      "https://docs.zoocode.dev/reporting-errors",
    ],
    "The extension normally asks before tools and exports task/action diagnostics, but execution remains on the host. .rooignore does not fully mediate commands, queued messages implicitly approve the next pending action, and checkpoints restore recorded files rather than external command side effects.",
  ),
  zcode: record(
    { context: "managed", permissions: "policy", verification: "workflow-gated", observability: "traces", recovery: "managed-recovery" },
    [
      "https://zcode.z.ai/en/docs/agents",
      "https://zcode.z.ai/en/docs/goal",
      "https://zcode.z.ai/en/docs/safety-confirm",
      "https://zcode.z.ai/en/docs/hooks",
      "https://zcode.z.ai/en/docs/usage-stats",
      "https://zcode.z.ai/en/docs/remote-development",
      "https://zcode.z.ai/en/changelog",
    ],
    "Vendor-documented posture for ZCode 3.5.2. Goal Mode records model trajectories and applies an independent failed-closed completion check, but no independent validation establishes its accuracy. Docker isolation requires an existing user-provided container; ordinary local and SSH workspaces execute with the target account, file undo does not reverse external side effects, and no headless CLI or CI API was found.",
  ),
  stagewise: record(
    { context: "managed", permissions: "approval", verification: "tool-assisted", observability: "logs", recovery: "checkpoint" },
    [
      "https://docs.stagewise.io/core-concepts/agent-context.md",
      "https://docs.stagewise.io/core-concepts/how-agents-work.md",
      "https://docs.stagewise.io/core-concepts/diff-review.md",
      "https://docs.stagewise.io/core-concepts/browser-and-agent.md",
      "https://github.com/stagewise-io/stagewise/blob/cb38225c2b0de27e85c10f26ed46123f487fb6f8/packages/agent-core/src/types/tool-approval.ts",
      "https://github.com/stagewise-io/stagewise/blob/cb38225c2b0de27e85c10f26ed46123f487fb6f8/packages/agent-shell/src/tools/execute-shell-command.ts",
    ],
    "The desktop app defaults to always-ask and provides diff-level undo and redo, but file and shell tools operate with the user's host permissions. The restricted JavaScript worker is not an OS sandbox; logs and telemetry are not a complete audit trace, and recovery covers recorded edits rather than arbitrary command side effects.",
  ),
  "hermes-agent": record(
    { context: "persistent", permissions: "policy", verification: "workflow-gated", observability: "traces", recovery: "managed-recovery" },
    [
      "https://hermes-agent.nousresearch.com/docs/user-guide/features/memory/",
      "https://hermes-agent.nousresearch.com/docs/user-guide/security/",
      "https://hermes-agent.nousresearch.com/docs/user-guide/features/goals",
      "https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback",
      "https://hermes-agent.nousresearch.com/docs/user-guide/features/cron",
      "https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation",
      "https://github.com/NousResearch/hermes-agent/blob/0fa5e41c86f022bba147797849f0b44865721476/docs/observability/README.md",
    ],
    "Code-verifiable at commit 0fa5e41c86f022bba147797849f0b44865721476. Completion contracts gate an optional persistent-goal loop on stated evidence, but the LLM judge can still produce false verdicts. Checkpoints and memory or skill write approval are opt-in; local execution remains host-privileged, and a process restart does not resume an in-flight delegated child.",
  ),
  "mini-swe-agent": record(
    { context: "basic", permissions: "approval", verification: "manual", observability: "traces", recovery: "manual" },
    [
      "https://mini-swe-agent.com/latest/usage/mini/",
      "https://mini-swe-agent.com/latest/advanced/control_flow/",
      "https://mini-swe-agent.com/latest/advanced/environments/",
      "https://mini-swe-agent.com/latest/usage/output_files/",
      "https://mini-swe-agent.com/latest/usage/swebench/",
    ],
    "Confirm mode prompts for every proposed action but is not a scoped permission policy. The default local environment executes with the user's host privileges, isolated environments are opt-in, trajectories are written only when a task finishes, and interrupted batch work requires manual reruns or output cleanup.",
  ),
  amp: record(
    { context: "persistent", permissions: "host", verification: "tool-assisted", observability: "traces", recovery: "managed-recovery" },
    [
      "https://ampcode.com/manual#orbs",
      "https://ampcode.com/manual#permissions",
      "https://ampcode.com/manual#schedules",
      "https://ampcode.com/manual#thread-sharing",
      "https://ampcode.com/manual/sdk/typescript",
      "https://ampcode.com/security",
      "https://ampcode.com/news/agents-everywhere",
    ],
    "Amp preserves thread context and tool-call history and now uses durable execution, schedules, and sleeping orbs. This is vendor-documented recovery, not independent task-success evidence. Local tools still run with host privileges and no approval by default; policy plugins are optional, and orb SDK calls ignore local-only policy options in favor of project configuration.",
  ),
  "kiro-cli": record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "logs", recovery: "checkpoint" },
    [
      "https://kiro.dev/docs/cli/chat/permissions/",
      "https://kiro.dev/docs/cli/chat/subagents/",
      "https://kiro.dev/docs/cli/chat/goal/",
      "https://kiro.dev/docs/cli/chat/session-management/",
      "https://kiro.dev/docs/cli/experimental/checkpointing/",
      "https://kiro.dev/docs/cli/hooks/",
      "https://kiro.dev/docs/cli/v3/",
    ],
    "Kiro 2.x provides scoped approvals, session logs and resume, agent-driven goal verification, and an opt-in experimental shadow-Git checkpoint system. Execution is still host-privileged and checkpoint recovery does not reverse external side effects. CLI 3.0 is a separate early-access path with breaking permission and session changes, so its policy model is not described as the stable default.",
  ),
  "poolside-cli": record(
    { context: "managed", permissions: "policy", verification: "tool-assisted", observability: "traces", recovery: "session-resume" },
    [
      "https://docs.poolside.ai/cli/interactive-mode",
      "https://docs.poolside.ai/cli/automated-mode",
      "https://docs.poolside.ai/settings-file-reference",
      "https://docs.poolside.ai/sandboxes",
      "https://docs.poolside.ai/organization/permissions-reference",
      "https://docs.poolside.ai/managed-agents",
    ],
    "Poolside exposes scoped tool and path rules, structured local and web trajectories, resumable sessions, and optional managed sandboxes. The local environment remains enabled by default, remote HTTP or SSE MCP calls bypass local sandbox egress restrictions, and conversation rewind is not file rollback. No product checkpoint is claimed.",
  ),
  plandex: record(
    { context: "persistent", permissions: "approval", verification: "tool-assisted", observability: "session", recovery: "checkpoint" },
    [
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/docs/docs/core-concepts/context-management.md",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/docs/docs/core-concepts/autonomy.md",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/docs/docs/core-concepts/execution-and-debugging.md",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/docs/docs/core-concepts/version-control.md",
      "https://github.com/plandex-ai/plandex/blob/e2d772072efadbe41d2946d97d79be55532dbab5/app/cli/lib/apply_cgroup_linux.go",
    ],
    "Historical self-host posture at the last inspected source commit. Pending diffs and rewind provide review and recovery, not command isolation; execution uses the host, while the plan log is a session record rather than structured tracing.",
  ),
};

const unknownRecord: OperationalProfileRecord = {
  profile: unknownProfile,
  sourceUrls: [],
  verifiedAt,
  limitation: "No reviewed operational record is available.",
};

export function getOperationalProfileRecord(harnessId: string): OperationalProfileRecord {
  return operationalProfileRecords[harnessId] ?? unknownRecord;
}

export function getOperationalProfile(harnessId: string): OperationalProfile {
  return getOperationalProfileRecord(harnessId).profile;
}
