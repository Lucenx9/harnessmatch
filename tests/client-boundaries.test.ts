import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const clientComponents = [
  "../src/components/gui-live-signals.tsx",
  "../src/components/gui-workflow-matcher.tsx",
  "../src/components/architecture-level-indicator.tsx",
  "../src/components/evidence-ledger.tsx",
  "../src/components/evidence-ranking-explorer.tsx",
  "../src/components/harness-lens-explorer.tsx",
];

describe("client module boundaries", () => {
  it("keeps repository datasets out of interactive client modules", () => {
    for (const relativePath of clientComponents) {
      const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
      expect(source, relativePath).not.toMatch(/from ["']@\/data\//);
    }
  });
});
