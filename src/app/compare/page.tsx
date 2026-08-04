import "../styles/responsive.css";
import type { Metadata } from "next";
import { CompareClient } from "@/components/compare-client";
import { compareHarnessRecords } from "@/lib/compare-records";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Compare coding harnesses",
  description:
    "Compare AI coding harnesses by interfaces, model access, capabilities, execution controls, trade-offs, and verified evidence.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <section className="section page-section">
      <div className="shell wide-shell">
        <div className="page-intro">
          <h1>Compare coding harnesses.</h1>
          <p>Choose up to four harnesses, then compare workflow, control, model access, and trade-offs. Open technical rows only when needed.</p>
        </div>
        <CompareClient harnesses={compareHarnessRecords()} />
      </div>
    </section>
  );
}
