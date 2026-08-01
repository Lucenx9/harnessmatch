import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HarnessLogo } from "@/components/harness-logo";
import { FeatureClaimValue } from "@/components/feature-claim-value";
import { HarnessArchitectureSection } from "@/components/harness-architecture-section";
import { HarnessEcosystemSection } from "@/components/harness-ecosystem-section";
import { HarnessEvidenceLedger } from "@/components/harness-evidence-ledger";
import { HarnessMeasurementSection } from "@/components/harness-measurement-section";
import { HarnessMembershipSection } from "@/components/harness-membership-section";
import { VisualIcon } from "@/components/visual-icon";
import { benchmarkRunsForHarness } from "@/data/benchmark-runs";
import { ecosystemSignalsByHarness } from "@/data/ecosystem-signals";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnessBySlug, harnesses } from "@/data/harnesses";
import { openRouterAttributionByHarness } from "@/data/openrouter-attribution";
import { releaseSnapshotByHarness } from "@/data/release-signals";
import { getOperationalProfileRecord } from "@/data/operational-profiles";
import {
  repositoryAuditForHarness,
} from "@/data/repository-audits";
import {
  formatIsolationModes,
  harnessRoleLabels,
  modelPortabilityFor,
  modelPortabilityLabels,
  orchestrationLabels,
  productLayerLabels,
  runtimePostureLabels,
  stateModelLabels,
} from "@/lib/harness-classification";
import {
  architectureProfileFor,
  evidenceStateFor,
} from "@/lib/evaluation";
import { harnessProfileDescription, pageMetadata } from "@/lib/site";
import type { FeatureKey } from "@/lib/types";

export const dynamicParams = false;

const featureSupport: Array<{ key: FeatureKey; label: string }> = [
  { key: "mcp", label: "External tools (MCP)" },
  { key: "skills", label: "Reusable skills" },
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

const ecosystemSignalOrder = {
  homebrew: 0,
  npm: 1,
  "github-releases": 2,
  vscode: 3,
  openvsx: 4,
  jetbrains: 5,
  github: 6,
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
  const setupEvidence = harness.evidence.at(0);
  const operational = operationalRecord.profile;
  const architecture = architectureProfileFor(harness);
  const repositoryAudit = repositoryAuditForHarness(harness.id);
  const openRouterSnapshot = openRouterAttributionByHarness.get(harness.id);
  const releaseSnapshot = releaseSnapshotByHarness.get(harness.id);
  const ecosystemSignals = [...(ecosystemSignalsByHarness.get(harness.id) ?? [])]
    .sort((left, right) => ecosystemSignalOrder[left.source] - ecosystemSignalOrder[right.source]);
  const ecosystemCheckedAt = [
    openRouterSnapshot?.windows.month.observedAt,
    releaseSnapshot?.observedAt,
    ...ecosystemSignals.map((signal) => signal.observedAt),
  ].filter((value): value is string => Boolean(value)).sort().at(-1);
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
              <dd>{evidenceState.label}, {harness.evidence.length} sources</dd>
            </div>
            <div>
              <dt>Product record checked</dt>
              <dd>{harness.verifiedAt}</dd>
            </div>
          </dl>

          <div className="button-row profile-actions">
            <Link className="button primary" href={{ pathname: "/compare", query: { ids: harness.id } }}>Compare harnesses</Link>
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
                <dd><FeatureClaimValue claim={harness.featureClaims.localModels} compact /></dd>
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
                  <dd><FeatureClaimValue claim={harness.featureClaims.localModels} compact /></dd>
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
          <HarnessMembershipSection
            membership={membership}
            evidenceByUrl={evidenceByUrl}
            documentedCriteria={documentedMembershipCriteria}
            totalCriteria={totalMembershipCriteria}
            qualifies={qualifiesAsCodingHarness}
          />
        )}

        <HarnessArchitectureSection
          architecture={architecture}
          sourceUrls={operationalRecord.sourceUrls}
          verifiedAt={operationalRecord.verifiedAt}
        />

        <HarnessEcosystemSection
          harnessId={harness.id}
          inUsageLedger={harness.status === "active"}
          releaseSnapshot={releaseSnapshot}
          openRouterSnapshot={openRouterSnapshot}
          ecosystemSignals={ecosystemSignals}
          checkedAt={ecosystemCheckedAt}
        />

        <HarnessMeasurementSection repositoryAudit={repositoryAudit} measuredRuns={measuredRuns} />

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
                  <dd><FeatureClaimValue claim={harness.featureClaims[feature.key]} /></dd>
                </div>
              );
            })}
          </dl>
        </section>

        <div className="profile-record-grid">
          <section className="profile-evidence" id="evidence" aria-labelledby="evidence-heading">
            <HarnessEvidenceLedger sources={harness.evidence} recordVerifiedAt={harness.verifiedAt} />
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
            {setupEvidence
              ? (
                  <a className="text-link" href={setupEvidence.url} target="_blank" rel="noreferrer">
                    Open official documentation
                  </a>
                )
              : <span className="muted">No setup source is currently linked.</span>}
          </aside>
        </div>
      </div>
    </section>
  );
}
