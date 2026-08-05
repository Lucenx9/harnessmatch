import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

const privacyEmail = "lucenz@proton.me";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "Learn what technical and analytics data HarnessMatch processes, why it is used, which providers handle it, and your privacy rights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="section page-section">
      <div className="shell narrow-shell prose-page privacy-page">
        <header className="page-intro">
          <p className="privacy-updated">Last updated July 30, 2026</p>
          <h1>Privacy, in plain language.</h1>
          <p>
            HarnessMatch uses limited technical data to run the site and understand aggregate traffic.
          </p>
        </header>

        <section className="prose-section">
          <h2>Who is responsible</h2>
          <p>
            HarnessMatch is an independent personal project. The data controller is its individual
            maintainer. For privacy requests, email{" "}
            <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>.
          </p>
        </section>

        <section className="prose-section">
          <h2>What is processed</h2>
          <p>
            Vercel provides hosting and may process technical request data, such as an IP address,
            requested URL, timestamp, browser or device information, and response status, to deliver and
            protect the site.
          </p>
          <p>
            HarnessMatch also uses Vercel Web Analytics to understand aggregate traffic. It records page
            views, referrers, filtered query parameters, approximate location, browser, operating system,
            and device type. Vercel states that Web Analytics does not use third-party cookies, does not
            associate data points with an IP address, and discards the visitor session created from a
            request hash after 24 hours.
          </p>
          <p>
            Your light or dark theme choice is stored only in your browser as{" "}
            <code>harnessmatch-theme</code>. HarnessMatch has no accounts, contact forms, newsletter,
            advertising pixels, or profiling cookies.
          </p>
        </section>

        <section className="prose-section">
          <h2>Purpose, provider, and retention</h2>
          <p>
            This processing supports the legitimate interests of operating, protecting, and improving the
            site. Vercel Inc. provides the hosting and analytics infrastructure and may process service data
            in the United States and other locations.
          </p>
          <p>
            For Web Analytics, Vercel states that the visitor session created from a request hash is
            discarded after 24 hours. The available reporting window depends on the site&apos;s current Vercel
            plan, and Vercel may retain analytics data beyond that window so it remains available after a
            plan upgrade. Hosting, security, and other service data follow Vercel&apos;s applicable retention
            policies and transfer safeguards.
          </p>
          <p className="privacy-source-links">
            <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">
              Vercel Web Analytics privacy
            </a>
            <a
              href="https://vercel.com/docs/analytics/limits-and-pricing"
              target="_blank"
              rel="noreferrer"
            >
              Vercel analytics retention
            </a>
            <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">
              Vercel Privacy Notice
            </a>
          </p>
        </section>

        <section className="prose-section">
          <h2>External links</h2>
          <p>
            HarnessMatch links to GitHub, product websites, documentation, repositories, and other
            first-party sources. Ordinary outbound links do not connect your browser to those destinations
            unless you follow them. If you do, the destination may receive technical request data and
            process it under its own privacy terms. HarnessMatch does not control that processing.
          </p>
        </section>

        <section className="prose-section">
          <h2>Your rights</h2>
          <p>
            Where applicable, you may request access, correction, deletion, restriction, or object to the
            processing of your personal data by emailing{" "}
            <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>. Because HarnessMatch receives aggregate
            analytics and has no user accounts, it may not be possible to associate a visit with a specific
            person.
          </p>
          <p>
            You may also lodge a complaint with the{" "}
            <a href="https://www.garanteprivacy.it/" target="_blank" rel="noreferrer">
              Italian Data Protection Authority
            </a>
            .
          </p>
        </section>
      </div>
    </section>
  );
}
