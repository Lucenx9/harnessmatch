import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  metadataBase: new URL("https://harnessmatch.vercel.app"),
  title: {
    default: "HarnessMatch - Match the harness to the work",
    template: "%s | HarnessMatch",
  },
  description:
    "Compare AI coding harnesses by workflow fit, model access, security, autonomy, and verified capabilities.",
  applicationName: "HarnessMatch",
  icons: {
    icon: "/brand/harnessmatch-mark-64.png",
    apple: "/brand/harnessmatch-mark-180.png",
  },
  keywords: ["AI coding agents", "coding harnesses", "developer tools", "agent comparison"],
  openGraph: {
    title: "HarnessMatch - Match the harness to the work",
    description: "A source-backed, workflow-aware guide to AI coding harnesses.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "HarnessMatch - Match the harness to the work.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HarnessMatch - Match the harness to the work",
    description: "A source-backed, workflow-aware guide to AI coding harnesses.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
