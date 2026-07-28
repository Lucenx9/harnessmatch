"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import {
  harnessRoleLabels,
  productLayerLabels,
  runtimePostureLabels,
} from "@/lib/harness-classification";
import type {
  FeatureKey,
  HarnessLogo as HarnessLogoData,
  HarnessRole,
  InterfaceType,
  IsolationMode,
  OrchestrationModel,
  ProductLayer,
  RuntimePosture,
  StateModel,
} from "@/lib/types";

type LensKey = "all" | FeatureKey;

export type LensHarness = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogoData;
  tagline: string;
  layer: ProductLayer;
  role: HarnessRole;
  orchestration: OrchestrationModel;
  runtime: RuntimePosture;
  isolation: IsolationMode[];
  state: StateModel;
  interfaces: InterfaceType[];
  providerStyle: "single-vendor" | "multi-provider" | "enterprise-routing";
  featureSupport: Record<FeatureKey, boolean>;
  evidenceCount: number;
  verifiedAt: string;
};

const lenses: Array<{ key: LensKey; label: string }> = [
  { key: "all", label: "All harnesses" },
  { key: "localModels", label: "Local models" },
  { key: "sandbox", label: "Security sandbox" },
  { key: "browser", label: "Browser tool" },
  { key: "checkpoints", label: "File rollback" },
  { key: "mcp", label: "MCP" },
];

const roleOptions = Object.entries(harnessRoleLabels) as Array<[HarnessRole, string]>;
const layerOptions = Object.entries(productLayerLabels) as Array<[ProductLayer, string]>;
const runtimeOptions = Object.entries(runtimePostureLabels) as Array<[RuntimePosture, string]>;
const interfaceLabels: Record<InterfaceType, string> = {
  terminal: "Terminal",
  ide: "IDE",
  web: "Web / desktop",
  automation: "Automation",
};
const interfaceOptions = Object.entries(interfaceLabels) as Array<[InterfaceType, string]>;

const providerLabels: Record<LensHarness["providerStyle"], string> = {
  "single-vendor": "Single vendor",
  "multi-provider": "Multi-provider",
  "enterprise-routing": "Enterprise routing",
};

