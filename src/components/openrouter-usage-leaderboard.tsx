"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { HarnessLogo } from "@/components/harness-logo";
import type {
  HarnessLogo as HarnessLogoData,
  OpenRouterUsageWindow,
  OpenRouterUsageWindowKey,
} from "@/lib/types";

export type OpenRouterUsageRecord = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  logo: HarnessLogoData;
  windows: Record<OpenRouterUsageWindowKey, OpenRouterUsageWindow>;
};

const windowOptions: Array<{ key: OpenRouterUsageWindowKey; label: string }> = [
  { key: "day", label: "Latest day" },
  { key: "week", label: "7 days" },
  { key: "month", label: "30 days" },
];

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const fullNumberFormatter = new Intl.NumberFormat("en-US");

function formatDateRange(window: OpenRouterUsageWindow) {
  if (window.windowStart === window.windowEnd) return window.windowEnd;
  return `${window.windowStart} to ${window.windowEnd}`;
}

export function OpenRouterUsageLeaderboard({ records }: { records: OpenRouterUsageRecord[] }) {
  const [selectedWindow, setSelectedWindow] = useState<OpenRouterUsageWindowKey>("week");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rows = records
    .map((record) => ({ ...record, usage: record.windows[selectedWindow] }))
    .sort((left, right) => {
      if (left.usage.attributedTokens === null) return right.usage.attributedTokens === null ? left.name.localeCompare(right.name) : 1;
      if (right.usage.attributedTokens === null) return -1;
      return right.usage.attributedTokens - left.usage.attributedTokens;
    });
  const listedRows = rows.filter((row) => row.usage.attributedTokens !== null);
  const maxTokens = listedRows[0]?.usage.attributedTokens ?? 1;
  const activeWindow = rows[0]?.usage;

  function selectRelativeTab(currentIndex: number, direction: -1 | 1) {
    const nextIndex = (currentIndex + direction + windowOptions.length) % windowOptions.length;
    const nextKey = windowOptions[nextIndex].key;
    setSelectedWindow(nextKey);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className="usage-leaderboard" aria-labelledby="openrouter-usage-heading">
      <header className="usage-leaderboard-header">
        <div>
          <h2 id="openrouter-usage-heading">Most used through OpenRouter</h2>
          <p>Publicly attributed coding-app traffic for products already tracked by HarnessMatch.</p>
        </div>
        <div
          className="usage-window-tabs"
          role="tablist"
          aria-label="Usage window"
        >
          {windowOptions.map((option, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={selectedWindow === option.key}
              aria-controls="openrouter-usage-panel"
              id={`openrouter-usage-tab-${option.key}`}
              tabIndex={selectedWindow === option.key ? 0 : -1}
              key={option.key}
              ref={(element) => { tabRefs.current[index] = element; }}
              onClick={() => setSelectedWindow(option.key)}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectRelativeTab(index, -1);
                }
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  selectRelativeTab(index, 1);
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div
        className="usage-leaderboard-panel"
        id="openrouter-usage-panel"
        role="tabpanel"
        aria-labelledby={`openrouter-usage-tab-${selectedWindow}`}
      >
        <div className="usage-leaderboard-context">
          <p>
            <strong>{activeWindow ? formatDateRange(activeWindow) : "No current window"}</strong>
            <span>{listedRows.length} of {rows.length} tracked apps listed</span>
          </p>
          <span>Sorted by attributed tokens</span>
        </div>

        <div className="usage-column-labels" aria-hidden="true">
          <span>OpenRouter rank</span>
          <span>Harness</span>
          <span>Attributed traffic</span>
          <span>Requests</span>
        </div>

        <ol className="usage-ranking" aria-label={`OpenRouter usage ranking for ${activeWindow ? formatDateRange(activeWindow) : selectedWindow}`}>
          {rows.map((row) => {
            const tokens = row.usage.attributedTokens;
            const barWidth = tokens === null ? 0 : Math.max(1.5, (tokens / maxTokens) * 100);
            return (
              <li key={row.id}>
                <Link href={`/harnesses/${row.slug}`} className="usage-ranking-row">
                  <span className="usage-rank">{row.usage.rank === null ? "Not listed" : `#${row.usage.rank}`}</span>
                  <span className="usage-product">
                    <HarnessLogo logo={row.logo} name={row.name} size="small" />
                    <span>
                      <strong>{row.name}</strong>
                      <small>{row.tagline}</small>
                    </span>
                  </span>
                  <span className="usage-bar-cell">
                    {tokens === null ? (
                      <span className="usage-missing">No attributed traffic in this window</span>
                    ) : (
                      <>
                        <span className="usage-bar" style={{ width: `${barWidth}%` }} aria-hidden="true" />
                        <strong
                          aria-label={`${fullNumberFormatter.format(tokens)} attributed tokens`}
                          title={`${fullNumberFormatter.format(tokens)} attributed tokens`}
                        >
                          {compactNumberFormatter.format(tokens)} tokens
                        </strong>
                      </>
                    )}
                  </span>
                  <span
                    className="usage-requests"
                    aria-label={row.usage.attributedRequests === null ? "Not listed" : `${fullNumberFormatter.format(row.usage.attributedRequests)} attributed requests`}
                    title={row.usage.attributedRequests === null ? undefined : `${fullNumberFormatter.format(row.usage.attributedRequests)} attributed requests`}
                  >
                    {row.usage.attributedRequests === null ? "Not listed" : compactNumberFormatter.format(row.usage.attributedRequests)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <footer className="usage-leaderboard-footer">
        <p>Token totals combine prompt and completion tokens. Provider tokenizers differ, so this is a routing-volume signal, not standardized work or user count.</p>
        <a href="/usage.csv" download>Download CSV</a>
      </footer>
    </section>
  );
}
