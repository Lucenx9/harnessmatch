# Source refresh work packet

**Created:** 2026-07-27
**Updated:** 2026-07-27 (second pass: web + X recheck for all harnesses)
**Purpose:** First-party source candidates for every harness, plus ranking-review guidance for a follow-up agent (Codex or Claude).
**Status:** Applied on 2026-07-27 for every live-verified, high-value candidate in this packet. The Codex, Goose, Mux, Cursor CLI, Command Code, Qwen Code, Aider, OpenHands, Factory Droid, Grok Build, Letta Harness, Claude Code, OpenCode, Kilo Code, and Kiro CLI slices were integrated. Remaining entries are overlap, broken paths, low-confidence discovery leads, or future refresh prompts—not verified evidence. No capability score may change from this packet alone.

### Honesty about research depth

| Product set | How sources were found |
|---|---|
| **claude-code**, **codex** | Full live crawl of official docs indexes (`llms.txt`) + page fetches |
| **Others (this update)** | Inventory of current `evidence[]` URLs, then **live web/docs search** for pages **not already in the ledger** |
| Generic guesses without a live hit | Removed or marked `unverified-guess` — do not merge those |

Every URL in **§2b** was absent from `src/data/harnesses.ts` when discovered. Consult the application log below before treating an entry as pending.

### Application log

#### 2026-07-27 — Codex slice applied

- Live-checked the current official `developers.openai.com/codex/llms.txt` index and the underlying Markdown pages.
- Added 20 first-party records covering sandboxing, Auto-review, permission modes and rules, AGENTS.md, local and cloud environments, Windows isolation, desktop and remote surfaces, authentication, skills and plugins, code review, enterprise rollout, Bedrock, feature maturity, release updates, and the optional Codex Security surface.
- Expanded the operational-profile source set for context, permissions, sandbox boundaries, review, and observability.
- Ranking decision: **ledger only**. Capabilities, features, architecture classification, and operational posture remain unchanged. Auto-review is non-deterministic, remote access inherits the host boundary, Code Review remains tool-assisted, and Codex Security is optional.
- Deliberately excluded the broad overview, pricing, overlapping configuration pages, stale/unindexed MCP-server route, and granular Security workflow pages because they added little independent harness evidence.
- Codex evidence count after the slice: **46**.

#### 2026-07-27 — Goose security slice applied

- Added the official security hub, Adversary Mode, prompt-injection detection, classifier API, project security policy, v1.44.0 release, and GHSA-r5pp-p5r8-466r advisory.
- Ranking decision: **ledger only**. Security remains 4 because isolation and granular policy exist, but the normal developer path is host-first, protections are optional, Adversary Mode is fail-open, and allowed commands retain user privileges.
- Added a version boundary: releases before 1.44.0 are affected by the high-severity `goose review` arbitrary-command-execution advisory.
- Goose evidence count after the slice: **19**.

#### 2026-07-27 — Mux runtime slice applied

- Added all 15 distinct pages from the official Mux docs index covering local, worktree, Docker, devcontainer, SSH and Coder runtimes; tool and init hooks; GitHub Actions; ACP and VS Code integrations; instructions, plan mode, installation, and server access.
- Ranking decision: **ledger only**. Mux remains host-first because the local runtime has no isolation; container and remote boundaries require explicit runtime selection. Experimental hooks remain policy, and `--no-auth` can remove the default server token boundary.
- Mux evidence count after the slice: **26**.

#### 2026-07-27 — Cursor CLI product-surface slice applied

- Live-checked installation, using-agent, MCP, Shell Mode, and authentication pages on the current official Cursor documentation site.
- Rejected `https://cursor.com/docs/cli/capabilities` because it currently returns 404 rather than treating the packet candidate as evidence.
- Added evidence topics to the complete Cursor CLI ledger and expanded the operational-profile source set for session handling and authentication.
- Ranking decision: **ledger only**. The five pages confirm already-recorded surfaces and do not change default isolation, permissions, recovery, or model-access posture.
- Cursor CLI evidence count after the slice: **15**.

#### 2026-07-27 — Command Code workflow slice applied

- Added 12 live-verified official pages covering worktrees, durable sessions, goals, memory, Taste, settings, plan and interactive modes, background scheduling, v1 changes, Mods, and Studio.
- Ranking decision: **ledger only**. The pages deepen support for already-recorded persistent state, worktree isolation, automation, and extension surfaces. Product-internal goal verification is not independent evidence, and scheduled/background work still inherits host execution.
- Command Code evidence count after the slice: **21**.

#### 2026-07-27 — Qwen Code daemon and extension slice applied

- Added the official overview, MCP server guide, extension system, alpha `qwen serve` daemon, JetBrains ACP integration, and dated nested-subagent release note.
- Added the daemon boundary: loopback starts without authentication, non-loopback binding refuses to start without a bearer token, and the alpha docs do not promise production-grade multi-client or network-failure guarantees.
- Ranking decision: **ledger only**. Existing automation, subagent, MCP, IDE, and security fields already represented these capabilities and their opt-in/default boundaries.
- Qwen Code evidence count after the slice: **17**.

#### 2026-07-27 — Aider privacy and release-provenance slice applied

- Added the official privacy policy, release history, and operational FAQ.
- Recorded the version-surface discrepancy: GitHub Releases stops at v0.86.0 and the history page at v0.86.1, while the pinned audited commit explicitly bumps the package to v0.86.2.
- Ranking decision: **ledger only**. No first-party sandbox was found, so security and isolation remain unchanged.
- Aider evidence count after the slice: **18**.

#### 2026-07-27 — OpenHands operations slice applied

- Added CLI installation and MCP management, scheduled and event-driven automations, V1 custom sandbox images, and the OSS 1.11.0 release boundary.
- Recorded that automations run unattended in fresh sandboxes with configured LLM settings, stored secrets, integrations, and Git-provider credentials.
- Ranking decision: **ledger only**. The sandbox-first platform, always-approve headless path, and operational postures remain unchanged.
- OpenHands evidence count after the slice: **23**.

#### 2026-07-27 — Factory Droid configuration slice applied

