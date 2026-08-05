import { appendWorkflowSummary, githubApi, requiredEnvironment } from "./lib/github-automation.mjs";
import {
  findExistingSpotlightIssue,
  parseGitHubIssueSummary,
  spotlightAlertBody,
  spotlightIssueTitle,
  spotlightIssuePageSize,
  validatedGitHubRepository,
} from "./lib/spotlight-alert.mjs";

const repository = validatedGitHubRepository(requiredEnvironment("GITHUB_REPOSITORY"));
const message = spotlightAlertBody(requiredEnvironment("SPOTLIGHT_RUN_URL"));

const existing = await findExistingSpotlightIssue((page) =>
  githubApi(
    `/repos/${repository}/issues?state=open&per_page=${spotlightIssuePageSize}&page=${page}`,
  ),
);

if (existing) {
  await githubApi(`/repos/${repository}/issues/${existing.number}/comments`, {
    method: "POST",
    body: { body: message },
  });
  appendWorkflowSummary(`Commented on the open spotlight alert #${existing.number}.`);
} else {
  const created = await githubApi(`/repos/${repository}/issues`, {
    method: "POST",
    body: { title: spotlightIssueTitle, body: message },
  });
  const createdIssue = parseGitHubIssueSummary(created);
  appendWorkflowSummary(`Opened spotlight alert #${createdIssue.number}.`);
}
