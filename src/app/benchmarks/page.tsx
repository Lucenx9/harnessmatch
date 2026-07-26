import type { Metadata } from "next";

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
      </div>
    </section>
  );
}
