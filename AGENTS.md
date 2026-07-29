# HarnessMatch contributor guide

## Product mission

HarnessMatch is an evidence-backed decision tool for choosing an AI coding harness by workflow fit. It is not a generic model leaderboard, an affiliate ranking site, or a marketing landing page.

The GUI catalog answers a separate decision question: which graphical interface or multi-harness workspace fits a workflow. Do not merge GUI fit into the coding-harness recommender, transfer capabilities between the two catalogs, or imply that a control plane inherits the capabilities of the harnesses it launches.

Design for technically aware users, including vibe coders, who need a clear recommendation without reading the entire methodology first. Prefer a data-first, restrained interface inspired by Vercel, Linear, Cursor, and strong analysis products. Every prominent visual must help comparison or decision-making; avoid decorative hero imagery, inflated claims, and sales copy.

Keep the public interface in English until localization is explicitly reopened.

## Technical shape

- Next.js App Router with static export
- React and TypeScript
- Tailwind CSS v4 plus project-level CSS in `src/app/globals.css`
- Repository-backed product, evidence, classification, and evaluation data
- Deterministic recommendation logic in `src/lib/recommendation.ts`
- Visible scoring inputs and value functions in `src/lib/recommendation-config.ts`
- Separate repository-backed GUI records with non-numeric workflow classification in `src/lib/gui-fit.ts`
- Vitest contracts for ranking, classification, evidence, freshness, SEO, and validation
- GitHub quality gate and Vercel Git deployment from `main`

## Scientific and editorial invariants

1. Keep model capability separate from harness capability. A model benchmark, provider claim, or model reputation cannot establish a harness capability.
2. A product enters the default coding-harness recommender only when first-party evidence documents all four membership criteria in `src/data/harness-membership.ts`:
   - adaptive agent loop;
   - repository tool execution;
   - task-aware context management;
   - model-independent runtime control.
3. Keep neighboring layers explicit. External-harness orchestrators, frameworks or runtimes, adjacent tools, pure IDE plugins, and evaluation harnesses must not be ranked as coding harnesses unless they independently satisfy the four membership criteria.
4. Membership establishes category fit only. It is not evidence of quality, safety, autonomy, benchmark performance, or suitability for every workflow.
5. Product capability claims require a traceable first-party source and a verification date. Prefer official documentation, official repositories pinned to an inspected commit when implementation details matter, official release notes, and official benchmark records admitted by the benchmark policy.
6. Scientific papers and expert analyses may shape taxonomy, evaluation design, uncertainty handling, and validation plans. They do not establish the current capabilities of a named product.
7. OpenRouter, GitHub search, app directories, social posts, third-party reviews, and language-model output are discovery aids only. They can create a watchlist candidate or identify a source to inspect; they cannot establish a published capability by themselves.
8. AI-assisted research is source-governed. Agreement among multiple models is not validation, and a model response is never a source.
9. Source count and documentation volume do not add recommendation points. A source refresh changes a classification or score only when the newly verified evidence changes an admitted underlying claim.
10. Unknown and contradicted are different states. Missing evidence must never be converted into evidence of absence, silently scored as zero, or renormalized away.
11. Do not add benchmark results unless the exact model, harness version, benchmark and dataset version, reasoning or token policy, budget, sandbox or environment, attempts, run date, cost, integrity status, and primary source are recorded. Benchmark outcomes belong to that measured configuration, not to the product in general.
12. Archived or dormant tools may remain visible for research but must not appear in recommender results or active benchmark rankings.
13. The recommender expresses preference fit for declared answers, not universal product quality. Public percentages describe rank robustness across deterministic sensitivity scenarios, not task-success probability. Do not expose the internal 0–100 value function as a measured quality grade.
14. Scoring, thresholds, gates, and value functions must be visible in code and explained in methodology copy. Avoid hidden magic constants.
15. Scoring or eligibility changes require tests that describe the intended workflow outcome and preserve the model-versus-harness boundary.

## GUI catalog invariants

