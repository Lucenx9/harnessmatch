import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  allowedUsageRefreshPaths,
  changedPathsFromPorcelain,
  unexpectedUsageRefreshPaths,
} from "../scripts/lib/usage-refresh-automation.mjs";

describe("daily usage automation", () => {
  it("allows only generated usage snapshots", () => {
    expect(allowedUsageRefreshPaths).toEqual([
      "research/release-review-queue.json",
      "src/data/ecosystem-signals.ts",
      "src/data/openrouter-attribution.ts",
      "src/data/release-signals.json",
    ]);
    const paths = changedPathsFromPorcelain([
      " M src/data/ecosystem-signals.ts",
      " M src/data/openrouter-attribution.ts",
      "?? src/data/harnesses.ts",
    ].join("\n"));
    expect(unexpectedUsageRefreshPaths(paths)).toEqual(["src/data/harnesses.ts"]);
  });

  it("keeps the scheduled transaction fail-closed", () => {
    const workflow = readFileSync(new URL("../.github/workflows/daily-usage-refresh.yml", import.meta.url), "utf8");
    expect(workflow).toContain('cron: "23 4 * * *"');
    expect(workflow).toContain("contents: write");
    expect(workflow).toContain("deployments: read");
    expect(workflow).toContain("npm run sync:usage");
    expect(workflow).toContain("src/data/release-signals.json");
    expect(workflow).toContain("npm run triage:releases");
    expect(workflow).toContain("continue-on-error: true");
    expect(workflow).toContain("research/release-review-queue.json");
    expect(workflow).toContain("npm run verify:maintenance");
    expect(workflow).toContain("npm audit --audit-level=high");
    expect(workflow).toContain("node scripts/validate-usage-refresh-diff.mjs");
    expect(workflow).toContain("git push origin HEAD:main");
    expect(workflow).toContain("node scripts/wait-for-quality-gate.mjs");
    expect(workflow).toContain("node scripts/wait-for-production-deployment.mjs");
    expect(workflow).toContain("node scripts/smoke-test-production.mjs");
    expect(workflow).not.toContain("pull_request");

    const qualityWorkflow = readFileSync(new URL("../.github/workflows/quality.yml", import.meta.url), "utf8");
    expect(qualityWorkflow).toContain("inputs.commit_sha || github.sha");
    expect(qualityWorkflow).toContain("Exact repository commit to verify");
  });
});
