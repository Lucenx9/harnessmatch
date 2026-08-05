const githubApiOrigin = "https://api.github.com";
const headFallbackStatuses = new Set([401, 403, 404, 405, 429, 501]);

export async function mapConcurrentByOrigin(items, worker, limit, perOriginLimit) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("Source probe concurrency must be a positive integer.");
  if (!Number.isInteger(perOriginLimit) || perOriginLimit < 1 || perOriginLimit > limit) {
    throw new Error("Per-origin source probe concurrency must be between one and the global limit.");
  }

  const queuesByOrigin = new Map();
  items.forEach((item, index) => {
    const origin = new URL(item).origin;
    const queue = queuesByOrigin.get(origin) ?? [];
    queue.push({ index, item });
    queuesByOrigin.set(origin, queue);
  });

  const results = new Array(items.length);
  const readyOrigins = [...queuesByOrigin.keys()];
  const activeCountsByOrigin = new Map();
  const activeJobs = new Map();
  let nextJobId = 0;

  function startReadyJobs() {
    while (activeJobs.size < limit && readyOrigins.length > 0) {
      const origin = readyOrigins.shift();
      if (!origin) continue;
      const activeForOrigin = activeCountsByOrigin.get(origin) ?? 0;
      if (activeForOrigin >= perOriginLimit) continue;
      const job = queuesByOrigin.get(origin)?.shift();
      if (!job) continue;
      activeCountsByOrigin.set(origin, activeForOrigin + 1);
      if ((queuesByOrigin.get(origin)?.length ?? 0) > 0 && activeForOrigin + 1 < perOriginLimit) {
        readyOrigins.push(origin);
      }
      const jobId = nextJobId;
      nextJobId += 1;
      const promise = Promise.resolve(worker(job.item)).then((value) => ({
        index: job.index,
        jobId,
        origin,
        value,
      }));
      activeJobs.set(jobId, promise);
    }
  }

  startReadyJobs();
  while (activeJobs.size > 0) {
    const completed = await Promise.race(activeJobs.values());
    activeJobs.delete(completed.jobId);
    results[completed.index] = completed.value;
    const remainingForOrigin = (activeCountsByOrigin.get(completed.origin) ?? 1) - 1;
    activeCountsByOrigin.set(completed.origin, remainingForOrigin);
    if (
      (queuesByOrigin.get(completed.origin)?.length ?? 0) > 0
      && !readyOrigins.includes(completed.origin)
    ) {
      readyOrigins.push(completed.origin);
    }
    startReadyJobs();
  }

  return results;
}

export function sourceHealthRequestHeaders(input, githubToken) {
  const url = new URL(input);
  return {
    accept: "text/html,application/xhtml+xml,application/json,text/plain,*/*",
    "user-agent": "HarnessMatch source-health audit (+https://harnessmatch.dev)",
    ...(githubToken && url.origin === githubApiOrigin
      ? { authorization: `Bearer ${githubToken}` }
      : {}),
  };
}

export function shouldRetrySourceProbe(attempt, status) {
  if (attempt >= 3) return false;
  if (attempt === 1 && headFallbackStatuses.has(status)) return true;
  return status === 429 || status >= 500;
}

export function sourceHealthRetryDelayMs(status, headers, attempt) {
  if (status === 429) {
    const retryAfter = headers.get("retry-after");
    const retryAfterSeconds = retryAfter && /^\d+$/.test(retryAfter)
      ? Number.parseInt(retryAfter, 10)
      : null;
    const requestedDelay = retryAfterSeconds === null ? attempt * 1_000 : retryAfterSeconds * 1_000;
    return Math.min(Math.max(requestedDelay, 250), 10_000);
  }
  return attempt * 250;
}

export function isReviewedAccessRestriction(result, reviewedRestrictions) {
  if (result.state !== "access-restricted") return false;
  return reviewedRestrictions.some((restriction) => (
    restriction.url === result.url && restriction.status === result.status
  ));
}

export function sourceHealthFailures(results, reviewedRestrictions) {
  return results.filter((result) => (
    result.state !== "healthy"
    && !isReviewedAccessRestriction(result, reviewedRestrictions)
  ));
}