- Added the current settings hierarchy and dedicated MCP configuration page. Release notes and Droid Control were already present, so the duplicate packet suggestions were not re-added.
- Recorded that CLI session mirroring to Factory web defaults on and can be disabled with `cloudSessionSync`.
- Ranking decision: **ledger only**. Existing policy, sandbox, automation, and capability fields already represent these mechanisms.
- Factory Droid evidence count after the slice: **15**.

#### 2026-07-27 — Grok Build settings slice applied

- Added the dedicated MCP server guide, settings overview, and CLI reference.
- Ranking decision: **ledger only**. These pages provide direct coverage for mechanisms already represented by the evidence ledger and capability profile.
- Grok Build evidence count after the slice: **24**.

#### 2026-07-27 — Letta Harness boundary slice applied

- Updated the display name from Letta Code to the current official **Letta Harness** name while retaining the stable `letta-code` identifier and repository/package boundary.
- Added the current documentation index, MCP and client-tool execution models, pinned v0.29.4 CLI MCP implementation, GitHub Action, trusted Mods, settings, changelog, and CLI reference.
- Rejected the packet's built-in-tool path because it now resolves to 404, and excluded the generic Agent SDK deployment page from harness capability evidence.
- Ranking decision: **ledger only**. MCP was already code-verifiable and enabled; the new sources clarify that skills are preferred for app/CLI use, external MCP servers are separate execution boundaries, and Mods are fully trusted in-process code.
- Letta Harness evidence count after the slice: **23**.

#### 2026-07-27 — Claude Code evaluation and retention slice applied

- Added Anthropic's Auto mode engineering evaluation and the qualified Enterprise Zero Data Retention documentation.
- Recorded the published Auto mode sample boundaries: 10,000 production sessions, 52 real overeager actions, and a 17% false-negative rate on those real actions; Anthropic explicitly does not position it as a replacement for high-stakes review.
- Recorded that Zero Data Retention requires separate qualification and enablement and excludes web and Cloud sessions, Remote Control, feedback, third-party tools, and MCP integrations.
- Excluded the sandboxing engineering article because the existing security, sandboxing, runtime, devcontainer, and open runtime records already support the same harness claims.
- Ranking decision: **ledger only**. Auto mode remains policy/classifier-backed rather than isolation, and ZDR is conditional rather than the product-wide default.
- Claude Code evidence count after the slice: **56**.

#### 2026-07-27 — OpenCode security-policy slice applied

- Added the immutable v1.18.5 `SECURITY.md` rather than the mutable repository security route.
- The policy explicitly confirms no built-in sandbox, permissions as a UX control rather than isolation, and the unauthenticated server default when no password is configured.
- Ranking decision: **ledger only**. The existing host-first runtime, absent sandbox flag, security 3, and server caveat already encode this boundary.
- OpenCode evidence count after the slice: **25**.

#### 2026-07-27 — Kilo Code sandbox-boundary slice applied

- Added the first-party local-sandbox threat-model article, CLI product surface, and Cloud Agent security architecture.
- Recorded that local sandboxing is opt-in, leaves reads unrestricted, and is explicitly neither a privacy boundary nor a complete firewall. Cloud Agent uses a distinct managed Cloudflare sandbox architecture.
- Ranking decision: **ledger only**. Kilo remains host-first because the local default did not change; the managed cloud boundary was already represented separately.
- Kilo Code evidence count after the slice: **27**.

#### 2026-07-27 — Kiro CLI review and v3-policy slice applied

- Added the privacy/security model and CLI 3.0 permission-rule documentation.
- Recorded that Supervised and Autopilot change review workflow, not tool capability, isolation, or access control. Declarative v3 policy remains early access and is not treated as the stable 2.x default.
- Ranking decision: **ledger only**. The existing host-first runtime, no-sandbox feature, and stable-versus-v3 split remain correct.
- Kiro CLI evidence count after the slice: **21**.

---

## 0. Rules for the implementing agent

Read and obey `AGENTS.md` and existing tests before editing.

1. **Capability claim** = first-party source + `verifiedAt` date.
2. Keep **model capability separate** from harness capability.
3. **Archived** tools stay out of recommender results.
4. **Scoring / capability / classification / feature** changes need tests that state the intended workflow outcome.
5. Do not invent OS sandbox, checkpoints, or headless support from marketing blurbs.
6. Prefer `official-docs` / `official-repository` / `official-announcement` kinds only (see `src/lib/types.ts`).
7. Hostnames must pass `firstPartyHosts` in `tests/harnesses.test.ts` (update allowlist if adding a new first-party host).
8. Operational profile `sourceUrls` must be a subset of that harness’s `evidence[].url`.
9. **Ranking does not auto-update from source count.** Fit scores use:
   - `capabilities` (1–5)
   - `features` / `classification` / interfaces / provider fields (eligibility gates)
   - `operational-profiles.ts` postures
   - weights in `recommendation-config.ts`
   Evidence only drives ledger, `evidenceSourceCount`, `evidenceCoverage`, and (with audits/benchmarks) `evidenceState`.

### Implementation workflow (per harness)

```
1. Open current evidence in src/data/harnesses.ts
2. Fetch each candidate URL; confirm claim text still matches
3. Add only verified sources with covers ≥ 12 chars and shared verifiedAt
4. If a claim changes: update features/classification/capabilities/tradeoffs + tests
5. If operational facet changes: update operational-profiles.ts + tests
6. npm test && npm run typecheck
7. Note residual risk in tradeoffs, never hide defaults
```

### Ranking review checklist (only after sources verify a gap)

Ask, with source quotes:

- [ ] Is `runtime` host-first vs sandbox-first still correct?
- [ ] Is `isolation` accurate (os-sandbox / worktree / managed-sandbox / container)?
- [ ] Is `state` session-based vs persistent-memory?
- [ ] Are feature flags (`sandbox`, `checkpoints`, `headless`, `browser`, `subagents`, `mcp`, `localModels`) still true under product defaults?
- [ ] Do security / autonomy / humanControl ordinals still match **defaults**, not max optional config?
- [ ] Should operational profile permissions/recovery/observability change?
- [ ] Any new benchmark run complete enough for `benchmark-runs.ts`? (usually no)

If no field changes: still OK to add evidence-only; document “ledger only” in the PR.

