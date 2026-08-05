export type ReleaseWatch = {
  harnessId: string;
  includeTagPatterns: string[];
  includeNamePatterns?: string[];
};

export type RepositoryAuditIdentity = {
  harnessId: string;
  repositoryUrl: string;
  sourceScope: "full-source" | "client-source" | "support-repository";
};

export const recentReleaseWindowDays: 90;
export const githubReleasePageSize: 100;
export function releaseHistoryPageNeedsNextPage(releases: unknown[]): boolean;
export function selectLatestStableRelease(releases: unknown[], watch: ReleaseWatch, audit: RepositoryAuditIdentity): Record<string, string> | null;
export function buildHarnessReleaseSnapshot(releases: unknown[], watch: ReleaseWatch, audit: RepositoryAuditIdentity, observedAt: string): Record<string, unknown>;
export function parseHarnessReleaseSnapshots(value: unknown): Array<Record<string, unknown>>;
export function renderHarnessReleaseSnapshots(snapshots: unknown[]): string;
