"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { GuiLogo } from "@/components/gui-logo";
import { VisualIcon } from "@/components/visual-icon";
import type { VisualIconName } from "@/components/visual-icon";
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
import type {
  GuiFitBand,
  GuiPlatform,
  GuiSourceAccess,
  GuiWorkflowId,
} from "@/lib/gui-types";

type HarnessFilter = string;
type PlatformFilter = "any" | Extract<GuiPlatform, "macOS" | "Windows" | "Linux" | "Browser">;
type SourceFilter = "any" | "public-code" | "proprietary";

const workflowIcons: Record<GuiWorkflowId, VisualIconName> = {
  "focused-review": "focused-review",
  "parallel-local": "parallel-local",
  "remote-control": "remote-control",
  "team-workspace": "team-workspace",
};

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
  guiProducts.flatMap((product) => product.supportedHarnesses),
)]
  .filter((harness) => harness !== "Custom CLI")
  .sort((left, right) => left.localeCompare(right));

function matchesHarness(product: (typeof guiProducts)[number], filter: HarnessFilter) {
  if (filter === "any") return true;
  if (filter === "multi") return product.acceptsArbitraryCli || product.supportedHarnesses.length > 1;
  return product.acceptsArbitraryCli || product.supportedHarnesses.includes(filter);
}

function matchesSource(access: GuiSourceAccess, filter: SourceFilter) {
  if (filter === "any") return true;
  if (filter === "public-code") return access !== "proprietary";
  return access === "proprietary";
}

function compactHarnesses(product: (typeof guiProducts)[number]) {
  if (product.acceptsArbitraryCli) return "Any CLI, with documented presets";
  if (product.supportedHarnesses.length <= 3) return product.supportedHarnesses.join(", ");
  return `${product.supportedHarnesses.slice(0, 2).join(", ")} + ${product.supportedHarnesses.length - 2} more`;
}

export function GuiWorkflowMatcher() {
  const [workflowId, setWorkflowId] = useState<GuiWorkflowId>("parallel-local");
  const [harnessFilter, setHarnessFilter] = useState<HarnessFilter>("any");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("any");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("any");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const workflow = guiWorkflowById(workflowId);

  const results = useMemo(() => {
    const filtered = guiProducts.filter((product) => (
      product.status === "active"
      && matchesHarness(product, harnessFilter)
      && (platformFilter === "any" || product.platforms.includes(platformFilter))
      && matchesSource(product.sourceAccess, sourceFilter)
    ));
    return classifyGuiProducts(filtered, workflow);
  }, [harnessFilter, platformFilter, sourceFilter, workflow]);

  const selectWorkflow = (index: number) => {
    const next = guiWorkflows[index];
    if (!next) return;
    setWorkflowId(next.id);
    tabRefs.current[index]?.focus();
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectWorkflow((index + 1) % guiWorkflows.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectWorkflow((index - 1 + guiWorkflows.length) % guiWorkflows.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectWorkflow(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectWorkflow(guiWorkflows.length - 1);
    }
  };

  return (
    <div className="gui-matcher">
      <header className="gui-matcher-header">
        <div>
          <p className="eyebrow">Workflow classification</p>
          <h2>GUI fit by workflow</h2>
          <p>Select a workflow to group products by documented required and preferred mechanisms. There is no overall score; products are alphabetical within each group.</p>
        </div>
        <dl aria-label="GUI classification rules">
          <div><dt>Required</dt><dd>Evidence gates</dd></div>
          <div><dt>Preferred</dt><dd>Strong vs good</dd></div>
          <div><dt>Unknown</dt><dd>Conditional</dd></div>
        </dl>
      </header>

      <div className="gui-workflow-tabs" role="tablist" aria-label="GUI workflows">
        {guiWorkflows.map((candidate, index) => (
          <button
            type="button"
            role="tab"
            id={`gui-workflow-tab-${candidate.id}`}
            aria-controls="gui-workflow-panel"
            aria-selected={workflow.id === candidate.id}
            tabIndex={workflow.id === candidate.id ? 0 : -1}
            key={candidate.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            onClick={() => setWorkflowId(candidate.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            <VisualIcon name={workflowIcons[candidate.id]} />
            <span className="gui-workflow-tab-copy">
              <strong>{candidate.label}</strong>
              <span>{candidate.description}</span>
            </span>
          </button>
        ))}
      </div>

      <section
        className="gui-workflow-panel"
        id="gui-workflow-panel"
        role="tabpanel"
        aria-labelledby={`gui-workflow-tab-${workflow.id}`}
      >
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

        <div className="gui-filters" role="group" aria-label="Filter GUI matches">
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
          <p aria-live="polite"><strong>{results.length}</strong> matching GUI{results.length === 1 ? "" : "s"}</p>
        </div>

        {results.length === 0 && (
          <div className="gui-empty">
            <strong>No GUI matches every selected filter.</strong>
            <p>Broaden the platform, harness, or source-access filter. Filters remove products; they do not lower evidence gates.</p>
          </div>
        )}

        <div className="gui-fit-groups">
          {visibleFitBands.map((band) => {
            const rows = results.filter((result) => result.fitBand === band);
            if (rows.length === 0) return null;
            return (
              <section className={`gui-fit-group gui-fit-group--${band}`} aria-labelledby={`gui-fit-${band}`} key={band}>
                <header>
                  <h3 id={`gui-fit-${band}`}>{guiFitBandLabels[band]}</h3>
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

                        <dl className="gui-result-readout">
                          <div><dt>Why it fits</dt><dd>{result.why} {product.bestFor}</dd></div>
                          <div><dt>Check first</dt><dd>{result.watchOut}</dd></div>
                          <div>
                            <dt>Harness coverage</dt>
                            <dd>
                              {compactHarnesses(product)}
                              <small>{product.harnessSupportNote}</small>
                            </dd>
                          </div>
                        </dl>

                        <details className="gui-evidence-details">
                          <summary>Evidence and implementation record</summary>
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