---

## 1. Coverage snapshot (2026-07-27 inventory)

| id | status | evidence | sandbox feat | checkpoints | sec score | notes |
|---|---|---:|---|---|---:|---|
| claude-code | active | 56 | yes | yes | 4 | Auto-mode evaluation and qualified ZDR limits applied |
| codex | active | 46 | yes | no | 5 | Codex source slice applied; ranking unchanged |
| opencode | active | 25 | no | yes | 3 | Pinned security policy reinforces host-first boundary |
| pi | active | 19 | no | no | 2 | Thin on automation ops docs |
| omp | active | 15 | no | no | 3 | Expand settings/memory/stats if present |
| grok-build | active | 24 | yes | yes | 4 | MCP, settings, and CLI reference applied |
| aider | active | 18 | no | yes | 3 | Privacy and release provenance applied; no sandbox found |
| openhands | active | 23 | yes | no | Operations and OSS release slice applied |
| goose | active | 19 | yes | no | 4 | Security slice applied; optional and fail-open controls documented |
| cline | active | 18 | no | yes | 3 | Changelog / enterprise policy gaps |
| gemini-cli | active | 13 | yes | yes | 4 | Consumer→Antigravity transition already noted |
| antigravity-cli | active | 14 | yes | no | 4 | New; keep version/docs pins current |
| copilot-cli | active | 14 | yes | yes | 4 | GitHub docs depth OK; confirm fleet/sandbox pages |
| cursor-cli | active | 15 | yes | yes | 4 | Product-surface slice applied; default posture unchanged |
| junie-cli | active | 13 | no | no | 4 | Remote mode already critical |
| factory-droid | active | 15 | yes | yes | Settings and MCP slice applied; session sync default documented |
| forgecode | active | 24 | no | no | 2 | Dense; verify defaults not overclaimed |
| qwen-code | active | 17 | yes | yes | 4 | Daemon, MCP, extensions, IDE, and nested-agent sources applied |
| continue-cli | archived | 4 | no | no | 3 | Leave out of recommender |
| mistral-vibe | active | 26 | no | yes | 4 | Strong docs; confirm CLI vs web split |
| kimi-code | active | 12 | no | no | 3 | Thin |
| letta-code | active | 23 | yes | no | Current name is Letta Harness; MCP/code boundary and trusted Mods documented |
| kilo-code | active | 27 | yes | yes | 4 | Local and managed sandbox boundaries separated |
| command-code | active | 21 | no | yes | 4 | Workflow and persistence slice applied; host boundary unchanged |
| codebuff | active | 15 | no | no | 3 | Missing dedicated security source |
| crush | active | 20 | no | no | 3 | Charm-land docs OK |
| mux | active | 26 | yes | no | 4 | Runtime and access slice applied; default remains host-first |
| coder-agents | active | 20 | yes | no | 5 | Version pin weak |
| zoo-code | active | 27 | no | yes | 3 | Strong; headless false intentional |
| zcode | active | 16 | yes | yes | 4 | Closed product; keep first-party only |
| stagewise | active | 27 | no | yes | 3 | Strong desktop focus |
| hermes-agent | active | 25 | yes | yes | 4 | Strong OSS |
| mini-swe-agent | active | 23 | yes | no | 3 | Strong OSS + bench assets |
| amp | active | 19 | yes | no | 3 | Version pin weak |
| kiro-cli | active | 21 | no | yes | 4 | Review modes and v3 policy boundary applied |
| poolside-cli | active | 18 | yes | no | 4 | Solid enterprise docs |
| plandex | dormant | 25 | no | yes | 2 | Dormant; refresh only if status changes |

---

## 2. Priority tiers for follow-up work

### P0 — implement next (high product weight + clear **live-found** source gaps)

1. ~~**codex** — §3 codex table + sandbox/permission-modes/app~~ **Applied 2026-07-27**
2. ~~**goose** — security suite almost entirely missing from ledger~~ **Applied 2026-07-27**
3. ~~**cursor-cli** — MCP, install, using-agent, shell mode missing~~ **Applied 2026-07-27**
4. ~~**mux** — docker/devcontainer/worktree/SSH runtimes + hooks + GHA missing~~ **Applied 2026-07-27**
5. ~~**command-code** — worktrees, sessions, memory, goal, taste, settings missing~~ **Applied 2026-07-27**
6. ~~**qwen-code** — MCP, extensions/subagents, daemon, overview missing~~ **Applied 2026-07-27**
7. ~~**aider** — privacy + release history missing~~ **Applied 2026-07-27**

### P1 — important; live candidates below

- ~~openhands (CLI install/MCP/automations/custom sandbox)~~ **Applied 2026-07-27**
- ~~factory-droid (settings, macOS sandbox notes in release)~~ **Applied 2026-07-27**
- cline (confirm remaining security/browser pages)
- kimi-code (if security pages appear)
- codebuff (security page still weak/unfound — do not invent)

### P2 — dense ledgers; only residual polish

- ~~claude-code Auto mode/ZDR and opencode SECURITY.md~~ **Applied 2026-07-27**
- mistral-vibe, stagewise, and zoo-code remain dense and need only future release-driven refreshes

### P3 — status-gated

- continue-cli (archived)
- plandex (dormant)

---

## 2b. Live-found sources **not currently in the ledger**

Cross-checked against `harnesses.ts` evidence URLs on 2026-07-27.
`conf: high` = official product docs hit in search/index. Still **re-fetch** before merge.

### goose (19 after security slice — **applied 2026-07-27**)

| URL | Why useful | conf |
|---|---|---|
| https://goose-docs.ai/docs/guides/security/ | Security hub: adversary, injection, best practices | high |
| https://goose-docs.ai/docs/guides/security/adversary-mode/ | Independent reviewer agent on tool calls | high |
| https://goose-docs.ai/docs/guides/security/prompt-injection-detection/ | Pre-exec injection detection; host-permission caveat | high |
| https://goose-docs.ai/docs/guides/security/classification-api-spec/ | Self-host ML classifier API; privacy of classification traffic | high |
| https://goose-docs.ai/blog/2026/02/23/goose-v1-25-0/ | **Already in ledger** as blog pin — keep; documents macOS seatbelt sandbox | — |
| https://github.com/aaif-goose/goose/blob/main/SECURITY.md | Vulnerability reporting / security policy | high |
| https://github.com/aaif-goose/goose (latest release tag) | Version pin beyond blog | medium |

