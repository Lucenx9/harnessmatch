import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** Mirrors the `@/*` path alias in tsconfig.json so tests can import app code. */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "coverage",
      /**
       * Only the hand-written logic and presentation layers carry a budget.
       * `src/data` is largely generated or declarative, so measuring it would
       * report a ratio of the catalog rather than of the code under test.
       */
      include: ["src/components/**/*.tsx", "src/lib/**/*.ts"],
      exclude: ["src/lib/*-types.ts", "src/lib/types.ts"],
      /**
       * A ratchet, not a target: each floor sits just under the measured
       * baseline so coverage cannot silently regress. Raise a floor when new
       * tests lift it; never lower one to make a run pass.
       */
      thresholds: {
        "src/lib/**/*.ts": {
          statements: 97,
          branches: 85,
          functions: 98,
          lines: 98,
        },
        "src/components/**/*.tsx": {
          statements: 75,
          branches: 68,
          functions: 72,
          lines: 78,
        },
        statements: 82,
        branches: 72,
        functions: 80,
        lines: 85,
      },
    },
  },
});
