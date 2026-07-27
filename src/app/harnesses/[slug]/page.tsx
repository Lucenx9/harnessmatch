import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HarnessLogo } from "@/components/harness-logo";
import { benchmarkRunsForHarness } from "@/data/benchmark-runs";
import { harnessBySlug, harnesses } from "@/data/harnesses";
import { getOperationalProfileRecord } from "@/data/operational-profiles";
import {
  repositoryArtifactCount,
  repositoryArtifactLabels,
  repositoryAuditForHarness,
} from "@/data/repository-audits";
import {
  formatIsolationModes,
  harnessRoleLabels,
  orchestrationLabels,
  runtimePostureLabels,
  stateModelLabels,
} from "@/lib/harness-classification";
import {
  architectureAxisLabels,
  architectureLevelAnchors,
  architectureProfileFor,
  benchmarkConfidenceInterval95,
  evidenceStateFor,
} from "@/lib/evaluation";
import type { ArchitectureAxis, FeatureKey } from "@/lib/types";

export const dynamicParams = false;

const featureSupport: Array<{ key: FeatureKey; label: string }> = [
  { key: "mcp", label: "External tools (MCP)" },
  { key: "localModels", label: "Local models" },
  { key: "subagents", label: "Agent parallelism" },
  { key: "headless", label: "Runs without an open UI" },
  { key: "browser", label: "Browser control" },
  { key: "sandbox", label: "Isolated execution" },
  { key: "checkpoints", label: "Undo file changes" },
];

const providerLabels = {
  "single-vendor": "Single-vendor",
  "multi-provider": "Multi-provider",
  "enterprise-routing": "Enterprise routing",
} as const;

const interfaceLabels = {
  terminal: "Terminal",
  ide: "IDE",
  web: "Web",
  automation: "Automation",
} as const;

const evidenceKindLabels = {
  "official-docs": "Official docs",
  "official-repository": "Official repository",
  "official-announcement": "Official announcement",
} as const;

const operationalLabels = {
  context: {
    basic: "Basic session context",
    managed: "Managed context lifecycle",
    persistent: "Persistent memory",
    unknown: "Not enough evidence",
  },
  permissions: {
    host: "Host defaults",
    approval: "Interactive approvals",
    policy: "Policy rules",
    unknown: "Not enough evidence",
  },
  verification: {
    manual: "Manual verification",
    "tool-assisted": "Tool-assisted checks",
    "workflow-gated": "Workflow-gated checks",
    unknown: "Not enough evidence",
  },
  observability: {
    session: "Session transcript",
    logs: "Execution logs",
    traces: "Structured traces",
    unknown: "Not enough evidence",
  },
  recovery: {
    manual: "Manual recovery",
    "session-resume": "Session resume",
    checkpoint: "File checkpoint",
    "managed-recovery": "Managed recovery",
    unknown: "Not enough evidence",
  },
} as const;

const repositorySignalLabels = {
  securityPolicy: "Security policy",
  continuousIntegration: "CI workflows",
  automatedTests: "Automated tests",
  evaluationAssets: "Evaluation assets",
  contributorDocumentation: "Contributor documentation",
} as const;