**Ranking question:** sandbox mode / seatbelt — is it default-on Desktop only? If opt-in, keep security ordinal cautious.

### cursor-cli (ledger 15 after product-surface slice — **applied 2026-07-27**)

| URL | Why useful | conf |
|---|---|---|
| https://cursor.com/docs/cli/installation | Install paths, PATH, Windows native | high |
| https://cursor.com/docs/cli/using | Agent modes, rules, MCP in CLI, review flow | high |
| https://cursor.com/docs/cli/mcp | MCP server management from CLI | high |
| https://cursor.com/docs/cli/shell-mode | Shell mode surface (nav lists this page) | high |
| ~~https://cursor.com/docs/cli/capabilities~~ | Rejected: returned 404 during live verification | not evidence |
| https://cursor.com/docs/cli/reference/authentication | Auth for headless/CI (linked from headless) | high |
| Overview sandbox section (`/sandbox`, `--sandbox`) | Already partially on overview — ensure covers mentions sandbox toggle | high — already have overview URL; **expand covers** or add dedicated sandbox doc if split |

**Host note:** ledger uses `cursor.com`; tests may still list `docs.cursor.com` — align `firstPartyHosts`.

### mux (26 after runtime slice — **applied 2026-07-27**)

Official index: https://mux.coder.com/llms.txt

| URL | Why useful | conf |
|---|---|---|
| https://mux.coder.com/runtime/docker | Isolated Docker runtime | high |
| https://mux.coder.com/runtime/devcontainer | Devcontainer isolation | high |
| https://mux.coder.com/runtime/worktree | Git worktree runtime | high |
| https://mux.coder.com/runtime/ssh | Remote SSH execution | high |
| https://mux.coder.com/runtime/local | Local host runtime (baseline risk) | high |
| https://mux.coder.com/runtime/coder | Coder workspace runtime | high |
| https://mux.coder.com/hooks/tools | Tool hooks (block dangerous commands) | high |
| https://mux.coder.com/hooks/init | Init hooks for workspace setup | high |
| https://mux.coder.com/guides/github-actions | CI automation with `mux run` | high |
| https://mux.coder.com/integrations/acp | Editor ACP integrations | high |
| https://mux.coder.com/integrations/vscode-extension | VS Code/Cursor pairing | high |
| https://mux.coder.com/agents/instruction-files | AGENTS.md instruction files | high |
| https://mux.coder.com/agents/plan-mode | Plan-before-exec | high |
| https://mux.coder.com/install | Install surfaces | high |
| https://mux.coder.com/config/server-access | Server/browser auth controls | high |

**Ranking question:** `features.sandbox: true` — which runtime is default? Local vs docker/worktree must stay honest in tradeoffs.

### command-code (ledger 21 after workflow slice — **applied 2026-07-27**)

| URL | Why useful | conf |
|---|---|---|
| https://commandcode.ai/docs/ | Docs hub / product map | high |
| https://commandcode.ai/docs/worktrees | Git worktree isolation | high |
| https://commandcode.ai/docs/sessions | Sessions + checkpoints surface | high |
| https://commandcode.ai/docs/goal | Multi-turn goal autonomy | high |
| https://commandcode.ai/docs/memory | Durable memory | high |
| https://commandcode.ai/docs/taste | Taste profiles (product differentiator) | high |
| https://commandcode.ai/docs/settings | Config hierarchy | high |
| https://commandcode.ai/docs/plan-mode | Plan mode | high |
| https://commandcode.ai/docs/interactive-mode | Interactive defaults | high |
| https://commandcode.ai/docs/background-tasks | Background automation | high |
| https://commandcode.ai/docs/whats-new | Version/surface changelog | high |
| https://commandcode.ai/docs/mods | Mods extensibility | medium |
| https://commandcode.ai/docs/studio | Studio control plane | medium |
| https://commandcode.ai/docs/workflows | Common workflows | low for claims |

Security page **already in ledger** (`/docs/resources/security`).

### qwen-code (ledger 17 after daemon and extension slice — **applied 2026-07-27**)

| URL | Why useful | conf |
|---|---|---|
| https://qwenlm.github.io/qwen-code-docs/en/users/overview/ | Product overview | high |
| https://qwenlm.github.io/qwen-code-docs/en/developers/tools/mcp-server/ | MCP servers | high |
| https://qwenlm.github.io/qwen-code-docs/en/users/extension/introduction/ | Extensions pack subagents/skills/MCP | high |
| https://qwenlm.github.io/qwen-code-docs/en/users/qwen-serve/ | Daemon / multi-client headless HTTP | high |
| https://qwenlm.github.io/qwen-code-docs/en/users/integration-jetbrains/ | JetBrains ACP | high |
| https://qwenlm.github.io/qwen-code-docs/en/blog/updates/weekly-update-2026-07-09/ | Nested subagents depth | high |
| Newer weekly updates after 2026-06-04 pin | Version surface | medium |

### aider (ledger 18 after privacy and release-provenance slice — **applied 2026-07-27**)

| URL | Why useful | conf |
|---|---|---|
| https://aider.chat/docs/legal/privacy.html | Privacy / data handling | high |
| https://aider.chat/HISTORY.html | Release history (version pin) | high |
| https://github.com/Aider-AI/aider/releases | GitHub releases (latest tag) | high |
| https://aider.chat/docs/faq.html | Operational FAQ | medium |

**No first-party OS sandbox docs found** — do not add third-party CodeGate as evidence.

### openhands (ledger 23 after operations slice — **applied 2026-07-27**)

| URL | Why useful | conf |
|---|---|---|
| https://docs.openhands.dev/openhands/usage/cli/installation | CLI install / settings path | high |
| https://docs.openhands.dev/openhands/usage/cli/mcp-servers | CLI MCP management | high |
| https://docs.openhands.dev/openhands/usage/automations/overview | Automations overview | high |
| https://docs.openhands.dev/openhands/usage/automations/event-automations | Event-driven automation | high |
| https://docs.openhands.dev/openhands/usage/advanced/custom-sandbox-guide | Custom sandbox images | high |
| GitHub release tag for current OpenHands version | Version pin | high |

