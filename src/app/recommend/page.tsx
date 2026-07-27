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
        <div className="page-intro">
          <h1>Find your coding harness.</h1>
          <p>Answer seven questions. Get one recommendation, two alternatives, and the evidence behind them.</p>
        </div>
        <Recommender />
      </div>
    </section>
  );
}
