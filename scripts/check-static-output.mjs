import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const pageBudgets = [
  { path: "out/data.html", maximumBytes: 550_000 },
  { path: "out/index.html", maximumBytes: 280_000 },
  { path: "out/compare.html", maximumBytes: 300_000 },
];

const assetBudgets = [
  { directory: "out/_next/static/chunks", extension: ".js", maximumBytes: 260_000 },
  { directory: "out/_next/static/chunks", extension: ".css", maximumBytes: 190_000 },
];

function formatBytes(bytes) {
  return `${(bytes / 1_000).toFixed(1)} KB`;
}

async function largestAsset({ directory, extension }) {
  const entries = await readdir(directory, { withFileTypes: true });
  const candidates = await Promise.all(entries
    .filter((entry) => entry.isFile() && extname(entry.name) === extension)
    .map(async (entry) => ({
      path: join(directory, entry.name),
      bytes: (await stat(join(directory, entry.name))).size,
    })));
  return candidates.sort((left, right) => right.bytes - left.bytes).at(0);
}

const measurements = await Promise.all(pageBudgets.map(async (budget) => ({
  ...budget,
  bytes: (await stat(budget.path)).size,
})));

for (const budget of assetBudgets) {
  const asset = await largestAsset(budget);
  if (!asset) throw new Error(`No ${budget.extension} assets found in ${budget.directory}`);
  measurements.push({ ...asset, maximumBytes: budget.maximumBytes });
}

let exceeded = false;
for (const measurement of measurements) {
  const passes = measurement.bytes <= measurement.maximumBytes;
  exceeded ||= !passes;
  console.log(`${passes ? "PASS" : "FAIL"} ${measurement.path}: ${formatBytes(measurement.bytes)} / ${formatBytes(measurement.maximumBytes)}`);
}

if (exceeded) {
  throw new Error("Static output exceeded its review budget. Inspect serialization or client bundling before raising a limit.");
}
