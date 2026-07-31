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

  it("pins workflow actions and limits credential exposure", () => {
    const workflows = ["daily-usage-refresh.yml", "quality.yml"].map((name) => ({
      name,
      source: readFileSync(new URL(`../.github/workflows/${name}`, import.meta.url), "utf8"),
    }));

    for (const workflow of workflows) {
      const actionReferences = [...workflow.source.matchAll(/^\s*uses:\s*[^@\s]+@([^\s#]+)/gm)];
      expect(actionReferences.length, `${workflow.name} should use at least one action`).toBeGreaterThan(0);
      for (const reference of actionReferences) {
        expect(reference[1], `${workflow.name} contains a mutable action reference`).toMatch(/^[0-9a-f]{40}$/);
      }
      expect(workflow.source).toContain("persist-credentials: false");
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
  });
});

describe("local TypeScript toolchain", () => {
  it("generates Next.js route types without tracking generated declarations", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as {
      scripts: { typecheck: string };
      devDependencies: { "@types/node": string };
    };
    const gitignore = readFileSync(
      new URL("../.gitignore", import.meta.url),
      "utf8",
    ).split("\n");

    expect(packageJson.scripts.typecheck).toBe("next typegen && tsc --noEmit");
    expect(packageJson.devDependencies["@types/node"]).toMatch(/^\^20\./);
    expect(gitignore).toContain("next-env.d.ts");
  });
});
