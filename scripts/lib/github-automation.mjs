import { appendFileSync } from "node:fs";

const githubApiOrigin = "https://api.github.com";

export function requiredEnvironment(name, environment = process.env) {
  const value = environment[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export async function githubApi(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${githubApiOrigin}${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token ?? requiredEnvironment("GITHUB_TOKEN")}`,
      "Content-Type": "application/json",
      "User-Agent": "HarnessMatch-maintenance",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`GitHub API ${method} ${path}: HTTP ${response.status} ${responseBody.slice(0, 500)}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function writeWorkflowOutput(name, value, outputPath = process.env.GITHUB_OUTPUT) {
  if (outputPath) appendFileSync(outputPath, `${name}=${value}\n`, "utf8");
}

export function appendWorkflowSummary(message, summaryPath = process.env.GITHUB_STEP_SUMMARY) {
  if (summaryPath) appendFileSync(summaryPath, `${message}\n`, "utf8");
}

export function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
