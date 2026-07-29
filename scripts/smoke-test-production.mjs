import { sleep } from "./lib/github-automation.mjs";

const canonicalOrigin = "https://harnessmatch.dev";
const attempts = 12;

const checks = [
  { url: `${canonicalOrigin}/`, includes: "Source-backed data on AI coding harnesses" },
  { url: `${canonicalOrigin}/data`, includes: "Latest stable releases" },
  { url: `${canonicalOrigin}/usage`, includes: "Coding harness usage signals" },
  { url: `${canonicalOrigin}/sitemap.xml`, includes: "https://harnessmatch.dev/harnesses/" },
  { url: `${canonicalOrigin}/robots.txt`, includes: "Sitemap: https://harnessmatch.dev/sitemap.xml" },
  { url: `${canonicalOrigin}/llms.txt`, includes: "# HarnessMatch" },
];

async function fetchText(check) {
  const response = await fetch(check.url, {
    headers: { "User-Agent": "HarnessMatch-production-smoke-test" },
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`${check.url} returned HTTP ${response.status}`);
  if (!body.includes(check.includes)) {
    throw new Error(`${check.url} did not contain the expected marker: ${check.includes}`);
  }
}

for (const check of checks) {
  let error;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await fetchText(check);
      console.log(`Smoke check passed: ${check.url}`);
      error = undefined;
      break;
    } catch (candidate) {
      error = candidate;
      if (attempt < attempts) await sleep(10_000);
    }
  }
  if (error) throw error;
}

for (const secondaryOrigin of ["https://www.harnessmatch.dev", "https://harnessmatch.vercel.app"]) {
  const response = await fetch(`${secondaryOrigin}/usage`, {
    headers: { "User-Agent": "HarnessMatch-production-smoke-test" },
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
  });
  const location = response.headers.get("location");
  if (![307, 308].includes(response.status) || location !== `${canonicalOrigin}/usage`) {
    throw new Error(`${secondaryOrigin} did not permanently redirect /usage to the canonical origin`);
  }
  console.log(`Canonical redirect passed: ${secondaryOrigin}/usage`);
}
