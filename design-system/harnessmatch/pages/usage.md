# Usage page override

Use `design-system/harnessmatch/MASTER.md` as the base. This page is a technical decision-support surface, not a marketing dashboard.

## Decision contract

- Question: what public routing, distribution, marketplace, or repository-interest signals are visible for cataloged harnesses?
- Sources: OpenRouter, Homebrew, npm, filtered stable GitHub release assets, VS Code Marketplace, Open VSX, JetBrains Marketplace, and GitHub.
- Keep one source visible at a time. Never combine sources into a composite popularity, adoption, or quality score.
- Preserve each source's native unit, time window, population, ranking scope, and observation date.
- Missing coverage means no admitted artifact mapping. Never render it as zero.
- OpenRouter rank is the global public coding-app rank. Other ranks are only among mapped active HarnessMatch products.

## Visual hierarchy

1. Plain-language page title and one-sentence interpretation rule.
2. Source tabs with horizontal overflow on narrow screens.
3. Optional OpenRouter window selector.
4. Ranked horizontal-bar list with exact values and direct profile links.
5. Source-specific limitation, a current-view CSV, and the unified CSV export.
6. Compact methodology and primary-source links.

## Interaction and accessibility

- Tabs use semantic `tablist`/`tab` roles, arrow-key navigation, visible focus, and at least 44px hit targets.
- Bars communicate relative magnitude only; exact values remain visible text and screen-reader labels.
- Bars use a linear zero-based scale anchored to the largest mapped value in the full selected source, including in focused comparisons. Preserve the calculated width and use a documented 1 px origin marker for positive subpixel values rather than a misleading minimum bar length.
- Avoid entrance animation and width transitions. Respect reduced motion globally.
- Show at most 12 rows initially, then offer an explicit show-all control.
- Allow a deep-linked comparison of up to four harnesses only within the same source, metric, and window. Never normalize across sources.
- Make the harness picker and comparison list searchable, and keep a copied view URL sufficient to restore the selection.
- On mobile, keep the page itself free of horizontal overflow; only the source-tab strip may scroll horizontally.

## Copy constraints

- Say `signals`, `events`, `downloads`, `installs`, `stars`, or `attributed traffic` according to the source.
- Never say `market share`, `users`, `best`, `quality`, or `task success` based on these records.
- State that package downloads and install events are not unique users.
- State that release totals include only mapped stable assets but may still contain repeated, automated, or multi-platform retrievals.
- State that editor-marketplace downloads and installs are cumulative retrieval events, not active users.
- State that GitHub stars are repository interest and preserve full/client/support repository scope.
