import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
};

const weights = [
  ["Interface fit", "20%"],
  ["Top priority", "20%"],
  ["Model-access fit", "20%"],
  ["Control style", "15%"],
  ["Repository context", "15%"],
  ["Required features", "10%"],
];

export default function MethodologyPage() {
  return (
    <section className="section page-section">
      <div className="shell narrow-shell prose-page">
        <div className="page-intro">
          <span className="eyebrow">Methodology</span>
          <h1>How the recommendation score works.</h1>
          <p>The engine is deterministic TypeScript. It does not call an LLM and it does not learn from vendor sponsorship.</p>
        </div>

        <section className="prose-section">
          <h2>Fit score</h2>
          <p>Each harness has a versioned capability profile. Your answers determine the weights applied to that profile.</p>
          <div className="weight-list">
            {weights.map(([label, value]) => (
              <div key={label}><span>{label}</span><strong>{value}</strong></div>
            ))}
          </div>
          <p>A missing required feature applies an additional penalty. Archived products are excluded from recommendations.</p>
        </section>

        <section className="prose-section">
          <h2>What a score means</h2>
          <p>A high score means the product matches the workflow described in the questionnaire. It does not predict the percentage of coding tasks completed, nor does it compare underlying model intelligence.</p>
        </section>

        <section className="prose-section">
          <h2>Editorial ratings</h2>
          <p>Ratings such as simplicity, autonomy, and security use a 1-5 scale. Every profile shows these values openly so disagreements can be reviewed as data changes rather than hidden inside prose.</p>
        </section>

        <section className="prose-section">
          <h2>Source quality</h2>
          <p>Capability existence is checked against first-party documentation, repositories, or product announcements. Each profile links claim groups such as model access, runtime isolation, and automation to supporting sources and records the verification date.</p>
          <p>A missing first-class capability is not inferred from marketing silence alone. The product documentation and command reference are checked before the profile is marked unsupported.</p>
        </section>
      </div>
    </section>
  );
}
