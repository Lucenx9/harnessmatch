# HarnessMatch

An evidence-backed catalog and comparison tool for AI coding harnesses.

**Live site:** [harnessmatch.dev](https://harnessmatch.dev)

## What is included

- Side-by-side harness comparison and source-backed product profiles
- Source-separated routing, package, release-asset, editor-marketplace, and repository signals with explicit windows and limits
- Separate views for classification, architecture, public-code artifacts, and admitted benchmark configurations
- Claim-level evidence ledger with first-party sources and verification dates
- Public methodology, validation protocol, scientific references, and benchmark admission policy
- Static Next.js export with Vercel Web Analytics

HarnessMatch keeps model capability, harness capability, documentation coverage, and measured performance separate. It is not a universal model or product leaderboard.

## Research policy

Language models may assist discovery, extraction, structuring, and cross-checking, but model output is never treated as evidence. Published product claims require an admitted underlying source and a verification date. See the [methodology](https://harnessmatch.dev/methodology) and [data ledger](https://harnessmatch.dev/data).

Benchmark results are admitted only when the model, exact harness version, benchmark version, budget, sandbox or environment, attempts, date, cost, and primary source are recorded.

## Technical stack

- Next.js App Router and static export
- React and TypeScript
- Tailwind CSS v4 plus project-level CSS
- Repository-backed data and deterministic classification logic
- Vitest for classification, measurement, evidence, and validation invariants

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run typecheck
npm test
npm run build
```

The static site is written to `out/` after a successful build.

Refresh the context-only usage datasets with:

```bash
npm run sync:usage
```

This command requires `OPENROUTER_API_KEY` for OpenRouter and uses `GITHUB_TOKEN` or the authenticated `gh` session for GitHub repository and release data. The OpenRouter sync records source-native most-used windows plus 7-day and 30-day trending ranks; it never infers a growth percentage. Homebrew, npm, VS Code, Open VSX, and JetBrains use public endpoints. GUI Homebrew activity, filtered stable GitHub installer downloads, and GitHub repository interest are generated separately in `src/data/gui-ecosystem-signals.ts`, so they cannot be confused with harness usage. Generated values are not capability, classification, or GUI-fit inputs.

### Automatic usage maintenance

`.github/workflows/daily-usage-refresh.yml` runs every day at 04:23 UTC and can also be started manually. It synchronizes every source-native usage feed and the factual stable-release feed, permits changes only to the generated snapshot files and the repository-only release-review queue, runs source health checks, dependency auditing, typecheck, tests, and the static build, then commits directly to `main` only when values changed. The workflow dispatches the quality gate for the published commit, waits for the matching Vercel production deployment, and smoke-tests the canonical site and redirects.

The workflow requires the repository Actions secret `OPENROUTER_API_KEY`. GitHub supplies the short-lived `GITHUB_TOKEN`; no personal access token is stored. A factual source, generated-data schema, identity, validation, concurrency, quality, deployment, or smoke-test failure stops the transaction and remains visible in the Actions run.

`src/data/release-signals.json` is generated first from the reviewed watchlist and official GitHub release API. It publishes only validated facts: product-scoped stable tag, date, official link, repository scope, observation date, and trailing 90-day release count. The triage step reopens the current official release notes, compares their digest with the editorial queue, and sends a bounded copy to `openai/gpt-oss-20b` only when the version is new or the notes changed. It then writes structured triage to `research/release-review-queue.json`. The watchlist is independent from GitHub asset-download measurement, so a release can be reviewed even when it exposes no countable binary. Product-specific tag filters exclude prereleases and unrelated monorepo release trains. Release text is treated as untrusted input, model output is validated and cannot introduce links, and inference failure never blocks factual source synchronization. The queue is editorial assistance only: it is not imported by the site, is not evidence, and cannot update claims, categories, or measured comparisons. Human review outcomes stay attached to an unchanged release-note digest, while changed notes automatically return the item to pending review.

## Deployment

The repository is connected to the existing Vercel project. Pushes to `main` create production deployments; other branches can create isolated preview deployments. Web Analytics is enabled on the production project.

## Main extension points

- Individual product and source records: `src/data/harness-records/`
- Catalog assembly and claim attachment: `src/data/harnesses.ts`
- Classification and comparison helpers: `src/lib/harness-classification.ts` and `src/lib/evaluation.ts`
- Ordinal anchors and operational reference values: `src/lib/evaluation-config.ts`
- Methodology: `src/app/methodology/page.tsx`
- Usage page and export: `src/app/usage/page.tsx`, `src/components/usage-signals-explorer.tsx`, and `src/app/usage.csv/route.ts`

## Contribution rules

- Keep model capability separate from harness capability.
- Every capability claim needs a first-party source and verification date.
- Archived tools must not appear in active catalog summaries or active benchmark rankings.
- Classification and measurement changes require tests describing the intended outcome.
- Do not add a personalized recommender, universal product score, or composite popularity score.
- Verification dates decay: `src/lib/evidence-freshness.ts` sets the review and maximum-age windows, and the freshness test fails the build once a published claim exceeds the maximum age. Re-verify the sources rather than widening the window.
