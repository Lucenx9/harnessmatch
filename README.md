# HarnessMatch

An independent, workflow-aware guide for choosing an AI coding harness.

## What is included

- Interactive recommendation quiz with explainable scoring
- Side-by-side comparison for up to four harnesses
- Static profile pages for Claude Code, Codex, OpenCode, Aider, OpenHands, goose, and Cline
- Transparent methodology and source ledger
- Static export: no database or server required for the MVP

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

## Editorial policy

HarnessMatch does not convert vendor claims into benchmark scores. Capability data is sourced from first-party documentation and includes a verification date. Performance leaderboards should only be added when runs are reproducible and compare the same task set, model, budget, sandbox, and attempt policy.

## Project status

This is an MVP data model and product shell. The initial scores are transparent editorial fit ratings, not claims of objective model intelligence.
