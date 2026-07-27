import type { Metadata } from "next";
import { EvidenceLedger } from "@/components/evidence-ledger";
import { discoveryWatchlist } from "@/data/discovery-watchlist";
import { harnesses } from "@/data/harnesses";
import { researchProcessDisclosure } from "@/data/research-process";

export const metadata: Metadata = {
  title: "Data and sources",
};

export default function DataPage() {
  const activeHarnesses = harnesses.filter((harness) => harness.status === "active");

  return (
    <section className="section page-section">
      <div className="shell wide-shell">
        <div className="page-intro">
          <h1>Inspect the sources.</h1>
          <p>Search every product claim and open the first-party page that supports it.</p>
        </div>
        <aside className="notice prominent research-disclosure" aria-label="Research process disclosure">
          <p><strong>{researchProcessDisclosure.label}:</strong> {researchProcessDisclosure.short}</p>
          <a href="/methodology#research-process">Read how the research process is governed</a>
        </aside>
        <div className="ledger-summary">
          <span><strong>{activeHarnesses.length}</strong> active products</span>
          <span><strong>{activeHarnesses.reduce((total, harness) => total + harness.evidence.length, 0)}</strong> primary sources</span>
          <span><strong>{discoveryWatchlist.length}</strong> watchlist records</span>
          <span><strong>0</strong> affiliate sources</span>
        </div>
        <EvidenceLedger records={harnesses} />

        <section className="watchlist-section" aria-labelledby="watchlist-heading">
          <div className="section-heading stacked-heading">
            <h2 id="watchlist-heading">Discovery watchlist</h2>
            <p>Products stay outside the ranked catalog until first-party evidence supports a complete coding-harness profile.</p>
          </div>
          <div className="watchlist-grid">
            {discoveryWatchlist.map((candidate) => (
              <a href={candidate.sourceUrl} target="_blank" rel="noreferrer" key={candidate.name}>
                <span>
                  <strong>{candidate.name}</strong>
                  <small>{candidate.reason}</small>
                </span>
                <span className="evidence-kind">{candidate.status.replaceAll("-", " ")}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
