import { harnesses } from "../data/harnesses";
import { benchmarkRuns } from "../data/benchmark-runs";
import { getHarnessMembershipAssessment } from "../data/harness-membership";
import { operationalProfileRecords } from "../data/operational-profiles";
import { repositoryAudits } from "../data/repository-audits";
import { guiExclusions, guiProducts } from "../data/gui-products";
import { guiRepositoryAudits } from "../data/gui-repository-audits";

/**
 * Published claims carry a verification date, so an unmaintained dataset keeps
 * asserting currency it no longer has. These thresholds turn that silent decay
 * into a visible state, and the freshness test into a failing build.
 *
 * The windows are short because the cataloged products ship on a scale of weeks:
 * a permission model or headless entry point verified six months ago is not
 * evidence about the product as it exists today.
 */
export const evidenceFreshnessPolicy = {
  /** Past this age a record belongs in the refresh queue, but stays publishable. */
  reviewAfterDays: 60,
  /** Past this age a record may no longer be published as a current claim. */
  maxAgeDays: 120,
} as const;

export type FreshnessState = "current" | "due-for-review" | "stale";

export type VerifiedRecordScope =
  | "harness"
  | "evidence-source"
  | "logo"
  | "membership"
  | "operational-profile"
  | "repository-audit"
  | "benchmark-run"
  | "gui-product"
  | "gui-logo"
  | "gui-claim"
  | "gui-source"
  | "gui-repository-audit"
  | "gui-exclusion";

export type VerifiedRecord = {
  scope: VerifiedRecordScope;
  subject: string;
  detail: string;
  verifiedAt: string;
};

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const millisecondsPerDay = 86_400_000;

export function isValidVerificationDate(value: string): boolean {
  if (!isoDatePattern.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(timestamp)) return false;
  return new Date(timestamp).toISOString().startsWith(value);
}

/** Whole days elapsed, in UTC, so the result never depends on the host timezone. */
export function verificationAgeInDays(verifiedAt: string, now: Date): number {
  const verified = Date.parse(`${verifiedAt}T00:00:00Z`);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((today - verified) / millisecondsPerDay);
}

export function freshnessStateForAge(ageInDays: number): FreshnessState {
  if (ageInDays > evidenceFreshnessPolicy.maxAgeDays) return "stale";
  if (ageInDays > evidenceFreshnessPolicy.reviewAfterDays) return "due-for-review";
  return "current";
}

/**
 * Every dated claim in the dataset, flattened. A new dated record type must be
 * added here, otherwise it ages without any check noticing.
 */
export function verifiedRecords(): VerifiedRecord[] {
  const records: VerifiedRecord[] = [];

  for (const harness of harnesses) {
    records.push({
      scope: "harness",
      subject: harness.id,
      detail: "product record",
      verifiedAt: harness.verifiedAt,
    });
    records.push({
      scope: "logo",
      subject: harness.id,
      detail: harness.logo.sourceUrl,
      verifiedAt: harness.logo.verifiedAt,
    });
    for (const source of harness.evidence) {
      records.push({
        scope: "evidence-source",
        subject: harness.id,
        detail: source.url,
        verifiedAt: source.verifiedAt,
      });
    }

    const membership = getHarnessMembershipAssessment(harness);
    if (membership) {
      records.push({
        scope: "membership",
        subject: harness.id,
        detail: "membership assessment",
        verifiedAt: membership.verifiedAt,
      });
    }

    const operational = operationalProfileRecords[harness.id];
    if (operational) {
      records.push({
        scope: "operational-profile",
        subject: harness.id,
        detail: "operational profile",
        verifiedAt: operational.verifiedAt,
      });
    }
  }

  for (const product of guiProducts) {
    records.push({
      scope: "gui-product",
      subject: product.id,
      detail: "GUI product record",
      verifiedAt: product.verifiedAt,
    });
    records.push({
      scope: "gui-logo",
      subject: product.id,
      detail: product.logo.sourceUrl,
      verifiedAt: product.logo.verifiedAt,
    });
    for (const [capability, claim] of Object.entries(product.capabilities)) {
      records.push({
        scope: "gui-claim",
        subject: product.id,
        detail: capability,
        verifiedAt: claim.verifiedAt,
      });
    }
    for (const source of product.evidence) {
      records.push({
        scope: "gui-source",
        subject: product.id,
        detail: source.url,
        verifiedAt: source.verifiedAt,
      });
    }
  }

  for (const audit of guiRepositoryAudits) {
    records.push({
      scope: "gui-repository-audit",
      subject: audit.guiId,
      detail: audit.inspectedRef,
      verifiedAt: audit.verifiedAt,
    });
  }

  for (const exclusion of guiExclusions) {
    records.push({
      scope: "gui-exclusion",
      subject: exclusion.id,
      detail: exclusion.sourceUrl,
      verifiedAt: exclusion.verifiedAt,
    });
  }

  for (const audit of repositoryAudits) {
    records.push({
      scope: "repository-audit",
      subject: audit.harnessId,
      detail: "repository audit",
      verifiedAt: audit.verifiedAt,
    });
  }

  for (const run of benchmarkRuns) {
    records.push({
      scope: "benchmark-run",
      subject: run.harnessId,
      detail: run.id,
      verifiedAt: run.verifiedAt,
    });
  }

  return records;
}

/**
 * The most recent verification date in the dataset. Use this instead of a
 * hardcoded date wherever the site states when it was last checked: a literal
 * keeps asserting the day it was typed long after the content moved on.
 */
export function latestVerifiedAt(): string {
  return verifiedRecords()
    .map((record) => record.verifiedAt)
    .reduce((latest, current) => (current > latest ? current : latest));
}

export type FreshnessSummary = {
  total: number;
  current: number;
  dueForReview: number;
  stale: number;
  oldestVerifiedAt: string | null;
  newestVerifiedAt: string | null;
};

export function freshnessSummary(now: Date = new Date()): FreshnessSummary {
  const records = verifiedRecords();
  const dates = records.map((record) => record.verifiedAt).sort();
  const states = records.map((record) =>
    freshnessStateForAge(verificationAgeInDays(record.verifiedAt, now)));

  return {
    total: records.length,
    current: states.filter((state) => state === "current").length,
    dueForReview: states.filter((state) => state === "due-for-review").length,
    stale: states.filter((state) => state === "stale").length,
    oldestVerifiedAt: dates[0] ?? null,
    newestVerifiedAt: dates[dates.length - 1] ?? null,
  };
}

export function recordsInState(state: FreshnessState, now: Date = new Date()): VerifiedRecord[] {
  return verifiedRecords().filter((record) =>
    freshnessStateForAge(verificationAgeInDays(record.verifiedAt, now)) === state);
}
