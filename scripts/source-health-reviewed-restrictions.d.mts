export type ReviewedSourceHealthRestriction = {
  url: string;
  status: number;
  /** ISO UTC calendar day, `YYYY-MM-DD`. */
  reviewedAt: string;
  reason: string;
};

export const reviewedSourceHealthRestrictions: ReviewedSourceHealthRestriction[];
