export type GitHubIssueSummary = {
  readonly number: number;
  readonly title: string;
  readonly pull_request?: unknown;
};

export const spotlightIssueTitle: string;
export const spotlightIssuePageSize: 100;
export function parseGitHubIssueSummary(value: unknown): GitHubIssueSummary;
export function existingSpotlightIssue(value: unknown): GitHubIssueSummary | null;
export function findExistingSpotlightIssue(
  loadIssuePage: (page: number) => Promise<unknown>,
): Promise<GitHubIssueSummary | null>;
export function validatedGitHubRepository(value: unknown): string;
export function spotlightAlertBody(runUrl: unknown): string;
