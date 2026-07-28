"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { GuiLogo } from "@/components/gui-logo";
import type {
  GuiEvidenceSource,
  GuiLayer,
  GuiLogo as GuiLogoData,
  GuiPlatform,
  GuiRepositoryAudit,
  GuiSourceAccess,
} from "@/lib/gui-types";

export type GuiEvidenceLedgerRecord = {
  id: string;
  name: string;
  summary: string;
  logo: GuiLogoData;
  status: "active" | "dormant" | "archived";
  layer: GuiLayer;
  sourceAccess: GuiSourceAccess;
  license: string;
  platforms: GuiPlatform[];
  supportedHarnesses: string[];
  acceptsArbitraryCli: boolean;
  verifiedAt: string;
  evidence: GuiEvidenceSource[];
  preview?: {
    caption: string;
    provenance: "official-media" | "editorial-capture";
    sourceUrl: string;
    verifiedAt: string;
  };
  audit?: Pick<GuiRepositoryAudit, "repositoryUrl" | "inspectedRef" | "sourceScope" | "verifiedAt">;
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

const evidenceKindLabels: Record<GuiEvidenceSource["kind"], string> = {
  "official-docs": "official docs",
  "official-repository": "official repository",
  "official-announcement": "official announcement",
};

function evidenceRecordCount(record: GuiEvidenceLedgerRecord) {
  return record.evidence.length + (record.preview ? 1 : 0) + (record.audit ? 1 : 0);
}

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
      ...record.platforms,
      ...record.supportedHarnesses,
      ...record.evidence.flatMap((source) => [source.title, source.covers]),
      ...(record.preview ? [record.preview.caption, record.preview.provenance] : []),
    ];
    return matchesLayer && (!deferredQuery || searchable.some((value) => value.toLowerCase().includes(deferredQuery)));
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
                <span>{evidenceRecordCount(record)} evidence records</span>
                <span>Checked {record.verifiedAt}</span>
              </span>
            </summary>

            <div className="evidence-record-body">
              <div className="evidence-product">
                <p>
                  {layerLabels[record.layer]}<br />
                  {sourceAccessLabels[record.sourceAccess]}<br />
                  {record.platforms.join(", ")}<br />
                  {record.supportedHarnesses.length} named harnesses<br />
                  {record.acceptsArbitraryCli ? "Arbitrary CLI documented" : "Named integrations only"}<br />
                  {record.license}
                </p>
                <div className="evidence-product-links">
                  <Link className="logo-source-link" href={`/guis/${record.id}`}>Open GUI profile</Link>
                  <a className="logo-source-link" href={record.logo.sourceUrl} target="_blank" rel="noreferrer">Official logo source</a>
                </div>
              </div>

              <div className="evidence-list">
                {record.evidence.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    <span>
                      <strong>{source.title}</strong>
                      <small>{source.covers}</small>
                    </span>
                    <span className="evidence-kind">{evidenceKindLabels[source.kind]}</span>
                  </a>
                ))}
                {record.preview && (
                  <a href={record.preview.sourceUrl} target="_blank" rel="noreferrer">
                    <span>
                      <strong>Product preview provenance</strong>
                      <small>{record.preview.caption}</small>
                    </span>
                    <span className="evidence-kind">{record.preview.provenance.replace("-", " ")}</span>
                  </a>
                )}
                {record.audit && (
                  <a href={`${record.audit.repositoryUrl}/tree/${record.audit.inspectedRef}`} target="_blank" rel="noreferrer">
                    <span>
                      <strong>Pinned implementation audit</strong>
                      <small>Repository inspected at commit {record.audit.inspectedRef.slice(0, 12)}.</small>
                    </span>
                    <span className="evidence-kind">{record.audit.sourceScope.replace("-", " ")}</span>
                  </a>
                )}
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
