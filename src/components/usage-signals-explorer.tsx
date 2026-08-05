"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
type UsageMode = "source" | "harness" | "compare";
type HarnessSignalStatus = "observed" | "mapped-unlisted" | "not-mapped";

type DisplayRow = UsageProduct & {
  status: HarnessSignalStatus;
  rank: number | null;
  value: number | null;
  valueLabel: string;
  unit: string;
  secondary: string;
  secondaryDetail: string;
  secondaryCsv: string;
  windowLabel: string;
  observedAt: string;
  artifactId: string | null;
  artifactUrl: string | null;
  sourceUrl: string | null;
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

function trendingWindowKey(windowKey: OpenRouterUsageWindowKey): OpenRouterTrendingWindowKey {
  return windowKey === "day" ? "week" : windowKey;
}

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

const maxComparedHarnesses = 4;

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

function secondaryColumnLabel(source: UsageSource) {
  switch (source) {
    case "openrouter": return "Requests / app";
    case "homebrew": return "Kind / artifact";
    case "github-releases": return "Matched scope / artifact";
    case "github": return "Forks / scope";
    default: return "Artifact";
  }
}

function csvCell(value: string | number | null) {
  if (value === null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function currentViewCsv({
  rows,
  source,
  openRouterView,
  rankScope,
}: {
  rows: DisplayRow[];
  source: UsageSource;
  openRouterView: OpenRouterView;
  rankScope: string;
}) {
  const header = [
    "source",
    "ranking_mode",
    "window",
    "rank",
    "rank_scope",
    "status",
    "harness_id",
    "harness_name",
    "value",
    "unit",
    "secondary",
    "observed_at",
    "artifact_id",
    "artifact_url",
    "source_url",
  ];
  const dataRows = rows.map((row) => [
    source,
    source === "openrouter" ? openRouterView : null,
    row.windowLabel,
    row.rank,
    rankScope,
    row.status,
    row.id,
    row.name,
    row.value,
    row.unit,
    row.secondaryCsv,
    row.observedAt,
    row.artifactId,
    row.artifactUrl,
    row.sourceUrl,
  ].map(csvCell).join(","));

  return [header.join(","), ...dataRows, ""].join("\n");
}

function filterProducts(products: UsageProduct[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase("en");
  if (!normalizedQuery) return products;
  return products.filter((product) => product.name.toLocaleLowerCase("en").includes(normalizedQuery));
}

function notMappedDisplayRow(product: UsageProduct): DisplayRow {
  return {
    ...product,
    status: "not-mapped",
    rank: null,
    value: null,
    valueLabel: "No mapped signal",
    unit: "Not mapped",
    secondary: "Not mapped",
    secondaryDetail: "Missing coverage is not zero",
    secondaryCsv: "",
    windowLabel: "No observation",
    observedAt: "",
    artifactId: null,
    artifactUrl: null,
    sourceUrl: null,
  };
}

function rowsForEcosystem(records: EcosystemUsageRecord[], source: EcosystemSignalSnapshot["source"]): DisplayRow[] {
  return records
    .filter((record) => record.signal.source === source)
    .sort((left, right) => right.signal.value - left.signal.value || left.name.localeCompare(right.name))
    .map((record, index) => {
      const value = record.signal.value;
      let valueLabel = fullNumberFormatter.format(value);
      let unit = "observed value";
      let secondary = record.signal.artifactId;
      let secondaryDetail = "Mapped artifact";
      let secondaryCsv = record.signal.artifactId;

      if (record.signal.source === "homebrew") {
        unit = "install events";
        valueLabel = `${fullNumberFormatter.format(value)} events`;
        secondary = record.signal.artifactKind === "formula" ? "Formula" : "Cask";
        secondaryDetail = record.signal.artifactId;
        secondaryCsv = `artifact_kind=${record.signal.artifactKind}; artifact=${record.signal.artifactId}`;
      } else if (record.signal.source === "npm") {
        unit = "package downloads";
        valueLabel = `${fullNumberFormatter.format(value)} downloads`;
      } else if (record.signal.source === "github-releases") {
        unit = "matched stable asset downloads";
        valueLabel = `${fullNumberFormatter.format(value)} downloads`;
        secondary = `${record.signal.releaseCount} releases · ${record.signal.assetCount} assets`;
        secondaryDetail = record.signal.artifactId;
        secondaryCsv = `${record.signal.releaseCount} stable releases; ${record.signal.assetCount} matched assets`;
      } else if (record.signal.source === "vscode") {
        unit = "marketplace installs";
        valueLabel = `${fullNumberFormatter.format(value)} installs`;
      } else if (record.signal.source === "openvsx") {
        unit = "extension downloads";
        valueLabel = `${fullNumberFormatter.format(value)} downloads`;
        secondary = `Version ${record.signal.latestVersion}`;
        secondaryDetail = record.signal.artifactId;
        secondaryCsv = `latest_version=${record.signal.latestVersion}; artifact=${record.signal.artifactId}`;
      } else if (record.signal.source === "jetbrains") {
        unit = "plugin downloads";
        valueLabel = `${fullNumberFormatter.format(value)} downloads`;
        secondary = `Plugin ${record.signal.pluginId}`;
        secondaryDetail = record.signal.artifactId;
        secondaryCsv = `plugin_id=${record.signal.pluginId}; artifact=${record.signal.artifactId}`;
      } else if (record.signal.source === "github") {
        unit = "repository stars";
        valueLabel = `${fullNumberFormatter.format(value)} stars`;
        secondary = `${fullNumberFormatter.format(record.signal.forks)} forks`;
        secondaryDetail = `${repositoryScopeLabels[record.signal.repositoryScope]} | ${record.signal.artifactId}`;
        secondaryCsv = `${record.signal.forks} forks; scope=${record.signal.repositoryScope}`;
      }

      return {
        id: record.id,
        slug: record.slug,
        name: record.name,
        tagline: record.tagline,
        logo: record.logo,
        status: "observed",
        rank: index + 1,
        value,
        valueLabel,
        unit,
        secondary,
        secondaryDetail,
        secondaryCsv,
        windowLabel: "windowStart" in record.signal
          ? formatDateRange(record.signal)
          : "Cumulative snapshot",
        observedAt: record.signal.observedAt,
        artifactId: record.signal.artifactId,
        artifactUrl: record.signal.artifactUrl,
        sourceUrl: record.signal.sourceUrl,
      };
    });
}

function UsageRankingList({
  rows,
  maxValue,
  source,
  openRouterView,
  rankingLabel,
}: {
  rows: DisplayRow[];
  maxValue: number;
  source: UsageSource;
  openRouterView: OpenRouterView;
  rankingLabel: string;
}) {
  return (
    <>
      <p className="usage-scale-note">
        Linear bars use the largest mapped value in this source as 100%. Positive values below one display pixel retain a 1 px origin marker. Exact values remain authoritative.
        {source === "openrouter" && openRouterView === "trending"
          ? " Order follows OpenRouter excess-growth rank; bars show current-window attributed tokens."
          : ""}
      </p>
      <div className="usage-column-labels" aria-hidden="true">
        <span>Rank</span>
        <span>Harness</span>
        <span>{source === "openrouter" && openRouterView === "trending" ? "Window volume" : "Observed value"}</span>
        <span>{secondaryColumnLabel(source)}</span>
      </div>

      <ol className="usage-ranking" aria-label={rankingLabel}>
        {rows.map((row) => {
          const barWidth = row.value === null ? 0 : (row.value / maxValue) * 100;
          const rankLabel = row.status === "not-mapped"
            ? "Not mapped"
            : row.rank === null
              ? "Not listed"
              : `#${row.rank}`;
          return (
            <li key={row.id}>
              <Link href={`/harnesses/${row.slug}`} className="usage-ranking-row">
                <span className="usage-rank">{rankLabel}</span>
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
                      <span
                        className={`usage-bar-track${row.value > 0 ? " usage-bar-track-positive" : ""}`}
                        aria-hidden="true"
                      >
                        <span className="usage-bar" style={{ width: `${barWidth}%` }} />
                      </span>
                      <strong>{row.valueLabel}</strong>
                    </>
                  )}
                </span>
                <span className="usage-secondary">
                  <strong>{row.secondary}</strong>
                  <small>{row.secondaryDetail}</small>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
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

type UsageSignalsExplorerProps = {
  products: UsageProduct[];
  openRouterRecords: OpenRouterUsageRecord[];
  ecosystemRecords: EcosystemUsageRecord[];
  activeHarnessCount: number;
};

type UsageExplorerState = {
  mode: UsageMode;
  selectedSource: UsageSource;
  openRouterView: OpenRouterView;
  selectedWindow: OpenRouterUsageWindowKey;
  selectedHarnessId: string;
  comparedHarnessIds: string[];
};

function subscribeToLocationSearch(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function locationSearchSnapshot(): string | null {
  return window.location.search;
}

function serverLocationSearchSnapshot(): string | null {
  return null;
}

function initialExplorerState(search: string, products: UsageProduct[]): UsageExplorerState {
  const searchParams = new URLSearchParams(search);
  const requestedMode = searchParams.get("mode");
  const requestedSource = searchParams.get("source");
  const requestedView = searchParams.get("view");
  const requestedWindow = searchParams.get("window");
  const requestedHarnessId = searchParams.get("id");
  const matchedSource = sourceOptions.find((option) => option.key === requestedSource);
  const matchedHarness = products.find((product) => product.id === requestedHarnessId);
  const requestedHarnessUnavailable = requestedHarnessId !== null && !matchedHarness;
  const comparedHarnessIds = (searchParams.get("ids") ?? "")
    .split(",")
    .filter((id, index, ids) => id && ids.indexOf(id) === index)
    .filter((id) => products.some((product) => product.id === id))
    .slice(0, maxComparedHarnesses);
  const openRouterView = requestedView === "trending" ? "trending" : "popular";
  const selectedWindow = requestedWindow === "day" || requestedWindow === "week" || requestedWindow === "month"
    ? requestedView === "trending" ? trendingWindowKey(requestedWindow) : requestedWindow
    : "week";

  return {
    mode: requestedMode === "compare"
      ? "compare"
      : requestedMode === "harness" && !requestedHarnessUnavailable
        ? "harness"
        : "source",
    selectedSource: matchedSource?.key ?? "openrouter",
    openRouterView,
    selectedWindow,
    selectedHarnessId: matchedHarness?.id ?? products[0]?.id ?? "",
    comparedHarnessIds,
  };
}

function explorerLocationSearch(state: UsageExplorerState) {
  const searchParams = new URLSearchParams();

  if (state.mode === "harness") {
    searchParams.set("mode", "harness");
    if (state.selectedHarnessId) searchParams.set("id", state.selectedHarnessId);
  } else {
    if (state.mode === "compare") {
      searchParams.set("mode", "compare");
      if (state.comparedHarnessIds.length > 0) searchParams.set("ids", state.comparedHarnessIds.join(","));
    }
    if (state.selectedSource !== "openrouter") searchParams.set("source", state.selectedSource);
  }

  if (state.mode === "harness" || state.selectedSource === "openrouter") {
    if (state.openRouterView !== "popular") searchParams.set("view", state.openRouterView);
    if (state.selectedWindow !== "week") searchParams.set("window", state.selectedWindow);
  }

  const search = searchParams.toString();
  return search ? `?${search}` : "";
}

function replaceExplorerLocation(search: string) {
  const url = new URL(window.location.href);
  window.history.replaceState(null, "", `${url.pathname}${search}${url.hash}`);
}

function UsageSignalsExplorerWithLocation(props: UsageSignalsExplorerProps) {
  const locationSearch = useSyncExternalStore(
    subscribeToLocationSearch,
    locationSearchSnapshot,
    serverLocationSearchSnapshot,
  );
  const initialState = initialExplorerState(locationSearch ?? "", props.products);
  const canonicalSearch = explorerLocationSearch(initialState);

  useEffect(() => {
    if (locationSearch === null || locationSearch === canonicalSearch) return;
    replaceExplorerLocation(canonicalSearch);
  }, [canonicalSearch, locationSearch]);

  return (
    <UsageSignalsExplorer
      key={locationSearch ?? "server"}
      {...props}
      initialState={initialState}
      synchronizeUrl={locationSearch !== null}
    />
  );
}

type UpdateExplorerState = (update: Partial<UsageExplorerState>) => void;

function UsageExplorerToolbar({
  mode,
  selectedSource,
  openRouterView,
  effectiveWindow,
  selectedHarnessId,
  comparedHarnessIds,
  products,
  selectedProduct,
  harnessQuery,
  harnessPickerProducts,
  availableWindowOptions,
  showOpenRouterControls,
  dateRange,
  comparedRowCount,
  coverageLabel,
  rankScopeLabel,
  updateExplorerState,
  setHarnessQuery,
  registerSourceTab,
  registerWindowTab,
  selectRelativeSource,
  selectRelativeWindow,
}: {
  mode: UsageMode;
  selectedSource: UsageSource;
  openRouterView: OpenRouterView;
  effectiveWindow: OpenRouterUsageWindowKey;
  selectedHarnessId: string;
  comparedHarnessIds: string[];
  products: UsageProduct[];
  selectedProduct: UsageProduct | undefined;
  harnessQuery: string;
  harnessPickerProducts: UsageProduct[];
  availableWindowOptions: ReadonlyArray<{ key: OpenRouterUsageWindowKey; label: string }>;
  showOpenRouterControls: boolean;
  dateRange: string;
  comparedRowCount: number;
  coverageLabel: string;
  rankScopeLabel: string;
  updateExplorerState: UpdateExplorerState;
  setHarnessQuery: (query: string) => void;
  registerSourceTab: (index: number, element: HTMLButtonElement | null) => void;
  registerWindowTab: (index: number, element: HTMLButtonElement | null) => void;
  selectRelativeSource: (currentIndex: number, direction: -1 | 1) => void;
  selectRelativeWindow: (currentIndex: number, direction: -1 | 1) => void;
}) {
  return (
    <>
      <div className="usage-mode-bar">
        <div className="usage-mode-tabs" role="group" aria-label="Usage explorer view">
          <button type="button" aria-pressed={mode === "source"} onClick={() => updateExplorerState({ mode: "source" })}>
            By source
          </button>
          <button type="button" aria-pressed={mode === "harness"} onClick={() => updateExplorerState({ mode: "harness" })}>
            By harness
          </button>
          <button
            type="button"
            aria-pressed={mode === "compare"}
            onClick={() => {
              const nextComparedHarnessIds = comparedHarnessIds.length > 0
                ? comparedHarnessIds
                : [selectedHarnessId, ...products.map((product) => product.id)]
                  .filter((id, index, ids) => id && ids.indexOf(id) === index)
                  .slice(0, 2);
              updateExplorerState({ mode: "compare", comparedHarnessIds: nextComparedHarnessIds });
            }}
          >
            Compare
          </button>
        </div>
      </div>

      {mode !== "harness" && (
        <div className="usage-source-switcher">
          <div className="usage-source-tabs-shell">
            <div className="usage-source-tabs" role="tablist" aria-label="Usage signal source">
              {sourceOptions.map((option, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedSource === option.key}
                  aria-controls={mode === "compare" ? "usage-compare-panel" : "usage-ranking-panel"}
                  id={`usage-source-tab-${option.key}`}
                  tabIndex={selectedSource === option.key ? 0 : -1}
                  key={option.key}
                  ref={(element) => registerSourceTab(index, element)}
                  onClick={() => updateExplorerState({ selectedSource: option.key })}
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

          <label className="usage-source-picker" htmlFor="usage-source-select">
            <span>Signal source</span>
            <select
              id="usage-source-select"
              value={selectedSource}
              onChange={(event) => {
                const source = sourceOptions.find((option) => option.key === event.target.value);
                if (source) updateExplorerState({ selectedSource: source.key });
              }}
            >
              {sourceOptions.map((option) => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <header className="usage-explorer-header">
        <div>
          <h2 id="usage-explorer-heading">
            {mode === "source"
              ? sourceTitle(selectedSource, openRouterView)
              : mode === "compare"
                ? `${sourceTitle(selectedSource, openRouterView)} comparison`
                : selectedProduct
                ? `${selectedProduct.name} usage signals`
                : "Harness usage signals"}
          </h2>
          <p>
            {mode === "source"
              ? sourceSummary(selectedSource, openRouterView)
              : mode === "compare"
                ? "Compare up to four harnesses inside one source, metric, and observation window. Unmapped coverage remains explicit."
                : "Inspect one harness across independent public signals without combining their units or populations."}
          </p>
          {mode !== "harness" && (
            <div className="usage-explorer-meta">
              <strong>{dateRange}</strong>
              <span>{mode === "compare" ? `${comparedRowCount} of ${maxComparedHarnesses} selected` : coverageLabel}</span>
              <span>{rankScopeLabel}</span>
            </div>
          )}
        </div>
        {showOpenRouterControls && (
          <div className="usage-header-controls">
            {mode === "harness" && (
              <div className="usage-harness-picker-group">
                <label className="usage-harness-search" htmlFor="usage-harness-search">
                  <span>Find harness</span>
                  <input
                    id="usage-harness-search"
                    type="search"
                    value={harnessQuery}
                    placeholder="Search by name"
                    onChange={(event) => setHarnessQuery(event.target.value)}
                  />
                </label>
                <label className="usage-harness-picker" htmlFor="usage-harness-select">
                  <span>Harness</span>
                  <select
                    id="usage-harness-select"
                    value={selectedProduct?.id ?? ""}
                    onChange={(event) => {
                      const product = products.find((candidate) => candidate.id === event.target.value);
                      if (product) updateExplorerState({ selectedHarnessId: product.id });
                    }}
                  >
                    {harnessPickerProducts.map((product) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <div className="usage-openrouter-controls">
              <span className="usage-control-label">OpenRouter controls</span>
              <div className="usage-view-tabs" role="group" aria-label="OpenRouter ranking view">
                <button type="button" aria-pressed={openRouterView === "popular"} onClick={() => updateExplorerState({ openRouterView: "popular" })}>Most used</button>
                <button type="button" aria-pressed={openRouterView === "trending"} onClick={() => updateExplorerState({ openRouterView: "trending" })}>Trending</button>
              </div>
              <div className="usage-window-tabs" role="tablist" aria-label="OpenRouter time window">
                {availableWindowOptions.map((option, index) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={effectiveWindow === option.key}
                    aria-controls={mode === "source" ? "usage-ranking-panel" : mode === "compare" ? "usage-compare-panel" : "usage-harness-panel"}
                    id={`usage-window-tab-${option.key}`}
                    tabIndex={effectiveWindow === option.key ? 0 : -1}
                    key={option.key}
                    ref={(element) => registerWindowTab(index, element)}
                    onClick={() => updateExplorerState({ selectedWindow: option.key })}
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
          </div>
        )}
      </header>
    </>
  );
}

function UsageExplorerResults({
  mode,
  selectedSource,
  openRouterView,
  effectiveWindow,
  comparedRows,
  visibleRows,
  maxValue,
  dateRange,
  rows,
  isExpanded,
  setExpandedSources,
  selectedProduct,
  selectedHarnessRows,
  copyCurrentViewLink,
  copyStatus,
  currentViewHref,
  currentViewFilename,
}: {
  mode: UsageMode;
  selectedSource: UsageSource;
  openRouterView: OpenRouterView;
  effectiveWindow: OpenRouterUsageWindowKey;
  comparedRows: DisplayRow[];
  visibleRows: DisplayRow[];
  maxValue: number;
  dateRange: string;
  rows: DisplayRow[];
  isExpanded: boolean;
  setExpandedSources: React.Dispatch<React.SetStateAction<UsageSource[]>>;
  selectedProduct: UsageProduct | undefined;
  selectedHarnessRows: HarnessSignalRow[];
  copyCurrentViewLink: () => Promise<void>;
  copyStatus: "copied" | "failed" | "idle";
  currentViewHref: string;
  currentViewFilename: string;
}) {
  if (mode === "harness") {
    return (
      <div id="usage-harness-mode">
        <div
          className="usage-harness-panel"
          id="usage-harness-panel"
          role="tabpanel"
          aria-labelledby={`usage-window-tab-${effectiveWindow}`}
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
          <p>Positions compare products only within the named source. Missing coverage means not mapped, never zero. OpenRouter controls affect only its row.</p>
          <div className="usage-footer-actions">
            <button type="button" onClick={copyCurrentViewLink}>
              {copyStatus === "copied" ? "Link copied" : "Copy view link"}
            </button>
            <span className="usage-copy-status" role="status">
              {copyStatus === "failed" ? "Copy failed; use the browser address bar." : ""}
            </span>
            <a href="/usage.csv" download>Download all signals (CSV)</a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div id={mode === "compare" ? "usage-compare-results" : "usage-ranking-mode"}>
      <div
        className="usage-leaderboard-panel"
        id={mode === "compare" ? "usage-compare-panel" : "usage-ranking-panel"}
        role="tabpanel"
        aria-labelledby={`usage-source-tab-${selectedSource}`}
        aria-live="polite"
      >
        {mode === "compare" && comparedRows.length === 0 ? (
          <div className="usage-compare-empty">
            <strong>Select at least one harness</strong>
            <span>The comparison will show the source rank, exact value, and mapping status here.</span>
          </div>
        ) : (
          <UsageRankingList
            rows={mode === "compare" ? comparedRows : visibleRows}
            maxValue={maxValue}
            source={selectedSource}
            openRouterView={openRouterView}
            rankingLabel={mode === "compare"
              ? `${sourceTitle(selectedSource, openRouterView)} comparison for ${dateRange}`
              : `${sourceTitle(selectedSource, openRouterView)} ranking for ${dateRange}`}
          />
        )}
        {mode === "source" && rows.length > 12 && (
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
        <div className="usage-footer-actions">
          <button type="button" onClick={copyCurrentViewLink}>
            {copyStatus === "copied" ? "Link copied" : "Copy view link"}
          </button>
          <span className="usage-copy-status" role="status">
            {copyStatus === "failed" ? "Copy failed; use the browser address bar." : ""}
          </span>
          <a href={currentViewHref} download={currentViewFilename}>Download current view (CSV)</a>
          <a href="/usage.csv" download>Download all signals (CSV)</a>
        </div>
      </footer>
    </div>
  );
}

function UsageSignalsExplorer({
  products,
  openRouterRecords,
  ecosystemRecords,
  activeHarnessCount,
  initialState,
  synchronizeUrl,
}: UsageSignalsExplorerProps & {
  initialState: UsageExplorerState;
  synchronizeUrl: boolean;
}) {
  const [explorerState, setExplorerState] = useState<UsageExplorerState>(initialState);
  const {
    mode,
    selectedSource,
    openRouterView,
    selectedWindow,
    selectedHarnessId,
    comparedHarnessIds,
  } = explorerState;
  const [harnessQuery, setHarnessQuery] = useState("");
  const [compareQuery, setCompareQuery] = useState("");
  const [copyResult, setCopyResult] = useState<{
    viewKey: string;
    status: "copied" | "failed";
  } | null>(null);
  const [expandedSources, setExpandedSources] = useState<UsageSource[]>([]);
  const sourceTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const windowTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const effectiveWindow = selectedWindow;

  function updateExplorerState(update: Partial<UsageExplorerState>) {
    const nextState = { ...explorerState, ...update };
    if (nextState.openRouterView === "trending") {
      nextState.selectedWindow = trendingWindowKey(nextState.selectedWindow);
    }
    setExplorerState(nextState);
    if (synchronizeUrl) replaceExplorerLocation(explorerLocationSearch(nextState));
  }

  const availableWindowOptions = openRouterView === "trending"
    ? trendingWindowOptions
    : windowOptions;
  const openRouterRows: DisplayRow[] = openRouterRecords
    .map((record) => ({
      ...record,
      usage: openRouterView === "trending"
        ? record.trendingWindows[trendingWindowKey(effectiveWindow)]
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
      status: record.usage.rank === null || record.usage.attributedTokens === null
        ? "mapped-unlisted" as const
        : "observed" as const,
      rank: record.usage.rank,
      value: record.usage.attributedTokens,
      valueLabel: record.usage.attributedTokens === null ? "Not listed" : `${fullNumberFormatter.format(record.usage.attributedTokens)} tokens`,
      unit: "attributed tokens",
      secondary: record.usage.attributedRequests === null ? "Not listed" : fullNumberFormatter.format(record.usage.attributedRequests),
      secondaryDetail: `Requests | ${record.artifactId}`,
      secondaryCsv: record.usage.attributedRequests === null ? "" : String(record.usage.attributedRequests),
      windowLabel: formatDateRange(record.usage),
      observedAt: record.usage.observedAt,
      artifactId: record.artifactId,
      artifactUrl: record.appUrl,
      sourceUrl: record.usage.sourceUrl,
    }));

  const ecosystemRows = selectedSource === "openrouter" ? [] : rowsForEcosystem(ecosystemRecords, selectedSource);
  const rows = selectedSource === "openrouter" ? openRouterRows : ecosystemRows;
  const comparedHarnessIdSet = new Set(comparedHarnessIds);
  const listedRows = rows.filter((row) => row.value !== null);
  const coverageLabel = selectedSource === "openrouter"
    ? `${listedRows.length} listed; ${rows.length} mapped of ${activeHarnessCount} active harnesses`
    : `${rows.length} mapped of ${activeHarnessCount} active harnesses`;
  const maxValue = Math.max(1, ...listedRows.map((row) => row.value ?? 0));
  const isExpanded = expandedSources.includes(selectedSource);
  const visibleRows = isExpanded ? rows : rows.slice(0, 12);
  const comparedRows = comparedHarnessIds
    .flatMap((id) => {
      const product = products.find((candidate) => candidate.id === id);
      if (!product) return [];
      return [rows.find((row) => row.id === id) ?? notMappedDisplayRow(product)];
    })
    .sort((left, right) => {
      if (left.rank === null) return right.rank === null ? left.name.localeCompare(right.name) : 1;
      if (right.rank === null) return -1;
      return left.rank - right.rank;
    });
  const openRouterWindow = openRouterRecords[0]
    ? openRouterView === "trending"
      ? openRouterRecords[0].trendingWindows[trendingWindowKey(effectiveWindow)]
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
  const filteredHarnessProducts = filterProducts(products, harnessQuery);
  const harnessPickerProducts = selectedProduct && !filteredHarnessProducts.some((product) => product.id === selectedProduct.id)
    ? [selectedProduct, ...filteredHarnessProducts]
    : filteredHarnessProducts;
  const selectedCompareProducts = comparedHarnessIds.flatMap((id) => {
    const product = products.find((candidate) => candidate.id === id);
    return product ? [product] : [];
  });
  const comparePickerProducts = [
    ...selectedCompareProducts,
    ...filterProducts(products, compareQuery).filter((product) => !comparedHarnessIdSet.has(product.id)),
  ];
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
    updateExplorerState({ selectedSource: nextSource.key });
    sourceTabRefs.current[nextIndex]?.focus();
  }

  function selectRelativeWindow(currentIndex: number, direction: -1 | 1) {
    const nextIndex = (currentIndex + direction + availableWindowOptions.length) % availableWindowOptions.length;
    const nextWindow = availableWindowOptions[nextIndex];
    if (!nextWindow) return;
    updateExplorerState({ selectedWindow: nextWindow.key });
    windowTabRefs.current[nextIndex]?.focus();
  }

  const showOpenRouterControls = mode === "harness" || selectedSource === "openrouter";
  const rankScopeLabel = selectedSource === "openrouter"
    ? openRouterView === "trending"
      ? "OpenRouter growth rank"
      : "Global coding-app rank"
    : "Rank among mapped HarnessMatch products";
  const currentViewRows = mode === "compare" ? comparedRows : rows;
  const currentViewHref = `data:text/csv;charset=utf-8,${encodeURIComponent(currentViewCsv({
    rows: currentViewRows,
    source: selectedSource,
    openRouterView,
    rankScope: rankScopeLabel,
  }))}`;
  const currentViewFilename = selectedSource === "openrouter"
    ? `harnessmatch-${selectedSource}-${openRouterView}-${effectiveWindow}-${mode}.csv`
    : `harnessmatch-${selectedSource}-${mode}.csv`;
  const currentViewKey = [
    mode,
    selectedSource,
    openRouterView,
    effectiveWindow,
    selectedHarnessId,
    comparedHarnessIds.join(","),
  ].join(":");
  const copyStatus = copyResult?.viewKey === currentViewKey ? copyResult.status : "idle";

  async function copyCurrentViewLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyResult({ viewKey: currentViewKey, status: "copied" });
    } catch {
      setCopyResult({ viewKey: currentViewKey, status: "failed" });
    }
  }

  return (
    <section className="usage-explorer" aria-labelledby="usage-explorer-heading">
      <UsageExplorerToolbar
        mode={mode}
        selectedSource={selectedSource}
        openRouterView={openRouterView}
        effectiveWindow={effectiveWindow}
        selectedHarnessId={selectedHarnessId}
        comparedHarnessIds={comparedHarnessIds}
        products={products}
        selectedProduct={selectedProduct}
        harnessQuery={harnessQuery}
        harnessPickerProducts={harnessPickerProducts}
        availableWindowOptions={availableWindowOptions}
        showOpenRouterControls={showOpenRouterControls}
        dateRange={dateRange}
        comparedRowCount={comparedRows.length}
        coverageLabel={coverageLabel}
        rankScopeLabel={rankScopeLabel}
        updateExplorerState={updateExplorerState}
        setHarnessQuery={setHarnessQuery}
        registerSourceTab={(index, element) => { sourceTabRefs.current[index] = element; }}
        registerWindowTab={(index, element) => { windowTabRefs.current[index] = element; }}
        selectRelativeSource={selectRelativeSource}
        selectRelativeWindow={selectRelativeWindow}
      />

      {mode === "compare" && (
        <fieldset className="usage-compare-picker" id="usage-compare-mode">
          <legend>Harnesses to compare</legend>
          <div className="usage-compare-picker-header">
            <p>
              Select up to {maxComparedHarnesses}. Every value keeps the source’s native unit. Rank scope: {rankScopeLabel}.
            </p>
            <strong aria-live="polite">{comparedHarnessIds.length} selected</strong>
          </div>
          <label className="usage-compare-search" htmlFor="usage-compare-search">
            <span>Find harness</span>
            <input
              id="usage-compare-search"
              type="search"
              value={compareQuery}
              placeholder="Search by name"
              onChange={(event) => setCompareQuery(event.target.value)}
            />
          </label>
          <div className="usage-compare-options">
            {comparePickerProducts.length > 0 ? comparePickerProducts.map((product) => {
              const isSelected = comparedHarnessIdSet.has(product.id);
              const selectionLimitReached = comparedHarnessIds.length >= maxComparedHarnesses;
              return (
                <label key={product.id}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={!isSelected && selectionLimitReached}
                    onChange={(event) => {
                      const nextComparedHarnessIds = event.target.checked
                        ? [...comparedHarnessIds, product.id].slice(0, maxComparedHarnesses)
                        : comparedHarnessIds.filter((id) => id !== product.id);
                      updateExplorerState({ comparedHarnessIds: nextComparedHarnessIds });
                    }}
                  />
                  <HarnessLogo logo={product.logo} name={product.name} size="small" />
                  <span>{product.name}</span>
                </label>
              );
            }) : (
              <p className="usage-compare-no-results">No harness matches this search.</p>
            )}
          </div>
        </fieldset>
      )}

      <UsageExplorerResults
        mode={mode}
        selectedSource={selectedSource}
        openRouterView={openRouterView}
        effectiveWindow={effectiveWindow}
        comparedRows={comparedRows}
        visibleRows={visibleRows}
        maxValue={maxValue}
        dateRange={dateRange}
        rows={rows}
        isExpanded={isExpanded}
        setExpandedSources={setExpandedSources}
        selectedProduct={selectedProduct}
        selectedHarnessRows={selectedHarnessRows}
        copyCurrentViewLink={copyCurrentViewLink}
        copyStatus={copyStatus}
        currentViewHref={currentViewHref}
        currentViewFilename={currentViewFilename}
      />
    </section>
  );
}

export { UsageSignalsExplorerWithLocation as UsageSignalsExplorer };
