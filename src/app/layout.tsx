import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  defaultSiteDescription,
  defaultSiteTitle,
  siteName,
  siteUrl,
  socialMetadata,
  websiteStructuredData,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const themeInit = `
  try {
    const saved = localStorage.getItem("harnessmatch-theme");
    const preferred = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.dataset.theme = saved === "light" || saved === "dark" ? saved : preferred;
  } catch {}
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultSiteTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultSiteDescription,
  ...socialMetadata(defaultSiteTitle, defaultSiteDescription, "/"),
  applicationName: siteName,
  icons: {
    icon: [
      {
        url: "/brand/harnessmatch-favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/brand/harnessmatch-favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/brand/harnessmatch-mark-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/brand/harnessmatch-mark-180.png", type: "image/png", sizes: "180x180" },
    ],
  },
  keywords: ["AI coding agents", "coding harnesses", "developer tools", "agent comparison"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: the inline theme bootstrap is a static, repository-owned constant */}
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: this static JSON-LD payload is escaped before insertion */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData).replaceAll("<", "\\u003c"),
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
