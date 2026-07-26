import type { Metadata } from "next";
import { researchSources } from "@/data/research";

export const metadata: Metadata = {
  title: "Benchmark policy",
};

const requiredFields = [
  "Harness and exact version",
  "Model and provider",
  "Benchmark and benchmark version",
  "Reasoning effort and token budget",
  "Sandbox, network, and tool policy",
  "Attempt count and selection policy",
  "Cost, duration, date, and reproducible source",
];

export default function BenchmarksPage() {
  return (
    <section className="section page-section">
      <div className="shell narrow-shell">
        <div className="page-intro">
          <span className="eyebrow">Benchmark explorer</span>
          <h1>No fake universal leaderboard.</h1>
          <p>HarnessMatch will publish performance results only when runs are comparable enough to support the conclusion being shown.</p>
        </div>

        <div className="notice prominent">
          <strong>Current status:</strong> the MVP contains capability evidence and workflow-fit scoring. It does not yet contain a normalized performance dataset.
        </div>

        <div className="two-grid benchmark-grid">
          <article className="card">
            <h2>Every accepted run must include</h2>
            <ul className="check-list large-list">
              {requiredFields.map((field) => <li key={field}>{field}</li>)}
            </ul>
          </article>
          <article className="card">
            <h2>Why this matters</h2>
            <p>The result of a coding task is shaped by the model, harness architecture, configuration, environment, and evaluation budget.</p>
            <div className="formula">result = model × harness × config × environment × budget</div>
            <p>Changing any one variable can reverse a ranking.</p>
          </article>
        </div>

        <section className="prose-section benchmark-research">
          <span className="eyebrow">Research context</span>
          <h2>Papers inform the policy, not the product claims.</h2>
          <p>Research helps define a defensible evaluation protocol. Product capabilities such as sandboxing, local models, or rollback still require current first-party documentation.</p>
          <div className="evidence-list">
            {researchSources.map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                <span>
                  <strong>{source.title}</strong>
                  <small>{source.supports}</small>
                </span>
                <span className="evidence-kind">
                  {source.maturity === "peer-reviewed" ? source.venue : `${source.venue} · preprint`}
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