### factory-droid (ledger 15 after configuration slice — **applied 2026-07-27**)

| URL | Why useful | conf |
|---|---|---|
| https://docs.factory.ai/cli/configuration/settings | Settings incl. sandbox object, worktrees | high |
| https://docs.factory.ai/changelog/release-notes | macOS command sandbox and security-review notes | high (already partially used? **not** in evidence list — add) |
| Explicit browser/MCP pages if linked from docs nav | browser feature | medium — re-check nav |

### opencode — applied 2026-07-27

| URL | Why useful | conf |
|---|---|---|
| ~~https://github.com/anomalyco/opencode/security~~ | **Applied as immutable v1.18.5 `SECURITY.md`:** no built-in sandbox; permissions are UX not isolation | high |

### cline / copilot-cli / kimi-code / amp / coder-agents

Live search did **not** surface large new first-party pages clearly outside the existing dense sets for copilot-cli. For these:

- Prefer **release pins** and any dedicated security page found on next pass
- **codebuff:** no dedicated first-party security URL found in search — leave gap open rather than invent

### claude-code residual — curated and applied 2026-07-27

| URL | Host issue |
|---|---|
| https://www.anthropic.com/engineering/claude-code-sandboxing | Excluded as overlap with the existing granular sandbox/runtime records |
| ~~https://www.anthropic.com/engineering/claude-code-auto-mode~~ | Applied; `www.anthropic.com` allowlisted |
| ~~https://code.claude.com/docs/en/zero-data-retention~~ | Applied |

### codex residual (applied 2026-07-27)

The curated high-signal subset from §3 is now in the ledger. Broad, overlapping, stale, or low-value candidates remain excluded intentionally.

- `/codex/sandboxing`, `/sandboxing/auto-review`, `/permission-modes`, `/agent-configuration/agents-md`, `/agent-configuration/rules`, `/app`, `/auth`, `/overview`, `/windows/windows-sandbox`, `/enterprise/admin-setup`, `/mcp-server`, `/skills-and-plugins`, runtime env pages, `/third-party/github`, `/feature-maturity`, `/whats-new`, `/pricing`

---

## 2c. Second recheck (web + X) — 2026-07-27

Method: web search on official docs hosts + X keyword/semantic search for product accounts and recent sandbox/security docs.
Compared again to live `harnesses.ts` evidence counts at discovery time (Claude **54**, Codex then **26** and now **46** after application).

### X findings (use carefully)

| Signal | First-party value? | Action |
|---|---|---|
| **@OpenAI** Codex Security plugin posts (Jul 2026) | Yes as *pointer* to official docs | Add docs pages under `developers.openai.com/codex/security*` if not in ledger |
| **@AnthropicAI** older Claude Code security-review post | Already covered by `code-review` / security-guidance docs path | Prefer docs URLs already partially expanded (Claude 54) |
| **@cursor_ai** CLI install / config / cookbook | Soft; points to `cursor.com/cli`, docs, github.com/cursor/cookbook | Cookbook = optional repo evidence; not security depth |
| Pillar Security / CVE / third-party sandbox-escape threads | **No** for capability claims | Context/tradeoff only, never as `evidence[]` capability source |
| Generic “harness engineering” viral threads | **No** | Ignore for ranking |

**Rule:** X is a discovery channel. Merge only the **official docs/repo/release** URLs the posts point to.

### New first-party candidates found this pass (not already in §2b / not in ledger)

#### codex — Codex Security product surface (from OpenAI posts + docs index)

| URL | Why | conf |
|---|---|---|
| https://developers.openai.com/codex/security | Codex Security overview (plugin/cloud vuln workflows) | high |
| https://developers.openai.com/codex/security/plugin | Security plugin quickstart | high |
| https://developers.openai.com/codex/security/setup | Cloud security setup | high |
| https://developers.openai.com/codex/security/plugin/scans | Running scans | high |
| https://developers.openai.com/codex/security/threat-model | Threat model for findings | medium |

Still **also missing** the earlier high-value harness pages: sandboxing, permission-modes, agents-md, app, auth, etc. (§2b/§3).

#### grok-build (24) — docs.x.ai build tree gaps **applied 2026-07-27**

Already has sandbox, permissions, worktrees, skills-plugins, enterprise, settings/reference. Still useful if not present:

| URL | Why | conf |
|---|---|---|
| https://docs.x.ai/build/features/mcp-servers | MCP config, scopes, OAuth, compat with Claude/Cursor MCP files | high |
| https://docs.x.ai/build/settings | Settings hierarchy (user/project/requirements) | high |
| https://docs.x.ai/build/cli/reference | CLI flags for sandbox/permissions | high |

#### kilo-code (27) — sandbox-boundary slice applied 2026-07-27

| URL | Why | conf |
|---|---|---|
| ~~https://blog.kilo.ai/p/kilo-sandbox-run-auto-mode-without~~ | Applied; OS sandbox vs permissions, read scope, network deny, and limits | high |
| ~~https://kilo.ai/cli~~ | Applied; `/sandbox` and automation surface | high |
| ~~https://kilo.ai/docs/contributing/architecture/cloud-security~~ | Applied; separate Cloud Agent sandbox architecture | high after live verification |

#### letta-code / Letta Harness (23) — MCP + tool execution model **applied 2026-07-27**

Ledger has computers/cloud-sandboxes but **not** MCP tools page; feature flag MCP is false — verify:

| URL | Why | conf |
|---|---|---|
| https://docs.letta.com/v1-sdk/tools/mcp-tools | MCP tools execution model | high |
| https://docs.letta.com/v1-sdk/tools/client-tools | Client-side bash vs server sandbox | high |
| https://docs.letta.com/guides/core-concepts/tools/builtin-tools/ | Sandboxed `run_code` | medium |
| https://docs.letta.com/platform/github-action | Automation surface | medium |
| https://docs.letta.com/letta-agent-sdk/deployment/ | Managed sandbox for SDK sessions | medium |

#### kiro-cli (21) — applied 2026-07-27

