import { appendWorkflowSummary, githubApi, requiredEnvironment } from "./lib/github-automation.mjs";
import {
  existingSpotlightIssue,
  spotlightAlertBody,
  spotlightIssueTitle,
} from "./lib/spotlight-alert.mjs";

const repository = requiredEnvironment("GITHUB_REPOSITORY");
const message = spotlightAlertBody(requiredEnvironment("SPOTLIGHT_RUN_URL"));

const openIssues = await githubApi(`/repos/${repository}/issues?state=open&per_page=100`);
const existing = existingSpotlightIssue(openIssues);

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
  appendWorkflowSummary(`Opened spotlight alert #${created.number}.`);
}
