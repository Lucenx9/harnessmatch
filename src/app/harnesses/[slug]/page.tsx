import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { harnessBySlug, harnesses } from "@/data/harnesses";
import { ScoreBar } from "@/components/score-bar";

export const dynamicParams = false;

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

  const scoreLabels = {
    simplicity: "Simplicity",
    flexibility: "Flexibility",
    security: "Security controls",
    autonomy: "Autonomy",
    automation: "Automation",
    largeRepo: "Large repository fit",
    humanControl: "Human control",
  } as const;

  const featureLabels = {
    mcp: "MCP",
    localModels: "Local models",
    subagents: "Subagents",
    headless: "Headless mode",
    browser: "Browser interaction",
    sandbox: "Built-in sandbox",
    checkpoints: "Checkpoints / rollback",
  } as const;

  return (
    <section className="section page-section">
      <div className="shell profile-shell">
        <div className="profile-hero">
          <div>
            <div className="card-topline">
              <span className="pill">{harness.category}</span>
              <span className="status active">{harness.status}</span>
            </div>
            <h1>{harness.name}</h1>
            <p className="profile-tagline">{harness.tagline}</p>
            <p className="profile-summary">{harness.summary}</p>
            <div className="tag-row">
              {harness.interfaces.map((item) => <span className="tag" key={item}>{item}</span>)}
              <span className="tag">{harness.license}</span>
            </div>
          </div>
          <aside className="source-card card">
            <span className="eyebrow">Evidence record</span>
            <strong>{harness.evidence.length} first-party sources</strong>
            <p>All capability claims checked {harness.verifiedAt}.</p>
            <a className="button secondary" href={`/data/#${harness.id}`}>Inspect evidence</a>
          </aside>
        </div>

        <div className="profile-grid">
          <div className="profile-main">
            <section className="profile-section">
              <h2>Best for</h2>
              <ul className="check-list large-list">
                {harness.bestFor.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
            <section className="profile-section">
              <h2>Trade-offs</h2>
              <ul className="plain-list large-list">
                {harness.tradeoffs.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
            <section className="profile-section">
              <h2>Capability support</h2>
              <div className="capability-grid">
                {Object.entries(harness.features).map(([key, value]) => (
                  <div className="capability-item" key={key}>
                    <span>{featureLabels[key as keyof typeof featureLabels]}</span>
                    <strong className={value ? "yes" : "no"}>{value ? "Supported" : "Not first-class"}</strong>
                  </div>
                ))}
              </div>
            </section>
            <section className="profile-section">
              <div className="section-title-row">
                <h2>Primary evidence</h2>
                <span>{harness.verifiedAt}</span>
              </div>
              <div className="profile-evidence-list">
                {harness.evidence.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    <span>
                      <strong>{source.title}</strong>
                      <small>{source.covers}</small>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </section>
            <section className="profile-section">
              <h2>Getting started</h2>
              <p>{harness.setup}</p>
            </section>
          </div>

          <aside className="profile-sidebar card">
            <h2>Editorial fit profile</h2>
            <p>These 1–5 ratings describe product posture and are used by the recommender.</p>
            {Object.entries(harness.capabilities).map(([key, value]) => (
              <ScoreBar key={key} label={scoreLabels[key as keyof typeof scoreLabels]} value={value} />
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
