import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HarnessLogo } from "@/components/harness-logo";
import { harnessBySlug, harnesses } from "@/data/harnesses";
import {
  executionBoundaryLabels,
  harnessRoleLabels,
  orchestrationLabels,
} from "@/lib/harness-classification";
import type { CapabilityScores, FeatureKey } from "@/lib/types";

export const dynamicParams = false;

const capabilitySignals: Array<{
  key: keyof CapabilityScores;
  label: string;
  description: string;
}> = [
  { key: "humanControl", label: "Human control", description: "Approval and review posture" },
  { key: "security", label: "Security controls", description: "Controls and built-in isolation" },
  { key: "autonomy", label: "Autonomy", description: "Longer delegated work" },
  { key: "automation", label: "Automation", description: "Headless and CI workflows" },
  { key: "flexibility", label: "Flexibility", description: "Providers and configuration" },
  { key: "simplicity", label: "Simplicity", description: "Setup and daily operation" },
  { key: "largeRepo", label: "Large-repo fit", description: "Repository-scale work" },
];

const featureSupport: Array<{ key: FeatureKey; label: string }> = [
  { key: "mcp", label: "MCP" },
  { key: "localModels", label: "Local models" },
  { key: "subagents", label: "Subagents" },
  { key: "headless", label: "Headless mode" },
  { key: "browser", label: "Browser interaction" },
  { key: "sandbox", label: "Built-in sandbox" },
  { key: "checkpoints", label: "Checkpoints and rollback" },
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

function strengthLabel(value: number) {
  if (value >= 5) return "Very strong";
  if (value >= 4) return "Strong";
  if (value >= 3) return "Moderate";
  if (value >= 2) return "Limited";
  return "Minimal";
}

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

  return (
    <section className="section profile-page">
      <div className="shell wide-shell profile-shell">
        <header className="profile-header">
          <div className="profile-identity">
            <HarnessLogo logo={harness.logo} name={harness.name} size="large" priority />
            <p>{harness.category}</p>
          </div>

          <h1>{harness.name}</h1>
          <p className="profile-tagline">{harness.tagline}</p>

          <dl className="profile-meta" aria-label={`${harness.name} profile metadata`}>
            <div>
              <dt>Status</dt>
              <dd>{harness.status === "active" ? "Active" : "Archived"}</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>{harness.license}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>{harness.evidence.length} primary sources</dd>
            </div>
            <div>
              <dt>Verified</dt>
              <dd>{harness.verifiedAt}</dd>
            </div>
          </dl>

          <div className="button-row profile-actions">
            <Link className="button primary" href="/compare">Compare harnesses</Link>
            <a className="button secondary" href="#evidence">Inspect sources</a>
          </div>
        </header>

        <section className="profile-signals" aria-labelledby="fit-signals-heading">
          <div className="profile-section-heading">
            <div>
              <h2 id="fit-signals-heading">Fit signals</h2>
              <p>Editorial product-posture ratings used by the recommender. These are not model benchmarks.</p>
            </div>
            <Link className="text-link" href="/methodology">How ratings work</Link>
          </div>

          <ul className="profile-signal-grid">
            {capabilitySignals.map((signal) => {
              const value = harness.capabilities[signal.key];
              return (
                <li className="profile-signal" key={signal.key}>
                  <h3>{signal.label}</h3>
                  <div className="profile-signal-value" aria-label={`${signal.label}: ${value} out of 5`}>
                    <strong>{value}</strong>
                    <span>/5</span>
                  </div>
                  <p>{strengthLabel(value)}</p>
                  <small>{signal.description}</small>
                  <span className="profile-signal-ticks" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span className={index < value ? "is-filled" : undefined} key={index} />
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="profile-analysis-grid">
          <article className="profile-summary-panel">
            <h2>Capability summary</h2>
            <p className="profile-summary">{harness.summary}</p>

            <div className="profile-considerations-grid">
              <section>
                <h3>Best fit</h3>
                <ul className="check-list large-list">
                  {harness.bestFor.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
              <section>
                <h3>Trade-offs</h3>
                <ul className="plain-list large-list">
                  {harness.tradeoffs.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            </div>
          </article>

          <aside className="profile-spec-panel" aria-labelledby="technical-profile-heading">
            <h2 id="technical-profile-heading">Technical profile</h2>
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
                <dt>Execution boundary</dt>
                <dd>{executionBoundaryLabels[harness.classification.execution]}</dd>
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
              <span>{harness.verifiedAt}</span>
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
                    <time dateTime={source.verifiedAt}>{source.verifiedAt}</time>
                  </span>
                </a>
              ))}
            </div>
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
