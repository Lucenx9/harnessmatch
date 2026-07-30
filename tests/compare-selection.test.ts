import { describe, expect, it } from "vitest";
import {
  MAX_COMPARE_SELECTION,
  normalizeCompareSelection,
  parseCompareSelection,
} from "../src/lib/compare-selection";

const activeHarnessIds = new Set(["aider", "claude-code", "codex", "opencode", "warp"]);

describe("compare selection", () => {
  it("distinguishes a missing ids parameter from an explicit empty selection", () => {
    expect(parseCompareSelection("?source=profile", activeHarnessIds)).toBeNull();
    expect(parseCompareSelection("?ids=", activeHarnessIds)).toEqual([]);
  });

  it("filters unpublished ids and removes duplicates while preserving order", () => {
    expect(parseCompareSelection(
      "?ids=codex,unknown,codex,aider",
      activeHarnessIds,
    )).toEqual(["codex", "aider"]);
  });

  it("trims ids and caps the selection at the public limit", () => {
    const selection = normalizeCompareSelection(
      [" codex ", "aider", "opencode", "warp", "claude-code"],
      activeHarnessIds,
    );

    expect(selection).toEqual(["codex", "aider", "opencode", "warp"]);
    expect(selection).toHaveLength(MAX_COMPARE_SELECTION);
  });
});
