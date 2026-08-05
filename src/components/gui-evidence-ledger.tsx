"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { GuiLogo } from "@/components/gui-logo";
import type {
  GuiLayer,
  GuiLogo as GuiLogoData,
  GuiSourceAccess,
} from "@/lib/gui-types";
import { matchesCompactSearchTerms } from "@/lib/search";

export type GuiEvidenceLedgerRecord = {
  id: string;
  name: string;
  summary: string;
  logo: GuiLogoData;
  status: "active" | "dormant" | "archived";
  layer: GuiLayer;
  sourceAccess: GuiSourceAccess;
  license: string;
  verifiedAt: string;
  evidenceRecordCount: number;
  searchText: string;
};

type LayerFilter = GuiLayer | "all";

const layerLabels: Record<GuiLayer, string> = {
  "harness-native": "Harness-native GUI",
  "multi-harness-workspace": "Multi-harness workspace",
};

const sourceAccessLabels: Record<GuiSourceAccess, string> = {
  "open-source": "Open source",
  "source-available": "Source available",
  proprietary: "Proprietary",
};

export function GuiEvidenceLedger({ records }: { records: GuiEvidenceLedgerRecord[] }) {
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<LayerFilter>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = useMemo(() => records.filter((record) => {
    const matchesLayer = layer === "all" || record.layer === layer;
    const searchable = [
      record.name,
      record.summary,
      layerLabels[record.layer],
      sourceAccessLabels[record.sourceAccess],
      record.license,
      record.searchText,
    ];
    const matchesRawQuery = searchable.some((value) => value.toLowerCase().includes(deferredQuery));
    return matchesLayer && (
      !deferredQuery
      || matchesRawQuery
      || matchesCompactSearchTerms(searchable, deferredQuery)
    );
  }), [deferredQuery, layer, records]);

  return (
    <>
      <div className="evidence-ledger-controls">
        <label>
          Search GUI evidence
          <input
            type="search"
            value={query}
            placeholder="GUI, harness, platform, or source"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          GUI layer
          <select value={layer} onChange={(event) => setLayer(event.target.value as LayerFilter)}>
            <option value="all">All GUI layers</option>
            <option value="harness-native">Harness-native GUIs</option>
            <option value="multi-harness-workspace">Multi-harness workspaces</option>
          </select>
        </label>
        <p aria-live="polite"><strong>{filtered.length}</strong> of {records.length} GUI records</p>
      </div>

      <div className="evidence-ledger">
        {filtered.map((record) => (
          <details className="evidence-record" id={`gui-${record.id}`} key={record.id}>
            <summary>
              <span className="evidence-record-title">
                <GuiLogo logo={record.logo} name={record.name} />
                <span>
                  <strong>{record.name}</strong>
                  <small>{layerLabels[record.layer]}; {sourceAccessLabels[record.sourceAccess]}</small>
                </span>
              </span>
              <span className="evidence-record-meta">
                <span className={`status ${record.status}`}>{record.status}</span>
                <span>{record.evidenceRecordCount} evidence records</span>
                <span>Checked {record.verifiedAt}</span>
              </span>
            </summary>

            <div className="evidence-record-body">
              <div className="evidence-product">
                <p>{layerLabels[record.layer]}<br />{sourceAccessLabels[record.sourceAccess]}<br />{record.license}</p>
                <div className="evidence-product-links">
                  <Link className="logo-source-link" href={`/guis/${record.id}`}>Open GUI profile</Link>
                  <a className="logo-source-link" href={record.logo.sourceUrl} target="_blank" rel="noreferrer">Official logo source</a>
                </div>
              </div>

              <div className="evidence-record-summary">
                <p>{record.summary}</p>
                <p>{record.evidenceRecordCount} source, preview, and code-audit records are indexed on the canonical GUI profile.</p>
                <Link className="button secondary" href={`/guis/${record.id}#evidence`}>Inspect all sources</Link>
              </div>
            </div>
          </details>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="evidence-ledger-empty card">
          <h2>No GUI evidence records match.</h2>
          <p>Try a GUI name, supported harness, platform, or include both GUI layers.</p>
          <button className="button secondary" type="button" onClick={() => {
            setQuery("");
            setLayer("all");
          }}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
