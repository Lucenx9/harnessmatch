"use client";

import Link from "next/link";
import { useState } from "react";
import { GuiLogo } from "@/components/gui-logo";
import type {
  GuiLiveSignalRow,
  GuiLiveSignalsViewModel,
  GuiLiveSourceKey,
} from "@/lib/gui-view-models";

function SignalRows({ rows }: { rows: GuiLiveSignalRow[] }) {
  return (
    <ol className="gui-live-ranking">
      {rows.map((row, index) => (
        <li key={row.id}>
          <Link href={`/guis/${row.id}`} className="gui-live-row">
            <span className="gui-live-rank">{String(index + 1).padStart(2, "0")}</span>
            <span className="gui-live-product">
              <GuiLogo logo={row.logo} name={row.name} />
              <span>
                <strong>{row.name}</strong>
                <small>{row.detail}</small>
              </span>
            </span>
            <span className="gui-live-value">
              <i aria-hidden="true" style={{ width: `${row.barPercent}%` }} />
              <strong>{row.valueLabel}</strong>
            </span>
            <span className="gui-live-secondary">{row.secondary}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function GuiLiveSignals({
  viewModel,
}: {
  viewModel: GuiLiveSignalsViewModel;
}) {
  const [source, setSource] = useState<GuiLiveSourceKey>("homebrew");
  const activeSource = viewModel.sources.find((candidate) => candidate.id === source)
    ?? viewModel.sources[0];

  if (!activeSource) return null;

  return (
    <section className="gui-live-signals" aria-labelledby="gui-live-signals-title">
      <header className="gui-live-header">
        <div>
          <p className="eyebrow">Daily source refresh</p>
          <h2 id="gui-live-signals-title">Public activity signals</h2>
          <p>Distribution and repository activity in source-native units. These signals provide context, not quality or workflow-fit scores.</p>
        </div>
        {viewModel.observedAt && (
          <time dateTime={viewModel.observedAt}>Observed {viewModel.observedAt}</time>
        )}
      </header>

      <div className="gui-live-tabs" role="tablist" aria-label="GUI activity source">
        {viewModel.sources.map((candidate) => (
          <button
            type="button"
            role="tab"
            aria-selected={source === candidate.id}
            aria-controls="gui-live-panel"
            id={`gui-live-tab-${candidate.id}`}
            onClick={() => setSource(candidate.id)}
            key={candidate.id}
          >
            {candidate.tab}
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
          <h3>{activeSource.title}</h3>
          <strong>{activeSource.coverage}</strong>
        </header>
        <div className="gui-live-columns" aria-hidden="true">
          {activeSource.columns.map((column) => <span key={column}>{column}</span>)}
        </div>
        <SignalRows rows={activeSource.rows} />
        <footer>
          <p>{activeSource.note}</p>
          <a href={activeSource.href} target="_blank" rel="noreferrer">{activeSource.link}</a>
        </footer>
      </div>
    </section>
  );
}
