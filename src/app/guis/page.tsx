import type { Metadata } from "next";
import { VisualIcon } from "@/components/visual-icon";
import { GuiWorkflowMatcher } from "@/components/gui-workflow-matcher";
import { guiExclusions, guiProducts } from "@/data/gui-products";
import { guiRepositoryAudits } from "@/data/gui-repository-audits";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Coding agent GUIs",
  description:
    "Choose a coding-agent GUI by workflow, platform, harness compatibility, source access, review surfaces, isolation, remote use, and dated evidence.",
  path: "/guis",
});

export default function GuisPage() {
  const proprietaryCount = guiProducts.filter((product) => product.sourceAccess === "proprietary").length;

  return (
    <section className="section page-section gui-page">
      <div className="shell wide-shell">
        <div className="page-intro gui-page-intro">
          <p className="eyebrow">Interface layer</p>
          <h1>Coding-agent GUIs by workflow fit.</h1>
          <p>First-party harness interfaces and multi-harness control planes are classified separately against workflow requirements. This is not an overall product ranking.</p>
        </div>

        <section className="gui-scope-summary" aria-label="GUI catalog scope">
          <div>
            <VisualIcon name="catalog" />
            <span className="gui-scope-stat-copy"><strong>{guiProducts.length}</strong><span>active GUI records</span></span>
          </div>
          <div>
            <VisualIcon name="code-audit" />
            <span className="gui-scope-stat-copy"><strong>{guiRepositoryAudits.length}</strong><span>pinned code audits</span></span>
          </div>
          <div>
            <VisualIcon name="proprietary" />
            <span className="gui-scope-stat-copy"><strong>{proprietaryCount}</strong><span>proprietary GUIs included</span></span>
          </div>
          <p><strong>Boundary:</strong> ChatGPT Chat and Claude Chat are general conversation surfaces. Codex in ChatGPT Desktop and the Code tab in Claude Desktop are coding-agent GUIs because they expose repository work, execution, and review.</p>
        </section>

        <GuiWorkflowMatcher />

        <details className="gui-exclusions">
          <summary>Inactive products excluded from matches</summary>
          <div>
            {guiExclusions.map((product) => (
              <p key={product.id}>
                <strong>{product.name}.</strong> {product.reason}{" "}
                <a href={product.sourceUrl} target="_blank" rel="noreferrer">Open source record</a>
              </p>
            ))}
          </div>
        </details>

        <aside className="gui-method-note">
          <div>
            <strong>Fit is not code availability.</strong>
            <p>Public source can make a claim code-verifiable, but it never adds fit points. Proprietary GUIs can be a strong fit when first-party documentation establishes the required workflow mechanisms.</p>
          </div>
          <a href="/methodology#gui-classification">Read the classification rules</a>
        </aside>
      </div>
    </section>
  );
}
