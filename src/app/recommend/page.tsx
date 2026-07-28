import type { Metadata } from "next";
import { Recommender } from "@/components/recommender";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Harness recommender",
  description:
    "Answer seven questions to find the AI coding harness that best fits your workflow, constraints, preferred controls, model access, and operating mode.",
  path: "/recommend",
});

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
