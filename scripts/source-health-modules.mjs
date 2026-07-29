import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createViteServer } from "vitest/node";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceRoot = fileURLToPath(new URL("../src", import.meta.url));
const dataRoot = new URL("../src/data/", import.meta.url);

export async function loadPublishedDataModules() {
  const moduleFiles = (await readdir(dataRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) => `/src/data/${entry.name}`);
  const vite = await createViteServer({
    root: repositoryRoot,
    resolve: { alias: { "@": sourceRoot } },
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });

  try {
    const modules = await Promise.all(moduleFiles.map((path) => vite.ssrLoadModule(path)));
    return { moduleFiles, modules };
  } finally {
    await vite.close();
  }
}
