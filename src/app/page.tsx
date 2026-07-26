import Link from "next/link";
import { harnesses } from "@/data/harnesses";
import { HarnessCard } from "@/components/harness-card";

export default function HomePage() {
  return (
    <>
      <section className="hero section">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> Independent decision support</span>
            <h1>Match the harness to <span className="gradient-text">the work.</span></h1>
            <p className="hero-lede">
              Compare coding agents by interface, model access, control, runtime, and automation—without turning model intelligence into a fake universal ranking.
            </p>
            <div className="button-row">
              <Link className="button primary" href="/recommend">Find my harness <span aria-hidden="true">→</span></Link>
              <Link className="button secondary" href="/compare">Open comparison</Link>
            </div>
            <div className="trust-row">
              <span>Explainable scoring</span>
              <span>26 first-party sources</span>
              <span>No affiliate ranking</span>
            </div>
          </div>

          <div className="hero-console" aria-label="Example workflow-fit analysis">
            <div className="console-head">
              <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
              <span>workflow-fit / terminal-flex</span>
              <span className="console-status"><span /> live preview</span>
            </div>
            <div className="console-body">
              <div className="console-query"><span>$</span> match --workflow terminal-flex</div>
              <div className="console-kicker">Top workflow fit</div>
              <div className="console-result">
                <div>
                  <span className="console-rank">01</span>
                  <strong>OpenCode</strong>
                  <small>Multi-provider terminal agent</small>
                </div>
                <b>94</b>
              </div>
              <div className="console-bars">
                <div><span>Interface</span><i style={{ width: "100%" }} /></div>
                <div><span>Model access</span><i style={{ width: "96%" }} /></div>
                <div><span>Control fit</span><i style={{ width: "88%" }} /></div>
              </div>
              <div className="console-note"><span>✓</span> MCP and local models verified in first-party docs</div>
            </div>
          </div>
        </div>
        <div className="shell proof-strip" aria-label="Catalog facts">
          <div><strong>07</strong><span>active harnesses</span></div>
          <div><strong>26</strong><span>primary sources</span></div>
          <div><strong>2026.07.26</strong><span>latest verification</span></div>
          <div><strong>00</strong><span>uncontrolled rankings</span></div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">The selection model</span>
              <h2>“Best” is a workflow question.</h2>
            </div>
            <p>A model, a harness, a permission policy, and a runtime environment all affect the outcome. HarnessMatch keeps those layers separate.</p>
          </div>
          <div className="three-grid">
            <article className="principle-card">
              <span>01 / FIT</span>
              <h3>Fit before rank</h3>
              <p>A local-model requirement can eliminate a polished cloud-only tool before benchmark scores matter.</p>
            </article>
            <article className="principle-card">
              <span>02 / PROOF</span>
              <h3>Evidence before hype</h3>
              <p>Capability claims include a source and verification date. Uncontrolled benchmark claims stay out.</p>
            </article>
            <article className="principle-card">
              <span>03 / CONTROL</span>
              <h3>Trade-offs stay visible</h3>
              <p>Every result explains why it fits, what is missing, and which alternative is close behind.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Source-backed catalog</span>
              <h2>Seven harnesses. One exacting schema.</h2>
            </div>
            <Link className="text-link" href="/harnesses">Browse all profiles →</Link>
          </div>
          <div className="card-grid">
            {harnesses.slice(0, 6).map((harness) => <HarnessCard key={harness.id} harness={harness} />)}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="shell cta-box">
          <div>
            <span className="eyebrow">Two minutes · no signup</span>
            <h2>Turn your constraints into a shortlist.</h2>
            <p>The recommender scores interface, priorities, model access, control style, repository context, and hard requirements.</p>
          </div>
          <Link className="button primary" href="/recommend">Start the recommender</Link>
        </div>
      </section>
    </>
  );
}
