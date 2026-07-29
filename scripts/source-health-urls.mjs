export const sourceUrlFields = new Set([
  "url",
  "sourceUrl",
  "sourceUrls",
  "repositoryUrl",
  "benchmarkSourceUrl",
  "resultSourceUrl",
  "submissionUrl",
  "artifactUrl",
  "integrationUrl",
  "latestReleaseUrl",
]);

export function urlsIn(source) {
  const matches = source.match(/https?:\/\/[^\s"'`<>\\]+/g) ?? [];
  return matches.map((url) => url.replace(/[),.;]+$/, ""));
}

export function collectUrls(value, urls, seen, field) {
  if (typeof value === "string") {
    if (sourceUrlFields.has(field)) for (const url of urlsIn(value)) urls.add(url);
    return;
  }
  if (value === null || (typeof value !== "object" && typeof value !== "function")) return;
  if (seen.has(value)) return;
  seen.add(value);
  if (typeof value === "function") return;
  if (Array.isArray(value)) {
    for (const item of value) collectUrls(item, urls, seen, field);
  } else {
    for (const [key, item] of Object.entries(value)) collectUrls(item, urls, seen, key);
  }
}
