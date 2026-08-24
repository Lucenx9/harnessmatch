import { readFileSync, readdirSync } from "node:fs";
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
      "src/data/gui-ecosystem-signals.ts",
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
    expect(workflow).toContain("for attempt in 1 2");
    expect(workflow).toContain('git restore --worktree -- "' + "$" + '{generated_paths[@]}"');
    expect(workflow).toContain("failed after two complete transaction attempts");
    expect(workflow).toContain("src/data/release-signals.json");
    expect(workflow).toContain("src/data/gui-ecosystem-signals.ts");
    expect(workflow).toContain("npm run triage:releases");
    expect(workflow).toContain("continue-on-error: true");
    expect(workflow).toContain("research/release-review-queue.json");
    expect(workflow).toContain("npm run verify:maintenance");
    expect(workflow).toMatch(/name: Verify sources, contracts, and static export[\s\S]*?GITHUB_TOKEN: \$\{\{ secrets\.GITHUB_TOKEN \}\}[\s\S]*?run: npm run verify:maintenance/);
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
    expect(qualityWorkflow).toContain("pull_request:");
    expect(qualityWorkflow).toContain("npm audit --audit-level=high");
    expect(qualityWorkflow).toContain("actions/dependency-review-action@");
    expect(qualityWorkflow).toContain("fail-on-severity: high");
    expect(qualityWorkflow).toContain("node-version: 24");
    expect(qualityWorkflow).not.toContain("npm run check:spotlight");
    expect(workflow).not.toContain("npm run check:spotlight");

    const spotlightWorkflow = readFileSync(
      new URL("../.github/workflows/monthly-spotlight-freshness.yml", import.meta.url),
      "utf8",
    );
    expect(spotlightWorkflow).toContain('cron: "17 5 1 * *"');
    expect(spotlightWorkflow).toContain("npm run check:spotlight");
    expect(spotlightWorkflow).toMatch(/\npermissions:\n {2}contents: read\n\nconcurrency:/);
    expect(spotlightWorkflow).toMatch(
      /report:\n {4}needs: verify\n {4}if: always\(\) && needs\.verify\.outputs\.spotlight-conclusion == 'failure'[\s\S]*?run: node scripts\/report-stale-spotlight\.mjs/,
    );
    const verifyJobStart = spotlightWorkflow.indexOf("  verify:");
    const reportJobStart = spotlightWorkflow.indexOf("  report:");
    expect(verifyJobStart).toBeGreaterThanOrEqual(0);
    expect(reportJobStart).toBeGreaterThan(verifyJobStart);
    const verifyJob = spotlightWorkflow.slice(
      verifyJobStart,
      reportJobStart,
    );
    const reportJob = spotlightWorkflow.slice(reportJobStart);
    expect(verifyJob).not.toContain("issues: write");
    expect(reportJob).toContain("issues: write");
    expect(reportJob).not.toContain("npm ci");
    expect(reportJob).not.toContain("npm run check:spotlight");
    expect(reportJob).toMatch(
      /actions\/checkout@[0-9a-f]{40}[\s\S]*?persist-credentials: false[\s\S]*?run: node scripts\/report-stale-spotlight\.mjs/,
    );

    const spotlightReporter = readFileSync(
      new URL("../scripts/report-stale-spotlight.mjs", import.meta.url),
      "utf8",
    );
    expect(spotlightReporter).toContain("findExistingSpotlightIssue");
    expect(spotlightReporter).toMatch(/&page=\$\{page\}/);
  });

  it("pins workflow actions and limits credential exposure", () => {
    const workflowNames = readdirSync(new URL("../.github/workflows/", import.meta.url))
      .filter((name) => name.endsWith(".yml"));
    const workflows = workflowNames.map((name) => ({
      name,
      source: readFileSync(new URL(`../.github/workflows/${name}`, import.meta.url), "utf8"),
    }));

    for (const workflow of workflows) {
      const actionReferences = [...workflow.source.matchAll(/^\s*(?:-\s*)?uses:\s*[^@\s]+@([^\s#]+)/gm)];
      expect(actionReferences.length, `${workflow.name} should use at least one action`).toBeGreaterThan(0);
      for (const reference of actionReferences) {
        expect(reference[1], `${workflow.name} contains a mutable action reference`).toMatch(/^[0-9a-f]{40}$/);
      }
      if (workflow.source.includes("actions/checkout@")) {
        expect(workflow.source).toContain("persist-credentials: false");
      }
    }

    const refreshWorkflow = workflows.find(({ name }) => name === "daily-usage-refresh.yml")?.source;
    expect(refreshWorkflow).toBeDefined();
    const refreshJobHeader = refreshWorkflow!.slice(
      refreshWorkflow!.indexOf("  refresh:"),
      refreshWorkflow!.indexOf("    steps:"),
    );
    expect(refreshJobHeader).not.toContain("secrets.");
    expect(refreshJobHeader).not.toContain("GH_TOKEN:");
    expect(refreshJobHeader).not.toContain("GITHUB_TOKEN:");
    expect(refreshJobHeader).not.toContain("OPENROUTER_API_KEY:");

    const reactDoctorWorkflow = workflows.find(({ name }) => name === "react-doctor.yml")?.source;
    if (reactDoctorWorkflow === undefined) {
      throw new Error("react-doctor.yml should exist");
    }
    const workflowLines = reactDoctorWorkflow.split(/\r?\n/);
    const permissionDeclarations = workflowLines.filter((line) =>
      /^\s*permissions\s*:/.test(line),
    );
    expect(permissionDeclarations).toEqual(["permissions:"]);
    const permissionsStart = workflowLines.indexOf("permissions:");

    const workflowPermissions: string[] = [];
    for (const line of workflowLines.slice(permissionsStart + 1)) {
      const trimmed = line.trim();
      if (trimmed === "" || trimmed.startsWith("#")) {
        continue;
      }
      if (!/^[ \t]/.test(line)) {
        break;
      }
      workflowPermissions.push(trimmed.replace(/\s+#.*$/, ""));
    }

    expect(workflowPermissions).toEqual(["contents: read"]);
    expect(reactDoctorWorkflow).toMatch(/^\s+comment: false\s+#/m);
    expect(reactDoctorWorkflow).toMatch(/^\s+review-comments: false$/m);
    expect(reactDoctorWorkflow).toMatch(/^\s+commit-status: false$/m);
  });

  it("keeps dependency updates scheduled for packages and workflow actions", () => {
    const dependabot = readFileSync(new URL("../.github/dependabot.yml", import.meta.url), "utf8");
    expect(dependabot).toContain("package-ecosystem: npm");
    expect(dependabot).toContain("package-ecosystem: github-actions");
    expect(dependabot.match(/interval: weekly/g)).toHaveLength(2);
  });
});

describe("local TypeScript toolchain", () => {
  it("generates Next.js route types without tracking generated declarations", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as {
      scripts: { "check:spotlight": string; doctor: string; typecheck: string };
      devDependencies: { "@types/node": string };
    };
    const gitignore = readFileSync(
      new URL("../.gitignore", import.meta.url),
      "utf8",
    ).split("\n");

    expect(packageJson.scripts.typecheck).toBe("next typegen && tsc --noEmit");
    expect(packageJson.scripts.doctor).toBe("npx --yes react-doctor@0.9.3");
    expect(packageJson.scripts["check:spotlight"]).toBe(
      "vitest run --config vitest.spotlight.config.ts",
    );
    expect(packageJson.devDependencies["@types/node"]).toMatch(/^\^20\./);
    expect(gitignore).toContain("next-env.d.ts");
  });
});
