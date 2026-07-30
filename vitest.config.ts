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
          statements: 95,
          branches: 80,
          functions: 95,
          lines: 97,
        },
        "src/components/**/*.tsx": {
          statements: 27,
          branches: 24,
          functions: 30,
          lines: 28,
        },
        statements: 46,
        branches: 35,
        functions: 50,
        lines: 47,
      },
    },
  },
});
