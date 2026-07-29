import { z } from "zod";

export const recentReleaseWindowDays = 90;

const repositoryScopeSchema = z.enum(["full-source", "client-source", "support-repository"]);

const harnessReleaseSnapshotSchema = z.object({
  harnessId: z.string().min(1).max(100),
  repository: z.string().regex(/^[^/]+\/[^/]+$/),
  repositoryScope: repositoryScopeSchema,
  latestVersion: z.string().min(1).max(200),
  latestReleaseAt: z.string().date(),
  latestReleaseUrl: z.string().url().startsWith("https://github.com/"),
  recentReleaseCount: z.number().int().nonnegative(),
  recentReleaseWindowDays: z.literal(recentReleaseWindowDays),
  observedAt: z.string().date(),
  sourceUrl: z.string().url().startsWith("https://api.github.com/"),
}).strict();

const harnessReleaseSnapshotsSchema = z.array(harnessReleaseSnapshotSchema).max(200);

function utcWindowStart(observedAt) {
  const timestamp = Date.parse(`${observedAt}T00:00:00Z`);
  if (Number.isNaN(timestamp)) throw new Error(`Release observation date is invalid: ${observedAt}`);
  return new Date(timestamp - ((recentReleaseWindowDays - 1) * 86_400_000)).toISOString().slice(0, 10);
}

function matchingStableReleases(releases, watch, audit) {
  if (!Array.isArray(releases)) throw new Error(`GitHub releases are missing for ${watch.harnessId}`);
  if (audit?.harnessId !== watch.harnessId) throw new Error(`Release-watch repository identity changed for ${watch.harnessId}`);
  if (!Array.isArray(watch.includeTagPatterns) || watch.includeTagPatterns.length === 0) {
    throw new Error(`Release watch has no tag pattern for ${watch.harnessId}`);
  }
  const patterns = watch.includeTagPatterns.map((pattern) => new RegExp(pattern));
  const releaseUrlPrefix = `${audit.repositoryUrl}/releases/tag/`;
  return releases.filter((release) => {
    if (release?.draft === true || release?.prerelease === true) return false;
    if (typeof release?.tag_name !== "string" || !patterns.some((pattern) => pattern.test(release.tag_name))) return false;
    if (typeof release?.published_at !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(release.published_at)) {
      throw new Error(`GitHub release date is invalid for ${watch.harnessId}`);
    }
    if (typeof release?.html_url !== "string" || !release.html_url.toLowerCase().startsWith(releaseUrlPrefix.toLowerCase())) {
      throw new Error(`GitHub release URL changed for ${watch.harnessId}`);
    }
    return true;
  }).toSorted((left, right) => (
    right.published_at.localeCompare(left.published_at)
    || right.tag_name.localeCompare(left.tag_name)
  ));
}

export function selectLatestStableRelease(releases, watch, audit) {
  const latest = matchingStableReleases(releases, watch, audit)[0];
  if (!latest) return null;
  return {
    harnessId: watch.harnessId,
    repository: audit.repositoryUrl.replace("https://github.com/", ""),
    version: latest.tag_name,
    releasedAt: latest.published_at.slice(0, 10),
    releaseUrl: latest.html_url,
  };
}

export function buildHarnessReleaseSnapshot(releases, watch, audit, observedAt) {
  const matching = matchingStableReleases(releases, watch, audit);
  const latest = matching[0];
  if (!latest) throw new Error(`No product-scoped stable GitHub release was found for ${watch.harnessId}`);
  const latestReleaseAt = latest.published_at.slice(0, 10);
  if (latestReleaseAt > observedAt) throw new Error(`Latest release is in the future for ${watch.harnessId}`);
  const windowStart = utcWindowStart(observedAt);
  const repository = audit.repositoryUrl.replace("https://github.com/", "");
  return harnessReleaseSnapshotSchema.parse({
    harnessId: watch.harnessId,
    repository,
    repositoryScope: audit.sourceScope,
    latestVersion: latest.tag_name,
    latestReleaseAt,
    latestReleaseUrl: latest.html_url,
    recentReleaseCount: matching.filter((release) => {
      const releasedAt = release.published_at.slice(0, 10);
      return releasedAt >= windowStart && releasedAt <= observedAt;
    }).length,
    recentReleaseWindowDays,
    observedAt,
    sourceUrl: `https://api.github.com/repos/${repository}/releases`,
  });
}

export function parseHarnessReleaseSnapshots(value) {
  const snapshots = harnessReleaseSnapshotsSchema.parse(value);
  const harnessIds = new Set(snapshots.map(({ harnessId }) => harnessId));
  if (harnessIds.size !== snapshots.length) throw new Error("Harness release snapshots repeat a harness id");
  return snapshots;
}

export function renderHarnessReleaseSnapshots(snapshots) {
  const validated = parseHarnessReleaseSnapshots(snapshots)
    .toSorted((left, right) => left.harnessId.localeCompare(right.harnessId));
  return `${JSON.stringify(validated, null, 2)}\n`;
}
