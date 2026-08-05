export type GitHubIssueSummary = {
  number: number;
  title: string;
  pull_request?: unknown;
};

export const spotlightIssueTitle: string;
export function existingSpotlightIssue(
  issues: unknown[],
  title?: string,
): GitHubIssueSummary | null;
export function spotlightAlertBody(runUrl: string): string;
