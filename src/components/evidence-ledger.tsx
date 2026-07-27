"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import {
  formatIsolationModes,
  harnessRoleLabels,
  orchestrationLabels,
  runtimePostureLabels,
  stateModelLabels,
} from "@/lib/harness-classification";
import type { Harness } from "@/lib/types";

type StatusFilter = Harness["status"] | "all";

export function EvidenceLedger({ records }: { records: Harness[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = useMemo(() => records.filter((record) => {
    const matchesStatus = status === "all" || record.status === status;
    const searchable = [
      record.name,
      record.summary,
      harnessRoleLabels[record.classification.role],
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
        <p aria-live="polite"><strong>{filtered.length}</strong> matching {filtered.length === 1 ? "product" : "products"}</p>
      </div>

      <div className="evidence-ledger">
        {filtered.map((record) => (
          <details className="evidence-record" id={record.id} key={record.id}>
            <summary>
              <span className="evidence-record-title">
                <HarnessLogo logo={record.logo} name={record.name} />
                <span>
                  <strong>{record.name}</strong>
                  <small>{harnessRoleLabels[record.classification.role]}</small>
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
                  {harnessRoleLabels[record.classification.role]}<br />
                  {orchestrationLabels[record.classification.orchestration]}<br />
                  {runtimePostureLabels[record.classification.runtime]}<br />
                  {formatIsolationModes(record.classification.isolation)}<br />
                  {stateModelLabels[record.classification.state]}<br />
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