Has data-protection; parent privacy/security + v3 permissions may still be thin:

| URL | Why | conf |
|---|---|---|
| ~~https://kiro.dev/docs/cli/privacy-and-security/~~ | Applied; review workflow is not isolation or access control | high |
| ~~https://kiro.dev/docs/cli/v3/permissions/~~ | Applied; early-access declarative v3 rules | high |

#### hermes-agent (25)

Security user-guide + SECURITY.md **already in ledger**. No net-new first-party page required; GitHub security *issues* are **not** evidence.

#### openhands / factory / goose / cursor / mux / command-code / qwen / aider / opencode

Prior §2b list **confirmed again**; no better first-party replacements found this pass. Prioritize those URLs.

### Products where second pass found **little or no** net-new first-party gap

Dense / already covered enough for harness claims (polish-only):

- **claude-code** (56) — curated Auto mode/ZDR slice applied; sandboxing article excluded as overlap
- **hermes-agent**, **mistral-vibe**, **stagewise**, **zoo-code**, **forgecode**, **crush**, **kilo-code** (core docs present)
- **pi** (security + containerization already present)
- **amp**, **coder-agents**, **poolside-cli** (primary surfaces present)
- **antigravity-cli** / **gemini-cli** (transition + docs already intentional)
- **continue-cli** archived, **plandex** dormant

### Explicit non-sources from this pass

- Third-party sandbox escape writeups (Pillar, Ona, etc.)
- CVE records without first-party advisory URL
- Viral harness-engineering threads
- Model/cyber benchmark marketing unless tied to harness mechanism docs

### Revised merge priority after recheck

