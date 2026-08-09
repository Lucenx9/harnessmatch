import { describe, expect, it } from "vitest";
import {
  evidenceFreshnessPolicy,
  isValidVerificationDate,
  verificationAgeInDays,
} from "../src/lib/evidence-freshness";
import { reviewedSourceHealthRestrictions } from "../scripts/source-health-reviewed-restrictions.mjs";

/**
 * A reviewed restriction lets a failing probe pass the source audit, so it is a
 * dated claim in the same sense as a published verification date and it ages
 * under the same policy. Like tests/evidence-freshness.test.ts this reads the
 * wall clock on purpose: a failure means the restrictions must be re-checked
 * against the live publishers, not that the threshold should be widened.
 */
describe("reviewed source health restrictions", () => {
  const now = new Date();

  it("records every review date as a real ISO calendar day", () => {
    expect(reviewedSourceHealthRestrictions.length).toBeGreaterThan(0);

    for (const restriction of reviewedSourceHealthRestrictions) {
      expect(isValidVerificationDate(restriction.reviewedAt), restriction.url).toBe(true);
    }
  });

  it("never claims a restriction was reviewed in the future", () => {
    for (const restriction of reviewedSourceHealthRestrictions) {
      expect(verificationAgeInDays(restriction.reviewedAt, now), restriction.url)
        .toBeGreaterThanOrEqual(0);
    }
  });

  it("expires a waiver once it ages past the published freshness policy", () => {
    for (const restriction of reviewedSourceHealthRestrictions) {
      expect(verificationAgeInDays(restriction.reviewedAt, now), restriction.url)
        .toBeLessThanOrEqual(evidenceFreshnessPolicy.maxAgeDays);
    }
  });

  it("records both observed OpenReview challenge outcomes without widening status matching", () => {
    const openReviewStatuses = reviewedSourceHealthRestrictions
      .filter(({ url }) => url.startsWith("https://openreview.net/"))
      .reduce<Map<string, number[]>>((statusesByUrl, { status, url }) => {
        statusesByUrl.set(url, [...(statusesByUrl.get(url) ?? []), status]);
        return statusesByUrl;
      }, new Map());

    expect([...openReviewStatuses.values()]).toHaveLength(5);
    for (const statuses of openReviewStatuses.values()) {
      expect(statuses.toSorted()).toEqual([200, 403]);
    }
  });
});
