import type { MetadataRoute } from "next";
import { harnesses } from "@/data/harnesses";
import { latestVerifiedAt } from "@/lib/evidence-freshness";

const siteUrl = "https://harnessmatch.vercel.app";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteCheckedAt = latestVerifiedAt();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: siteCheckedAt, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/recommend`, lastModified: siteCheckedAt, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/compare`, lastModified: siteCheckedAt, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/harnesses`, lastModified: siteCheckedAt, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/benchmarks`, lastModified: siteCheckedAt, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/methodology`, lastModified: siteCheckedAt, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/data`, lastModified: siteCheckedAt, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: siteCheckedAt, changeFrequency: "yearly", priority: 0.3 },
  ];
  const harnessRoutes: MetadataRoute.Sitemap = harnesses
    .filter((harness) => harness.status === "active")
    .map((harness) => ({
      url: `${siteUrl}/harnesses/${harness.slug}`,
      lastModified: harness.verifiedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...harnessRoutes];
}
