import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { decodeAnswers } from "../src/components/recommender";

describe("decodeAnswers", () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      atob: (str: string) => Buffer.from(str, 'base64').toString('binary')
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null on invalid base64/JSON strings", () => {
    expect(decodeAnswers("invalid-base64")).toBeNull();
    expect(decodeAnswers(Buffer.from("invalid-json").toString("base64"))).toBeNull();
  });
});
