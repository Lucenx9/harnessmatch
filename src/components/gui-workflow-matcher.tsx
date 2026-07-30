"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GuiLogo } from "@/components/gui-logo";
import { VisualIcon } from "@/components/visual-icon";
import { guiProducts, guiCapabilityLabels } from "@/data/gui-products";
import {
  guiRepositoryAuditFor,
} from "@/data/gui-repository-audits";
import {
  classifyGuiProducts,
  guiFitBandLabels,
  guiWorkflowById,
  guiWorkflows,
} from "@/lib/gui-fit";
import { namedHarnesses } from "@/lib/gui-harness-coverage";
import type {
  GuiFitBand,
  GuiPlatform,
  GuiProduct,
  GuiSourceAccess,
  GuiWorkflowId,
} from "@/lib/gui-types";

type WorkflowFilter = "any" | GuiWorkflowId;
type HarnessFilter = string;
type PlatformFilter = "any" | Extract<GuiPlatform, "macOS" | "Windows" | "Linux" | "Browser">;
type SourceFilter = "any" | "public-code" | "proprietary";

const layerLabels = {
  "harness-native": "Harness-native GUI",
  "multi-harness-workspace": "Multi-harness workspace",
} as const;

const sourceAccessLabels: Record<GuiSourceAccess, string> = {
  "open-source": "Open source",
  "source-available": "Source available",
  proprietary: "Proprietary",
};

const visibleFitBands: GuiFitBand[] = ["strong", "good", "conditional", "not-eligible"];
const harnessFilterOptions = [...new Set(
  guiProducts.flatMap((product) => namedHarnesses(product)),
)].sort((left, right) => left.localeCompare(right));

function matchesHarness(product: (typeof guiProducts)[number], filter: HarnessFilter) {
  if (filter === "any") return true;
  if (filter === "multi") return product.acceptsArbitraryCli || namedHarnesses(product).length > 1;
  return product.acceptsArbitraryCli || product.supportedHarnesses.includes(filter);
}

function matchesSource(access: GuiSourceAccess, filter: SourceFilter) {
  if (filter === "any") return true;
  if (filter === "public-code") return access !== "proprietary";
  return access === "proprietary";
}

function compactHarnesses(product: (typeof guiProducts)[number]) {
  if (product.acceptsArbitraryCli) return "Any CLI, with documented presets";
  const named = namedHarnesses(product);
  if (named.length <= 3) return named.join(", ");
  return `${named.slice(0, 2).join(", ")} + ${named.length - 2} more`;
}