1. Keep GUI products separate from coding harnesses. `harness-native` and `multi-harness-workspace` describe the interface layer; neither is a quality tier.
2. A GUI capability may be `documented`, `unknown`, or `contradicted`. A documented claim requires direct first-party support and a verification date. Unknown is uncertainty, not evidence of absence.
3. GUI fit is deterministic and non-numeric. Required mechanisms are evidence gates, preferred mechanisms distinguish strong from good fit, unresolved requirements remain conditional, and contradicted requirements or inactive products are not eligible.
4. Products remain alphabetical inside each GUI fit band. Do not introduce hidden scores, source-count bonuses, popularity signals, star counts, or license preferences into GUI fit.
5. Named harness support and arbitrary CLI support are distinct claims. An integration name does not establish feature parity, native authentication, subscription compatibility, history, interruption, resume, or any capability of the underlying harness.
6. A GUI never inherits model or harness capability from a supported provider. Likewise, a harness does not inherit remote execution, collaboration, isolation, or review features from a GUI that can launch it.
7. Public-code findings require an official repository pinned to an exact inspected commit and path list. Proprietary products may remain eligible on first-party documentation and must not be penalized merely because implementation code is unavailable.
8. Source count, public-code availability, license, and logo provenance are evidence metadata, not workflow-fit inputs.
9. Archived or dormant GUIs must remain outside active workflow matches and indexable GUI profile routes. Keep research exclusions explicit rather than silently deleting prior classification decisions.
10. Changes to GUI workflows, required or preferred mechanisms, fit-band rules, or eligibility require outcome-focused tests and matching methodology copy.
11. Preview media is optional context, not capability evidence. Keep local media, poster, intrinsic dimensions, useful alt text, caption, first-party source or clearly labeled editorial-capture provenance, and verification date aligned. A replaced preview must be checked at desktop and mobile sizes.

## Evidence dates and freshness

- Store verification dates as ISO UTC calendar days (`YYYY-MM-DD`). Automated runs should derive the date from UTC (for example `date -u +%F`) so a run near local midnight never publishes a future date.
- A verification date means the underlying source was actually reopened and the published claim was checked on that date. Never advance `verifiedAt` merely because an automation ran, a file was edited, or another source for the same product was refreshed.
- Every new dated record type must be registered in `verifiedRecords()` in `src/lib/evidence-freshness.ts`; otherwise it ages without any check noticing.
- `tests/evidence-freshness.test.ts` reads the wall clock by design. A failure means sources are overdue for re-verification, not that the test is flaky. Re-verify the sources or archive the claims; do not widen the thresholds to make the test pass.
- Preserve the distinction between a current product record, a repository snapshot pinned to a commit, and a dated measured configuration.
- If a source is temporarily unavailable or ambiguous, do not automatically delete or downgrade a published claim. Hold it for review and record the limitation.

## Change propagation checklist

Editing one product file is rarely sufficient. For every product addition, removal, archival, or source-backed capability change, review all affected records and tests:

1. Base product, capabilities, trade-offs, first-party evidence, logo provenance, and overall verification date: `src/data/harnesses.ts`.
2. Claim-level support, contradiction, or unknown state: `src/data/feature-claims.ts`.
3. Catalog layer and four membership criteria: `src/data/harness-membership.ts`.
4. Context, permissions, verification, observability, and recovery posture: `src/data/operational-profiles.ts`.
5. Public-code signals and inspected commit, when an official repository is available: `src/data/repository-audits.ts`.
6. Configuration-specific measured results, only when admissible: `src/data/benchmark-runs.ts`.
7. Context-only usage snapshots, when present: `src/data/openrouter-attribution.ts` and `src/data/ecosystem-signals.ts`. The separate factual release feed is generated in `src/data/release-signals.json`; do not hand-edit generated values. All three are refreshed by `npm run sync:usage`. OpenRouter page totals, most-used windows, and 7-day or 30-day trending windows have separate dates and scopes. Trending rank follows OpenRouter's excess token-growth ordering; the API supplies current-window volume but not the excess amount or a growth percentage, so never infer either. Homebrew, npm, filtered stable GitHub release assets, VS Code Marketplace, Open VSX, JetBrains Marketplace, and GitHub repository interest retain their native units, windows, populations, and explicit artifact mappings. Download mappings must isolate the user-facing harness distribution from prereleases, checksums, source archives, SDKs, GUI packages, and unrelated monorepo artifacts. The independent harness release watchlist in `scripts/lib/release-watch-mappings.mjs` may include a stable official release feed even when no asset-download metric is admissible; keep its product-specific tag filters and canonical repository-audit join explicit. Public version, publication date, official URL, and 90-day cadence come only from the validated GitHub release feed, never from GPT output. New watched stable versions may create GPT-OSS editorial triage in `research/release-review-queue.json`, but that queue is never evidence and cannot propagate into claims or scores without first-party verification. Never add these signals together or use them as capability evidence or scoring inputs. Keep home release activity, profile context, the data ledger, freshness records, methodology, and tests aligned with any schema change.
8. Discovery-only candidates that are not ready for the ranked catalog: `src/data/discovery-watchlist.ts`.
9. Freshness registration: `src/lib/evidence-freshness.ts`.
10. Product-specific and cross-dataset contracts in `tests/`.
11. User-facing methodology or data-ledger copy when interpretation changes.

