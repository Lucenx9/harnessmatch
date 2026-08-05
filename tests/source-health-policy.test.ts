import { describe, expect, it } from "vitest";
import {
  mapConcurrentByOrigin,
  sourceHealthRetryDelayMs,
  sourceHealthFailures,
  sourceHealthRequestHeaders,
  shouldRetrySourceProbe,
} from "../scripts/lib/source-health-policy.mjs";

const reviewedRestriction = {
  url: "https://restricted.example/source",
  status: 403,
  reviewedAt: "2026-08-05",
  reason: "The publisher rejects automated source probes.",
};

describe("source health policy", () => {
  it("serializes probes per origin while retaining cross-origin concurrency", async () => {
    const urls = [
      "https://one.example/a",
      "https://one.example/b",
      "https://two.example/a",
      "https://two.example/b",
    ];
    const activeByOrigin = new Map<string, number>();
    const maximumByOrigin = new Map<string, number>();
    let activeTotal = 0;
    let maximumTotal = 0;

    const results = await mapConcurrentByOrigin(urls, async (url: string) => {
      const origin = new URL(url).origin;
      const activeForOrigin = (activeByOrigin.get(origin) ?? 0) + 1;
      activeByOrigin.set(origin, activeForOrigin);
      maximumByOrigin.set(origin, Math.max(maximumByOrigin.get(origin) ?? 0, activeForOrigin));
      activeTotal += 1;
      maximumTotal = Math.max(maximumTotal, activeTotal);
      await new Promise((resolve) => setTimeout(resolve, 2));
      activeTotal -= 1;
      activeByOrigin.set(origin, activeForOrigin - 1);
      return url;
    }, 4, 2);

    expect(results).toEqual(urls);
    expect([...maximumByOrigin.values()]).toEqual([2, 2]);
    expect(maximumTotal).toBe(4);
  });

  it("scopes GitHub credentials to the exact HTTPS API origin", () => {
    expect(sourceHealthRequestHeaders(
      "https://api.github.com/repos/example/project",
      "github-token",
    )).toHaveProperty("authorization", "Bearer github-token");
    expect(sourceHealthRequestHeaders(
      "https://api.github.com.evil.example/repos/example/project",
      "github-token",
    )).not.toHaveProperty("authorization");
    expect(sourceHealthRequestHeaders(
      "http://api.github.com/repos/example/project",
      "github-token",
    )).not.toHaveProperty("authorization");
  });

  it("retries access-restricted HEAD responses with GET before classifying them", () => {
    expect(shouldRetrySourceProbe(1, 403)).toBe(true);
    expect(shouldRetrySourceProbe(1, 429)).toBe(true);
    expect(shouldRetrySourceProbe(2, 403)).toBe(false);
    expect(shouldRetrySourceProbe(2, 503)).toBe(true);
  });

  it("honors bounded Retry-After guidance for rate limits", () => {
    expect(sourceHealthRetryDelayMs(429, new Headers({ "retry-after": "2" }), 1)).toBe(2_000);
    expect(sourceHealthRetryDelayMs(429, new Headers({ "retry-after": "60" }), 2)).toBe(10_000);
    expect(sourceHealthRetryDelayMs(503, new Headers(), 2)).toBe(500);
  });

  it("fails closed on broken, inconclusive, and unreviewed restricted sources", () => {
    const broken = { url: "https://example.com/broken", status: 404, state: "broken" } as const;
    const inconclusive = { url: "https://example.com/timeout", status: null, state: "inconclusive" } as const;
    const restricted = { url: "https://example.com/private", status: 403, state: "access-restricted" } as const;

    expect(sourceHealthFailures([broken, inconclusive, restricted], [reviewedRestriction])).toEqual([
      broken,
      inconclusive,
      restricted,
    ]);
  });

  it("accepts only an exact, status-matched reviewed restriction without calling it healthy", () => {
    const reviewed = {
      url: reviewedRestriction.url,
      status: reviewedRestriction.status,
      state: "access-restricted",
    } as const;
    const changedStatus = { ...reviewed, status: 429 };

    expect(sourceHealthFailures([reviewed], [reviewedRestriction])).toEqual([]);
    expect(sourceHealthFailures([changedStatus], [reviewedRestriction])).toEqual([changedStatus]);
  });
});
