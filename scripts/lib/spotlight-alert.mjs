export const spotlightIssueTitle = "Homepage spotlight edition is stale";

/**
 * The issues endpoint also returns pull requests, so a pull request carrying the
 * alert title must never be mistaken for an already-open alert: that would
 * silence the alert instead of raising it.
 */
export function existingSpotlightIssue(issues, title = spotlightIssueTitle) {
  if (!Array.isArray(issues)) throw new Error("GitHub issue list must be an array");
  return issues.find((issue) => issue?.title === title && issue?.pull_request === undefined) ?? null;
}

export function spotlightAlertBody(runUrl) {
  if (typeof runUrl !== "string" || !runUrl.startsWith("https://")) {
    throw new Error("A spotlight alert needs the failing run URL.");
  }

  return [
    "`npm run check:spotlight` failed: `src/data/home-spotlight.ts` no longer matches the current UTC month.",
    "",
    "The homepage keeps publishing the previous edition until the spotlight data is refreshed. This is a stale published claim, not a flaky test.",
    "",
    `Failing run: ${runUrl}`,
  ].join("\n");
}
