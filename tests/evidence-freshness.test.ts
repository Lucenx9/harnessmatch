import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import {
  evidenceFreshnessPolicy,
  freshnessStateForAge,
  freshnessSummary,
  isValidVerificationDate,
  latestVerifiedAt,
  recordsInState,
  verificationAgeInDays,
  verifiedRecords,
} from "../src/lib/evidence-freshness";

/**
 * These tests read the wall clock on purpose. The site publishes verification
 * dates as current-state claims, so an untouched dataset must eventually fail
 * the build rather than keep asserting currency it no longer has. A failure
 * here is not flakiness: it means the sources are due for re-verification.
 */
describe("evidence freshness", () => {
  const now = new Date();

  it("collects a dated record for every product and every source", () => {
    const records = verifiedRecords();
    const scopes = new Set(records.map((record) => record.scope));

    expect(records.length).toBeGreaterThan(0);
    expect(scopes).toContain("harness");
    expect(scopes).toContain("evidence-source");
    expect(scopes).toContain("discovery-source");
    expect(scopes).toContain("logo");
    expect(scopes).toContain("membership");
    expect(scopes).toContain("operational-profile");
    expect(scopes).toContain("gui-product");
    expect(scopes).toContain("gui-logo");
    expect(scopes).toContain("gui-preview");
    expect(scopes).toContain("gui-claim");
    expect(scopes).toContain("gui-source");
    expect(scopes).toContain("gui-repository-audit");
    expect(scopes).toContain("gui-exclusion");
    expect(scopes).toContain("openrouter-attribution");
    expect(scopes).toContain("openrouter-ranking");
    expect(scopes).toContain("ecosystem-signal");
    expect(scopes).toContain("gui-ecosystem-signal");
    expect(scopes).toContain("release-snapshot");
  });

  it("records every verification date as a real ISO calendar day", () => {
    for (const record of verifiedRecords()) {
      expect(
        isValidVerificationDate(record.verifiedAt),
        `${record.scope} ${record.subject}: ${record.detail}`,
      ).toBe(true);
    }
  });

  it("never claims a source was verified in the future", () => {
    for (const record of verifiedRecords()) {
      expect(
        verificationAgeInDays(record.verifiedAt, now),
        `${record.scope} ${record.subject}: ${record.detail}`,
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("publishes no claim older than the maximum age in the freshness policy", () => {
    const stale = recordsInState("stale", now);
    const worst = stale
      .map((record) => `${record.scope} ${record.subject}: ${record.detail} (${record.verifiedAt})`)
      .slice(0, 10);

    expect(
      stale.length,
      `Re-verify these sources or archive the claims they support:\n${worst.join("\n")}`,
    ).toBe(0);
  });

  it("classifies ages against the policy boundaries", () => {
    expect(freshnessStateForAge(0)).toBe("current");
    expect(freshnessStateForAge(evidenceFreshnessPolicy.reviewAfterDays)).toBe("current");
    expect(freshnessStateForAge(evidenceFreshnessPolicy.reviewAfterDays + 1)).toBe("due-for-review");
    expect(freshnessStateForAge(evidenceFreshnessPolicy.maxAgeDays)).toBe("due-for-review");
    expect(freshnessStateForAge(evidenceFreshnessPolicy.maxAgeDays + 1)).toBe("stale");
  });

  it("measures age in whole UTC days regardless of host timezone", () => {
    expect(verificationAgeInDays("2026-07-01", new Date("2026-07-01T23:59:59Z"))).toBe(0);
    expect(verificationAgeInDays("2026-07-01", new Date("2026-07-02T00:00:01Z"))).toBe(1);
    expect(verificationAgeInDays("2026-01-01", new Date("2026-03-01T12:00:00Z"))).toBe(59);
  });

  it("rejects malformed or impossible verification dates", () => {
    expect(isValidVerificationDate("2026-02-30")).toBe(false);
    expect(isValidVerificationDate("2026-7-1")).toBe(false);
    expect(isValidVerificationDate("July 1, 2026")).toBe(false);
    expect(isValidVerificationDate("2026-07-01T00:00:00Z")).toBe(false);
    expect(isValidVerificationDate("2026-07-01")).toBe(true);
  });

  it("derives the site-wide checked date from the newest record in the dataset", () => {
    const latest = latestVerifiedAt();

    expect(isValidVerificationDate(latest)).toBe(true);
    expect(verificationAgeInDays(latest, now)).toBeGreaterThanOrEqual(0);
    for (const record of verifiedRecords()) {
      expect(record.verifiedAt <= latest).toBe(true);
    }
  });

  it("uses record dates only for profile sitemap entries and keeps the footer dynamic", async () => {
    const [{ default: sitemap }, footerSource] = await Promise.all([
      import("../src/app/sitemap"),
      readFile(new URL("../src/components/site-footer.tsx", import.meta.url), "utf8"),
    ]);
    const sitemapSource = await readFile(
      new URL("../src/app/sitemap.ts", import.meta.url),
      "utf8",
    );
    for (const entry of sitemap()) {
      const pathname = new URL(entry.url).pathname;
      const isProfile = /^\/(?:guis|harnesses)\/[^/]+$/.test(pathname);
      if (isProfile) {
        expect(entry.lastModified, entry.url).toBeDefined();
      } else {
        expect(entry, entry.url).not.toHaveProperty("lastModified");
      }
    }
    expect(sitemapSource).not.toContain("latestVerifiedAt");
    expect(sitemapSource).not.toMatch(/"20\d\d-\d\d-\d\d"/);
    expect(footerSource).not.toMatch(/20\d\d-\d\d-\d\d/);
  });

  it("summarises the dataset into states that add up", () => {
    const summary = freshnessSummary(now);

    expect(summary.current + summary.dueForReview + summary.stale).toBe(summary.total);
    expect(summary.oldestVerifiedAt).not.toBeNull();
    expect(summary.newestVerifiedAt! >= summary.oldestVerifiedAt!).toBe(true);
  });
});
