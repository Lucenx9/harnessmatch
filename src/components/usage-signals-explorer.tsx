"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { HarnessLogo } from "@/components/harness-logo";
import type {
  EcosystemSignalSnapshot,
  OpenRouterTrendingWindowKey,
  OpenRouterUsageWindow,
  OpenRouterUsageWindowKey,
} from "@/lib/types";
import type {
  EcosystemUsageRecord,
  OpenRouterUsageRecord,
  UsageProduct,
} from "@/lib/usage-view";

type UsageSource = "openrouter" | EcosystemSignalSnapshot["source"];
type OpenRouterView = "popular" | "trending";

type DisplayRow = UsageProduct & {
  rank: number | null;
  value: number | null;
  valueLabel: string;
  valueAriaLabel: string;
  secondary: string;
  secondaryAriaLabel: string;
};

const sourceOptions: Array<{ key: UsageSource; label: string }> = [
  { key: "openrouter", label: "OpenRouter" },
  { key: "homebrew", label: "Homebrew" },
  { key: "npm", label: "npm" },
  { key: "github-releases", label: "Releases" },
  { key: "vscode", label: "VS Code" },
  { key: "openvsx", label: "Open VSX" },
  { key: "jetbrains", label: "JetBrains" },
  { key: "github", label: "GitHub" },
];

const windowOptions: Array<{ key: OpenRouterUsageWindowKey; label: string }> = [
  { key: "day", label: "Latest day" },
  { key: "week", label: "7 days" },
  { key: "month", label: "30 days" },
];

const trendingWindowOptions: Array<{ key: OpenRouterTrendingWindowKey; label: string }> = [
  { key: "week", label: "7 days" },
  { key: "month", label: "30 days" },
];

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const fullNumberFormatter = new Intl.NumberFormat("en-US");

const repositoryScopeLabels = {
  "full-source": "Full-source repository",
  "client-source": "Client-source repository",
  "support-repository": "Support repository",
} as const;

function formatDateRange(window: Pick<OpenRouterUsageWindow, "windowStart" | "windowEnd">) {
  if (window.windowStart === window.windowEnd) return window.windowEnd;
  return `${window.windowStart} to ${window.windowEnd}`;
}

function sourceTitle(source: UsageSource, openRouterView: OpenRouterView) {
  switch (source) {
    case "openrouter": return openRouterView === "trending" ? "Trending on OpenRouter" : "Most used on OpenRouter";
    case "homebrew": return "Homebrew install events";
    case "npm": return "npm package downloads";
    case "github-releases": return "GitHub release asset downloads";
    case "vscode": return "VS Code Marketplace installs";
    case "openvsx": return "Open VSX extension downloads";
    case "jetbrains": return "JetBrains Marketplace downloads";
    case "github": return "GitHub repository interest";
  }
}

function sourceSummary(source: UsageSource, openRouterView: OpenRouterView) {
  switch (source) {
    case "openrouter": return openRouterView === "trending"
      ? "Apps ordered by excess attributed-token growth against the preceding three equal windows."
      : "Traffic attributed to public coding apps using OpenRouter's app-attribution mechanism.";
    case "homebrew": return "Install-on-request events for mapped formulae and install events for mapped casks.";
    case "npm": return "Registry downloads for one mapped, user-facing package per harness.";
    case "github-releases": return "Cumulative downloads of explicitly matched stable CLI binaries and archives.";
    case "vscode": return "Cumulative Marketplace installs for the exact mapped extension.";
    case "openvsx": return "Cumulative downloads for exact extensions in the vendor-neutral Open VSX registry.";
    case "jetbrains": return "Cumulative downloads for exact plugins in the JetBrains Marketplace.";
    case "github": return "Cumulative stars for the repository audited by HarnessMatch. Stars indicate interest, not use.";
  }
}

