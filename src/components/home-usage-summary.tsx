"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import type { OpenRouterTrendingWindowKey } from "@/lib/types";
import type {
  EcosystemUsageRecord,
  OpenRouterUsageRecord,
  UsageProduct,
} from "@/lib/usage-view";

type UsageSource = "openrouter" | "homebrew" | "npm" | "github-releases" | "vscode";
type OpenRouterView = "popular" | "trending";

type SummaryRow = UsageProduct & {
  rank: number;
  value: number;
  valueLabel: string;
  valueAriaLabel: string;
};

const sourceOptions: Array<{ key: UsageSource; label: string }> = [
  { key: "openrouter", label: "OpenRouter" },
  { key: "homebrew", label: "Homebrew" },
  { key: "npm", label: "npm" },
  { key: "github-releases", label: "Releases" },
  { key: "vscode", label: "VS Code" },
];

const openRouterWindowOptions: Array<{ key: OpenRouterTrendingWindowKey; label: string }> = [
  { key: "week", label: "7 days" },
  { key: "month", label: "30 days" },
];

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});
const fullNumberFormatter = new Intl.NumberFormat("en-US");

function dateRange(window: { windowStart: string; windowEnd: string }) {
  return window.windowStart === window.windowEnd
    ? window.windowEnd
    : `${window.windowStart} to ${window.windowEnd}`;
}

function sourceTitle(source: UsageSource, openRouterView: OpenRouterView) {
  switch (source) {
    case "openrouter": return openRouterView === "trending" ? "Trending on OpenRouter" : "Most used on OpenRouter";
    case "homebrew": return "Homebrew install events";
    case "npm": return "npm package downloads";
    case "github-releases": return "GitHub release downloads";
    case "vscode": return "VS Code Marketplace installs";
  }
}

function sourceNote(source: UsageSource, openRouterView: OpenRouterView) {
  switch (source) {
    case "openrouter": return openRouterView === "trending"
      ? "Order reflects excess attributed-token growth against the preceding three equal windows. Bars show current-window volume, not the growth amount."
      : "Opt-in traffic attributed to coding apps. Attributed volume does not measure users, task quality, or success.";
    case "homebrew": return "Install events are not unique people or active installations.";
    case "npm": return "Downloads can include automated and repeated retrievals.";
    case "github-releases": return "Stable asset downloads can be repeated, automated, or split across platforms.";
    case "vscode": return "Marketplace installs are cumulative events, not current active users.";
  }
}

