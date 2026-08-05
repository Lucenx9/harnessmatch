export const spotlightIssueTitle = "Homepage spotlight edition is stale";
export const spotlightIssuePageSize = 100;

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseGitHubIssueSummary(value) {
  if (!isRecord(value)) throw new Error("GitHub issue record must be an object");
  if (!Number.isSafeInteger(value.number) || value.number <= 0) {
    throw new Error("GitHub issue number must be a positive integer");
  }
  if (typeof value.title !== "string") throw new Error("GitHub issue title must be a string");

  return "pull_request" in value
    ? { number: value.number, title: value.title, pull_request: value.pull_request }
    : { number: value.number, title: value.title };
}

function parseGitHubIssuePage(value) {
  if (!Array.isArray(value)) throw new Error("GitHub issue list must be an array");
  return value.map(parseGitHubIssueSummary);
}

function spotlightIssueFromPage(issues) {
  return issues.find(
    (issue) => issue.title === spotlightIssueTitle && issue.pull_request === undefined,
  ) ?? null;
}

/**
 * The issues endpoint also returns pull requests, so a pull request carrying the
 * alert title must never be mistaken for an already-open alert: that would
 * silence the alert instead of raising it.
 */
export function existingSpotlightIssue(value) {
  return spotlightIssueFromPage(parseGitHubIssuePage(value));
}

export async function findExistingSpotlightIssue(loadIssuePage) {
  if (typeof loadIssuePage !== "function") throw new Error("GitHub issue page loader must be a function");

  for (let page = 1; ; page += 1) {
    const issues = parseGitHubIssuePage(await loadIssuePage(page));
    const existing = spotlightIssueFromPage(issues);
    if (existing !== null) return existing;
    if (issues.length < spotlightIssuePageSize) return null;
  }
}

export function validatedGitHubRepository(value) {
  if (
    typeof value !== "string" ||
    !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\/(?=[A-Za-z0-9._-]{1,100}$)(?=[A-Za-z0-9._-]*[A-Za-z0-9])[A-Za-z0-9._-]+$/.test(
      value,
    )
  ) {
    throw new Error("GITHUB_REPOSITORY must be an owner/repository slug");
  }
  return value;
}

export function spotlightAlertBody(runUrl) {
  let parsedRunUrl;
  try {
    parsedRunUrl = new URL(runUrl);
  } catch {
    throw new Error("A spotlight alert needs the failing run URL.");
  }
  if (
    parsedRunUrl.protocol !== "https:" ||
    parsedRunUrl.username !== "" ||
    parsedRunUrl.password !== "" ||
    parsedRunUrl.search !== "" ||
    parsedRunUrl.hash !== "" ||
    !/^\/[^/]+\/[^/]+\/actions\/runs\/[1-9]\d*\/?$/.test(parsedRunUrl.pathname)
  ) {
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
