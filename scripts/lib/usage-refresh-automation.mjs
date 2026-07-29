export const allowedUsageRefreshPaths = [
  "research/release-review-queue.json",
  "src/data/ecosystem-signals.ts",
  "src/data/gui-ecosystem-signals.ts",
  "src/data/openrouter-attribution.ts",
  "src/data/release-signals.json",
];

export function changedPathsFromPorcelain(source) {
  return source
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const path = line.slice(3);
      return path.includes(" -> ") ? path.split(" -> ").at(-1) : path;
    });
}

export function unexpectedUsageRefreshPaths(paths) {
  const allowed = new Set(allowedUsageRefreshPaths);
  return paths.filter((path) => !allowed.has(path));
}
