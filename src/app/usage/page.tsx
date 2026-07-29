import type { Metadata } from "next";
import { UsageSignalsExplorer } from "@/components/usage-signals-explorer";
import { ecosystemSignalSnapshots } from "@/data/ecosystem-signals";
import { harnesses } from "@/data/harnesses";
import { openRouterAttributionSnapshots } from "@/data/openrouter-attribution";
import { pageMetadata } from "@/lib/site";
import { buildUsageViewRecords } from "@/lib/usage-view";

export const metadata: Metadata = pageMetadata({
  title: "Coding harness usage signals",
  description:
    "Compare source-separated routing, package, release, editor-marketplace, and repository signals for AI coding harnesses over time.",
  path: "/usage",
});

export default function UsagePage() {
  const { activeHarnessCount, openRouterRecords, ecosystemRecords } = buildUsageViewRecords({
    harnesses,
    openRouterSnapshots: openRouterAttributionSnapshots,
    ecosystemSignals: ecosystemSignalSnapshots,
  });

  return (
    <section className="section page-section usage-page">
      <div className="shell wide-shell">
        <div className="page-intro usage-page-intro">
          <h1>Coding harness usage signals</h1>
          <p>Compare public signals from eight source views. Each keeps its own unit, time window, coverage, and limitations, so you can inspect adoption context without confusing it with quality.</p>
        </div>

        <UsageSignalsExplorer
          openRouterRecords={openRouterRecords}
          ecosystemRecords={ecosystemRecords}
          activeHarnessCount={activeHarnessCount}
        />

        <section className="usage-scope" aria-labelledby="usage-scope-heading">
          <div>
            <h2 id="usage-scope-heading">Why these sources stay separate</h2>
            <p>OpenRouter tokens, Homebrew install events, package downloads, editor installs, and repository activity observe different populations. Adding them together would create a precise-looking but invalid total.</p>
          </div>
          <dl>
            <div>
              <dt>Routing</dt>
              <dd>OpenRouter attributed tokens and requests over completed 1-day, 7-day, and 30-day UTC windows.</dd>
            </div>
            <div>
              <dt>Distribution</dt>
              <dd>Homebrew 30d events, npm last-month downloads, and cumulative downloads of explicitly matched stable GitHub release assets.</dd>
            </div>
            <div>
              <dt>Editor marketplaces</dt>
              <dd>Cumulative VS Code installs, Open VSX downloads, and JetBrains downloads for exact mapped extensions or plugins.</dd>
            </div>
            <div>
              <dt>Repository interest</dt>
              <dd>GitHub stars and forks for the repository already audited by HarnessMatch, with full, client, or support scope preserved.</dd>
            </div>
          </dl>
        </section>

        <aside className="usage-source-note" aria-label="Usage signal source notes">
          <p>All records are refreshed from public or authenticated source APIs and joined only through an explicit artifact mapping. Coverage gaps remain visible and no popularity signal affects capability claims or classifications.</p>
          <div>
            <a href="https://openrouter.ai/docs/agent-sdk/typescript/api-reference/datasets" target="_blank" rel="noreferrer">OpenRouter dataset</a>
            <a href="https://formulae.brew.sh/docs/api/" target="_blank" rel="noreferrer">Homebrew API</a>
            <a href="https://github.com/npm/download-counts" target="_blank" rel="noreferrer">npm downloads API</a>
            <a href="https://docs.github.com/en/rest/releases/releases" target="_blank" rel="noreferrer">GitHub releases API</a>
            <a href="https://learn.microsoft.com/en-us/javascript/api/azure-devops-extension-api/eventcounts" target="_blank" rel="noreferrer">Marketplace metric</a>
            <a href="https://github.com/eclipse-openvsx/openvsx" target="_blank" rel="noreferrer">Open VSX registry</a>
            <a href="https://plugins.jetbrains.com/docs/marketplace/api-reference.html" target="_blank" rel="noreferrer">JetBrains API</a>
            <a href="https://docs.github.com/en/rest/activity/starring" target="_blank" rel="noreferrer">GitHub stars API</a>
            <a href="/methodology#eligibility">Evidence policy</a>
          </div>
        </aside>
      </div>
    </section>
  );
}
