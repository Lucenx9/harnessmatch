import { describe, expect, it } from "vitest";
// @ts-expect-error The production helper is a directly executable JavaScript module.
import { loadPublishedDataModules } from "../scripts/source-health-modules.mjs";

describe("source health module loading", () => {
  it("loads every top-level published data module with project aliases", async () => {
    const { moduleFiles, modules } = await loadPublishedDataModules();

    expect(moduleFiles).toContain("/src/data/harnesses.ts");
    expect(moduleFiles).toContain("/src/data/feature-claims.ts");
    expect(modules).toHaveLength(moduleFiles.length);
    expect(modules.length).toBeGreaterThan(10);
  });
});
