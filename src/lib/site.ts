import type { Metadata } from "next";

export const siteUrl = "https://harnessmatch.dev";

export function canonicalMetadata(path: string): Pick<Metadata, "alternates"> {
  return {
    alternates: {
      canonical: path,
    },
  };
}
