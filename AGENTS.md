# HarnessMatch contributor guide

## Product intent

HarnessMatch recommends AI coding harnesses by workflow fit. Do not turn it into a generic model leaderboard or an affiliate ranking site.

## Technical shape

- Next.js App Router with static export
- React and TypeScript
- Tailwind CSS v4 plus project-level CSS in `src/app/globals.css`
- Repository-backed data in `src/data/harnesses.ts`
- Deterministic scoring in `src/lib/recommendation.ts`

## Non-negotiable rules

1. Keep model capability separate from harness capability.
2. A capability claim needs a first-party source and verification date.
3. Do not add benchmark scores unless model, harness version, benchmark version, budget, sandbox, attempts, date, and source are recorded.
4. Archived tools must not appear in recommender results.
5. Scoring changes require tests that describe the intended workflow outcome.
6. Avoid hidden magic constants. Keep weights visible in code and methodology copy.
7. Every new dated record type must be registered in `verifiedRecords()` in `src/lib/evidence-freshness.ts`, otherwise it ages without any check noticing.
8. `tests/evidence-freshness.test.ts` reads the wall clock by design. A failure there means sources are overdue for re-verification, not that the test is flaky. Re-verify the sources or archive the claims; do not raise the thresholds to make it pass.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

## Main extension points

- Add or update products: `src/data/harnesses.ts`
- Change recommendation logic: `src/lib/recommendation.ts`
- Add questions: `src/components/recommender.tsx`
- Change comparison dimensions: `src/components/compare-client.tsx`
- Update methodology: `src/app/methodology/page.tsx`