export function HarnessLensExplorer({
  harnesses,
  initialVisibleCount = 8,
  cardHeadingLevel = 3,
}: {
  harnesses: LensHarness[];
  initialVisibleCount?: number;
  cardHeadingLevel?: 2 | 3;
}) {
  const CardHeading = `h${cardHeadingLevel}` as const;
  const [query, setQuery] = useState("");
  const [lens, setLens] = useState<LensKey>("all");
  const [catalogLayer, setCatalogLayer] = useState<ProductLayer | "all">("all");
  const [role, setRole] = useState<HarnessRole | "all">("all");
  const [surface, setSurface] = useState<InterfaceType | "all">("all");
  const [runtime, setRuntime] = useState<RuntimePosture | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = useMemo(
    () => harnesses.filter((harness) => (
      (!deferredQuery || [
        harness.name,
        harness.tagline,
        productLayerLabels[harness.layer],
        harnessRoleLabels[harness.role],
        harness.interfaces.map((item) => interfaceLabels[item]).join(" "),
        providerLabels[harness.providerStyle],
      ].some((value) => value.toLowerCase().includes(deferredQuery))) &&
      (lens === "all" || harness.featureSupport[lens]) &&
      (catalogLayer === "all" || harness.layer === catalogLayer) &&
      (role === "all" || harness.role === role) &&
      (surface === "all" || harness.interfaces.includes(surface)) &&
      (runtime === "all" || harness.runtime === runtime)
    )),
    [catalogLayer, deferredQuery, harnesses, lens, role, runtime, surface],
  );
  const hasAdvancedFilters = catalogLayer !== "all" || role !== "all" || surface !== "all" || runtime !== "all";
  const availableLayerOptions = layerOptions.filter(([value]) => (
    harnesses.some((harness) => harness.layer === value)
  ));
  const availableRuntimeOptions = runtimeOptions.filter(([value]) => (
    harnesses.some((harness) => harness.runtime === value)
  ));
  const visibleHarnesses = showAll ? filtered : filtered.slice(0, initialVisibleCount);

  return (
    <div className="lens-explorer">
      <div className="lens-search-row">
        <label>
          Search profiles
          <input
            type="search"
            value={query}
            placeholder="Name, layer, role, interface, or provider"
            onChange={(event) => {
              setQuery(event.target.value);
              setShowAll(false);
            }}
          />
        </label>
        <p className="lens-count" aria-live="polite">
          <strong>{filtered.length}</strong> active {filtered.length === 1 ? "profile" : "profiles"}
        </p>
      </div>
      <div className="lens-toolbar">
        <div className="lens-tabs" role="group" aria-label="Filter harnesses by capability">
          {lenses.map((item) => (
            <button
              type="button"
              key={item.key}
              aria-pressed={lens === item.key}
              onClick={() => {
                setLens(item.key);
                setShowAll(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <details className="lens-advanced">
        <summary>
          Advanced filters
          <span>{hasAdvancedFilters ? "Filters active" : "Layer, role, surface, and runtime"}</span>
        </summary>
        <div className="lens-advanced-grid">
          <label>
            Catalog layer
            <select value={catalogLayer} onChange={(event) => {
              setCatalogLayer(event.target.value as ProductLayer | "all");
              setShowAll(false);
            }}>
              <option value="all">All layers</option>
              {availableLayerOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
          <label>
            Product role
            <select value={role} onChange={(event) => {
              setRole(event.target.value as HarnessRole | "all");
              setShowAll(false);
            }}>
              <option value="all">All roles</option>
              {roleOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
          <label>
            Interaction surface
            <select value={surface} onChange={(event) => {
              setSurface(event.target.value as InterfaceType | "all");
              setShowAll(false);
            }}>
              <option value="all">All surfaces</option>
              {interfaceOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
          <label>
            Runtime posture
            <select value={runtime} onChange={(event) => {
              setRuntime(event.target.value as RuntimePosture | "all");
              setShowAll(false);
            }}>
              <option value="all">All runtime postures</option>
              {availableRuntimeOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
          <button
            className="lens-reset"
            type="button"
            disabled={!hasAdvancedFilters}
            onClick={() => {
              setCatalogLayer("all");
              setRole("all");
              setSurface("all");
              setRuntime("all");
              setShowAll(false);
            }}
          >
            Clear advanced filters
          </button>
        </div>
      </details>

      <div className="lens-grid">
        {visibleHarnesses.map((harness) => (
          <article className="lens-card" key={harness.id}>
            <div className="lens-card-head">
              <span>{productLayerLabels[harness.layer]}</span>
              <span>{harness.evidenceCount} first-party sources</span>
            </div>
            <div className="lens-card-title">
              <HarnessLogo logo={harness.logo} name={harness.name} />
              <CardHeading><Link href={`/harnesses/${harness.slug}`}>{harness.name}</Link></CardHeading>
            </div>
            <p>{harness.tagline}</p>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>{harnessRoleLabels[harness.role]}</dd>
              </div>
              <div>
                <dt>Interfaces</dt>
                <dd>{harness.interfaces.map((item) => interfaceLabels[item]).join(", ")}</dd>
              </div>
              <div>
                <dt>Model access</dt>
                <dd>{providerLabels[harness.providerStyle]}</dd>
              </div>
            </dl>
            <div className="lens-card-foot">
              <span>Checked {harness.verifiedAt}</span>
              <Link className="text-link" href={`/harnesses/${harness.slug}`}>View profile</Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="lens-empty card">
          <CardHeading>No profiles match these filters.</CardHeading>
          <p>Try a product name, remove a capability filter, or clear the advanced filters.</p>
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              setQuery("");
              setLens("all");
              setCatalogLayer("all");
              setRole("all");
              setSurface("all");
              setRuntime("all");
              setShowAll(false);
            }}
          >
            Clear all filters
          </button>
        </div>
      )}

      {filtered.length > initialVisibleCount && (
        <div className="lens-show-more">
          <button className="button secondary" type="button" onClick={() => setShowAll((current) => !current)}>
            {showAll ? "Show fewer profiles" : `Show all ${filtered.length} profiles`}
          </button>
        </div>
      )}

      <div className="lens-method-note">
        <p>Capability filters reflect explicit product documentation. They do not compare model intelligence or benchmark performance.</p>
        <Link className="text-link" href="/methodology">Read the methodology</Link>
      </div>
    </div>
  );
}
