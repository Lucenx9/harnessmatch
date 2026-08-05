import { describe, expect, it } from "vitest";
import { homeSpotlight } from "../src/data/home-spotlight";

describe("monthly homepage spotlight freshness", () => {
  it("matches the current UTC month", () => {
    const now = new Date();

    expect(homeSpotlight.period).toEqual({
      year: now.getUTCFullYear(),
      month: now.getUTCMonth() + 1,
    });
  });
});