function sourceFootnote(source: UsageSource, openRouterView: OpenRouterView) {
  switch (source) {
    case "openrouter": return openRouterView === "trending"
      ? "Trending rank comes from OpenRouter. Bars show current-window attributed tokens because the API does not publish the excess amount or a growth percentage."
      : "Token totals combine prompt and completion tokens. Tokenizers differ, attribution is opt-in, and this is not standardized work, users, or task success.";
    case "homebrew": return "Homebrew counts install events, not unique people or active installations. Formula and cask events share a source view but retain their artifact labels.";
    case "npm": return "Downloads include automated and repeated retrievals. They are not unique users, active installs, or completed coding tasks.";
    case "github-releases": return "Counts sum only mapped assets across stable published releases. Repeated, automated, and multi-platform downloads remain possible, so this is not a user count.";
    case "vscode": return "Marketplace installs are cumulative extension-install events. They are not current active users or usage frequency.";
    case "openvsx": return "Registry downloads are cumulative retrieval events, not active installations or unique users. Coverage is limited to exact verified extension identities.";
    case "jetbrains": return "Marketplace downloads are cumulative plugin retrievals, not active installations, unique users, or CLI-only use.";
    case "github": return "Stars measure interest in the mapped repository. Support and client repositories may cover only part of the product, as labeled per row.";
  }
}

