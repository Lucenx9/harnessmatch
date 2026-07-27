import type { Metadata } from "next";

const privacyEmail = "lucenz@proton.me";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How HarnessMatch handles technical and analytics data.",
};

export default function PrivacyPage() {
  return (
    <section className="section page-section">
      <div className="shell narrow-shell prose-page privacy-page">
        <header className="page-intro">
          <p className="privacy-updated">Last updated July 27, 2026</p>
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
            in the United States and other locations. Technical data and aggregate reports follow Vercel&apos;s
            applicable retention and transfer safeguards.
          </p>
          <p className="privacy-source-links">
            <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">
              Vercel Web Analytics privacy
            </a>
            <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">
              Vercel Privacy Notice
            </a>
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
