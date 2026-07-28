import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { canonicalMetadata, siteUrl } from "../src/lib/site";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

describe("canonical production domain", () => {
  it("uses the custom HTTPS origin for shared metadata", () => {
    expect(siteUrl).toBe("https://harnessmatch.dev");
    expect(canonicalMetadata("/compare")).toEqual({
      alternates: { canonical: "/compare" },
    });
  });

  it("publishes only custom-domain URLs in discovery files", () => {
    const robotsRecord = robots();

    expect(robotsRecord.host).toBe(siteUrl);
    expect(robotsRecord.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(sitemap()).not.toHaveLength(0);
    expect(sitemap().every((entry) => entry.url === siteUrl || entry.url.startsWith(`${siteUrl}/`))).toBe(true);
  });

  it("keeps secondary production hosts out of the index", () => {
    const configuration = JSON.parse(
      readFileSync(`${repositoryRoot}/vercel.json`, "utf8"),
    ) as {
      headers: Array<{ has: Array<{ value: string }>; headers: Array<{ key: string; value: string }> }>;
      redirects: Array<{ has: Array<{ value: string }>; destination: string; permanent: boolean }>;
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
