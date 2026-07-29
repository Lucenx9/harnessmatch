import { describe, expect, it } from "vitest";
import { decodeHashFragment } from "@/components/evidence-ledger";

describe("evidence ledger hash fragments", () => {
  it("decodes a valid fragment", () => {
    expect(decodeHashFragment("#Claude%20Code")).toBe("Claude Code");
  });

  it.each(["#%", "#%E0%A4%A"])("ignores a malformed fragment: %s", (hash) => {
    expect(decodeHashFragment(hash)).toBeNull();
  });
});