export function generateStaticParams() {
  return harnesses.map((harness) => ({ slug: harness.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const harness = harnessBySlug.get(slug);
  if (!harness) return {};
  return {
    title: harness.name,
    description: harness.summary,
  };
}

export default async function HarnessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const harness = harnessBySlug.get(slug);
  if (!harness) notFound();
  const operationalRecord = getOperationalProfileRecord(harness.id);
  const operational = operationalRecord.profile;
  const architecture = architectureProfileFor(harness);
  const documentedLayers = Object.values(architecture).filter((value) => value !== null).length;
  const repositoryAudit = repositoryAuditForHarness(harness.id);
  const artifactCount = repositoryAudit ? repositoryArtifactCount(repositoryAudit) : null;
  const measuredRuns = benchmarkRunsForHarness(harness.id);
  const evidenceState = evidenceStateFor(harness.id);

  return (
    <section className="section profile-page">
      <div className="shell wide-shell profile-shell">
        <header className="profile-header">
          <div className="profile-identity">
            <HarnessLogo logo={harness.logo} name={harness.name} size="large" priority />
            <p>{harnessRoleLabels[harness.classification.role]}</p>
          </div>

          <h1>{harness.name}</h1>
          <p className="profile-tagline">{harness.tagline}</p>

          <dl className="profile-meta" aria-label={`${harness.name} profile metadata`}>
            <div>
              <dt>Status</dt>
              <dd>{harness.status === "active" ? "Active" : harness.status === "dormant" ? "Dormant" : "Archived"}</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>{harness.license}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{evidenceState.label} · {harness.evidence.length} sources</dd>
            </div>
            <div>
              <dt>Product record checked</dt>
              <dd>{harness.verifiedAt}</dd>
            </div>
          </dl>

          <div className="button-row profile-actions">
            <Link className="button primary" href="/compare">Compare harnesses</Link>
            <a className="button secondary" href="#evidence">Inspect sources</a>
          </div>
        </header>

        <div className="profile-analysis-grid">
          <article className="profile-summary-panel">
            <h2>At a glance</h2>
            <p className="profile-summary">{harness.summary}</p>

            <div className="profile-considerations-grid">
              <section>
                <h3>Good choice if</h3>
                <ul className="check-list large-list">
                  {harness.bestFor.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
              <section>
                <h3>Check before choosing</h3>
                <ul className="plain-list large-list">
                  {harness.tradeoffs.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            </div>
          </article>

          <aside className="profile-spec-panel" aria-labelledby="technical-profile-heading">
            <h2 id="technical-profile-heading">Technical details</h2>
            <dl className="profile-spec-list">
              <div>
                <dt>Product role</dt>
                <dd>{harnessRoleLabels[harness.classification.role]}</dd>
              </div>
              <div>
                <dt>Agent organization</dt>
                <dd>{orchestrationLabels[harness.classification.orchestration]}</dd>
              </div>
              <div>
                <dt>Runtime posture</dt>
                <dd>{runtimePostureLabels[harness.classification.runtime]}</dd>
              </div>
              <div>
                <dt>Isolation options</dt>
                <dd>{formatIsolationModes(harness.classification.isolation)}</dd>
              </div>
              <div>
                <dt>State model</dt>
                <dd>{stateModelLabels[harness.classification.state]}</dd>
              </div>
              <div>
                <dt>Context lifecycle</dt>
                <dd>{operationalLabels.context[operational.context]}</dd>
              </div>
              <div>
                <dt>Permission posture</dt>
                <dd>{operationalLabels.permissions[operational.permissions]}</dd>
              </div>
              <div>
                <dt>Verification</dt>
                <dd>{operationalLabels.verification[operational.verification]}</dd>
              </div>
              <div>
                <dt>Observability</dt>
                <dd>{operationalLabels.observability[operational.observability]}</dd>
              </div>
              <div>
                <dt>Recovery</dt>
                <dd>{operationalLabels.recovery[operational.recovery]}</dd>
              </div>
              <div>
                <dt>Interfaces</dt>
                <dd>{harness.interfaces.map((item) => interfaceLabels[item]).join(", ")}</dd>
              </div>
              <div>
                <dt>Provider posture</dt>
                <dd>{providerLabels[harness.providerStyle]}</dd>
              </div>
              <div>
                <dt>Subscription access</dt>
                <dd>{harness.supportsSubscription ? "Available" : "Not documented"}</dd>
              </div>
              <div>
                <dt>Local model path</dt>
                <dd>{harness.localModels ? "Supported" : "Not first-class"}</dd>
              </div>
              <div>
                <dt>Claim boundary</dt>
                <dd>Harness capability only</dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="profile-signals" aria-labelledby="operational-evidence-heading">
          <div className="profile-section-heading">
            <div>
              <h2 id="operational-evidence-heading">How it works under the hood</h2>
              <p>Seven mechanisms mapped from first-party records. These labels describe what the harness provides, not how intelligent its model is.</p>
            </div>
            <div className="profile-operational-summary">
              <strong>{documentedLayers}/7</strong>
              <span>layers documented</span>
            </div>
          </div>

          <ul className="profile-operational-grid">
            {(Object.keys(architectureAxisLabels) as ArchitectureAxis[]).map((axis) => {
              const level = architecture[axis];
              return (
                <li key={axis}>
                  <span>{architectureAxisLabels[axis]}</span>
                  <strong>{level === null ? "Not documented" : architectureLevelAnchors[axis][level]}</strong>
                  <small>Documented mechanism, not a performance score.</small>
                  <em>{level === null ? "Excluded from comparison" : `Ordinal level ${level}`}</em>
                </li>
              );
            })}
          </ul>
          <footer className="profile-operational-footer">
            <p>{documentedLayers} of 7 layers documented. Mechanism sources checked {operationalRecord.verifiedAt}. Missing layers stay missing; they do not lower or inflate a total score.</p>
            <div>
              {operationalRecord.sourceUrls.map((url, index) => (
                <a className="text-link" href={url} target="_blank" rel="noreferrer" key={url}>Operational source {index + 1}</a>
              ))}
              <Link className="text-link" href="/methodology">Rubric</Link>
            </div>
          </footer>
        </section>

        <section className="profile-measurement-grid" aria-label="Public audit and measured configurations">
          <article>
            <h2>Public code audit</h2>
            {!repositoryAudit && <p>No official public repository was located for a code-level audit.</p>}
            {repositoryAudit && (
              <>
                <div className="profile-measurement-value">
                  <strong>{artifactCount === null ? "Unranked" : `${artifactCount}/5`}</strong>
                  <span>{artifactCount === null ? "support-only repository" : "public artifacts present"}</span>
                </div>
                <dl className="profile-audit-signals">
                  {(Object.keys(repositorySignalLabels) as Array<keyof typeof repositorySignalLabels>).map((signal) => (
                    <div key={signal}>
                      <dt>{repositoryArtifactLabels[signal]}</dt>
                      <dd>{repositoryAudit.signals[signal] ? "Present at inspected commit" : "Not found"}</dd>
                    </div>
                  ))}
                </dl>
                <p>{repositoryAudit.limitation}</p>
                <a className="text-link" href={`${repositoryAudit.repositoryUrl}/tree/${repositoryAudit.inspectedRef}`} target="_blank" rel="noreferrer">Inspect commit {repositoryAudit.inspectedRef}, checked {repositoryAudit.verifiedAt}</a>
              </>
            )}
          </article>
          <article>
            <h2>Measured configurations</h2>
            {measuredRuns.length === 0 && <p>No benchmark run passes the full metadata admission policy for this harness yet. Missing data is not scored as zero.</p>}
            {measuredRuns.map((run) => {
              const interval = benchmarkConfidenceInterval95(run);
              return (
                <div className="profile-benchmark-record" key={run.id}>
                  <div className="profile-measurement-value">
                    <strong>{run.accuracy.toFixed(2)}%</strong>
                    <span>95% descriptive interval {interval.lower.toFixed(1)}-{interval.upper.toFixed(1)}</span>
                  </div>
                  <p>{run.model}, harness {run.harnessVersion}, {run.reasoningEffort} effort, {run.totalTrials} trials, ${run.totalCostUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}. Result source checked {run.verifiedAt}.</p>
                  <a className="text-link" href={run.resultSourceUrl} target="_blank" rel="noreferrer">Open official result</a>
                </div>
              );
            })}
            <Link className="text-link" href="/benchmarks">Benchmark policy and all runs</Link>
          </article>
        </section>

        <section className="profile-support" aria-labelledby="support-heading">
          <div className="profile-section-heading">
            <div>
              <h2 id="support-heading">Capability support</h2>
              <p>Documented first-class product support, checked against the sources below.</p>
            </div>
          </div>
          <dl className="profile-support-grid">
            {featureSupport.map((feature) => {
              const supported = harness.features[feature.key];
              return (
                <div key={feature.key}>
                  <dt>{feature.label}</dt>
                  <dd className={supported ? "yes" : "neutral-no"}>
                    {supported ? "Supported" : "Not first-class"}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>

        <div className="profile-record-grid">
          <section className="profile-evidence" id="evidence" aria-labelledby="evidence-heading">
            <div className="profile-section-heading">
              <div>
                <h2 id="evidence-heading">Primary evidence</h2>
                <p>Each capability claim is tied to a first-party record and a verification date.</p>
              </div>
              <span>Product record checked {harness.verifiedAt}</span>
            </div>
            <div className="profile-evidence-list">
              {harness.evidence.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                  <span>
                    <strong>{source.title}</strong>
                    <small>{source.covers}</small>
                  </span>
                  <span className="profile-evidence-meta">
                    <span>{evidenceKindLabels[source.kind]}</span>
                    <time dateTime={source.verifiedAt}>Source checked {source.verifiedAt}</time>
                  </span>
                </a>
              ))}
            </div>
            {harness.discovery && harness.discovery.length > 0 && (
              <div className="profile-discovery-note">
                <h3>Ecosystem discovery</h3>
                {harness.discovery.map((source) => (
                  <p key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                    {" "}{source.note} Observed {source.observedAt}.
                  </p>
                ))}
              </div>
            )}
          </section>

          <aside className="profile-setup" aria-labelledby="setup-heading">
            <h2 id="setup-heading">Getting started</h2>
            <p>{harness.setup}</p>
            <a className="text-link" href={harness.evidence[0].url} target="_blank" rel="noreferrer">
              Open official documentation
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
