import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://harnessmatch.simonelucentini.chatgpt.site"),
  title: {
    default: "HarnessMatch — Match the harness to the work",
    template: "%s — HarnessMatch",
  },
  description:
    "Compare AI coding harnesses by workflow fit, model access, security, autonomy, and verified capabilities.",
  applicationName: "HarnessMatch",
  keywords: ["AI coding agents", "coding harnesses", "developer tools", "agent comparison"],
  openGraph: {
    title: "HarnessMatch — Match the harness to the work",
    description: "A source-backed, workflow-aware guide to AI coding harnesses.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "HarnessMatch — Match the harness to the work.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HarnessMatch — Match the harness to the work",
    description: "A source-backed, workflow-aware guide to AI coding harnesses.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
