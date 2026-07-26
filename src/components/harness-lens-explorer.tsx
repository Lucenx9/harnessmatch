"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import {
  executionBoundaryLabels,
  harnessRoleLabels,
  orchestrationLabels,
} from "@/lib/harness-classification";
import type {
  ExecutionBoundary,
  FeatureKey,
  HarnessLogo as HarnessLogoData,
  HarnessRole,
  InterfaceType,
  OrchestrationModel,
} from "@/lib/types";

type LensKey = "all" | FeatureKey;

export type LensHarness = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogoData;
  tagline: string;
  role: HarnessRole;
  orchestration: OrchestrationModel;
  execution: ExecutionBoundary;
  interfaces: InterfaceType[];
  providerStyle: "single-vendor" | "multi-provider" | "enterprise-routing";
  features: Record<FeatureKey, boolean>;
  evidenceCount: number;
  verifiedAt: string;
};

const lenses: Array<{ key: LensKey; label: string }> = [
  { key: "all", label: "All harnesses" },
  { key: "localModels", label: "Local models" },
  { key: "sandbox", label: "Built-in sandbox" },
  { key: "browser", label: "Browser work" },
  { key: "checkpoints", label: "Checkpoints" },
  { key: "mcp", label: "MCP" },
];

const providerLabels: Record<LensHarness["providerStyle"], string> = {
  "single-vendor": "Single vendor",
  "multi-provider": "Multi-provider",
  "enterprise-routing": "Enterprise routing",
};

export function HarnessLensExplorer({ harnesses }: { harnesses: LensHarness[] }) {
  const [lens, setLens] = useState<LensKey>("all");
  const filtered = useMemo(
    () => lens === "all" ? harnesses : harnesses.filter((harness) => harness.features[lens]),
    [harnesses, lens],
  );

  return (
    <div className="lens-explorer">
      <div className="lens-toolbar">
        <div className="lens-tabs" role="group" aria-label="Filter harnesses by capability">
          {lenses.map((item) => (
            <button
              type="button"
              key={item.key}
              aria-pressed={lens === item.key}
              onClick={() => setLens(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="lens-count" aria-live="polite">
          <strong>{filtered.length}</strong> matching {filtered.length === 1 ? "profile" : "profiles"}
        </p>
      </div>

      <div className="lens-grid">
        {filtered.map((harness) => (
          <article className="lens-card" key={harness.id}>
            <div className="lens-card-head">
              <span>{harnessRoleLabels[harness.role]}</span>
              <span>{harness.evidenceCount} first-party sources</span>
            </div>
            <div className="lens-card-title">
              <HarnessLogo logo={harness.logo} name={harness.name} />
              <h3><Link href={`/harnesses/${harness.slug}`}>{harness.name}</Link></h3>
            </div>
            <p>{harness.tagline}</p>
            <dl>
              <div>
                <dt>Agents</dt>
                <dd>{orchestrationLabels[harness.orchestration]}</dd>
              </div>
              <div>
                <dt>Runtime</dt>
                <dd>{executionBoundaryLabels[harness.execution]}</dd>
              </div>
              <div>
                <dt>Provider</dt>
                <dd>{providerLabels[harness.providerStyle]}</dd>
              </div>
              <div>
                <dt>Interfaces</dt>
                <dd>{harness.interfaces.join(", ")}</dd>
              </div>
            </dl>
            <div className="lens-card-foot">
              <span>Checked {harness.verifiedAt}</span>
              <Link className="text-link" href={`/harnesses/${harness.slug}`}>View profile</Link>
            </div>
          </article>
        ))}
      </div>

      <div className="lens-method-note">
        <p>Capability filters reflect explicit product documentation. They do not compare model intelligence or benchmark performance.</p>
        <Link className="text-link" href="/methodology">Read the methodology</Link>
      </div>
    </div>
  );
}
