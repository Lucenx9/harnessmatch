import type { MetadataRoute } from "next";
import { guiProducts } from "@/data/gui-products";
import { harnesses } from "@/data/harnesses";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl },
    { url: `${siteUrl}/compare` },
    { url: `${siteUrl}/harnesses` },
    { url: `${siteUrl}/usage` },
    { url: `${siteUrl}/guis` },
    { url: `${siteUrl}/benchmarks` },
    { url: `${siteUrl}/methodology` },
    { url: `${siteUrl}/data` },
    { url: `${siteUrl}/privacy` },
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
