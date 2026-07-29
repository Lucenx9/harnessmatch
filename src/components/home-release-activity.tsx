import Link from "next/link";
import { HarnessLogo } from "@/components/harness-logo";
import type { ReleaseActivityRecord } from "@/lib/usage-view";

const fullNumberFormatter = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const repositoryScopeLabels = {
  "full-source": "Full-source repository",
  "client-source": "Client-source repository",
  "support-repository": "Support repository",
} as const;

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

export function HomeReleaseActivity({ records }: { records: ReleaseActivityRecord[] }) {
  const observedAt = records.reduce(
    (latest, record) => record.signal.observedAt > latest ? record.signal.observedAt : latest,
    "",
  );

  return (
    <section className="home-release-activity" aria-labelledby="home-release-heading">
      <header className="home-release-header">
        <div>
          <h2 id="home-release-heading">Recent release activity</h2>
          <p>Latest stable releases from explicitly matched GitHub feeds. Recency and downloads describe activity, not product quality.</p>
        </div>
        <Link className="text-link" href="/usage">Open all usage data</Link>
      </header>

      {records.length > 0 ? (
        <>
          <div className="home-release-columns" aria-hidden="true">
            <span>Harness</span>
            <span>Latest stable release</span>
            <span>Releases scanned</span>
            <span>Matched asset downloads</span>
          </div>
          <ol className="home-release-list">
            {records.map((record) => (
              <li className="home-release-row" key={record.id}>
                <div className="home-release-product">
                  <HarnessLogo logo={record.logo} name={record.name} size="small" />
                  <span>
                    <Link href={`/harnesses/${record.slug}`}><strong>{record.name}</strong></Link>
                    <small>{repositoryScopeLabels[record.signal.repositoryScope]}</small>
                  </span>
                </div>
                <a
                  className="home-release-date"
                  href={record.signal.artifactUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${record.name} GitHub release source`}
                >
                  <span className="home-release-mobile-label">Latest stable release</span>
                  <strong>{formatDate(record.signal.latestReleaseAt)}</strong>
                  <small>GitHub source</small>
                </a>
                <div className="home-release-stat">
                  <span className="home-release-mobile-label">Releases scanned</span>
                  <strong>{fullNumberFormatter.format(record.signal.releaseCount)}</strong>
                </div>
                <div className="home-release-stat">
                  <span className="home-release-mobile-label">Matched downloads</span>
                  <strong>{fullNumberFormatter.format(record.signal.value)}</strong>
                </div>
              </li>
            ))}
          </ol>
          <footer className="home-release-footer">
            <p>
              Sorted by latest stable release date, then matched downloads. Coverage is limited to reviewed asset mappings.
              {observedAt ? ` Observed ${formatDate(observedAt)}.` : ""}
            </p>
          </footer>
        </>
      ) : (
        <p className="home-release-empty">No current stable release feeds are mapped.</p>
      )}
    </section>
  );
}
