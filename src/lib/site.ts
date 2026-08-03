import type { Metadata } from "next";

export const siteUrl = "https://harnessmatch.dev";
export const siteName = "HarnessMatch";
export const defaultSiteTitle = "HarnessMatch - AI coding harness data and comparison";
export const defaultSiteDescription =
  "Compare AI coding harnesses using source-backed capability records, operating-model data, public usage signals, documented trade-offs, and transparent methodology.";

const metaDescriptionLength = {
  min: 120,
  max: 170,
} as const;

const searchResultTitleMaxLength = 60;
const brandedTitleSuffix = ` | ${siteName}`;

const socialImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "HarnessMatch: source-backed data on AI coding harnesses.",
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

export function harnessProfileTitle(name: string): string {
  const candidates = name.toLowerCase().includes("harness")
    ? [
        `${name} capabilities and controls`,
        `${name} capabilities`,
        `${name} profile`,
      ]
    : [
        `${name} coding harness capabilities`,
        `${name} harness capabilities`,
        `${name} capabilities`,
        `${name} profile`,
      ];
  const title = candidates.find((candidate) => (
    `${candidate}${brandedTitleSuffix}`.length <= searchResultTitleMaxLength
  ));

  if (!title) {
    throw new Error(`Unable to build a search-result title for ${name}.`);
  }

  return title;
}

export function harnessProfileDescription(name: string, tagline: string): string {
  const prefix = `${name}: ${tagline}`;
  const candidates = [
    `${prefix} Inspect capabilities, controls, trade-offs, public activity, and verified first-party evidence.`,
    `${prefix} Inspect controls, trade-offs, public activity, and verified evidence.`,
    `${prefix} Capabilities, trade-offs, and verified first-party evidence.`,
    `${prefix} Verified capabilities, controls, and evidence.`,
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

export function guiProfileDescription(name: string, summary: string): string {
  const prefix = `${name}: ${summary}`;
  const candidates = [
    `${prefix} Review workflow fit, supported harnesses, limitations, and verified first-party evidence.`,
    `${prefix} Review supported harnesses, limitations, and verified evidence.`,
    `${prefix} Workflow fit, limitations, and verified evidence.`,
    `${name} GUI profile: supported harnesses, workflow fit, platforms, source access, limitations, and verified first-party evidence.`,
  ];
  const description = candidates.find((candidate) => (
    candidate.length >= metaDescriptionLength.min
    && candidate.length <= metaDescriptionLength.max
  ));

  if (!description) {
    throw new Error(`Unable to build a valid GUI meta description for ${name}.`);
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
