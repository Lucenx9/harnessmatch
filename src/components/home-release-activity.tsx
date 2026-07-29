import Link from "next/link";
import { HarnessLogo } from "@/components/harness-logo";
import type { ReleaseActivityRecord } from "@/lib/usage-view";
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

function formatReleaseCount(value: number) {
  return `${value} ${value === 1 ? "release" : "releases"}`;
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
          <h2 id="home-release-heading">Latest stable releases</h2>
          <p>Current version, date, and 90-day cadence from stable GitHub releases with reviewed assets. Frequency describes activity, not quality.</p>
        </div>
        <Link className="text-link" href="/usage">Open all usage data</Link>
      </header>

      {records.length > 0 ? (
        <>
          <div className="home-release-columns" aria-hidden="true">
            <span>Harness</span>
            <span>Stable version</span>
            <span>Released</span>
            <span>Release cadence</span>
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
                  className="home-release-version"
                  href={record.signal.latestReleaseUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${record.name} ${record.signal.latestVersion} release on GitHub`}
                >
                  <span className="home-release-mobile-label">Stable version</span>
                  <strong>{record.signal.latestVersion}</strong>
                  <small>Open release</small>
                </a>
                <div className="home-release-stat">
                  <span className="home-release-mobile-label">Released</span>
                  <strong>{formatDate(record.signal.latestReleaseAt)}</strong>
                </div>
                <div className="home-release-stat">
                  <span className="home-release-mobile-label">Release cadence</span>
                  <strong>{formatReleaseCount(record.signal.recentReleaseCount)}</strong>
                  <small>past {record.signal.recentReleaseWindowDays} days</small>
                </div>
              </li>
            ))}
          </ol>
          <footer className="home-release-footer">
            <p>
              Sorted by latest stable release date, then matched stable releases in the trailing 90-day window. Version tags are shown verbatim.
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
