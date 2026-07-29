"use client";

import Link from "next/link";
import { useState } from "react";
import { GuiLogo } from "@/components/gui-logo";
import { guiEcosystemSignalSnapshots } from "@/data/gui-ecosystem-signals";
import { guiProducts } from "@/data/gui-products";
import { buildGuiEcosystemViewRecords } from "@/lib/gui-ecosystem-view";
import type { GuiEcosystemViewRecord } from "@/lib/gui-ecosystem-view";

const integer = new Intl.NumberFormat("en-US");
type SourceKey = "homebrew" | "github-releases" | "github";

const sourceOrder: SourceKey[] = ["homebrew", "github-releases", "github"];

function SignalRows({ records, source }: {
  records: GuiEcosystemViewRecord[];
  source: SourceKey;
}) {
  const maximum = Math.max(...records.map((record) => record.signal.value), 1);

  return (
    <ol className="gui-live-ranking">
      {records.map(({ product, signal }, index) => (
        <li key={product.id}>
          <Link href={`/guis/${product.id}`} className="gui-live-row">
            <span className="gui-live-rank">{String(index + 1).padStart(2, "0")}</span>
            <span className="gui-live-product">
              <GuiLogo logo={product.logo} name={product.name} />
              <span>
                <strong>{product.name}</strong>
                <small>{signal.source === "homebrew"
                  ? `v${signal.latestVersion.split(",")[0]}`
                  : signal.source === "github-releases"
                    ? signal.latestVersion
                    : signal.artifactId}</small>
              </span>
            </span>
            <span className="gui-live-value">
              <i aria-hidden="true" style={{ width: `${Math.max((signal.value / maximum) * 100, 3)}%` }} />
              <strong>{integer.format(signal.value)} {source === "homebrew"
                ? "installs"
                : source === "github-releases" ? "downloads" : "stars"}</strong>
            </span>
            <span className="gui-live-secondary">
              {signal.source === "github"
                ? `${integer.format(signal.forks)} forks`
                : signal.source === "github-releases"
                  ? `${signal.recentReleaseCount} releases / ${signal.recentReleaseWindowDays}d`
                  : "30 days"}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function GuiLiveSignals() {
  const records = buildGuiEcosystemViewRecords(guiProducts, guiEcosystemSignalSnapshots);
  const [source, setSource] = useState<SourceKey>("homebrew");
  const observedAt = guiEcosystemSignalSnapshots
    .map((signal) => signal.observedAt)
    .toSorted()
    .at(-1);
  const homebrewWindow = records.homebrew[0]?.signal.source === "homebrew"
    ? records.homebrew[0].signal
    : null;
  const sourceRecords: Record<SourceKey, GuiEcosystemViewRecord[]> = {
    homebrew: records.homebrew,
    "github-releases": records.githubReleases,
    github: records.github,
  };
  const sourceCopy = {
    homebrew: {
      tab: "Homebrew · 30d",
      title: "macOS install activity",
      coverage: `${records.homebrew.length}/${guiProducts.length} mapped`,
      columns: ["Rank", "Interface", "30-day events", "Window"],
      note: `${homebrewWindow ? `${homebrewWindow.windowStart}–${homebrewWindow.windowEnd}. ` : ""}Install events are not unique users.`,
      href: "https://formulae.brew.sh/docs/api/",
      link: "Homebrew source",
    },
    "github-releases": {
      tab: "GitHub installers",
      title: "Stable installer downloads",
      coverage: `${records.githubReleases.length}/${guiProducts.length} measurable`,
      columns: ["Rank", "Interface", "Cumulative downloads", "Recent releases"],
      note: "Matched stable installers only. Counts can include reinstalls and updater retrievals; they are not unique users.",
      href: "https://docs.github.com/en/rest/releases/releases",
      link: "GitHub releases source",
    },
    github: {
      tab: "GitHub interest",
      title: "Repository interest",
      coverage: `${records.github.length}/${guiProducts.length} audited`,
      columns: ["Rank", "Interface", "Stars", "Forks"],
      note: "Only the exact repository already used for the code audit is counted. Missing is not zero.",
      href: "https://docs.github.com/en/rest/activity/starring",
      link: "GitHub stars source",
    },
  } satisfies Record<SourceKey, {
    tab: string;
    title: string;
    coverage: string;
    columns: string[];
    note: string;
    href: string;
    link: string;
  }>;
  const activeCopy = sourceCopy[source];

  return (
    <section className="gui-live-signals" aria-labelledby="gui-live-signals-title">
      <header className="gui-live-header">
        <div>
          <p className="eyebrow">Daily source refresh</p>
          <h2 id="gui-live-signals-title">Public activity signals</h2>
          <p>Distribution and repository activity in source-native units. These signals provide context, not quality or workflow-fit scores.</p>
        </div>
        {observedAt && <time dateTime={observedAt}>Observed {observedAt}</time>}
      </header>

      <div className="gui-live-tabs" role="tablist" aria-label="GUI activity source">
        {sourceOrder.map((candidate) => (
          <button
            type="button"
            role="tab"
            aria-selected={source === candidate}
            aria-controls="gui-live-panel"
            id={`gui-live-tab-${candidate}`}
            onClick={() => setSource(candidate)}
            key={candidate}
          >
            {sourceCopy[candidate].tab}
          </button>
        ))}
      </div>

      <div
        className="gui-live-panel"
        id="gui-live-panel"
        role="tabpanel"
        aria-labelledby={`gui-live-tab-${source}`}
      >
        <header>
          <h3>{activeCopy.title}</h3>
          <strong>{activeCopy.coverage}</strong>
        </header>
        <div className="gui-live-columns" aria-hidden="true">
          {activeCopy.columns.map((column) => <span key={column}>{column}</span>)}
        </div>
        <SignalRows records={sourceRecords[source]} source={source} />
        <footer>
          <p>{activeCopy.note}</p>
          <a href={activeCopy.href} target="_blank" rel="noreferrer">{activeCopy.link}</a>
        </footer>
      </div>
    </section>
  );
}