export function GuiWorkflowMatcher() {
  const [workflowId, setWorkflowId] = useState<WorkflowFilter>("any");
  const [harnessFilter, setHarnessFilter] = useState<HarnessFilter>("any");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("any");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("any");
  const workflow = workflowId === "any" ? null : guiWorkflowById(workflowId);

  const filteredProducts = useMemo(() => (
    guiProducts.filter((product) => (
      product.status === "active"
      && matchesHarness(product, harnessFilter)
      && (platformFilter === "any" || product.platforms.includes(platformFilter))
      && matchesSource(product.sourceAccess, sourceFilter)
    )).sort((left, right) => left.name.localeCompare(right.name))
  ), [harnessFilter, platformFilter, sourceFilter]);

  const classifiedResults = useMemo(() => (
    workflow ? classifyGuiProducts(filteredProducts, workflow) : []
  ), [filteredProducts, workflow]);

  type DisplayResult = {
    product: GuiProduct;
    fitBand?: GuiFitBand;
    why?: string;
    watchOut?: string;
  };

  const resultGroups: Array<{ id: string; label: string; rows: DisplayResult[] }> = workflow
    ? visibleFitBands.map((band) => ({
      id: band,
      label: guiFitBandLabels[band],
      rows: classifiedResults.filter((result) => result.fitBand === band),
    }))
    : [{
      id: "catalog",
      label: "All documented interfaces",
      rows: filteredProducts.map((product) => ({ product })),
    }];

  return (
    <div className="gui-matcher" id="gui-workflow-matcher">
      <header className="gui-matcher-header">
        <div>
          <h2>Browse interfaces</h2>
          <p>Start from the complete catalog. Select a workflow only when you want evidence-backed fit groups.</p>
        </div>
      </header>

      <section className="gui-workflow-panel" aria-label="GUI catalog filters and results">
        <div className="gui-filters" role="group" aria-label="Filter GUI matches">
          <label>
            <span>Workflow</span>
            <select value={workflowId} onChange={(event) => setWorkflowId(event.target.value as WorkflowFilter)}>
              <option value="any">All workflows</option>
              {guiWorkflows.map((candidate) => (
                <option value={candidate.id} key={candidate.id}>{candidate.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Harness</span>
            <select value={harnessFilter} onChange={(event) => setHarnessFilter(event.target.value as HarnessFilter)}>
              <option value="any">Any harness</option>
              <option value="multi">Multiple harnesses</option>
              {harnessFilterOptions.map((harness) => (
                <option value={harness} key={harness}>{harness}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Platform</span>
            <select value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value as PlatformFilter)}>
              <option value="any">Any platform</option>
              <option value="macOS">macOS</option>
              <option value="Windows">Windows</option>
              <option value="Linux">Linux</option>
              <option value="Browser">Browser</option>
            </select>
          </label>
          <label>
            <span>Source access</span>
            <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value as SourceFilter)}>
              <option value="any">Any source model</option>
              <option value="public-code">Public code</option>
              <option value="proprietary">Proprietary</option>
            </select>
          </label>
          <p aria-live="polite"><strong>{filteredProducts.length}</strong> interface{filteredProducts.length === 1 ? "" : "s"} shown</p>
        </div>

        {workflow && (
          <div className="gui-criteria-row">
            <div>
              <VisualIcon name="required" />
              <span className="gui-criteria-copy">
                <span>Required evidence</span>
                <strong>{workflow.required.map((key) => guiCapabilityLabels[key]).join(" · ")}</strong>
              </span>
            </div>
            <div>
              <VisualIcon name="preferred" />
              <span className="gui-criteria-copy">
                <span>Preferred evidence</span>
                <strong>{workflow.preferred.map((key) => guiCapabilityLabels[key]).join(" · ")}</strong>
              </span>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="gui-empty">
            <strong>No GUI matches every selected filter.</strong>
            <p>Broaden the platform, harness, or source-access filter. Filters remove products; they do not lower evidence gates.</p>
          </div>
        )}

        <div className="gui-fit-groups">
          {resultGroups.map((group) => {
            const { rows } = group;
            if (rows.length === 0) return null;
            return (
              <section className={`gui-fit-group${group.id === "catalog" ? "" : ` gui-fit-group--${group.id}`}`} aria-labelledby={`gui-fit-${group.id}`} key={group.id}>
                <header>
                  <h3 id={`gui-fit-${group.id}`}>{group.label}</h3>
                  <span>{rows.length} product{rows.length === 1 ? "" : "s"} · alphabetical</span>
                </header>
                <div className="gui-result-list">
                  {rows.map((result) => {
                    const { product } = result;
                    const audit = guiRepositoryAuditFor(product.id);
                    const evidenceState = audit ? "Code inspected" : "Documented";
                    return (
                      <article className="gui-result" id={`gui-${product.id}`} key={product.id}>
                        <div className="gui-result-identity">
                          <Link href={`/guis/${product.id}`} aria-label={`${product.name} profile`}>
                            <GuiLogo logo={product.logo} name={product.name} />
                          </Link>
                          <div>
                            <div className="gui-result-title">
                              <h4><Link href={`/guis/${product.id}`}>{product.name}</Link></h4>
                              <span className={`gui-evidence-state${audit ? " gui-evidence-state--code" : ""}`}>{evidenceState}</span>
                            </div>
                            <p>{product.summary}</p>
                            <div className="gui-tags">
                              <span>{layerLabels[product.layer]}</span>
                              <span>{sourceAccessLabels[product.sourceAccess]}</span>
                              <span>{product.platforms.join(" · ")}</span>
                            </div>
                          </div>
                        </div>

                        <details className="gui-result-details">
                          <summary>{workflow ? "Fit details and evidence" : "Product details and evidence"}</summary>
                          <div className="gui-result-expanded">
                            <dl className="gui-result-readout">
                              <div>
                                <dt>{workflow ? "Why it fits" : "Best for"}</dt>
                                <dd>{workflow ? `${result.why ?? ""} ${product.bestFor}` : product.bestFor}</dd>
                              </div>
                              <div><dt>Check first</dt><dd>{workflow ? result.watchOut ?? product.limitation : product.limitation}</dd></div>
                              <div>
                                <dt>Harness coverage</dt>
                                <dd>
                                  {compactHarnesses(product)}
                                  <small>{product.harnessSupportNote}</small>
                                </dd>
                              </div>
                            </dl>

                            <div className="gui-evidence-body">
                              <section>
                                <h5>Capability claims</h5>
                                <ul>
                                  {Object.entries(product.capabilities).map(([key, claim]) => (
                                    <li key={key}>
                                      <span className={`gui-claim-state gui-claim-state--${claim.state}`}>{claim.state}</span>
                                      <div>
                                        <strong>{guiCapabilityLabels[key as keyof typeof guiCapabilityLabels]}</strong>
                                        <p>{claim.summary}</p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </section>
                              <section>
                                <h5>First-party sources</h5>
                                <ul className="gui-source-list">
                                  {product.evidence.map((evidence) => (
                                    <li key={evidence.url}>
                                      <a href={evidence.url} target="_blank" rel="noreferrer">{evidence.title}</a>
                                      <p>{evidence.covers}</p>
                                    </li>
                                  ))}
                                </ul>
                              </section>
                              {audit && (
                                <section className="gui-code-audit">
                                  <h5>Code audit</h5>
                                  <p>Inspected commit <a href={`${audit.repositoryUrl}/tree/${audit.inspectedRef}`} target="_blank" rel="noreferrer"><code>{audit.inspectedRef.slice(0, 12)}</code></a>.</p>
                                  <ul>
                                    {audit.established.map((finding) => <li key={finding}>{finding}</li>)}
                                  </ul>
                                  <details>
                                    <summary>Inspected paths</summary>
                                    <ul>{audit.inspectedPaths.map((path) => <li key={path}><code>{path}</code></li>)}</ul>
                                  </details>
                                  <p className="gui-audit-limitation">{audit.limitation}</p>
                                </section>
                              )}
                            </div>
                          </div>
                        </details>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
