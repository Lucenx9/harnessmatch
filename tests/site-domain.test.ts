import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { guiProducts } from "../src/data/gui-products";
import { harnesses } from "../src/data/harnesses";
import {
  canonicalMetadata,
  guiProfileDescription,
  harnessProfileDescription,
  pageMetadata,
  siteUrl,
  websiteStructuredData,
} from "../src/lib/site";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

describe("canonical production domain", () => {
  it("uses the custom HTTPS origin for shared metadata", () => {
    expect(siteUrl).toBe("https://harnessmatch.dev");
    expect(canonicalMetadata("/compare")).toEqual({
      alternates: { canonical: "/compare" },
    });
  });

  it("builds page-specific canonical and social metadata", () => {
    const metadata = pageMetadata({
      title: "Compare coding harnesses",
      description: "A page-specific description.",
      path: "/compare",
    });

    expect(metadata).toEqual(expect.objectContaining({
      title: "Compare coding harnesses",
      description: "A page-specific description.",
      alternates: { canonical: "/compare" },
      openGraph: expect.objectContaining({
        title: "Compare coding harnesses | HarnessMatch",
        description: "A page-specific description.",
        url: "/compare",
      }),
      twitter: expect.objectContaining({
        title: "Compare coding harnesses | HarnessMatch",
        description: "A page-specific description.",
      }),
    }));
  });

  it("publishes WebSite structured data on the canonical origin", () => {
    expect(websiteStructuredData).toEqual(expect.objectContaining({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "HarnessMatch",
      url: siteUrl,
      inLanguage: "en",
    }));
  });

  it("keeps profile descriptions unique and within the audited length range", () => {
    const harnessDescriptions = harnesses.map((harness) => (
      harnessProfileDescription(harness.name, harness.tagline)
    ));
    const guiDescriptions = guiProducts.map((product) => (
      guiProfileDescription(product.name, product.summary)
    ));
    const descriptions = [...harnessDescriptions, ...guiDescriptions];

    expect(descriptions.every((description) => (
      description.length >= 120 && description.length <= 170
    ))).toBe(true);
    expect(new Set(descriptions)).toHaveLength(descriptions.length);
  });

  it("publishes only custom-domain URLs in discovery files", () => {
    const robotsRecord = robots();

    expect(robotsRecord.host).toBe(siteUrl);
    expect(robotsRecord.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(sitemap()).not.toHaveLength(0);
    expect(sitemap().every((entry) => entry.url === siteUrl || entry.url.startsWith(`${siteUrl}/`))).toBe(true);
    expect(sitemap()).toContainEqual(expect.objectContaining({ url: `${siteUrl}/guis` }));
    expect(sitemap()).toContainEqual(expect.objectContaining({ url: `${siteUrl}/usage` }));
    for (const product of guiProducts) {
      expect(sitemap()).toContainEqual(expect.objectContaining({ url: `${siteUrl}/guis/${product.id}` }));
    }
  });

  it("keeps secondary production hosts out of the index", () => {
    const configuration = JSON.parse(
      readFileSync(`${repositoryRoot}/vercel.json`, "utf8"),
    ) as {
      headers: Array<{ has: Array<{ value: string }>; headers: Array<{ key: string; value: string }> }>;
      redirects: Array<{ source: string; has?: Array<{ value: string }>; destination: string; permanent: boolean }>;
    };

    expect(configuration.headers).toContainEqual(
      expect.objectContaining({
        has: [expect.objectContaining({ value: "harnessmatch.vercel.app" })],
        headers: [expect.objectContaining({ key: "X-Robots-Tag", value: "noindex" })],
      }),
    );
    expect(configuration.redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/recommend",
          destination: "https://harnessmatch.dev/compare",
          permanent: true,
        }),
        expect.objectContaining({
          has: [expect.objectContaining({ value: "www.harnessmatch.dev" })],
          destination: "https://harnessmatch.dev/$1",
          permanent: true,
        }),
        expect.objectContaining({
          has: [expect.objectContaining({ value: "harnessmatch.vercel.app" })],
          destination: "https://harnessmatch.dev/$1",
          permanent: true,
        }),
      ]),
    );
  });
});
