import {
  appendWorkflowSummary,
  githubApi,
  requiredEnvironment,
  sleep,
  writeWorkflowOutput,
} from "./lib/github-automation.mjs";

const repository = requiredEnvironment("GITHUB_REPOSITORY");
const publishedSha = requiredEnvironment("PUBLISHED_SHA");
const timeoutAt = Date.now() + (15 * 60 * 1_000);
const terminalFailures = new Set(["error", "failure", "inactive"]);

while (Date.now() < timeoutAt) {
  const deployments = await githubApi(
    `/repos/${repository}/deployments?sha=${publishedSha}&environment=Production&per_page=10`,
  );
  const deployment = deployments[0];
  if (!deployment) {
    console.log(`Vercel deployment for ${publishedSha} has not appeared yet.`);
    await sleep(10_000);
    continue;
  }
  const statuses = await githubApi(`/repos/${repository}/deployments/${deployment.id}/statuses?per_page=20`);
  const status = statuses[0];
  if (!status) {
    await sleep(10_000);
    continue;
  }
  if (terminalFailures.has(status.state)) {
    throw new Error(`Production deployment ended in ${status.state}: ${status.log_url ?? deployment.url}`);
  }
  if (status.state !== "success") {
    console.log(`Production deployment ${deployment.id} is ${status.state}.`);
    await sleep(12_000);
    continue;
  }
  const deploymentUrl = status.environment_url || status.log_url;
  if (!deploymentUrl) throw new Error(`Production deployment ${deployment.id} has no public URL`);
  console.log(`Production deployment succeeded: ${deploymentUrl}`);
  writeWorkflowOutput("deployment_url", deploymentUrl);
  appendWorkflowSummary(`Production deployment: ${deploymentUrl}`);
  process.exit(0);
}

throw new Error(`Timed out waiting for the Vercel production deployment of ${publishedSha}`);
