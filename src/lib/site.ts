import type { Metadata } from "next";

export const siteUrl = "https://harnessmatch.dev";
export const siteName = "HarnessMatch";
export const defaultSiteTitle = "HarnessMatch - Coding harness workflow fit";
export const defaultSiteDescription =
  "Explore source-backed workflow fit across AI coding harnesses with transparent scoring, verified capabilities, and documented trade-offs.";

const metaDescriptionLength = {
  min: 120,
  max: 170,
} as const;

const socialImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "HarnessMatch coding harness workflow fit explorer.",
};

export function canonicalMetadata(path: string): Pick<Metadata, "alternates"> {
  return {
    alternates: {
      canonical: path,
    },
  };
}

export function socialMetadata(
  title: string,
  description: string,
  path: string,
): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  return {
    ...canonicalMetadata(path),
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName,
      locale: "en_US",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    ...socialMetadata(`${title} | ${siteName}`, description, path),
  };
}

export function harnessProfileDescription(name: string, tagline: string): string {
  const prefix = `${name}: ${tagline}`;
  const candidates = [
    `${prefix} Compare workflow fit, capabilities, controls, trade-offs, and verified first-party evidence.`,
    `${prefix} Compare workflow fit, controls, trade-offs, and verified evidence.`,
    `${prefix} Workflow fit, trade-offs, and verified evidence.`,
  ];
  const description = candidates.find((candidate) => (
    candidate.length >= metaDescriptionLength.min
    && candidate.length <= metaDescriptionLength.max
  ));

  if (!description) {
    throw new Error(`Unable to build a valid meta description for ${name}.`);
  }

  return description;
}

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: defaultSiteDescription,
  inLanguage: "en",
};
