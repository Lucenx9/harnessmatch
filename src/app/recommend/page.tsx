import type { Metadata } from "next";
import { Recommender } from "@/components/recommender";

export const metadata: Metadata = {
  title: "Harness recommender",
  description: "Find the AI coding harness that best fits your workflow and constraints.",
};

export default function RecommendPage() {
  return (
    <section className="section page-section">
      <div className="shell narrow-shell">
        <div className="page-intro centered">
          <span className="eyebrow">Workflow-aware recommendation</span>
          <h1>Find your best-fit coding harness.</h1>
          <p>Six concrete questions. Transparent scoring. No signup and no model-generated verdict.</p>
        </div>
        <Recommender />
      </div>
    </section>
  );
}
