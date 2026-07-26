import type { Metadata } from "next";
import { HarnessLogo } from "@/components/harness-logo";
import { harnesses } from "@/data/harnesses";
import {
  executionBoundaryLabels,
  harnessRoleLabels,
  orchestrationLabels,
} from "@/lib/harness-classification";

export const metadata: Metadata = {
  title: "Data and sources",
};

export default function DataPage() {
  return (
    <section className="section page-section">
      <div className="shell wide-shell">
        <div className="page-intro">
          <span className="eyebrow">Evidence ledger</span>
          <h1>Every claim needs a first-party trail.</h1>
          <p>Sources are grouped by the product claim they support. Dates show when HarnessMatch checked the page, not when the vendor published it.</p>
        </div>
        <div className="ledger-summary">
          <span><strong>{harnesses.length}</strong> active products</span>
          <span><strong>{harnesses.reduce((total, harness) => total + harness.evidence.length, 0)}</strong> primary sources</span>
          <span><strong>0</strong> affiliate sources</span>
        </div>
        <div className="evidence-ledger">
          {harnesses.map((harness) => (
            <article className="evidence-row" id={harness.id} key={harness.id}>
              <div className="evidence-product">
                <div className="card-topline">
                  <span className="status active">{harness.status}</span>
                  <span className="mono-label">{harness.verifiedAt}</span>
                </div>
                <div className="evidence-product-title">
                  <HarnessLogo logo={harness.logo} name={harness.name} />
                  <h2>{harness.name}</h2>
                </div>
                <p>
                  {harnessRoleLabels[harness.classification.role]}<br />
                  {orchestrationLabels[harness.classification.orchestration]}<br />
                  {executionBoundaryLabels[harness.classification.execution]}<br />
                  {harness.license}
                </p>
                <a className="logo-source-link" href={harness.logo.sourceUrl} target="_blank" rel="noreferrer">
                  Official logo source
                </a>
              </div>
              <div className="evidence-list">
                {harness.evidence.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    <span>
                      <strong>{source.title}</strong>
                      <small>{source.covers}</small>
                    </span>
                    <span className="evidence-kind">{source.kind.replace("official-", "")}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
