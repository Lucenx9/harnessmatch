"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import { FeatureClaimValue } from "@/components/feature-claim-value";
import type { CompareHarnessRecord } from "@/lib/compare-types";
import type { FeatureKey } from "@/lib/types";

const DEFAULT_SELECTED = ["claude-code", "codex", "opencode"];

const featureRows: Array<[FeatureKey, string]> = [
  ["mcp", "MCP"],
  ["localModels", "Local models"],
  ["subagents", "Agent parallelism"],
  ["headless", "Headless"],
  ["browser", "Browser tool"],
  ["sandbox", "Security sandbox"],
  ["checkpoints", "File rollback / restore"],
];
const practicalFeatureKeys = new Set<FeatureKey>(["localModels", "subagents", "headless", "sandbox", "checkpoints"]);
const practicalFeatureRows = featureRows.filter(([feature]) => practicalFeatureKeys.has(feature));
const technicalFeatureRows = featureRows.filter(([feature]) => !practicalFeatureKeys.has(feature));

export function CompareClient({ harnesses }: { harnesses: CompareHarnessRecord[] }) {
  const activeHarnessIds = useMemo(() => new Set(harnesses.map((harness) => harness.id)), [harnesses]);
  const [selected, setSelected] = useState(DEFAULT_SELECTED);
  const [query, setQuery] = useState("");
  const [urlReady, setUrlReady] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const pickerDialogRef = useRef<HTMLDialogElement>(null);
  const chosen = useMemo(
    () => selected
      .map((id) => harnesses.find((harness) => harness.id === id))
      .filter((harness): harness is CompareHarnessRecord => Boolean(harness)),
    [harnesses, selected],
  );
  const filteredHarnesses = useMemo(() => {
    if (!deferredQuery) return harnesses;
    return harnesses.filter((harness) => [
      harness.name,
      harness.tagline,
      harness.productRole,
    ].some((value) => value.toLowerCase().includes(deferredQuery)));
  }, [deferredQuery, harnesses]);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search)
      .get("ids")
      ?.split(",")
      .filter((id) => activeHarnessIds.has(id))
      .slice(0, 4);

    if (requested?.length) setSelected(requested);
    setUrlReady(true);
  }, [activeHarnessIds]);

  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    url.searchParams.set("ids", selected.join(","));
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [selected, urlReady]);

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  }

  function renderPicker(inputId: string) {
    return (
      <>
        <label className="picker-search" htmlFor={inputId}>
          Search harnesses
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, role, or workflow"
          />
        </label>
        <div className="picker-result-count" aria-live="polite">
          {filteredHarnesses.length} {filteredHarnesses.length === 1 ? "match" : "matches"}, {selected.length} of 4 selected
        </div>
        <div className="picker-list">
          {filteredHarnesses.map((harness) => (
            <label key={harness.id} className="picker-row">
              <input
                type="checkbox"
                checked={selected.includes(harness.id)}
                onChange={() => toggle(harness.id)}
                disabled={!selected.includes(harness.id) && selected.length >= 4}
              />
              <HarnessLogo logo={harness.logo} name={harness.name} size="small" />
              <span className="picker-copy">
                <strong>{harness.name}</strong>
                <small>{harness.productRole}</small>
              </span>
            </label>
          ))}
          {filteredHarnesses.length === 0 && (
            <div className="picker-empty">
              <strong>No matching harnesses</strong>
              <span>Try a product name such as Codex, Aider, or OpenCode.</span>
              <button type="button" className="text-button" onClick={() => setQuery("")}>Clear search</button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="compare-selection-summary">
        <div>
          <span className="mono-label">Comparing</span>
          <div className="compare-selected-list" aria-live="polite">
            {chosen.map((harness) => (
              <button
                type="button"
                key={harness.id}
                onClick={() => toggle(harness.id)}
                aria-label={`Remove ${harness.name} from comparison`}
              >
                <HarnessLogo logo={harness.logo} name={harness.name} size="small" />
                <span>{harness.name}</span>
                <span aria-hidden="true">Remove</span>
              </button>
            ))}
          </div>
        </div>
        <div className="compare-summary-actions">
          <button className="button secondary compare-picker-button" type="button" onClick={() => pickerDialogRef.current?.showModal()}>
            Change harnesses ({selected.length}/4)
          </button>
          <button
            className="button ghost"
            type="button"
            aria-pressed={showTechnical}
            onClick={() => setShowTechnical((current) => !current)}
          >
            {showTechnical ? "Hide technical rows" : "Show technical rows"}
          </button>
        </div>
      </div>

      <div className="compare-layout compare-layout-simple">
        {chosen.length === 0 ? (
          <div className="compare-empty card">
            <h2>Choose at least one harness</h2>
            <p>Open the selector and add up to four products to inspect their architecture and evidence side by side.</p>
            <button className="button primary" type="button" onClick={() => pickerDialogRef.current?.showModal()}>Choose harnesses</button>
          </div>
        ) : (
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the focusable region lets keyboard users scroll the wide table
          <section className="comparison-scroll" tabIndex={0} aria-label="Harness comparison table">
        <table className="comparison-table">
          <caption>
            {showTechnical
              ? "Practical and technical comparison. Model capability remains separate."
              : "Practical comparison. Open technical rows for the complete architecture and evidence matrix."}
          </caption>
          <thead>
            <tr>
              <th>Dimension</th>
              {chosen.map((harness) => (
                <th key={harness.id}>
                  <div className="comparison-brand">
                    <HarnessLogo logo={harness.logo} name={harness.name} />
                    <span>{harness.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Best fit</th>
              {chosen.map((harness) => <td key={harness.id}>{harness.bestFit}</td>)}
            </tr>
            <tr>
              <th>Interaction surfaces</th>
              {chosen.map((harness) => (
                <td key={harness.id}>{harness.interfaces}</td>
              ))}
            </tr>
            <tr>
              <th>Approval style</th>
              {chosen.map((harness) => (
                <td key={harness.id}>{harness.approvalStyle}</td>
              ))}
            </tr>
            <tr>
              <th>Model portability</th>
              {chosen.map((harness) => <td key={harness.id}>{harness.modelPortability}</td>)}
            </tr>
            {practicalFeatureRows.map(([feature, label]) => (
              <tr key={feature}>
                <th>{label}</th>
                {chosen.map((harness) => (
                  <td key={harness.id}><FeatureClaimValue claim={harness.featureClaims[feature]} /></td>
                ))}
              </tr>
            ))}
            <tr>
              <th>Admitted measured configuration</th>
              {chosen.map((harness) => {
                const runs = harness.measuredRuns;
                return (
                  <td key={harness.id}>
                    {runs.length === 0 ? "No admitted run" : runs.map((run) => (
                      <span className="comparison-measured-run" key={run.id}>
                        <strong>{run.accuracy.toFixed(2)}% ± {run.standardError.toFixed(2)}</strong>
                        <small>{run.model}, harness {run.harnessVersion}</small>
                      </span>
                    ))}
                  </td>
                );
              })}
            </tr>
            <tr>
              <th>Main trade-off</th>
              {chosen.map((harness) => <td key={harness.id}>{harness.mainTradeoff}</td>)}
            </tr>
            {showTechnical && (
              <>
                <tr className="comparison-group-row">
                  <th colSpan={chosen.length + 1}>Technical classification and evidence</th>
                </tr>
                <tr>
                  <th>Catalog layer</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.catalogLayer}</td>)}
                </tr>
                <tr>
                  <th>Harness membership</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.membershipSummary}</td>)}
                </tr>
                <tr>
                  <th>Product role</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.productRole}</td>)}
                </tr>
                <tr>
                  <th>Agent organization</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.orchestration}</td>)}
                </tr>
                <tr>
                  <th>Runtime posture</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.runtimePosture}</td>)}
                </tr>
                <tr>
                  <th>Isolation options</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.isolation}</td>)}
                </tr>
                <tr>
                  <th>State model</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.stateModel}</td>)}
                </tr>
                <tr>
                  <th>Context lifecycle</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.contextLifecycle}</td>)}
                </tr>
                <tr>
                  <th>Verification</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.verification}</td>)}
                </tr>
                <tr>
                  <th>Observability</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.observability}</td>)}
                </tr>
                <tr>
                  <th>Recovery posture</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.recovery}</td>)}
                </tr>
                <tr>
                  <th>Provider posture</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.providerPosture}</td>)}
                </tr>
                <tr>
                  <th>License</th>
                  {chosen.map((harness) => <td key={harness.id}>{harness.license}</td>)}
                </tr>
                {technicalFeatureRows.map(([feature, label]) => (
                  <tr key={feature}>
                    <th>{label}</th>
                    {chosen.map((harness) => (
                      <td key={harness.id}><FeatureClaimValue claim={harness.featureClaims[feature]} /></td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th>Architecture evidence</th>
                  {chosen.map((harness) => <td key={harness.id}><strong>{harness.documentedArchitectureLayers}/7 layers</strong><br /><small>No aggregate product grade</small></td>)}
                </tr>
                <tr>
                  <th>Public code auditability</th>
                  {chosen.map((harness) => {
                    const audit = harness.repositoryAudit;
                    return <td key={harness.id}>{audit?.artifactCount === null || !audit ? "Not publicly auditable" : <><strong>{audit.artifactCount}/5 artifacts</strong><br /><small>Commit {audit.inspectedRef}</small></>}</td>;
                  })}
                </tr>
              </>
            )}
          </tbody>
        </table>
          </section>
        )}
      </div>

      <dialog className="dialog-surface compare-picker-dialog" ref={pickerDialogRef} aria-labelledby="compare-picker-dialog-title">
        <div className="compare-picker-dialog-shell">
          <div className="compare-picker-dialog-head">
            <div>
              <h2 id="compare-picker-dialog-title">Choose up to four harnesses</h2>
            </div>
            <button className="button ghost" type="button" onClick={() => pickerDialogRef.current?.close()}>Close</button>
          </div>
          {renderPicker("compare-dialog-search")}
          <button className="button primary compare-picker-done" type="button" onClick={() => pickerDialogRef.current?.close()}>
            Compare {selected.length} {selected.length === 1 ? "harness" : "harnesses"}
          </button>
        </div>
      </dialog>
    </>
  );
}
