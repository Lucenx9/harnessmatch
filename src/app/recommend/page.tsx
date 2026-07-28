import type { Metadata } from "next";
import { Recommender } from "@/components/recommender";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Harness recommender",
  description:
    "Answer seven questions, review your constraints, and compare the AI coding harnesses that best fit your workflow, controls, and model access.",
  path: "/recommend",
});

export default function RecommendPage() {
  return (
    <section className="section page-section">
      <div className="shell narrow-shell">
        <div className="page-intro">
          <h1>Find your coding harness.</h1>
          <p>Answer seven short questions. Review your choices, then compare the leading matches and the evidence behind them.</p>
        </div>
        <Recommender />
      </div>
    </section>
  );
}
