# HarnessMatch contributor guide

## Product mission

HarnessMatch is an evidence-backed decision tool for choosing an AI coding harness by workflow fit. It is not a generic model leaderboard, an affiliate ranking site, or a marketing landing page.

Design for technically aware users, including vibe coders, who need a clear recommendation without reading the entire methodology first. Prefer a data-first, restrained interface inspired by Vercel, Linear, Cursor, and strong analysis products. Every prominent visual must help comparison or decision-making; avoid decorative hero imagery, inflated claims, and sales copy.

Keep the public interface in English until localization is explicitly reopened.

## Technical shape

- Next.js App Router with static export
- React and TypeScript
- Tailwind CSS v4 plus project-level CSS in `src/app/globals.css`
- Repository-backed product, evidence, classification, and evaluation data
- Deterministic recommendation logic in `src/lib/recommendation.ts`
- Visible scoring inputs and value functions in `src/lib/recommendation-config.ts`
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

## Evidence dates and freshness

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
7. Discovery-only candidates that are not ready for the ranked catalog: `src/data/discovery-watchlist.ts`.
8. Freshness registration: `src/lib/evidence-freshness.ts`.
9. Product-specific and cross-dataset contracts in `tests/`.
10. User-facing methodology or data-ledger copy when interpretation changes.

When changing the recommendation model, update `src/lib/recommendation.ts`, `src/lib/recommendation-config.ts`, the methodology page, and outcome-focused tests together. When adding a new question, update the answer types, eligibility or scoring behavior, recommender UI, methodology, and tests together.

When changing taxonomy or evaluation terminology, keep the catalog, profiles, comparison UI, recommender exclusions, methodology, `llms.txt`, and tests consistent.

## SEO, domain, and public identity

- The sole canonical origin is `https://harnessmatch.dev`, defined centrally in `src/lib/site.ts`.
- `www.harnessmatch.dev` and `harnessmatch.vercel.app` are secondary hosts that permanently redirect to the canonical origin. Do not use them in canonical tags, sitemap URLs, structured data, social metadata, or public documentation.
- Every indexable page must have a page-specific canonical URL and useful title and description. Use the shared metadata helpers in `src/lib/site.ts`.
- Keep `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, page metadata, and `vercel.json` aligned after route or domain changes.
- Keep canonical-domain references in `README.md` aligned with the deployed site.
- A sitemap `lastmod` value must represent a real, significant change to that page's primary content. Omit it when no reliable page-level date exists. Do not use `priority` or `changefreq` as ranking signals.
- Keep only canonical, indexable, successful URLs in the sitemap. Do not add redirected, archived, parameterized, or `noindex` URLs.
- HarnessMatch is an independent personal project. The only public contact detail is `lucenz@proton.me`. Do not add a legal name, street address, telephone number, VAT number, company details, newsletter, advertising tracker, or additional personal information unless explicitly requested.
- Vercel Web Analytics is the only intended visitor analytics integration. Any new analytics, cookies, forms, accounts, or third-party data collection requires an explicit privacy review and corresponding disclosure before release.

## Automation and deployment policy

- Scheduled maintenance is intended to update the site automatically through direct commits to `main`; do not open pull requests unless explicitly requested.
- Automation must fail closed. Before committing or pushing, run the same quality sequence as CI: `npm ci`, `npm run typecheck`, `npm test`, and `npm run build`.
- Do not push when a validation step fails, evidence is conflicting, a required source cannot be verified, or the local worktree contains unrelated changes that cannot be preserved safely.
- Start automated work from the current remote `main`, verify that `main` has not advanced before pushing, and never force-push or bypass branch protections and quality gates.
- Preserve unrelated user changes. Do not overwrite, clean, reset, or reformat files outside the task.
- Automated source refreshes may publish straightforward, first-party-supported corrections. Ambiguous classification, methodology, or scoring changes must be supported by explicit evidence and tests; otherwise leave a review note or watchlist record instead of guessing.
- A successful push is not the end of deployment verification. Confirm that the Vercel production deployment is ready and smoke-test the canonical domain, sitemap, robots file, redirects, and the changed user path when tooling is available.
- `.github/workflows/quality.yml` is the repository quality gate. Do not weaken or skip it to make an automated update pass.
- Review dependency advisories explicitly. Never run `npm audit fix --force` automatically; framework or dependency upgrades require a scoped change, lockfile review, the full quality sequence, and production verification.

## Commands

Use a clean install for CI and automation:

```bash
npm ci
npm run typecheck
npm test
npm run build
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
- Scientific literature and research insights: `src/data/research.ts`
- Research work packets: `research/` (discovery and review aids only, never evidence by themselves)
- Research-process disclosure: `src/data/research-process.ts`
- Validation plans: `src/data/validation-plan.ts`
- Workflow scenarios: `src/data/workflow-scenarios.ts`
- Recommendation logic: `src/lib/recommendation.ts`
- Visible weights and value functions: `src/lib/recommendation-config.ts`
- Freshness policy and dated-record registry: `src/lib/evidence-freshness.ts`
- Taxonomy labels and derived classification: `src/lib/harness-classification.ts`
- Canonical origin and shared metadata: `src/lib/site.ts`
- Recommender questions and results: `src/components/recommender.tsx`
- Comparison dimensions: `src/components/compare-client.tsx`
- Public methodology: `src/app/methodology/page.tsx`
- Sitemap, crawler guide, and host redirects: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, and `vercel.json`