When changing the recommendation model, update `src/lib/recommendation.ts`, `src/lib/recommendation-config.ts`, the methodology page, and outcome-focused tests together. When adding a new question, update the answer types, eligibility or scoring behavior, recommender UI, methodology, and tests together.

When changing taxonomy or evaluation terminology, keep the catalog, profiles, comparison UI, recommender exclusions, methodology, `llms.txt`, and tests consistent.

For every GUI addition, removal, archival, or source-backed capability change, review all affected records and tests:

1. Product identity, status, layer, platform support, source access, license, harness coverage, logo and preview provenance, claims, evidence, and verification dates: `src/data/guis/` and preview assets in `public/gui-previews/`.
2. Active catalog exports and capability labels: `src/data/guis/index.ts` and `src/data/gui-products.ts`.
3. Explicitly excluded or sunset GUI products: `src/data/guis/exclusions.ts`.
4. Official repository inspection at a pinned commit, when public implementation is available: `src/data/gui-audits/` and `src/data/gui-repository-audits.ts`.
5. Workflow definitions and deterministic fit-band behavior: `src/lib/gui-fit.ts` and `src/lib/gui-types.ts`.
6. Freshness registration for products, logos, claims, sources, audits, and exclusions: `src/lib/evidence-freshness.ts`.
7. GUI classification, provenance, SEO, sitemap, and freshness contracts in `tests/`.
8. GUI pages, methodology, navigation, search, sitemap, and `llms.txt` when public interpretation or routes change.

Do not add a GUI only to the aggregate export. Each product belongs in its own record file, and every documented capability must link to the first-party evidence that establishes it.

## SEO, domain, and public identity

