"use client";

import { useEffect, useRef, useState } from "react";
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
type UsageMode = "source" | "harness";
type HarnessSignalStatus = "observed" | "mapped-unlisted" | "not-mapped";

type DisplayRow = UsageProduct & {
  rank: number | null;
  value: number | null;
  valueLabel: string;
  valueAriaLabel: string;
  secondary: string;
  secondaryAriaLabel: string;
};

type HarnessSignalRow = {
  source: UsageSource;
  sourceLabel: string;
  metricLabel: string;
  status: HarnessSignalStatus;
  valueLabel: string;
  secondaryLabel: string;
  positionLabel: string;
  windowLabel: string;
  observedAt: string;
  artifactId: string | null;
  artifactUrl: string | null;
};

const sourceOptions: Array<{
  key: UsageSource;
  label: string;
  metricLabel: string;
}> = [
  { key: "openrouter", label: "OpenRouter", metricLabel: "Attributed tokens and requests" },
  { key: "homebrew", label: "Homebrew", metricLabel: "Install events" },
  { key: "npm", label: "npm", metricLabel: "Package downloads" },
  { key: "github-releases", label: "Releases", metricLabel: "Matched stable asset downloads" },
  { key: "vscode", label: "VS Code", metricLabel: "Marketplace installs" },
  { key: "openvsx", label: "Open VSX", metricLabel: "Extension downloads" },
  { key: "jetbrains", label: "JetBrains", metricLabel: "Plugin downloads" },
  { key: "github", label: "GitHub", metricLabel: "Repository stars and forks" },
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

const statusLabels: Record<HarnessSignalStatus, string> = {
  observed: "Observed",
  "mapped-unlisted": "Mapped but unlisted",
  "not-mapped": "Not mapped",
};

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

function notMappedHarnessRow(
  option: (typeof sourceOptions)[number],
): HarnessSignalRow {
  return {
    source: option.key,
    sourceLabel: option.label,
    metricLabel: option.metricLabel,
    status: "not-mapped",
    valueLabel: "No mapped signal",
    secondaryLabel: "Missing coverage is not zero",
    positionLabel: "No rank",
    windowLabel: "No observation",
    observedAt: "Not observed",
    artifactId: null,
    artifactUrl: null,
  };
}

function harnessSignalRows({
  harnessId,
  openRouterRecords,
  ecosystemRecords,
  openRouterView,
  openRouterWindowKey,
}: {
  harnessId: string;
  openRouterRecords: OpenRouterUsageRecord[];
  ecosystemRecords: EcosystemUsageRecord[];
  openRouterView: OpenRouterView;
  openRouterWindowKey: OpenRouterUsageWindowKey;
}): HarnessSignalRow[] {
  return sourceOptions.map((option) => {
    if (option.key === "openrouter") {
      const record = openRouterRecords.find((candidate) => candidate.id === harnessId);
      if (!record) return notMappedHarnessRow(option);

      const usage = openRouterView === "trending"
        ? record.trendingWindows[openRouterWindowKey === "day" ? "week" : openRouterWindowKey]
        : record.windows[openRouterWindowKey];
      const isListed = usage.rank !== null && usage.attributedTokens !== null;

      return {
        source: option.key,
        sourceLabel: option.label,
        metricLabel: `${option.metricLabel}, ${openRouterView === "trending" ? "trending" : "most used"}`,
        status: isListed ? "observed" : "mapped-unlisted",
        valueLabel: usage.attributedTokens === null
          ? "Not listed"
          : `${compactNumberFormatter.format(usage.attributedTokens)} tokens`,
        secondaryLabel: usage.attributedRequests === null
          ? "Requests not listed"
          : `${compactNumberFormatter.format(usage.attributedRequests)} requests`,
        positionLabel: usage.rank === null
          ? "Not listed"
          : openRouterView === "trending"
            ? `#${usage.rank} growth rank`
            : `#${usage.rank} global`,
        windowLabel: formatDateRange(usage),
        observedAt: `Observed ${usage.observedAt}`,
        artifactId: record.artifactId,
        artifactUrl: record.appUrl,
      };
    }

    const record = ecosystemRecords.find(
      (candidate) => candidate.id === harnessId && candidate.signal.source === option.key,
    );
    if (!record) return notMappedHarnessRow(option);

    const rankedRows = rowsForEcosystem(ecosystemRecords, option.key);
    const displayRow = rankedRows.find((candidate) => candidate.id === harnessId);
    if (!displayRow) return notMappedHarnessRow(option);

    const signal = record.signal;
    return {
      source: option.key,
      sourceLabel: option.label,
      metricLabel: option.metricLabel,
      status: "observed",
      valueLabel: displayRow.valueLabel,
      secondaryLabel: displayRow.secondary,
      positionLabel: `#${displayRow.rank} of ${rankedRows.length} mapped`,
      windowLabel: "windowStart" in signal
        ? formatDateRange(signal)
        : "Cumulative snapshot",
      observedAt: `Observed ${signal.observedAt}`,
      artifactId: signal.artifactId,
      artifactUrl: signal.artifactUrl,
    };
  });
}

export function UsageSignalsExplorer({
  products,
  openRouterRecords,
  ecosystemRecords,
  activeHarnessCount,
}: {
  products: UsageProduct[];
  openRouterRecords: OpenRouterUsageRecord[];
  ecosystemRecords: EcosystemUsageRecord[];
  activeHarnessCount: number;
}) {
  const [mode, setMode] = useState<UsageMode>("source");
  const [selectedSource, setSelectedSource] = useState<UsageSource>("openrouter");
  const [openRouterView, setOpenRouterView] = useState<OpenRouterView>("popular");
  const [selectedWindow, setSelectedWindow] = useState<OpenRouterUsageWindowKey>("week");
  const [selectedHarnessId, setSelectedHarnessId] = useState(products[0]?.id ?? "");
  const [urlReady, setUrlReady] = useState(false);
  const [expandedSources, setExpandedSources] = useState<UsageSource[]>([]);
  const sourceTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const windowTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const requestedMode = searchParams.get("mode");
    const requestedSource = searchParams.get("source");
    const requestedView = searchParams.get("view");
    const requestedWindow = searchParams.get("window");
    const requestedHarnessId = searchParams.get("id");
    const matchedSource = sourceOptions.find((option) => option.key === requestedSource);
    const matchedHarness = products.find((product) => product.id === requestedHarnessId);
    const requestedHarnessUnavailable = requestedHarnessId !== null && !matchedHarness;

    if (requestedMode === "harness" && !requestedHarnessUnavailable) setMode("harness");
    if (matchedSource) setSelectedSource(matchedSource.key);
    if (requestedView === "trending") setOpenRouterView("trending");
    if (requestedWindow === "day" || requestedWindow === "week" || requestedWindow === "month") {
      setSelectedWindow(requestedView === "trending" && requestedWindow === "day" ? "week" : requestedWindow);
    }
    if (matchedHarness) setSelectedHarnessId(matchedHarness.id);
    setUrlReady(true);
  }, [products]);

  const effectiveWindow = openRouterView === "trending" && selectedWindow === "day"
    ? "week"
    : selectedWindow;

  useEffect(() => {
    if (!urlReady) return;

    const url = new URL(window.location.href);
    for (const key of ["mode", "id", "source", "view", "window"]) {
      url.searchParams.delete(key);
    }

    if (mode === "harness") {
      url.searchParams.set("mode", "harness");
      if (selectedHarnessId) url.searchParams.set("id", selectedHarnessId);
    } else if (selectedSource !== "openrouter") {
      url.searchParams.set("source", selectedSource);
    }

    if (mode === "harness" || selectedSource === "openrouter") {
      if (openRouterView !== "popular") url.searchParams.set("view", openRouterView);
      if (effectiveWindow !== "week") url.searchParams.set("window", effectiveWindow);
    }

    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [
    effectiveWindow,
    mode,
    openRouterView,
    selectedHarnessId,
    selectedSource,
    urlReady,
  ]);

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
      valueAriaLabel: record.usage.attributedTokens === null ? "Not listed in this window" : `${fullNumberFormatter.format(record.usage.attributedTokens)} attributed tokens`,
      secondary: record.usage.attributedRequests === null ? "Not listed" : compactNumberFormatter.format(record.usage.attributedRequests),
      secondaryAriaLabel: record.usage.attributedRequests === null ? "Not listed in this window" : `${fullNumberFormatter.format(record.usage.attributedRequests)} attributed requests`,
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
  const selectedProduct = products.find((product) => product.id === selectedHarnessId) ?? products[0];
  const selectedHarnessRows = mode === "harness" && selectedProduct
    ? harnessSignalRows({
      harnessId: selectedProduct.id,
      openRouterRecords,
      ecosystemRecords,
      openRouterView,
      openRouterWindowKey: effectiveWindow,
    })
    : [];

  function selectRelativeSource(currentIndex: number, direction: -1 | 1) {
    const nextIndex = (currentIndex + direction + sourceOptions.length) % sourceOptions.length;
    const nextSource = sourceOptions[nextIndex];
    if (!nextSource) return;
    setSelectedSource(nextSource.key);
    sourceTabRefs.current[nextIndex]?.focus();
  }

  function selectRelativeWindow(currentIndex: number, direction: -1 | 1) {
    const nextIndex = (currentIndex + direction + availableWindowOptions.length) % availableWindowOptions.length;
    const nextWindow = availableWindowOptions[nextIndex];
    if (!nextWindow) return;
    setSelectedWindow(nextWindow.key);
    windowTabRefs.current[nextIndex]?.focus();
  }

  const showOpenRouterControls = mode === "harness" || selectedSource === "openrouter";

  return (
    <section className="usage-explorer" aria-labelledby="usage-explorer-heading">
      <div className="usage-mode-bar">
        <span>Explore usage</span>
        <div className="usage-mode-tabs" role="group" aria-label="Usage explorer view">
          <button
            type="button"
            aria-pressed={mode === "source"}
            aria-controls="usage-ranking-mode"
            onClick={() => setMode("source")}
          >
            By source
          </button>
          <button
            type="button"
            aria-pressed={mode === "harness"}
            aria-controls="usage-harness-mode"
            onClick={() => setMode("harness")}
          >
            By harness
          </button>
        </div>
      </div>

      <header className="usage-explorer-header">
        <div>
          <span className="usage-explorer-kicker">
            {mode === "source" ? "Source-separated rankings" : "Source-by-source product ledger"}
          </span>
          <h2 id="usage-explorer-heading">
            {mode === "source"
              ? sourceTitle(selectedSource, openRouterView)
              : selectedProduct
                ? `${selectedProduct.name} usage signals`
                : "Harness usage signals"}
          </h2>
          <p>
            {mode === "source"
              ? sourceSummary(selectedSource, openRouterView)
              : "Inspect one harness across independent public signals without combining their units or populations."}
          </p>
        </div>
        {showOpenRouterControls && (
          <div className="usage-header-controls">
            {mode === "harness" && (
              <label className="usage-harness-picker" htmlFor="usage-harness-select">
                <span>Harness</span>
                <select
                  id="usage-harness-select"
                  value={selectedProduct?.id ?? ""}
                  onChange={(event) => {
                    const product = products.find((candidate) => candidate.id === event.target.value);
                    if (product) setSelectedHarnessId(product.id);
                  }}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </label>
            )}

            {showOpenRouterControls && (
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
                      aria-controls={mode === "source" ? "usage-ranking-panel" : "usage-harness-panel"}
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
          </div>
        )}
      </header>

      {mode === "source" ? (
        <div id="usage-ranking-mode">
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
                          <span className="usage-missing">{row.valueLabel}</span>
                        ) : (
                          <>
                            <span className="usage-bar" style={{ width: `${barWidth}%` }} aria-hidden="true" />
                            <strong title={row.valueAriaLabel}>{row.valueLabel}</strong>
                          </>
                        )}
                      </span>
                      <span className="usage-secondary" title={row.secondaryAriaLabel}>
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
        </div>
      ) : (
        <div id="usage-harness-mode">
          <div
            className="usage-harness-panel"
            id="usage-harness-panel"
            aria-live="polite"
          >
            {selectedProduct ? (
              <>
                <div className="usage-harness-product">
                  <div>
                    <HarnessLogo logo={selectedProduct.logo} name={selectedProduct.name} />
                    <span>
                      <strong>{selectedProduct.name}</strong>
                      <small>{selectedProduct.tagline}</small>
                    </span>
                  </div>
                  <Link href={`/harnesses/${selectedProduct.slug}`}>Open harness profile</Link>
                </div>

                <table className="usage-harness-table">
                  <caption>
                    Source-separated usage signals for {selectedProduct.name}. Values retain their native units and cannot be added together.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Source</th>
                      <th scope="col">Status</th>
                      <th scope="col">Observed value</th>
                      <th scope="col">Position</th>
                      <th scope="col">Window</th>
                      <th scope="col">Artifact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHarnessRows.map((row) => (
                      <tr key={row.source}>
                        <th scope="row">
                          <strong>{row.sourceLabel}</strong>
                          <small>{row.metricLabel}</small>
                        </th>
                        <td data-label="Status">
                          <span className={`usage-harness-status usage-harness-status-${row.status}`}>
                            {statusLabels[row.status]}
                          </span>
                        </td>
                        <td data-label="Observed value">
                          <strong>{row.valueLabel}</strong>
                          <small>{row.secondaryLabel}</small>
                        </td>
                        <td data-label="Position">
                          <strong>{row.positionLabel}</strong>
                        </td>
                        <td data-label="Window">
                          <strong>{row.windowLabel}</strong>
                          <small>{row.observedAt}</small>
                        </td>
                        <td data-label="Artifact">
                          {row.artifactId && row.artifactUrl ? (
                            <a href={row.artifactUrl} target="_blank" rel="noreferrer">{row.artifactId}</a>
                          ) : (
                            <span>No mapped artifact</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="usage-harness-empty">
                <strong>No active harnesses</strong>
                <span>The source ledger needs at least one active catalog record.</span>
              </div>
            )}
          </div>

          <footer className="usage-leaderboard-footer">
            <p>
              Positions compare products only within the named source. Missing coverage means not mapped, never zero. OpenRouter controls affect only its row.
            </p>
            <a href="/usage.csv" download>Download all signals (CSV)</a>
          </footer>
        </div>
      )}
    </section>
  );
}
