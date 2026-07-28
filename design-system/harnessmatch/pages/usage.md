# Usage page override

The global HarnessMatch design system remains authoritative. This page uses a denser analytical layout because exact comparison is the product surface.

## Decision contract

- Question: which cataloged harnesses received the most publicly attributed OpenRouter traffic in the selected completed UTC window?
- Visual: sorted horizontal leaderboard with one primary measure, attributed tokens, and requests as secondary context.
- Windows: latest completed day, 7 days, and 30 days. The 7-day view is the default because it balances recency with day-to-day volatility.
- Scope: OpenRouter coding-app attribution only. Never label the output as overall market share, users, quality, or task success.
- Missingness: unlisted records remain visible as `Not listed`; never convert them to zero.

## Layout and interaction

- Keep the page server-rendered; isolate window selection in one client leaf.
- Use one ranked list, not a card grid. Every row is a link to the corresponding HarnessMatch profile.
- Bars use the existing muted violet accent without a background track. Exact values remain visible as text.
- Tabs are keyboard operable with left and right arrow keys and preserve 44px touch targets.
- Mobile rows use two visual lines and never require horizontal scrolling.
- Provide a static CSV export and source links beside the interpretation caveat.