- The sole canonical origin is `https://harnessmatch.dev`, defined centrally in `src/lib/site.ts`.
- `www.harnessmatch.dev` and `harnessmatch.vercel.app` are secondary hosts that permanently redirect to the canonical origin. Do not use them in canonical tags, sitemap URLs, structured data, social metadata, or public documentation.
- Every indexable page must have a page-specific canonical URL and useful title and description. Use the shared metadata helpers in `src/lib/site.ts`.
- A new or renamed public route is not complete until it has one descriptive H1, page-specific canonical/title/description/Open Graph/Twitter metadata, an intentional internal-link path, and sitemap treatment that matches its indexability.
- GUI routes follow the same contract: `/guis` is the workflow-classification index and each active `/guis/[slug]` profile must have unique metadata, an evidence path, and a canonical sitemap entry.
- Keep metadata descriptions unique and within the SiteGuru-audited 120–170 character range. Write useful summaries for humans; do not keyword-stuff or create filler pages for SEO, GEO, or AEO.
- Social metadata must describe the current page. Do not let non-home routes inherit generic homepage Open Graph or Twitter values.
- Keep the root `WebSite` JSON-LD valid. Add richer structured data only when every field is truthful, supported by the page, and source-backed when it includes a capability claim.
- Keep `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, page metadata, and `vercel.json` aligned after route or domain changes.
- `robots.txt` intentionally allows compliant crawlers. Any AI-crawler policy change must distinguish search/retrieval bots from model-training bots and be treated as an explicit product and privacy decision. Do not add non-standard `llms.txt` directives to `robots.txt`.
- `llms.txt` is a machine-readable orientation guide, not access control or a ranking guarantee. Generate it from repository data, list only active profiles, preserve the model-versus-harness distinction and evidence-date caveats, and update its tests when the contract changes.
- Keep canonical-domain references in `README.md` aligned with the deployed site.
- A sitemap `lastmod` value must represent a real, significant change to that page's primary content. Omit it when no reliable page-level date exists. Do not use `priority` or `changefreq` as ranking signals.
- Keep only canonical, indexable, successful URLs in the sitemap. Do not add redirected, archived, parameterized, or `noindex` URLs.
- SiteGuru results may lag behind production. Before changing code for a reported issue, compare the report's captured title, description, and canonical URL with the live response; re-run the audit after deployment instead of coding against stale findings.
- After SEO or crawler-discovery changes, run the full quality sequence and inspect the static export for page canonical/title/description, Open Graph/Twitter metadata, JSON-LD, `out/robots.txt`, `out/sitemap.xml`, and `out/llms.txt`. After deployment, smoke-test the same resources on the canonical origin.
- HarnessMatch is an independent personal project. The only public contact detail is `lucenz@proton.me`. Do not add a legal name, street address, telephone number, VAT number, company details, newsletter, advertising tracker, or additional personal information unless explicitly requested.
- Vercel Web Analytics is the only intended visitor analytics integration. Any new analytics, cookies, forms, accounts, or third-party data collection requires an explicit privacy review and corresponding disclosure before release.

## Automation and deployment policy

- Scheduled maintenance is intended to update the site automatically through direct commits to `main`; do not open pull requests unless explicitly requested.
- Scheduled catalog maintenance covers both harness and GUI records while preserving their separate taxonomies, evidence rules, and decision outputs.
- The dedicated usage refresh runs daily. It may update generated OpenRouter, Homebrew, npm, filtered GitHub release, VS Code Marketplace, Open VSX, JetBrains Marketplace, and GitHub repository context data, the factual stable-release feed, derived public views, the static usage CSV, and the repository-only release-review queue. Release triage reads the already validated factual release feed rather than inferring coverage from downloadable assets or model output; it must never reinterpret popularity or model triage as capability, quality, task success, or workflow fit.
- Every scheduled catalog run must execute `npm run sync:usage` before deciding that no data changed. OpenRouter most-used and trending rows must join by stable app id, retain their ranking mode, and preserve exact completed UTC windows. Every other source must join through the reviewed exact artifact mapping or the canonical repository audit. Sync must fail closed on an identity, schema, source, window, or API error. A missing source mapping remains missing; it is never emitted as zero.
- Automation must fail closed. Before committing or pushing, run the same quality sequence as CI: `npm ci`, `npm run typecheck`, `npm test`, and `npm run build`.
- Do not push when a validation step fails, evidence is conflicting, a required source cannot be verified, or the local worktree contains unrelated changes that cannot be preserved safely.
- Start automated work from the current remote `main`, verify that `main` has not advanced before pushing, and never force-push or bypass branch protections and quality gates.
- Preserve unrelated user changes. Do not overwrite, clean, reset, or reformat files outside the task.
- Automated source refreshes may publish straightforward, first-party-supported corrections. Ambiguous classification, methodology, or scoring changes must be supported by explicit evidence and tests; otherwise leave a review note or watchlist record instead of guessing.
- A successful push is not the end of deployment verification. Confirm that the Vercel production deployment is ready and smoke-test the canonical domain, sitemap, robots file, redirects, and the changed user path when tooling is available.
- `.github/workflows/quality.yml` is the repository quality gate. Do not weaken or skip it to make an automated update pass.
- `.github/workflows/daily-usage-refresh.yml` is the zero-touch daily usage transaction. It may commit only `src/data/openrouter-attribution.ts`, `src/data/ecosystem-signals.ts`, `src/data/release-signals.json`, and the repository-only `research/release-review-queue.json`; it must dispatch the quality gate for the published commit and verify the matching production deployment before reporting success. The factual release JSON is synchronized and validated before GPT-OSS may triage a newly observed release into the queue. GPT output is never evidence and cannot change capability, taxonomy, recommendation, or scoring records.
- Review dependency advisories explicitly with `npm audit --json`. Record severity, direct or transitive status, affected runtime or build surface, fix availability, and the decision taken. Never run `npm audit fix --force`, accept an unrelated major downgrade suggested by npm, or silently ignore a high or critical finding. Framework or dependency upgrades require a scoped change, lockfile review, the full quality sequence, and production verification.

### Required update transaction

An automated run that changes the repository is incomplete until every applicable step below is recorded. A skipped applicable step blocks publication; it is not a warning to ignore.

1. **Synchronize:** start on a clean local `main`, fetch and fast-forward from `origin/main`, record the starting commit, and stop on unrelated changes or divergence.
2. **Establish:** identify the exact claim, product, route, or defect being changed; reopen the admitted source; record what it establishes, its limitations, and the real observation or verification date.
3. **Propagate:** walk the relevant harness or GUI change-propagation checklist above. The run report must name every affected dataset or public surface reviewed, including those intentionally left unchanged and why.
4. **Validate dates and assets:** register every new dated record in `verifiedRecords()`, keep source and preview assets traceable, and never advance unrelated dates.
5. **Verify locally:** run `npm ci` and `npm run verify` for every published change. Run `npm run verify:maintenance` instead when product data, evidence, research, attribution snapshots, metadata, or public routes change. Access-restricted or inconclusive URLs require explicit review and never count as successful re-verification; a broken published URL blocks the update.
6. **Review the patch:** run `git diff --check`, inspect `git status --short`, `git diff --stat`, and the full diff, and confirm that only intended files changed. Re-fetch before pushing and stop if `origin/main` advanced since the starting commit.
7. **Publish and verify:** commit once with a descriptive message, push directly to `main` without a PR, confirm the GitHub quality gate and the Vercel production deployment for that exact commit, then smoke-test the canonical domain, the changed path, and any affected sitemap, robots, `llms.txt`, search, navigation, or profile route.
8. **Leave a ledger:** report the starting and published commit, sources reopened, claims changed, files and propagation surfaces reviewed, validation results, deployment result, live URLs checked, decision-output impact, and every unresolved or deferred item. A failed CI run, failed deployment, or failed live check means the update is not complete.

## Commands

Use a clean install for CI and automation:

```bash
npm ci
npm run verify
```

For changes to catalog data, evidence, research, attribution snapshots, metadata, or public routes:

```bash
npm ci
npm run verify:maintenance
```

For local development:

```bash
npm install
npm run dev
```

The static export is written to `out/` after a successful build.

## Main extension points

- Product records and first-party evidence: `src/data/harnesses.ts`
- Feature claims: `src/data/feature-claims.ts`
- Coding-harness membership and catalog layer: `src/data/harness-membership.ts`
- Operational mechanisms: `src/data/operational-profiles.ts`
- Official repository audits: `src/data/repository-audits.ts`
- Measured configurations: `src/data/benchmark-runs.ts`
- Context-only usage snapshots: `src/data/openrouter-attribution.ts` and `src/data/ecosystem-signals.ts`
- Usage sync and stable mappings: `scripts/sync-openrouter-attribution.mjs`, `scripts/lib/openrouter-sync.mjs`, `scripts/sync-ecosystem-signals.mjs`, `scripts/lib/ecosystem-signals.mjs`, and `scripts/lib/ecosystem-signal-mappings.mjs`
- Factual stable-release feed and product-scoped watchlist: `src/data/release-signals.json`, `src/data/release-signals.ts`, `scripts/sync-release-signals.mjs`, `scripts/lib/release-signals.mjs`, and `scripts/lib/release-watch-mappings.mjs`
- AI-assisted release-note triage for editorial review only: `scripts/triage-release-updates.mjs`, `scripts/lib/release-triage.mjs`, and `research/release-review-queue.json`
- Source-separated usage page and CSV: `src/app/usage/page.tsx`, `src/components/usage-signals-explorer.tsx`, and `src/app/usage.csv/route.ts`
- Scientific literature and research insights: `src/data/research.ts`
- Research work packets: `research/` (discovery and review aids only, never evidence by themselves)
- Research-process disclosure: `src/data/research-process.ts`
- Validation plans: `src/data/validation-plan.ts`
- Workflow scenarios: `src/data/workflow-scenarios.ts`
- Recommendation logic: `src/lib/recommendation.ts`
- Visible weights and value functions: `src/lib/recommendation-config.ts`
- GUI product records and exclusions: `src/data/guis/`
- GUI public-code audits: `src/data/gui-audits/`
- GUI types and workflow classification: `src/lib/gui-types.ts` and `src/lib/gui-fit.ts`
- GUI catalog and profiles: `src/app/guis/page.tsx`, `src/app/guis/[slug]/page.tsx`, and `src/components/gui-workflow-matcher.tsx`
- Freshness policy and dated-record registry: `src/lib/evidence-freshness.ts`
- Taxonomy labels and derived classification: `src/lib/harness-classification.ts`
- Canonical origin and shared metadata: `src/lib/site.ts`
- Recommender questions and results: `src/components/recommender.tsx`
- Comparison dimensions: `src/components/compare-client.tsx`
- Public methodology: `src/app/methodology/page.tsx`
- Sitemap, crawler guide, and host redirects: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, and `vercel.json`
