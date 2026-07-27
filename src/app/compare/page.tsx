import type { Metadata } from "next";
import { CompareClient } from "@/components/compare-client";

export const metadata: Metadata = {
  title: "Compare coding harnesses",
  description: "Compare coding harnesses by interfaces, providers, capabilities, controls, and trade-offs.",
};

export default function ComparePage() {
  return (
    <section className="section page-section">
      <div className="shell wide-shell">
        <div className="page-intro">
          <span className="eyebrow">Capability matrix</span>
          <h1>Compare architecture, not just branding.</h1>
          <p>Compare product architecture, controls, evidence, and exact measured configurations. Model capability stays separate.</p>
        </div>
        <CompareClient />
      </div>
    </section>
  );
}
