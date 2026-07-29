import {
  appendWorkflowSummary,
  githubApi,
  requiredEnvironment,
  sleep,
} from "./lib/github-automation.mjs";

const repository = requiredEnvironment("GITHUB_REPOSITORY");
const publishedSha = requiredEnvironment("PUBLISHED_SHA");
const workflowFile = "quality.yml";
const timeoutAt = Date.now() + (15 * 60 * 1_000);

await githubApi(`/repos/${repository}/actions/workflows/${workflowFile}/dispatches`, {
  method: "POST",
  body: { ref: "main", inputs: { commit_sha: publishedSha } },
});

console.log(`Dispatched ${workflowFile} for ${publishedSha}.`);

while (Date.now() < timeoutAt) {
  const response = await githubApi(
    `/repos/${repository}/actions/workflows/${workflowFile}/runs?event=workflow_dispatch&branch=main&per_page=20`,
  );
  const run = response.workflow_runs.find((candidate) => (
    candidate.display_title === `Quality gate ${publishedSha}`
  ));
  if (!run) {
    await sleep(8_000);
    continue;
  }
  if (run.status !== "completed") {
    console.log(`Quality gate ${run.id} is ${run.status}.`);
    await sleep(12_000);
    continue;
  }
  if (run.conclusion !== "success") {
    throw new Error(`Quality gate failed with ${run.conclusion}: ${run.html_url}`);
  }
  console.log(`Quality gate passed: ${run.html_url}`);
  appendWorkflowSummary(`Quality gate: ${run.html_url}`);
  process.exit(0);
}

throw new Error(`Timed out waiting for quality.yml on ${publishedSha}`);
