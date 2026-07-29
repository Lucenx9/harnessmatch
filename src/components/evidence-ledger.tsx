"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HarnessLogo } from "@/components/harness-logo";
import {
  harnessRoleLabels,
  productLayerLabels,
} from "@/lib/harness-classification";
import type {
  Harness,
  HarnessLogo as HarnessLogoData,
  HarnessRole,
  ProductLayer,
} from "@/lib/types";

export type EvidenceLedgerRecord = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  logo: HarnessLogoData;
  status: Harness["status"];
  productLayer: ProductLayer | null;
  role: HarnessRole;
  license: string;
  verifiedAt: string;
  primarySourceCount: number;
  discoverySourceCount: number;
  searchText: string;
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

export function decodeHashFragment(hash: string) {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }
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
      record.searchText,
    ];
    return matchesStatus && (!deferredQuery || searchable.some((value) => value.toLowerCase().includes(deferredQuery)));
  }), [deferredQuery, records, status]);

  useEffect(() => {
    function openHashTarget() {
      const id = decodeHashFragment(window.location.hash);
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
                <span>{record.primarySourceCount} primary sources</span>
                <span>Checked {record.verifiedAt}</span>
              </span>
            </summary>
            <div className="evidence-record-body">
              <div className="evidence-product">
                <p>{productLayerLabelFor(record)}<br />{harnessRoleLabels[record.role]}<br />{record.license}</p>
                <a className="logo-source-link" href={record.logo.sourceUrl} target="_blank" rel="noreferrer">
                  Official logo source
                </a>
              </div>
              <div className="evidence-record-summary">
                <p>{record.summary}</p>
                <p>{record.primarySourceCount} first-party sources{record.discoverySourceCount > 0 ? ` and ${record.discoverySourceCount} discovery records` : ""} are indexed on the canonical product profile.</p>
                <Link className="button secondary" href={`/harnesses/${record.slug}#evidence`}>Inspect all sources</Link>
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
