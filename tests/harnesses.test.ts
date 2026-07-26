import { describe, expect, it } from "vitest";
import { harnesses } from "../src/data/harnesses";

const firstPartyHosts: Record<string, string[]> = {
  "claude-code": ["code.claude.com", "claude.com"],
  codex: ["developers.openai.com", "github.com"],
  opencode: ["opencode.ai"],
  aider: ["aider.chat"],
  openhands: ["docs.openhands.dev"],
  goose: ["goose-docs.ai", "github.com"],
  cline: ["docs.cline.bot"],
};

describe("harness evidence ledger", () => {
  it("keeps every capability profile backed by multiple current sources", () => {
    for (const harness of harnesses) {
      expect(harness.evidence.length).toBeGreaterThanOrEqual(2);
      expect(harness.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      for (const source of harness.evidence) {
        expect(source.verifiedAt).toBe(harness.verifiedAt);
        expect(source.covers.length).toBeGreaterThan(12);
        expect(firstPartyHosts[harness.id]).toContain(new URL(source.url).hostname);
      }
    }
  });

  it("records the source-audited capability corrections", () => {
    const byId = new Map(harnesses.map((harness) => [harness.id, harness]));

    expect(byId.get("claude-code")?.features.sandbox).toBe(true);
    expect(byId.get("codex")?.localModels).toBe(true);
    expect(byId.get("opencode")?.features.checkpoints).toBe(true);
    expect(byId.get("aider")?.supportsSubscription).toBe(true);
    expect(byId.get("openhands")?.supportsSubscription).toBe(true);
  });
});
