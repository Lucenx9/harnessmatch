import { execFileSync } from "node:child_process";
import {
  allowedUsageRefreshPaths,
  changedPathsFromPorcelain,
  unexpectedUsageRefreshPaths,
} from "./lib/usage-refresh-automation.mjs";

const status = execFileSync(
  "git",
  ["status", "--porcelain=v1", "--untracked-files=all"],
  { encoding: "utf8" },
);
const changedPaths = changedPathsFromPorcelain(status);
const unexpectedPaths = unexpectedUsageRefreshPaths(changedPaths);

if (unexpectedPaths.length > 0) {
  throw new Error(`Usage refresh changed files outside its allowlist: ${unexpectedPaths.join(", ")}`);
}

console.log(changedPaths.length > 0
  ? `Usage refresh scope is valid: ${changedPaths.join(", ")}.`
  : `Usage refresh made no changes. Allowed paths: ${allowedUsageRefreshPaths.join(", ")}.`);
