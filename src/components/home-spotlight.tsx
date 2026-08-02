import Link from "next/link";
import type { HomeSpotlightRecord } from "@/data/home-spotlight";
import { HarnessLogo } from "./harness-logo";

type HomeSpotlightProps = {
  period: string;
  records: readonly HomeSpotlightRecord[];
};

const verificationDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function HomeSpotlight({ period, records }: HomeSpotlightProps) {
  const compareHref = `/compare?ids=${records.map(({ id }) => id).join(",")}`;

  return (
    <div className="home-spotlight">
      <div className="home-spotlight-intro">
        <h2 id="home-spotlight-heading">Under the lens: {period}.</h2>
        <p>
          Three contrasting harnesses selected by HarnessMatch from the catalog. Not a ranking, an overall
          recommendation, or the result of comparative product trials.
        </p>
        <Link className="text-link" href={compareHref}>Compare these three</Link>
      </div>

      <ul className="home-spotlight-list">
        {records.map((record) => (
          <li key={record.id}>
            <div className="home-spotlight-product">
              <HarnessLogo logo={record.logo} name={record.name} size="small" />
              <div>
                <span>{record.angle}</span>
                <h3><Link href={`/harnesses/${record.slug}`}>{record.name}</Link></h3>
              </div>
            </div>

            <dl className="home-spotlight-notes">
              <div>
                <dt>Why inspect</dt>
                <dd>{record.tagline}</dd>
              </div>
              <div>
                <dt>Check first</dt>
                <dd>{record.limitation}</dd>
              </div>
            </dl>

            <div className="home-spotlight-meta">
              <span>
                Catalog checked {verificationDateFormatter.format(new Date(`${record.verifiedAt}T00:00:00Z`))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
