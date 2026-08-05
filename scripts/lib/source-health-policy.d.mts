export type SourceHealthState = "healthy" | "broken" | "access-restricted" | "inconclusive";

export type SourceHealthResult = {
  url: string;
  status: number | null;
  state: SourceHealthState;
};

export type ReviewedSourceHealthRestriction = {
  url: string;
  status: number;
  reviewedAt: string;
  reason: string;
};

export function mapConcurrentByOrigin<Item extends string, Result>(
  items: readonly Item[],
  worker: (item: Item) => Promise<Result>,
  limit: number,
  perOriginLimit: number,
): Promise<Result[]>;
export function sourceHealthRequestHeaders(
  input: string | URL,
  githubToken: string | null,
): Record<string, string>;
export function shouldRetrySourceProbe(attempt: number, status: number): boolean;
export function sourceHealthRetryDelayMs(status: number, headers: Headers, attempt: number): number;
export function isReviewedAccessRestriction(
  result: SourceHealthResult,
  reviewedRestrictions: readonly ReviewedSourceHealthRestriction[],
): boolean;
export function sourceHealthFailures<Result extends SourceHealthResult>(
  results: readonly Result[],
  reviewedRestrictions: readonly ReviewedSourceHealthRestriction[],
): Result[];
