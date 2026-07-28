import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HarnessLogo } from "@/components/harness-logo";
import { FeatureClaimValue } from "@/components/feature-claim-value";
import { ArchitectureLevelIndicator } from "@/components/architecture-level-indicator";
import { VisualIcon } from "@/components/visual-icon";
import { benchmarkRunsForHarness } from "@/data/benchmark-runs";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnessBySlug, harnesses } from "@/data/harnesses";
import { openRouterAttributionByHarness } from "@/data/openrouter-attribution";
import { getOperationalProfileRecord } from "@/data/operational-profiles";
import {
  repositoryArtifactCount,
  repositoryArtifactLabels,
  repositoryAuditForHarness,
} from "@/data/repository-audits";
import {
  formatIsolationModes,
  harnessRoleLabels,
  membershipCriterionDescriptions,
  membershipCriterionLabels,
  modelPortabilityFor,
  modelPortabilityLabels,
  orchestrationLabels,
  productLayerLabels,
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
import { harnessProfileDescription, pageMetadata } from "@/lib/site";
import type {
  ArchitectureAxis,
  EvidenceSource,
  FeatureKey,
  MembershipEvidenceState,
} from "@/lib/types";

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

const membershipEvidenceLabels: Record<MembershipEvidenceState, string> = {
  documented: "Documented",
  contradicted: "Contradicted",
  unknown: "Not established",
};

type EvidenceTopic = NonNullable<EvidenceSource["topic"]> | "additional";

const primaryEvidenceLimit = 8;
const evidenceTopicLabels: Record<EvidenceTopic, string> = {
  "product-surfaces": "Product and interfaces",
  "execution-control": "Execution and control",
  "orchestration-state": "Agents, state and recovery",
  "automation-extensions": "Automation and extensions",
  "enterprise-operations": "Enterprise and operations",
  "releases-code-audit": "Releases and public code audit",
  additional: "Additional first-party evidence",
};
const evidenceTopicOrder: EvidenceTopic[] = [
  "product-surfaces",
  "execution-control",
  "orchestration-state",
  "automation-extensions",
  "enterprise-operations",
  "releases-code-audit",
  "additional",
];

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

function EvidenceRows({ sources }: { sources: EvidenceSource[] }) {
  return (
    <div className="profile-evidence-list">
      {sources.map((source) => (
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
  );
}

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
  return pageMetadata({
    title: harness.name,
    description: harnessProfileDescription(harness.name, harness.tagline),
    path: `/harnesses/${harness.slug}`,
  });
}

export default async function HarnessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const harness = harnessBySlug.get(slug);
  if (!harness) notFound();
  const operationalRecord = getOperationalProfileRecord(harness.id);
  const membership = getHarnessMembershipAssessment(harness);
  const documentedMembershipCriteria = membership
    ? Object.values(membership.criteria).filter((criterion) => criterion.state === "documented").length
    : 0;
  const totalMembershipCriteria = membership ? Object.keys(membership.criteria).length : 0;
  const qualifiesAsCodingHarness = membership?.layer === "coding-harness"
    && totalMembershipCriteria > 0
    && documentedMembershipCriteria === totalMembershipCriteria;
  const evidenceByUrl = new Map(harness.evidence.map((source) => [source.url, source]));
  const operational = operationalRecord.profile;
  const architecture = architectureProfileFor(harness);
  const documentedLayers = Object.values(architecture).filter((value) => value !== null).length;
  const repositoryAudit = repositoryAuditForHarness(harness.id);
  const openRouterSnapshot = openRouterAttributionByHarness.get(harness.id);
  const artifactCount = repositoryAudit ? repositoryArtifactCount(repositoryAudit) : null;
  const measuredRuns = benchmarkRunsForHarness(harness.id);
  const evidenceState = evidenceStateFor(harness.id);
  const primaryEvidence = harness.evidence.slice(0, primaryEvidenceLimit);
  const additionalEvidence = harness.evidence.slice(primaryEvidenceLimit);
  const groupedAdditionalEvidence = additionalEvidence.reduce((groups, source) => {
    const topic: EvidenceTopic = source.topic ?? "additional";
    groups.set(topic, [...(groups.get(topic) ?? []), source]);
    return groups;
  }, new Map<EvidenceTopic, EvidenceSource[]>());
  const additionalEvidenceGroups = evidenceTopicOrder.flatMap((topic) => {
    const sources = groupedAdditionalEvidence.get(topic);
    return sources ? [[topic, sources] as const] : [];
  });

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
              <dd>{evidenceState.label}, {harness.evidence.length} sources</dd>
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
                <div className="profile-consideration-heading">
                  <VisualIcon name="workflow-fit" />
                  <h3>Good choice if</h3>
                </div>
                <ul className="check-list large-list">
                  {harness.bestFor.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
              <section>
                <div className="profile-consideration-heading">
                  <VisualIcon name="check-first" />
                  <h3>Check before choosing</h3>
                </div>
                <ul className="plain-list large-list">
                  {harness.tradeoffs.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                </ul>
                {harness.tradeoffs.length > 3 && (
                  <details className="profile-more-considerations">
                    <summary>See {harness.tradeoffs.length - 3} more considerations</summary>
                    <ul className="plain-list large-list">
                      {harness.tradeoffs.slice(3).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </details>
                )}
              </section>
            </div>
          </article>

          <aside className="profile-spec-panel" aria-labelledby="quick-facts-heading">
            <h2 id="quick-facts-heading">Quick facts</h2>
            <dl className="profile-spec-list">
              <div>
                <dt>Interfaces</dt>
                <dd>{harness.interfaces.map((item) => interfaceLabels[item]).join(", ")}</dd>
              </div>
              <div>
                <dt>Approval style</dt>
                <dd>{operationalLabels.permissions[operational.permissions]}</dd>
              </div>
              <div>
                <dt>Model portability</dt>
                <dd>{modelPortabilityLabels[modelPortabilityFor(harness)]}</dd>
              </div>
              <div>
                <dt>Isolation</dt>
                <dd>{formatIsolationModes(harness.classification.isolation)}</dd>
              </div>
              <div>
                <dt>Agent organization</dt>
                <dd>{orchestrationLabels[harness.classification.orchestration]}</dd>
              </div>
              <div>
                <dt>Local model path</dt>
                <dd><FeatureClaimValue harness={harness} feature="localModels" compact /></dd>
              </div>
            </dl>
            <details className="profile-technical-details">
              <summary>View full technical record</summary>
              <dl className="profile-spec-list">
                <div>
                  <dt>Catalog layer</dt>
                  <dd>{membership ? productLayerLabels[membership.layer] : "Not assessed"}</dd>
                </div>
                <div>
                  <dt>Harness membership</dt>
                  <dd>
                    {membership
                      ? qualifiesAsCodingHarness
                        ? `Qualifies: ${documentedMembershipCriteria} required criteria evidenced`
                        : `${documentedMembershipCriteria} of ${totalMembershipCriteria} required criteria evidenced`
                      : "Not assessed"}
                  </dd>
                </div>
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
                  <dt>Model portability</dt>
                  <dd>{modelPortabilityLabels[modelPortabilityFor(harness)]}</dd>
                </div>
                <div>
                  <dt>Subscription access</dt>
                  <dd>{harness.supportsSubscription ? "Available" : "Not documented"}</dd>
                </div>
                <div>
                  <dt>Enterprise access</dt>
                  <dd>{harness.supportsEnterpriseAccess ? "Available" : "Not documented"}</dd>
                </div>
                <div>
                  <dt>Local model path</dt>
                  <dd><FeatureClaimValue harness={harness} feature="localModels" compact /></dd>
                </div>
                <div>
                  <dt>Claim boundary</dt>
                  <dd>Harness capability only</dd>
                </div>
              </dl>
            </details>
          </aside>
        </div>

        {membership && (
          <section className="profile-membership" id="membership" aria-labelledby="membership-heading">
            <div className="profile-section-heading">
              <div className="profile-section-title-with-icon">
                <VisualIcon name="membership" />
                <div>
                  <h2 id="membership-heading">Why it qualifies as a coding harness</h2>
                  <p>This confirms category fit, not product quality. Every required criterion links back to first-party evidence.</p>
                </div>
              </div>
              <div className={`profile-membership-verdict profile-membership-verdict--${qualifiesAsCodingHarness ? "qualified" : "unconfirmed"}`}>
                <strong>{qualifiesAsCodingHarness ? "Qualifies" : "Not established"}</strong>
                <span>{documentedMembershipCriteria} of {totalMembershipCriteria} required criteria evidenced</span>
              </div>
            </div>
            <ul className="profile-membership-grid">
              {Object.entries(membership.criteria).map(([criterion, assessment]) => (
                <li className="profile-membership-criterion" key={criterion}>
                  <h3>{membershipCriterionLabels[criterion as keyof typeof membership.criteria]}</h3>
                  <span className={`profile-membership-state profile-membership-state--${assessment.state}`}>
                    <i aria-hidden="true" />
                    {membershipEvidenceLabels[assessment.state]}
                  </span>
                  <p>{membershipCriterionDescriptions[criterion as keyof typeof membership.criteria]}</p>
                  <div className="profile-membership-sources" aria-label="First-party evidence">
                    {assessment.sourceUrls.length > 0
                      ? assessment.sourceUrls.map((url) => (
                          <a href={url} target="_blank" rel="noreferrer" key={url}>
                            <span>Evidence</span>
                            {evidenceByUrl.get(url)?.title ?? "First-party source"}
                          </a>
                        ))
                      : <span className="profile-membership-source-missing">No first-party source linked</span>}
                  </div>
                </li>
              ))}
            </ul>
            <footer>
              <p>
                {membership.limitation} <time dateTime={membership.verifiedAt}>Checked {membership.verifiedAt}.</time>{" · "}
                <Link className="text-link" href="/methodology#eligibility">Read the membership rule.</Link>
              </p>
            </footer>
          </section>
        )}

        <section className="profile-signals" aria-labelledby="operational-evidence-heading">
          <div className="profile-section-heading">
            <div className="profile-section-title-with-icon">
              <VisualIcon name="operating-model" />
              <div>
                <h2 id="operational-evidence-heading">How it works under the hood</h2>
                <p>Seven mechanisms mapped from first-party records. These labels describe what the harness provides, not how intelligent its model is.</p>
              </div>
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
                  <ArchitectureLevelIndicator axis={axis} level={level} />
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

        {openRouterSnapshot && (
          <section className="profile-openrouter" id="openrouter-footprint" aria-labelledby="openrouter-heading">
            <header>
              <div>
                <span>Ecosystem signal</span>
                <h2 id="openrouter-heading">OpenRouter routing footprint</h2>
                <p>Public traffic attributed to this app on OpenRouter. The comparable API window runs from {openRouterSnapshot.rolling30d.windowStart} to {openRouterSnapshot.rolling30d.windowEnd}. It is context about one routing channel, not a capability or quality score.</p>
              </div>
              <a className="text-link" href={openRouterSnapshot.sourceUrl} target="_blank" rel="noreferrer">Open app page</a>
            </header>
            <dl className="profile-openrouter-metrics">
              <div>
                <dt>30-day coding rank</dt>
                <dd>{openRouterSnapshot.rolling30d.rank === null ? "Not listed" : `#${openRouterSnapshot.rolling30d.rank}`}</dd>
                <small>Coding category</small>
              </div>
              <div>
                <dt>30-day attributed tokens</dt>
                <dd title={openRouterSnapshot.rolling30d.attributedTokens === null ? undefined : `${openRouterSnapshot.rolling30d.attributedTokens.toLocaleString("en-US")} tokens`}>
                  {openRouterSnapshot.rolling30d.attributedTokens === null ? "—" : compactNumberFormatter.format(openRouterSnapshot.rolling30d.attributedTokens)}
                </dd>
                <small>Same API window</small>
              </div>
              <div>
                <dt>30-day attributed requests</dt>
                <dd title={openRouterSnapshot.rolling30d.attributedRequests === null ? undefined : `${openRouterSnapshot.rolling30d.attributedRequests.toLocaleString("en-US")} requests`}>
                  {openRouterSnapshot.rolling30d.attributedRequests === null ? "—" : compactNumberFormatter.format(openRouterSnapshot.rolling30d.attributedRequests)}
                </dd>
                <small>Same API window</small>
              </div>
            </dl>
            <footer>
              <p>
                Attribution excludes direct APIs, subscriptions, local models, and traffic without app attribution. OpenRouter coding-category rank is channel-specific; an unlisted app is not scored as zero. Token volume is not a standardized workload, user count, or task-success measure.
              </p>
              <div>
                {openRouterSnapshot.integrationUrl && (
                  <a className="text-link" href={openRouterSnapshot.integrationUrl} target="_blank" rel="noreferrer">OpenRouter setup</a>
                )}
                <a className="text-link" href={openRouterSnapshot.rolling30d.sourceUrl} target="_blank" rel="noreferrer">Dataset definition</a>
                <span title={`${openRouterSnapshot.attributedTokens.toLocaleString("en-US")} page-total tokens`}>
                  App page: {compactNumberFormatter.format(openRouterSnapshot.attributedTokens)} tokens · {openRouterSnapshot.modelsObserved.toLocaleString("en-US")} models · daily rank {openRouterSnapshot.dailyGlobalRank === null ? "not listed" : `#${openRouterSnapshot.dailyGlobalRank}`}
                </span>
                <span>Source: OpenRouter (openrouter.ai/apps), as of <time dateTime={openRouterSnapshot.rolling30d.observedAt}>{openRouterSnapshot.rolling30d.observedAt}</time></span>
              </div>
            </footer>
          </section>
        )}

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
            <div className="profile-section-title-with-icon">
              <VisualIcon name="capability-support" />
              <div>
                <h2 id="support-heading">Capability support</h2>
                <p>Documented first-class product support, checked against the sources below.</p>
              </div>
            </div>
          </div>
          <dl className="profile-support-grid">
            {featureSupport.map((feature) => {
              return (
                <div key={feature.key}>
                  <dt>{feature.label}</dt>
                  <dd><FeatureClaimValue harness={harness} feature={feature.key} /></dd>
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
            <EvidenceRows sources={primaryEvidence} />
            {additionalEvidence.length > 0 && (
              <details className="profile-evidence-more">
                <summary>View {additionalEvidence.length} additional sources</summary>
                <div className="profile-evidence-groups">
                  {additionalEvidenceGroups.map(([topic, sources]) => (
                    <details className="profile-evidence-group" key={topic}>
                      <summary>
                        <span>{evidenceTopicLabels[topic]}</span>
                        <span>{sources.length} sources</span>
                      </summary>
                      <EvidenceRows sources={sources} />
                    </details>
                  ))}
                </div>
              </details>
            )}
            {harness.discovery && harness.discovery.length > 0 && (
              <div className="profile-discovery-note">
                <h3>Ecosystem context</h3>
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
