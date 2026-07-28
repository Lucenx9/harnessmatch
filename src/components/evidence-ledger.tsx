"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import {
  formatIsolationModes,
  harnessRoleLabels,
  orchestrationLabels,
  productLayerLabels,
  runtimePostureLabels,
  stateModelLabels,
} from "@/lib/harness-classification";
import type {
  DiscoverySource,
  EvidenceSource,
  Harness,
  HarnessLogo as HarnessLogoData,
  HarnessRole,
  IsolationMode,
  OrchestrationModel,
  ProductLayer,
  RuntimePosture,
  StateModel,
} from "@/lib/types";

export type EvidenceLedgerRecord = {
  id: string;
  name: string;
  summary: string;
  logo: HarnessLogoData;
  status: Harness["status"];
  productLayer: ProductLayer | null;
  role: HarnessRole;
  orchestration: OrchestrationModel;
  runtime: RuntimePosture;
  isolation: IsolationMode[];
  state: StateModel;
  license: string;
  verifiedAt: string;
  evidence: Array<Pick<EvidenceSource, "title" | "url" | "covers" | "kind">>;
  discovery?: Array<Pick<DiscoverySource, "title" | "url" | "note">>;
};

type StatusFilter = EvidenceLedgerRecord["status"] | "all";

const statusFilterLabels: Record<StatusFilter, string> = {
  all: "all statuses",
  active: "active",
  dormant: "dormant",
  archived: "archived",
};

function productLayerLabelFor(record: EvidenceLedgerRecord) {
  return record.productLayer ? productLayerLabels[record.productLayer] : "Not assessed";
}

export function EvidenceLedger({ records }: { records: EvidenceLedgerRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = useMemo(() => records.filter((record) => {
    const matchesStatus = status === "all" || record.status === status;
    const searchable = [
      record.name,
      record.summary,
      productLayerLabelFor(record),
      harnessRoleLabels[record.role],
      ...record.evidence.flatMap((source) => [source.title, source.covers]),
      ...(record.discovery?.flatMap((source) => [source.title, source.note]) ?? []),
    ];
    return matchesStatus && (!deferredQuery || searchable.some((value) => value.toLowerCase().includes(deferredQuery)));
  }), [deferredQuery, records, status]);

  useEffect(() => {
    function openHashTarget() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) target.open = true;
    }

    openHashTarget();
    window.addEventListener("hashchange", openHashTarget);
    return () => window.removeEventListener("hashchange", openHashTarget);
  }, []);

  return (
    <>
      <div className="evidence-ledger-controls">
        <label>
          Search evidence
          <input
            type="search"
            value={query}
            placeholder="Product, capability, or source"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Product status
          <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="dormant">Dormant</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <p aria-live="polite"><strong>{filtered.length}</strong> of {records.length} {records.length === 1 ? "product" : "products"}, {statusFilterLabels[status]}</p>
      </div>

      <div className="evidence-ledger">
        {filtered.map((record) => (
          <details className="evidence-record" id={record.id} key={record.id}>
            <summary>
              <span className="evidence-record-title">
                <HarnessLogo logo={record.logo} name={record.name} />
                <span>
                  <strong>{record.name}</strong>
                  <small>{productLayerLabelFor(record)}; {harnessRoleLabels[record.role]}</small>
                </span>
              </span>
              <span className="evidence-record-meta">
                <span className={`status ${record.status}`}>{record.status}</span>
                <span>{record.evidence.length} primary sources</span>
                <span>Checked {record.verifiedAt}</span>
              </span>
            </summary>
            <div className="evidence-record-body">
              <div className="evidence-product">
                <p>
                  {productLayerLabelFor(record)}<br />
                  {harnessRoleLabels[record.role]}<br />
                  {orchestrationLabels[record.orchestration]}<br />
                  {runtimePostureLabels[record.runtime]}<br />
                  {formatIsolationModes(record.isolation)}<br />
                  {stateModelLabels[record.state]}<br />
                  {record.license}
                </p>
                <a className="logo-source-link" href={record.logo.sourceUrl} target="_blank" rel="noreferrer">
                  Official logo source
                </a>
              </div>
              <div className="evidence-list">
                {record.evidence.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    <span>
                      <strong>{source.title}</strong>
                      <small>{source.covers}</small>
                    </span>
                    <span className="evidence-kind">{source.kind.replace("official-", "")}</span>
                  </a>
                ))}
                {record.discovery?.map((source) => (
                  <a className="discovery-source" href={source.url} target="_blank" rel="noreferrer" key={`${record.id}-${source.url}`}>
                    <span>
                      <strong>{source.title}</strong>
                      <small>{source.note}</small>
                    </span>
                    <span className="evidence-kind">discovery</span>
                  </a>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="evidence-ledger-empty card">
          <h2>No evidence records match.</h2>
          <p>Try a product name or capability, or include every product status.</p>
          <button className="button secondary" type="button" onClick={() => {
            setQuery("");
            setStatus("all");
          }}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
