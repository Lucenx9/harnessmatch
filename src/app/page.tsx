import Link from "next/link";
import Image from "next/image";
import { harnesses } from "@/data/harnesses";
import { HarnessLensExplorer } from "@/components/harness-lens-explorer";

export default function HomePage() {
  return (
    <>
      <section className="hero section">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Independent, source-backed guidance</span>
            <h1>
              <span className="hero-line">Match the harness</span>
              <span className="hero-line">to <span className="accent-word">the work.</span></span>
            </h1>
            <p className="hero-lede">
              Compare coding harnesses by workflow, model access, control, runtime, and verified capabilities.
            </p>
            <div className="button-row">
              <Link className="button primary" href="/recommend">Find my match</Link>
              <Link className="button secondary" href="/compare">Compare harnesses</Link>
            </div>
          </div>
          <figure className="hero-media">
            <Image
              src="/harness-hero.webp"
              alt="A precision modular wiring harness with braided cables and machined connectors."
              width={1536}
              height={1024}
              priority
              fetchPriority="high"
              sizes="(max-width: 1040px) 100vw, 48vw"
            />
          </figure>
        </div>
      </section>

      <section className="proof-section" aria-label="Catalog facts">
        <div className="shell proof-strip" aria-label="Catalog facts">
          <div><strong>7</strong><span>active harnesses</span></div>
          <div><strong>26</strong><span>primary sources</span></div>
          <div><strong>2026-07-26</strong><span>latest verification</span></div>
          <div><strong>0</strong><span>affiliate rankings</span></div>
        </div>
      </section>

      <section className="section decision-section">
        <div className="shell">
          <div className="section-heading stacked-heading decision-heading">
            <h2>Choose the constraint that changes the answer.</h2>
            <p>Filter the directory by verified harness capabilities, then open the evidence or compare products side by side.</p>
          </div>
          <HarnessLensExplorer harnesses={harnesses.map((harness) => ({
            id: harness.id,
            slug: harness.slug,
            name: harness.name,
            logo: harness.logo,
            tagline: harness.tagline,
            category: harness.category,
            interfaces: harness.interfaces,
            providerStyle: harness.providerStyle,
            features: harness.features,
            evidenceCount: harness.evidence.length,
            verifiedAt: harness.verifiedAt,
          }))} />
        </div>
      </section>

      <section className="section muted-section">
        <div className="shell">
          <div className="section-heading stacked-heading">
            <h2>“Best” is a workflow question.</h2>
            <p>A model, a harness, a permission policy, and a runtime all affect the outcome. HarnessMatch evaluates those layers separately.</p>
          </div>
          <div className="principle-list">
            <article className="principle-card">
              <h3>Fit before rank</h3>
              <p>A local-model requirement can eliminate a polished cloud-only tool before benchmark scores matter.</p>
            </article>
            <article className="principle-card">
              <h3>Evidence before hype</h3>
              <p>Capability claims include a source and verification date. Uncontrolled benchmark claims stay out.</p>
            </article>
            <article className="principle-card">
              <h3>Trade-offs stay visible</h3>
              <p>Every result explains why it fits, what is missing, and which alternative is close behind.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="shell cta-box">
          <div>
            <span className="eyebrow">Two minutes, no signup</span>
            <h2>Turn your constraints into a shortlist.</h2>
            <p>Six questions turn your workflow, model access, control preferences, and required capabilities into a transparent shortlist.</p>
          </div>
          <Link className="button primary" href="/recommend">Find my match</Link>
        </div>
      </section>
    </>
  );
}