function ecosystemRows(records: EcosystemUsageRecord[], source: Exclude<UsageSource, "openrouter">): SummaryRow[] {
  return records
    .filter((record) => record.signal.source === source)
    .sort((left, right) => right.signal.value - left.signal.value || left.name.localeCompare(right.name))
    .map((record, index) => {
      const value = record.signal.value;
      let valueLabel = fullNumberFormatter.format(value);
      let valueAriaLabel = valueLabel;

      if (record.signal.source === "homebrew") {
        valueLabel = `${compactNumberFormatter.format(value)} events`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} Homebrew install events`;
      } else if (record.signal.source === "npm") {
        valueLabel = `${compactNumberFormatter.format(value)} downloads`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} npm downloads`;
      } else if (record.signal.source === "github-releases") {
        valueLabel = `${compactNumberFormatter.format(value)} downloads`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} matched GitHub release asset downloads`;
      } else if (record.signal.source === "vscode") {
        valueLabel = `${compactNumberFormatter.format(value)} installs`;
        valueAriaLabel = `${fullNumberFormatter.format(value)} cumulative Marketplace installs`;
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
      };
    });
}

export function HomeUsageSummary({
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
  const [openRouterWindowKey, setOpenRouterWindowKey] = useState<OpenRouterTrendingWindowKey>("week");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const openRouterWindow = openRouterRecords[0]
    ? openRouterView === "trending"
      ? openRouterRecords[0].trendingWindows[openRouterWindowKey]
      : openRouterRecords[0].windows[openRouterWindowKey]
    : undefined;
  const openRouterRows: SummaryRow[] = openRouterRecords
    .flatMap((record) => {
      const usage = openRouterView === "trending"
        ? record.trendingWindows[openRouterWindowKey]
        : record.windows[openRouterWindowKey];
      if (usage.rank === null || usage.attributedTokens === null) return [];
      return [{
        id: record.id,
        slug: record.slug,
        name: record.name,
        tagline: record.tagline,
        logo: record.logo,
        rank: usage.rank,
        value: usage.attributedTokens,
        valueLabel: `${compactNumberFormatter.format(usage.attributedTokens)} tokens`,
        valueAriaLabel: `${fullNumberFormatter.format(usage.attributedTokens)} attributed tokens`,
      }];
    })
    .sort((left, right) => left.rank - right.rank || left.name.localeCompare(right.name));
  const rows = selectedSource === "openrouter"
    ? openRouterRows
    : ecosystemRows(ecosystemRecords, selectedSource);
  const visibleRows = rows.slice(0, 5);
  const maxValue = Math.max(1, ...visibleRows.map((row) => row.value));
  const selectedSignal = selectedSource === "openrouter"
    ? null
    : ecosystemRecords.find((record) => record.signal.source === selectedSource)?.signal;
  const observationRange = selectedSource === "openrouter" && openRouterWindow
    ? dateRange(openRouterWindow)
    : selectedSignal && "windowStart" in selectedSignal
      ? dateRange(selectedSignal)
      : selectedSignal?.observedAt ?? "No current observation";
  const mappedCount = selectedSource === "openrouter" ? openRouterRecords.length : rows.length;
  const listedCount = selectedSource === "openrouter" ? openRouterRows.length : rows.length;
  const coverage = selectedSource === "openrouter"
    ? `${listedCount} listed; ${mappedCount} mapped of ${activeHarnessCount}`
    : `${mappedCount} mapped of ${activeHarnessCount} active harnesses`;

  function selectRelativeSource(index: number, direction: -1 | 1) {
    const nextIndex = (index + direction + sourceOptions.length) % sourceOptions.length;
    setSelectedSource(sourceOptions[nextIndex].key);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="home-usage-summary" aria-labelledby="home-usage-heading">
      <header className="home-usage-header">
        <div>
          <h2 id="home-usage-heading">Public usage signals</h2>
          <p>Compare source-native activity without turning popularity into a quality score.</p>
        </div>
        <Link className="text-link" href="/usage">Open full usage data</Link>
      </header>

      <div className="home-usage-tabs" role="tablist" aria-label="Usage signal source">
        {sourceOptions.map((option, index) => (
          <button
            type="button"
            role="tab"
            id={`home-usage-tab-${option.key}`}
            aria-controls="home-usage-panel"
            aria-selected={selectedSource === option.key}
            tabIndex={selectedSource === option.key ? 0 : -1}
            key={option.key}
            ref={(element) => { tabRefs.current[index] = element; }}
            onClick={() => setSelectedSource(option.key)}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") { event.preventDefault(); selectRelativeSource(index, -1); }
              if (event.key === "ArrowRight") { event.preventDefault(); selectRelativeSource(index, 1); }
              if (event.key === "Home") { event.preventDefault(); setSelectedSource(sourceOptions[0].key); tabRefs.current[0]?.focus(); }
              if (event.key === "End") { event.preventDefault(); setSelectedSource(sourceOptions.at(-1)!.key); tabRefs.current.at(-1)?.focus(); }
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        className="home-usage-panel"
        id="home-usage-panel"
        role="tabpanel"
        aria-labelledby={`home-usage-tab-${selectedSource}`}
        aria-live="polite"
      >
        <div className="home-usage-context">
          <div className="home-usage-context-copy">
            <strong>{sourceTitle(selectedSource, openRouterView)}</strong>
            <span>{observationRange}</span>
            <span>{coverage}</span>
          </div>
          {selectedSource === "openrouter" && (
            <div className="home-usage-controls">
              <div className="home-usage-control-group" role="group" aria-label="OpenRouter ranking view">
                <button
                  type="button"
                  aria-pressed={openRouterView === "popular"}
                  onClick={() => setOpenRouterView("popular")}
                >
                  Most used
                </button>
                <button
                  type="button"
                  aria-pressed={openRouterView === "trending"}
                  onClick={() => setOpenRouterView("trending")}
                >
                  Trending
                </button>
              </div>
              <div className="home-usage-control-group" role="group" aria-label="OpenRouter ranking window">
                {openRouterWindowOptions.map((option) => (
                  <button
                    type="button"
                    aria-pressed={openRouterWindowKey === option.key}
                    key={option.key}
                    onClick={() => setOpenRouterWindowKey(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="home-usage-columns" aria-hidden="true">
          <span>Rank</span>
          <span>Harness</span>
          <span>{selectedSource === "openrouter" && openRouterView === "trending" ? "Window volume" : "Observed volume"}</span>
        </div>

        {visibleRows.length > 0 ? (
          <ol className="home-usage-ranking" aria-label={`${sourceTitle(selectedSource, openRouterView)} top five for ${observationRange}`}>
            {visibleRows.map((row) => (
              <li key={row.id}>
                <Link href={`/harnesses/${row.slug}`} className="home-usage-row">
                  <span className="home-usage-rank">#{row.rank}</span>
                  <span className="home-usage-product">
                    <HarnessLogo logo={row.logo} name={row.name} size="small" />
                    <strong>{row.name}</strong>
                  </span>
                  <span className="home-usage-value">
                    <span
                      className="home-usage-bar"
                      style={{ transform: `scaleX(${row.value / maxValue})` }}
                      aria-hidden="true"
                    />
                    <strong aria-label={row.valueAriaLabel} title={row.valueAriaLabel}>{row.valueLabel}</strong>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="home-usage-empty">No mapped records are available for this source.</p>
        )}
      </div>

      <footer className="home-usage-footer">
        <p>{sourceNote(selectedSource, openRouterView)} Rankings stay source-specific and never affect recommendations.</p>
      </footer>
    </section>
  );
}
