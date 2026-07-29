# Homepage override

The homepage is a working analysis surface. It should feel closer to a compact research console than a marketing landing page.

## Page job

- Let a user enter through source-separated usage, evidence, comparison, or the catalog without making the recommender the homepage task
- Keep the tailored recommender available through secondary navigation for users who explicitly want workflow guidance
- Add source-separated adoption context without turning popularity into quality or a recommendation factor
- Show recent stable release activity with exact dates, reviewed asset scope, and native GitHub download counts
- Route users to evidence profiles without inserting promotional sections between the working tools and catalog

## Layout

- Compact two-column intro: plain-language evidence scope on the left and dataset status on the right
- Add direct, equal-weight entry points for Usage, Compare, Evidence, and the active catalog below the intro
- Put the source-separated usage preview immediately below the intro
- Place the capability-filtered catalog after public usage signals
- Replace workflow-fit presets with a recent-release table sourced from reviewed stable GitHub release mappings
- Sort recent releases by exact latest stable release date, then matched asset downloads, without implying quality or recommendation rank
- Default to the completed OpenRouter 7-day window; keep Homebrew, npm, GitHub Releases, and VS Code in independent tabs
- Show five rows, native units, direct values, observation dates, coverage, and a link to the complete Usage page
- Keep the operational, auditability, and measured-system explorer on the Data page
- Keep the personalized workflow test on `/recommend`; do not duplicate it as a second homepage recommender
- Keep the catalog's compact methodology note as the final research route, without separate research-card repetition
- No testimonial, social proof, generic benefit, or conversion CTA sections

## Data display rules

- Usage bars use a single muted-violet series without background tracks, and every row links directly to the harness profile
- Usage tabs use native source names instead of implying a combined top-harness leaderboard
- Release activity uses a direct table rather than bars because date recency, release count, and downloads are separate dimensions
- Every release row opens the HarnessMatch profile and exposes the corresponding GitHub release feed as an external source

## Catalog rules

- Show eight profiles initially to keep the decision path compact
- Let the user expand the complete filtered catalog without navigating away

## Responsive behavior

- At 1040px the intro stacks while data tables retain readable source labels
- Below 720px usage source tabs become a two-column grid, ranking rows use two reading lines, and secondary context never forces horizontal scrolling
- Below 720px each release row places the product first, the source date second, and the two count metrics in a two-column summary
- The page itself never scrolls horizontally