1. ~~**codex** — sandbox + permission-modes + security plugin docs + app/auth~~ **Applied**
2. ~~**goose** — security hub suite (§2b)~~ **Applied**
3. ~~**mux** — runtime/* + hooks + GHA (§2b llms.txt)~~ **Applied**
4. ~~**cursor-cli** — installation / using / mcp / auth (§2b)~~ **Applied**
5. ~~**command-code** + **qwen-code** — surface fill (§2b)~~ **Applied**
6. ~~**grok-build** MCP/settings pages~~ **Applied**
7. ~~**letta-code** MCP/client-tools~~ **Applied; MCP was already enabled and code-verifiable**
8. **kilo** blog/cli sandbox narrative (ledger-only unless defaults change)
9. ~~**aider** privacy + HISTORY~~ **Applied**
10. ~~**openhands** automations/custom sandbox~~ **Applied**

---

## 3. Per-harness candidate sources (background notes)

> **Confidence legend**
> `high` = official docs index / known product doc
> `medium` = likely first-party but must re-fetch
> `low` = discover/confirm before merge

For each item: fetch live → write `covers` from actual page → only then add to `evidence[]`.

---

### claude-code (56) — residual slice applied 2026-07-27

**Current hosts:** `code.claude.com`, `claude.com`, `github.com`
**Ranking note:** security 4 + host-first runtime already encode opt-in Bash sandbox. Do not raise security without fail-closed defaults.

| candidate | kind | claim area | conf |
|---|---|---|---|
| https://www.anthropic.com/engineering/claude-code-sandboxing | official-announcement | sandbox eng deep dive | high — **needs** `anthropic.com` in firstPartyHosts |
| https://www.anthropic.com/engineering/claude-code-auto-mode | official-announcement | auto mode classifier | high — same host allowlist |
| https://www.anthropic.com/engineering/how-we-contain-claude | official-announcement | containment layers | medium |
| https://code.claude.com/docs/en/zero-data-retention | official-docs | enterprise ZDR | high |
| https://trust.anthropic.com | official-docs | compliance (not scoring) | medium — host allowlist |

**Suggested ranking review:** none unless auto mode / sandbox defaults change.

---

### codex (46) — **slice applied 2026-07-27**

**Current hosts:** `developers.openai.com`, `github.com`
**Index:** https://developers.openai.com/codex/llms.txt (redirects via learn.chatgpt.com)

The table below is retained as the discovery record. The curated 20-source subset is listed in the application log; excluded overlaps remain non-evidence.

| candidate | kind | claim area | conf |
|---|---|---|---|
| https://developers.openai.com/codex/sandboxing | official-docs | sandbox across clients | high |
| https://developers.openai.com/codex/sandboxing/auto-review | official-docs | sandbox-boundary reviewer | high |
| https://developers.openai.com/codex/permission-modes | official-docs | approval UX modes | high |
| https://developers.openai.com/codex/agent-configuration/rules | official-docs | elevated command rules | high |
| https://developers.openai.com/codex/agent-configuration/agents-md | official-docs | persistent project guidance | high |
| https://developers.openai.com/codex/app | official-docs | desktop multi-agent surface | high |
| https://developers.openai.com/codex/auth | official-docs | ChatGPT vs API auth | high |
| https://developers.openai.com/codex/overview | official-docs | product overview | high |
| https://developers.openai.com/codex/config-file/config-basic | official-docs | config basics | high |
| https://developers.openai.com/codex/config-file/config-reference | official-docs | full config.toml | high |
| https://developers.openai.com/codex/windows/windows-sandbox | official-docs | Windows native sandbox | high |
| https://developers.openai.com/codex/security-administration | official-docs | admin safety | high |
| https://developers.openai.com/codex/enterprise/admin-setup | official-docs | enterprise rollout | high |
| https://developers.openai.com/codex/skills-and-plugins | official-docs | extensibility | high |
| https://developers.openai.com/codex/mcp-server | official-docs | Codex as MCP server | high |
| https://developers.openai.com/codex/environments/local-environment | official-docs | worktree setup scripts | high |
| https://developers.openai.com/codex/environments/cloud-environment | official-docs | cloud deps | high |
| https://developers.openai.com/codex/code-review | official-docs | review workflows | high |
| https://developers.openai.com/codex/third-party/github | official-docs | PR review automation | high |
| https://developers.openai.com/codex/feature-maturity | official-docs | beta vs GA labels | high |
| https://developers.openai.com/codex/whats-new | official-docs | version digest | high |
| https://developers.openai.com/codex/amazon-bedrock | official-docs | Bedrock enterprise path | high |
| https://developers.openai.com/codex/pricing | official-docs | plan inclusion | high |
| https://developers.openai.com/codex/remote-connections | official-docs | SSH / remote host | high |
| https://openai.com/index/introducing-the-codex-app/ | official-announcement | app launch | medium — needs `openai.com` host |

**Operational profile add-ons (after evidence merge):**
sandboxing, permission-modes, agents-md

**Ranking review questions:**

- Keep `checkpoints: false`? (session resume + Git review, not product file checkpoint)
- Keep security 5 if local sandbox defaults remain network-off + write-limited?
- Permission profiles beta → humanControl stays 4?

---

### opencode (25) — security-policy slice applied 2026-07-27

| candidate | kind | claim area | conf |
|---|---|---|---|
| https://github.com/anomalyco/opencode/security | official-repository | **explicit no built-in sandbox** | high |
| https://opencode.ai/docs/ecosystem/ | official-docs | ecosystem / external sandbox plugins | medium |
| https://opencode.ai/docs/ (sessions/share deeper pages if split) | official-docs | session lifecycle | medium |
| Latest release tag beyond v1.18.5 if shipped | official-announcement | version pin | medium |

**Ranking review:** security 3 + no sandbox feature already match; security.md should **reinforce**, not raise, scores.

---

### pi (19)

| candidate | kind | claim area | conf |
|---|---|---|---|
| https://pi.dev/docs/latest/ (any new ACP / TUI / tools pages) | official-docs | surface completeness | medium |
| Latest release after v0.82.1 | official-announcement | version | medium |
| SECURITY / CONTRIBUTING in repo if present | official-repository | ops | low |

**Ranking review:** keep security 2 / no permission gate unless docs change.

---

### omp (15)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs on omp.sh product pages not yet in evidence | official-docs | product overview depth | medium |
| stats/memory/settings deeper files in repo docs/ | official-repository | yolo defaults | medium |
| newer release than v17.1.4 | official-announcement | version | medium |

**Ranking review:** yolo default → humanControl 3 remains.

---

### grok-build (21)

| candidate | kind | claim area | conf |
|---|---|---|---|
| https://docs.x.ai/build/overview | official-docs | already may overlap; confirm full build/* tree | high |
| user-guide pages under repo `crates/codegen/xai-grok-pager/docs/user-guide/` not yet linked | official-repository | memory/OTEL/sandbox detail | medium |
| latest release/changelog pin | official-announcement | version | medium |

---

### aider (15)

| candidate | kind | claim area | conf |
|---|---|---|---|
| https://aider.chat/docs/ (security/privacy if exists) | official-docs | security | medium |
| GitHub releases latest pin | official-announcement | version | high |
| https://github.com/Aider-AI/aider (SECURITY.md if any) | official-repository | security | medium |
| cont-browser / analytics pages already partial — complete any missing privacy | official-docs | browser default-off | medium |

**Gap flag:** inventory shows weak security-source signal — fix before any security ordinal change.

---

### openhands (17)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.openhands.dev security / sandbox / runtime pages not yet listed | official-docs | isolation | medium |
| GitHub release pin | official-announcement | version | high |
| evaluation docs (careful: not model leaderboard) | official-docs | harness eval assets only | medium |

---

### goose (19) — security slice applied

| candidate | kind | claim area | conf |
|---|---|---|---|
| goose-docs.ai security / recipes / extensions / MCP depth | official-docs | sandbox + tools | high |
| release/changelog | official-announcement | version | high |
| github.com/block/goose tree pin | official-repository | code-verifiable | medium |

---

### cline (18)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.cline.bot enterprise / checkpoints / browser / yolo | official-docs | defaults | medium |
| release pin | official-announcement | version | high |

---

### gemini-cli (13) + antigravity-cli (14)

| candidate | kind | claim area | conf |
|---|---|---|---|
| keep consumer transition blog current | official-announcement | product split | high |
| antigravity.google/docs/cli/* remaining pages (telemetry, skills, hooks, privacy) | official-docs | defaults | high |
| geminicli.com any post-0.52 stable notes | official-docs | enterprise-only path | medium |

**Ranking review:** ensure recommender gates treat consumer vs enterprise access correctly (`supportsEnterpriseAccess` / subscription fields).

---

### copilot-cli (14)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.github.com copilot CLI sandbox / custom agents / MCP remaining pages | official-docs | isolation | high |
| release notes | official-announcement | version | medium |

---

### cursor-cli (15) — product-surface slice applied

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.cursor.com agent / CLI / sandbox / rules / MCP / headless | official-docs | full surface | high |
| cursor.com changelog / blog for CLI | official-announcement | version | medium |
| github.com/cursor/* support tree if used | official-repository | support-only caveat | medium |

**Ranking review after sources:** security 4 + sandbox true must match default CLI sandbox behavior, not editor-only claims.

---

### junie-cli (13)

| candidate | kind | claim area | conf |
|---|---|---|---|
| junie.jetbrains.com docs on permissions, skills, remote, MCP | official-docs | control surface | high |
| JetBrains release notes | official-announcement | version | medium |

---

### factory-droid (13)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.factory.ai security / sandbox / droid exec / browser / org policy | official-docs | isolation + automation | high |
| factory.ai product announcements | official-announcement | version | medium |

---

### forgecode (24)

| candidate | kind | claim area | conf |
|---|---|---|---|
| forgecode.dev security / permissions defaults pages if any missing | official-docs | restrictive-rules optional | medium |

**Ranking review:** security 2 is intentional (optional rules). Do not raise without default-on isolation.

---

### qwen-code (11) — **under-sourced**

| candidate | kind | claim area | conf |
|---|---|---|---|
| qwenlm.github.io/qwen-code (or current docs host) sandbox, agents, browser, MCP, memory | official-docs | full surface | high |
| GitHub release pin | official-announcement | version | high |

---

### continue-cli (archived, 4)

**Do not expand for recommender.** Only historical ledger maintenance.

---

### mistral-vibe (26)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.mistral.ai CLI vs managed web separation pages | official-docs | surface split | medium |
| confirm no OS sandbox claim | official-docs | security 4 without sandbox feature | high |

---

### kimi-code (12)

| candidate | kind | claim area | conf |
|---|---|---|---|
| moonshotai.github.io/kimi-code customization, agents, MCP, security | official-docs | depth | high |
| release pin | official-announcement | version | high |

---

### letta-code (14)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.letta.com sandbox / agents / memory / ADE | official-docs | persistent memory | high |
| MCP support page if feature flag should flip | official-docs | **feature review** | medium |

**Ranking review:** `features.mcp` is false while many peers true — confirm docs.

---

### kilo-code (27) — sandbox-boundary slice applied 2026-07-27

| candidate | kind | claim area | conf |
|---|---|---|---|
| kilo.ai / github docs for default permission mode | official-docs | defaults | medium |

---

### command-code (9) — **under-sourced**

| candidate | kind | claim area | conf |
|---|---|---|---|
| commandcode.ai/docs security, checkpoints, subagents, headless, MCP, yolo | official-docs | full surface | high |
| GitHub if public core | official-repository | audit | medium |

---

### codebuff (15)

| candidate | kind | claim area | conf |
|---|---|---|---|
| www.codebuff.com docs security / isolation / browser | official-docs | **missing security signal** | high |
| release notes | official-announcement | version | medium |

---

### crush (20)

| candidate | kind | claim area | conf |
|---|---|---|---|
| charm.land / hyper.charm.land remaining security pages | official-docs | host execution | medium |

---

### mux (26) — runtime slice applied

| candidate | kind | claim area | conf |
|---|---|---|---|
| mux.coder.com security / sandbox / agents / MCP | official-docs | **security gap in ledger** | high |
| GitHub pin | official-repository | code | medium |

---

### coder-agents (20)

| candidate | kind | claim area | conf |
|---|---|---|---|
| coder.com docs for self-hosted MCP, desktop, sandbox | official-docs | isolation | medium |
| release pin | official-announcement | version | high |

---

### zoo-code (27)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.zoocode.dev headless status (confirm still private/unverified) | official-docs | headless false | high |

---

### zcode (16)

| candidate | kind | claim area | conf |
|---|---|---|---|
| zcode.z.ai docs only; avoid model marketing pages | official-docs | harness mechanisms | high |

---

### stagewise (27)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.stagewise.io MCP if product adds it | official-docs | feature flag | medium |

---

### hermes-agent (25)

| candidate | kind | claim area | conf |
|---|---|---|---|
| hermes-agent.nousresearch.com + GitHub SECURITY defaults | official-docs | optional safety on by default? | medium |

---

### mini-swe-agent (23)

| candidate | kind | claim area | conf |
|---|---|---|---|
| mini-swe-agent.com security + bubblewrap env pages already strong; pin latest release | official-announcement | version | medium |

**Benchmark note:** only complete Terminal-Bench style configs belong in `benchmark-runs.ts`.

---

### amp (19)

| candidate | kind | claim area | conf |
|---|---|---|---|
| ampcode.com/security already present; add version/changelog if exists | official-announcement | version | medium |
| orbs vs local permission default pages | official-docs | security 3 justification | high |

---

### kiro-cli (21) — review and v3-policy slice applied 2026-07-27

| candidate | kind | claim area | conf |
|---|---|---|---|
| kiro.dev docs CLI v2 stable vs v3 experimental already split — keep separate claims | official-docs | no sandbox | high |

---

### poolside-cli (18)

| candidate | kind | claim area | conf |
|---|---|---|---|
| docs.poolside.ai trajectories / rewind vs checkpoint clarity | official-docs | recovery | medium |

---

### plandex (dormant, 25)

Only if status → active: re-verify self-host docs + cgroup sandbox claims; currently dormant and excluded from recommender.

---

## 4. Cross-cutting source patterns to prefer

When browsing any product docs index / `llms.txt`, prioritize pages that support **harness** claims:

1. Security / sandbox / permissions / approvals
2. Headless / CI / SDK / automation
3. Subagents / parallel / worktrees
4. Checkpoints / rewind / session resume (distinguish carefully)
5. MCP / plugins / skills / hooks
6. Memory / AGENTS.md / rules (durable state)
7. Enterprise managed settings
8. Versioned release / changelog
9. Open-source boundary (what is public vs proprietary)

Deprioritize:

- model cards and LMSYS-style leaderboards
- unaudited third-party blogs
- affiliate roundups
- incomplete eval tables without budget/sandbox/attempt metadata

---

## 5. Suggested PR slices for the follow-up agent

| PR | Scope | Ranking expected? |
|---|---|---|
| A | Codex evidence + operational profile URLs + tests | **Applied 2026-07-27; ledger only** |
| B | cursor-cli + command-code + qwen-code evidence expansion | Maybe feature/security review |
| C | goose + mux + codebuff + aider security/version sources | **Goose and Mux applied; codebuff and Aider pending** |
| D | gemini-cli / antigravity-cli transition hygiene | Access gates |
| E | Residual claude-code eng sources + host allowlist | **Applied 2026-07-27; ledger only** |

Each PR: update `verifiedAt` consistently for touched harnesses; extend `tests/harnesses.test.ts` URL contains assertions for that product.

---

## 6. Explicit non-goals of this packet

- Do not bulk-raise capability scores because source count increased.
- Do not add Terminal-Bench rows without full configuration metadata.
- Do not mark support-only GitHub trees as `code-verifiable` product source.
- Do not merge Claude Code and Codex model performance into harness ranking.

---

## 7. Handoff note for Codex / Claude

You are receiving a **research queue**, not a ranking mandate.

1. The Kilo Code, Kiro CLI, OpenCode, and Claude Code residual candidates are complete. Continue only with new release-driven first-party evidence or the explicitly weak Cline, Kimi Code, and Codebuff gaps; do not bulk-add overlap.
2. After each harness, run `npm test`.
3. If you change any ordinal or feature flag, add/adjust a recommendation test that names the workflow outcome.
4. When done with a harness, check the boxes in §0 ranking review and record “ledger only” vs “score change” in the PR description.
5. Update this file’s status line to `partially-applied` / `done` with date when you finish a slice.

**Packet author:** Grok research pass (source discovery).
**Next owner:** implementing agent (Codex or Claude) with live verification.
