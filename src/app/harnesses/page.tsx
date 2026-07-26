import type { Metadata } from "next";
import { HarnessCard } from "@/components/harness-card";
import { harnesses } from "@/data/harnesses";

export const metadata: Metadata = {
  title: "Coding harness profiles",
};

export default function HarnessesPage() {
  return (
    <section className="section page-section">
      <div className="shell">
        <div className="page-intro">
          <span className="eyebrow">Catalog</span>
          <h1>AI coding harness profiles.</h1>
          <p>Each profile uses the same capability schema and links back to a first-party source.</p>
        </div>
        <div className="card-grid">
          {harnesses.map((harness) => <HarnessCard key={harness.id} harness={harness} />)}
        </div>
      </div>
    </section>
  );
}
