import type { Metadata } from "next";
import { CompareClient } from "@/components/compare-client";
import { canonicalMetadata } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare coding harnesses",
  description: "Compare coding harnesses by interfaces, providers, capabilities, controls, and trade-offs.",
  ...canonicalMetadata("/compare"),
};

export default function ComparePage() {
  return (
    <section className="section page-section">
      <div className="shell wide-shell">
        <div className="page-intro">
          <h1>Compare coding harnesses.</h1>
          <p>Start with workflow, control, model access, and trade-offs. Open the technical rows only when you need them.</p>
        </div>
        <CompareClient />
      </div>
    </section>
  );
}
