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
          <p>Editorial fit ratings are shown on a 1–5 scale. They describe product posture, not model intelligence.</p>
        </div>
        <CompareClient />
      </div>
    </section>
  );
}
