# HarnessMatch

An evidence-backed decision tool for choosing an AI coding harness by workflow fit.

**Live site:** [harnessmatch.vercel.app](https://harnessmatch.vercel.app)

## What is included

- Workflow recommender with hard eligibility gates and visible preference weights
- Sensitivity analysis that reports rank robustness without presenting it as task-success probability
- Side-by-side harness comparison and source-backed product profiles
- Separate views for workflow fit, architecture, public-code artifacts, and admitted benchmark configurations
- Claim-level evidence ledger with first-party sources and verification dates
- Public methodology, validation protocol, scientific references, and benchmark admission policy
- Static Next.js export with Vercel Web Analytics

HarnessMatch keeps model capability, harness capability, documentation coverage, and measured performance separate. It is not a universal model or product leaderboard.

## Research policy

Language models may assist discovery, extraction, structuring, and cross-checking, but model output is never treated as evidence. Published product claims require an admitted underlying source and a verification date. See the [methodology](https://harnessmatch.vercel.app/methodology) and [data ledger](https://harnessmatch.vercel.app/data).

Benchmark results are admitted only when the model, exact harness version, benchmark version, budget, sandbox or environment, attempts, date, cost, and primary source are recorded.

## Technical stack

- Next.js App Router and static export
- React and TypeScript
- Tailwind CSS v4 plus project-level CSS
- Repository-backed data and deterministic recommendation logic
- Vitest for scoring, classification, evidence, and validation invariants

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

## Deployment

The repository is connected to the existing Vercel project. Pushes to `main` create production deployments; other branches can create isolated preview deployments. Web Analytics is enabled on the production project.

## Main extension points

- Product and source records: `src/data/harnesses.ts`
- Recommendation logic: `src/lib/recommendation.ts`
- Visible weights and thresholds: `src/lib/recommendation-config.ts`
- Recommender questions: `src/components/recommender.tsx`
- Methodology: `src/app/methodology/page.tsx`

## Contribution rules

- Keep model capability separate from harness capability.
- Every capability claim needs a first-party source and verification date.
- Archived tools must not appear in recommender results.
- Scoring changes require tests describing the intended workflow outcome.
- Keep weights and provisional value functions visible in code and methodology copy.
- Verification dates decay: `src/lib/evidence-freshness.ts` sets the review and maximum-age windows, and the freshness test fails the build once a published claim exceeds the maximum age. Re-verify the sources rather than widening the window.