function rowsForEcosystem(records: EcosystemUsageRecord[], source: EcosystemSignalSnapshot["source"]): DisplayRow[] {
  return records
    .filter((record) => record.signal.source === source)
    .sort((left, right) => right.signal.value - left.signal.value || left.name.localeCompare(right.name))
    .map((record, index) => {
      const value = record.signal.value;
      let valueLabel = fullNumberFormatter.format(value);
      let valueAriaLabel = valueLabel;
      let secondary = record.signal.artifactId;
      let secondaryAriaLabel = `Artifact ${record.signal.artifactId}`;

      if (record.signal.source === "homebrew") {
        valueLabel = `${compactNumberFormatter.format(value)} events`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} Homebrew install events`;
        secondary = record.signal.artifactKind === "formula" ? "Formula" : "Cask";
        secondaryAriaLabel = `${secondary} ${record.signal.artifactId}`;
      } else if (record.signal.source === "npm") {
        valueLabel = `${compactNumberFormatter.format(value)} downloads`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} npm downloads`;
      } else if (record.signal.source === "github-releases") {
        valueLabel = `${compactNumberFormatter.format(value)} downloads`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} matched GitHub release asset downloads`;
        secondary = `${record.signal.releaseCount} releases · ${record.signal.assetCount} assets`;
        secondaryAriaLabel = `${record.signal.assetCount} matched assets across ${record.signal.releaseCount} stable releases; latest release ${record.signal.latestReleaseAt}`;
      } else if (record.signal.source === "vscode") {
        valueLabel = `${compactNumberFormatter.format(value)} installs`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} cumulative Marketplace installs`;
      } else if (record.signal.source === "openvsx") {
        valueLabel = `${compactNumberFormatter.format(value)} downloads`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} cumulative Open VSX downloads`;
        secondary = `Version ${record.signal.latestVersion}`;
        secondaryAriaLabel = `Latest Open VSX version ${record.signal.latestVersion}; extension ${record.signal.artifactId}`;
      } else if (record.signal.source === "jetbrains") {
        valueLabel = `${compactNumberFormatter.format(value)} downloads`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} cumulative JetBrains Marketplace downloads`;
        secondary = `Plugin ${record.signal.pluginId}`;
        secondaryAriaLabel = `JetBrains plugin ${record.signal.pluginId}; identifier ${record.signal.artifactId}`;
      } else if (record.signal.source === "github") {
        valueLabel = `${compactNumberFormatter.format(value)} stars`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} GitHub stars`;
        secondary = `${compactNumberFormatter.format(record.signal.forks)} forks`;
        secondaryAriaLabel = `${fullNumberFormatter.format(record.signal.forks)} forks; ${repositoryScopeLabels[record.signal.repositoryScope]}`;
      }

      return {
        id: record.id,
        slug: record.slug,
        name: record.name,
        tagline: record.tagline,
        logo: record.logo,
        rank: index + 1,
        value,
        valueLabel,
        valueAriaLabel,
        secondary,
        secondaryAriaLabel,
      };
    });
}

export function UsageSignalsExplorer({
  openRouterRecords,
  ecosystemRecords,
  activeHarnessCount,
}: {
  openRouterRecords: OpenRouterUsageRecord[];
  ecosystemRecords: EcosystemUsageRecord[];
  activeHarnessCount: number;
}) {
  const [selectedSource, setSelectedSource] = useState<UsageSource>("openrouter");
  const [openRouterView, setOpenRouterView] = useState<OpenRouterView>("popular");
  const [selectedWindow, setSelectedWindow] = useState<OpenRouterUsageWindowKey>("week");
  const [expandedSources, setExpandedSources] = useState<UsageSource[]>([]);
  const sourceTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const windowTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const effectiveWindow = openRouterView === "trending" && selectedWindow === "day"
    ? "week"
    : selectedWindow;
  const availableWindowOptions = openRouterView === "trending"
    ? trendingWindowOptions
    : windowOptions;
  const openRouterRows: DisplayRow[] = openRouterRecords
    .map((record) => ({
      ...record,
      usage: openRouterView === "trending"
        ? record.trendingWindows[effectiveWindow as OpenRouterTrendingWindowKey]
        : record.windows[effectiveWindow],
    }))
    .sort((left, right) => {
      if (left.usage.rank === null) return right.usage.rank === null ? left.name.localeCompare(right.name) : 1;
      if (right.usage.rank === null) return -1;
      return left.usage.rank - right.usage.rank;
    })
    .map((record) => ({
      id: record.id,
      slug: record.slug,
      name: record.name,
      tagline: record.tagline,
      logo: record.logo,
      rank: record.usage.rank,
      value: record.usage.attributedTokens,
      valueLabel: record.usage.attributedTokens === null ? "Not listed" : `${compactNumberFormatter.format(record.usage.attributedTokens)} tokens`,
      valueAriaLabel: record.usage.attributedTokens === null ? "No attributed traffic in this window" : `${fullNumberFormatter.format(record.usage.attributedTokens)} attributed tokens`,
      secondary: record.usage.attributedRequests === null ? "Not listed" : compactNumberFormatter.format(record.usage.attributedRequests),
      secondaryAriaLabel: record.usage.attributedRequests === null ? "No attributed requests in this window" : `${fullNumberFormatter.format(record.usage.attributedRequests)} attributed requests`,
    }));

  const ecosystemRows = selectedSource === "openrouter" ? [] : rowsForEcosystem(ecosystemRecords, selectedSource);
  const rows = selectedSource === "openrouter" ? openRouterRows : ecosystemRows;
  const listedRows = rows.filter((row) => row.value !== null);
  const coverageLabel = selectedSource === "openrouter"
    ? `${listedRows.length} listed; ${rows.length} mapped of ${activeHarnessCount} active harnesses`
    : `${rows.length} mapped of ${activeHarnessCount} active harnesses`;
  const maxValue = Math.max(1, ...listedRows.map((row) => row.value ?? 0));
  const isExpanded = expandedSources.includes(selectedSource);
  const visibleRows = isExpanded ? rows : rows.slice(0, 12);
  const openRouterWindow = openRouterRecords[0]
    ? openRouterView === "trending"
      ? openRouterRecords[0].trendingWindows[effectiveWindow as OpenRouterTrendingWindowKey]
      : openRouterRecords[0].windows[effectiveWindow]
    : undefined;
  const selectedSignal = selectedSource === "openrouter"
    ? null
    : ecosystemRecords.find((record) => record.signal.source === selectedSource)?.signal;
  const dateRange = selectedSource === "openrouter" && openRouterWindow
    ? formatDateRange(openRouterWindow)
    : selectedSignal && "windowStart" in selectedSignal
      ? formatDateRange(selectedSignal)
      : selectedSignal?.observedAt ?? "No current observation";

  function selectRelativeSource(currentIndex: number, direction: -1 | 1) {
    const nextIndex = (currentIndex + direction + sourceOptions.length) % sourceOptions.length;
    setSelectedSource(sourceOptions[nextIndex].key);
    sourceTabRefs.current[nextIndex]?.focus();
  }

  function selectRelativeWindow(currentIndex: number, direction: -1 | 1) {
    const nextIndex = (currentIndex + direction + availableWindowOptions.length) % availableWindowOptions.length;
    setSelectedWindow(availableWindowOptions[nextIndex].key);
    windowTabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="usage-explorer" aria-labelledby="usage-explorer-heading">
      <header className="usage-explorer-header">
        <div>
          <span className="usage-explorer-kicker">Source-separated rankings</span>
          <h2 id="usage-explorer-heading">{sourceTitle(selectedSource, openRouterView)}</h2>
          <p>{sourceSummary(selectedSource, openRouterView)}</p>
        </div>
        {selectedSource === "openrouter" && (
          <div className="usage-openrouter-controls">
            <div className="usage-view-tabs" role="group" aria-label="OpenRouter ranking view">
              <button type="button" aria-pressed={openRouterView === "popular"} onClick={() => setOpenRouterView("popular")}>Most used</button>
              <button
                type="button"
                aria-pressed={openRouterView === "trending"}
                onClick={() => {
                  setOpenRouterView("trending");
                  if (selectedWindow === "day") setSelectedWindow("week");
                }}
              >
                Trending
              </button>
            </div>
            <div className="usage-window-tabs" role="tablist" aria-label="OpenRouter time window">
              {availableWindowOptions.map((option, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={effectiveWindow === option.key}
                  aria-controls="usage-ranking-panel"
                  tabIndex={effectiveWindow === option.key ? 0 : -1}
                  key={option.key}
                  ref={(element) => { windowTabRefs.current[index] = element; }}
                  onClick={() => setSelectedWindow(option.key)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") { event.preventDefault(); selectRelativeWindow(index, -1); }
                    if (event.key === "ArrowRight") { event.preventDefault(); selectRelativeWindow(index, 1); }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="usage-source-tabs-shell">
        <div className="usage-source-tabs" role="tablist" aria-label="Usage signal source">
          {sourceOptions.map((option, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={selectedSource === option.key}
              aria-controls="usage-ranking-panel"
              id={`usage-source-tab-${option.key}`}
              tabIndex={selectedSource === option.key ? 0 : -1}
              key={option.key}
              ref={(element) => { sourceTabRefs.current[index] = element; }}
              onClick={() => setSelectedSource(option.key)}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") { event.preventDefault(); selectRelativeSource(index, -1); }
                if (event.key === "ArrowRight") { event.preventDefault(); selectRelativeSource(index, 1); }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="usage-leaderboard-panel"
        id="usage-ranking-panel"
        role="tabpanel"
        aria-labelledby={`usage-source-tab-${selectedSource}`}
        aria-live="polite"
      >
        <div className="usage-leaderboard-context">
          <p>
            <strong>{dateRange}</strong>
            <span>{coverageLabel}</span>
          </p>
          <span>{selectedSource === "openrouter" ? openRouterView === "trending" ? "OpenRouter growth rank" : "Global coding-app rank" : "Rank among mapped HarnessMatch products"}</span>
        </div>

        <div className="usage-column-labels" aria-hidden="true">
          <span>Rank</span>
          <span>Harness</span>
          <span>{selectedSource === "openrouter" && openRouterView === "trending" ? "Window volume" : selectedSource === "github" ? "Repository interest" : "Observed volume"}</span>
          <span>{selectedSource === "openrouter" ? "Requests" : selectedSource === "github" ? "Repository" : selectedSource === "github-releases" ? "Matched scope" : "Artifact"}</span>
        </div>

        <ol className="usage-ranking" aria-label={`${sourceTitle(selectedSource, openRouterView)} ranking for ${dateRange}`}>
          {visibleRows.map((row) => {
            const barWidth = row.value === null ? 0 : Math.max(1.5, (row.value / maxValue) * 100);
            return (
              <li key={row.id}>
                <Link href={`/harnesses/${row.slug}`} className="usage-ranking-row">
                  <span className="usage-rank">{row.rank === null ? "Not listed" : `#${row.rank}`}</span>
                  <span className="usage-product">
                    <HarnessLogo logo={row.logo} name={row.name} size="small" />
                    <span>
                      <strong>{row.name}</strong>
                      <small>{row.tagline}</small>
                    </span>
                  </span>
                  <span className="usage-bar-cell">
                    {row.value === null ? (
                      <span className="usage-missing">No attributed traffic in this window</span>
                    ) : (
                      <>
                        <span className="usage-bar" style={{ width: `${barWidth}%` }} aria-hidden="true" />
                        <strong aria-label={row.valueAriaLabel} title={row.valueAriaLabel}>{row.valueLabel}</strong>
                      </>
                    )}
                  </span>
                  <span className="usage-secondary" aria-label={row.secondaryAriaLabel} title={row.secondaryAriaLabel}>
                    {row.secondary}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        {rows.length > 12 && (
          <button
            className="usage-show-all"
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setExpandedSources((current) => (
              current.includes(selectedSource)
                ? current.filter((source) => source !== selectedSource)
                : [...current, selectedSource]
            ))}
          >
            {isExpanded ? "Show top 12" : `Show all ${rows.length}`}
          </button>
        )}
      </div>

      <footer className="usage-leaderboard-footer">
        <p>{sourceFootnote(selectedSource, openRouterView)} Missing coverage means not mapped, never zero.</p>
        <a href="/usage.csv" download>Download all signals (CSV)</a>
      </footer>
    </section>
  );
}
