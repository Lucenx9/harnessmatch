import { VisualIcon } from "@/components/visual-icon";
import type { VisualIconName } from "@/components/visual-icon";
import { guiCapabilityLabels, guiProducts } from "@/data/gui-products";
import { guiRepositoryAudits } from "@/data/gui-repository-audits";
import { guiWorkflows } from "@/lib/gui-fit";
import { summarizeGuiCatalog } from "@/lib/gui-stats";
import type { GuiWorkflowId } from "@/lib/gui-types";

const workflowIcons: Record<GuiWorkflowId, VisualIconName> = {
  "focused-review": "focused-review",
  "parallel-local": "parallel-local",
  "remote-control": "remote-control",
  "team-workspace": "team-workspace",
};

function CoverageCells({ documented, total, label }: { documented: number; total: number; label: string }) {
  return (
    <span className="gui-coverage-cells" role="img" aria-label={`${documented} of ${total} ${label}`}>
      {Array.from({ length: total }, (_, index) => index + 1).map((position) => (
        <i className={position <= documented ? "is-documented" : undefined} aria-hidden="true" key={`${label}-${position}`} />
      ))}
    </span>
  );
}

export function GuiLandscapeStats() {
  const stats = summarizeGuiCatalog(guiProducts, guiRepositoryAudits, guiWorkflows);

  return (
    <section className="gui-landscape" aria-labelledby="gui-landscape-title">
      <header className="gui-landscape-header">
        <div>
          <h2 id="gui-landscape-title">GUI landscape</h2>
          <p>Catalog coverage from first-party records. Counts describe documented product mechanisms, not quality or popularity.</p>
        </div>
        <time dateTime={stats.verifiedAt}>Checked {stats.verifiedAt}</time>
      </header>

      <dl className="gui-landscape-kpis">
        <div>
          <dt>Active interfaces</dt>
          <dd>{stats.activeProducts}</dd>
          <dd className="gui-landscape-kpi-note">{stats.nativeProducts} native, {stats.multiHarnessProducts} multi-harness</dd>
        </div>
        <div>
          <dt>Documented mechanisms</dt>
          <dd>{stats.documentedClaims}<span>/{stats.totalClaims}</span></dd>
          <dd className="gui-landscape-kpi-note">Unknown stays unscored</dd>
        </div>
        <div>
          <dt>First-party sources</dt>
          <dd>{stats.evidenceSources}</dd>
          <dd className="gui-landscape-kpi-note">Unique source records</dd>
        </div>
        <div>
          <dt>Code audits</dt>
          <dd>{stats.codeAudits}</dd>
          <dd className="gui-landscape-kpi-note">Exact commits inspected</dd>
        </div>
      </dl>

      <div className="gui-landscape-detail-grid">
        <section className="gui-capability-coverage" aria-labelledby="gui-capability-coverage-title">
          <header>
            <h3 id="gui-capability-coverage-title">Documented across the catalog</h3>
            <span>products with first-party evidence</span>
          </header>
          <ul>
            {stats.capabilityCoverage.map((capability) => (
              <li key={capability.key}>
                <div>
                  <strong>{guiCapabilityLabels[capability.key]}</strong>
                  <span>{capability.documented}/{capability.total}</span>
                </div>
                <CoverageCells
                  documented={capability.documented}
                  total={capability.total}
                  label={`products document ${guiCapabilityLabels[capability.key]}`}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="gui-catalog-composition" aria-labelledby="gui-platform-coverage-title">
          <header>
            <h3 id="gui-platform-coverage-title">Platform availability</h3>
            <span>documented product support</span>
          </header>
          <ul>
            {stats.platformCoverage.map((platform) => (
              <li key={platform.platform}>
                <div>
                  <strong>{platform.platform}</strong>
                  <span>{platform.products}/{platform.total}</span>
                </div>
                <CoverageCells
                  documented={platform.products}
                  total={platform.total}
                  label={`products support ${platform.platform}`}
                />
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Public code</dt><dd>{stats.publicCodeProducts}</dd></div>
            <div><dt>Proprietary</dt><dd>{stats.proprietaryProducts}</dd></div>
            <div><dt>Media previews</dt><dd>{stats.previews}</dd></div>
          </dl>
        </section>
      </div>

      <section className="gui-workflow-snapshot" aria-labelledby="gui-workflow-snapshot-title">
        <header>
          <h3 id="gui-workflow-snapshot-title">Fit under current evidence</h3>
          <p>Required mechanisms gate eligibility. Preferred mechanisms separate strong from good fit.</p>
        </header>
        <div>
          {stats.workflowCoverage.map((workflow) => (
            <article key={workflow.id}>
              <VisualIcon name={workflowIcons[workflow.id]} />
              <h4>{workflow.label}</h4>
              <dl>
                <div><dt>Strong</dt><dd>{workflow.counts.strong}</dd></div>
                {workflow.counts.good > 0 && <div><dt>Good</dt><dd>{workflow.counts.good}</dd></div>}
                {workflow.counts.conditional > 0 && <div><dt>Conditional</dt><dd>{workflow.counts.conditional}</dd></div>}
                {workflow.counts["not-eligible"] > 0 && <div><dt>Not eligible</dt><dd>{workflow.counts["not-eligible"]}</dd></div>}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
