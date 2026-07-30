import type { MetadataRoute } from "next";
import { guiProducts } from "@/data/gui-products";
import { harnesses } from "@/data/harnesses";
import { latestVerifiedAt } from "@/lib/evidence-freshness";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteCheckedAt = latestVerifiedAt();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: siteCheckedAt },
    { url: `${siteUrl}/compare`, lastModified: siteCheckedAt },
    { url: `${siteUrl}/harnesses`, lastModified: siteCheckedAt },
    { url: `${siteUrl}/usage`, lastModified: siteCheckedAt },
    { url: `${siteUrl}/guis`, lastModified: siteCheckedAt },
    { url: `${siteUrl}/benchmarks`, lastModified: siteCheckedAt },
    { url: `${siteUrl}/methodology`, lastModified: siteCheckedAt },
    { url: `${siteUrl}/data`, lastModified: siteCheckedAt },
    { url: `${siteUrl}/privacy`, lastModified: siteCheckedAt },
  ];
  const harnessRoutes: MetadataRoute.Sitemap = harnesses
    .filter((harness) => harness.status === "active")
    .map((harness) => ({
      url: `${siteUrl}/harnesses/${harness.slug}`,
      lastModified: harness.verifiedAt,
    }));
  const guiRoutes: MetadataRoute.Sitemap = guiProducts
    .filter((product) => product.status === "active")
    .map((product) => ({
      url: `${siteUrl}/guis/${product.id}`,
      lastModified: product.verifiedAt,
    }));

  return [...staticRoutes, ...harnessRoutes, ...guiRoutes];
}
