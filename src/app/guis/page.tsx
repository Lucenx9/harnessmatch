import "../styles/guis.css";
import "../styles/responsive.css";
import type { Metadata } from "next";
import Link from "next/link";
import { GuiLiveSignals } from "@/components/gui-live-signals";
import { GuiWorkflowMatcher } from "@/components/gui-workflow-matcher";
import { guiEcosystemSignalSnapshots } from "@/data/gui-ecosystem-signals";
import { guiExclusions, guiProducts } from "@/data/gui-products";
import { guiRepositoryAudits } from "@/data/gui-repository-audits";
import { guiWorkflows } from "@/lib/gui-fit";
import {
  buildGuiLiveSignalsViewModel,
  buildGuiWorkflowMatcherViewModel,
} from "@/lib/gui-view-models";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Coding agent GUIs",
  description:
    "Compare coding-agent GUIs with daily public activity signals and evidence-backed workflow, platform, source-access, and mechanism data.",
  path: "/guis",
});

const liveSignalsViewModel = buildGuiLiveSignalsViewModel(
  guiProducts,
  guiEcosystemSignalSnapshots,
);
const workflowMatcherViewModel = buildGuiWorkflowMatcherViewModel(
  guiProducts,
  guiRepositoryAudits,
  guiWorkflows,
);

export default function GuisPage() {
  return (
    <section className="section page-section gui-page">
      <div className="shell wide-shell">
        <div className="page-intro gui-page-intro">
          <p className="eyebrow">Interface layer</p>
          <h1>Coding-agent GUI landscape.</h1>
          <p>Inspect source-separated public activity, platform support, workflow fit, and documented mechanisms. Popularity and quality remain separate.</p>
        </div>

        <GuiLiveSignals viewModel={liveSignalsViewModel} />

        <GuiWorkflowMatcher viewModel={workflowMatcherViewModel} />

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
            <p>General chat surfaces stay outside this catalog. A coding-agent GUI must expose repository work, execution, or review.</p>
          </div>
          <Link href="/methodology#gui-classification">Read the classification rules</Link>
        </aside>
      </div>
    </section>
  );
}
