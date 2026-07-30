import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuiLogo } from "@/components/gui-logo";
import { GuiProductPreview } from "@/components/gui-product-preview";
import { VisualIcon } from "@/components/visual-icon";
import type { VisualIconName } from "@/components/visual-icon";
import { guiProductById, guiProducts } from "@/data/gui-products";
import { guiCapabilityLabels } from "@/lib/gui-labels";
import { guiEcosystemSignalsByProduct } from "@/data/gui-ecosystem-signals";
import { guiRepositoryAuditFor } from "@/data/gui-repository-audits";
import { namedHarnesses } from "@/lib/gui-harness-coverage";
import { guiProfileDescription, pageMetadata } from "@/lib/site";
import type { GuiCapabilityKey, GuiClaimState, GuiLayer, GuiSourceAccess } from "@/lib/gui-types";

export const dynamicParams = false;

const layerLabels: Record<GuiLayer, string> = {
  "harness-native": "Harness-native GUI",
  "multi-harness-workspace": "Multi-harness workspace",
};

const sourceAccessLabels: Record<GuiSourceAccess, string> = {
  "open-source": "Open source",
  "source-available": "Source available",
  proprietary: "Proprietary",
};

const claimStateLabels: Record<GuiClaimState, string> = {
  documented: "Documented",
  unknown: "Not established",
  contradicted: "Contradicted",
};

const evidenceKindLabels = {
  "official-docs": "Official docs",
  "official-repository": "Official repository",
  "official-announcement": "Official announcement",
} as const;

const capabilityIcons: Record<GuiCapabilityKey, VisualIconName> = {
  parallelSessions: "parallel-local",
  workspaceIsolation: "workspace-isolation",
  visualReview: "focused-review",
  remoteExecution: "remote-control",
  teamCollaboration: "team-workspace",
};

const activitySourceOrder = {
  homebrew: 0,
  "github-releases": 1,
  github: 2,
} as const;

export function generateStaticParams() {
  return guiProducts
    .filter((product) => product.status === "active")
    .map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = guiProductById.get(slug);
  if (product?.status !== "active") return {};

  return pageMetadata({
    title: `${product.name} GUI`,
    description: guiProfileDescription(product.name, product.summary),
    path: `/guis/${product.id}`,
  });
}

export default async function GuiProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = guiProductById.get(slug);
  if (product?.status !== "active") notFound();
  const audit = guiRepositoryAuditFor(product.id);
  const namedIntegrations = namedHarnesses(product);
  const activitySignals = (guiEcosystemSignalsByProduct.get(product.id) ?? [])
    .toSorted((left, right) => activitySourceOrder[left.source] - activitySourceOrder[right.source]);

  return (
    <section className="section profile-page gui-profile-page">
      <div className="shell wide-shell profile-shell">
        <header className="profile-header">
          <Link className="gui-profile-back" href="/guis">← GUI catalog</Link>
          <div className="profile-identity">
            <GuiLogo logo={product.logo} name={product.name} size="large" priority />
            <p>{layerLabels[product.layer]}</p>
          </div>

          <h1>{product.name}</h1>
          <p className="profile-tagline">{product.summary}</p>

          <dl className="profile-meta" aria-label={`${product.name} GUI profile metadata`}>
            <div><dt>Status</dt><dd>Active</dd></div>
            <div><dt>License</dt><dd>{product.license}</dd></div>
            <div><dt>Source access</dt><dd>{sourceAccessLabels[product.sourceAccess]}</dd></div>
            <div><dt>Record checked</dt><dd><time dateTime={product.verifiedAt}>{product.verifiedAt}</time></dd></div>
          </dl>

          <div className="button-row profile-actions">
            <a className="button primary" href={product.url} target="_blank" rel="noreferrer">Open product site</a>
            <a className="button secondary" href="#evidence">Inspect sources</a>
          </div>
        </header>

        <div className="profile-analysis-grid">
          <article className="profile-summary-panel">
            <h2>Workflow record</h2>
            <p className="profile-summary">{product.bestFor}</p>
            <div className="profile-considerations-grid">
              <section>
                <div className="profile-consideration-heading">
                  <VisualIcon name="workflow-fit" />
                  <h3>Good choice if</h3>
                </div>
                <p>{product.bestFor}</p>
              </section>
              <section>
                <div className="profile-consideration-heading">
                  <VisualIcon name="check-first" />
                  <h3>Check before choosing</h3>
                </div>
                <p>{product.limitation}</p>
              </section>
            </div>
          </article>

          <aside className="profile-spec-panel" aria-labelledby="gui-quick-facts-heading">
            <h2 id="gui-quick-facts-heading">Quick facts</h2>
            <dl className="profile-spec-list">
              <div><dt>Platforms</dt><dd>{product.platforms.join(", ")}</dd></div>
              <div><dt>GUI layer</dt><dd>{layerLabels[product.layer]}</dd></div>
              <div><dt>Named harnesses</dt><dd>{namedIntegrations.length}</dd></div>
              <div><dt>Arbitrary CLI</dt><dd>{product.acceptsArbitraryCli ? "Documented" : "Not documented"}</dd></div>
              <div><dt>Public activity feeds</dt><dd>{activitySignals.length}</dd></div>
              <div><dt>Code audit</dt><dd>{audit ? "Pinned commit inspected" : "No public implementation"}</dd></div>
              <div><dt>Logo provenance</dt><dd><a href={product.logo.sourceUrl} target="_blank" rel="noreferrer">Official asset</a></dd></div>
            </dl>
          </aside>
        </div>

        {product.preview && <GuiProductPreview id={product.id} name={product.name} preview={product.preview} />}

        {activitySignals.length > 0 && (
          <section className="gui-profile-signals" aria-labelledby="gui-profile-signals-heading">
            <div className="profile-section-heading">
              <div>
                <h2 id="gui-profile-signals-heading">Public activity signals</h2>
                <p>Daily source snapshots provide ecosystem context only. They do not affect workflow fit or capability claims.</p>
              </div>
              <span>{activitySignals.length} mapped source{activitySignals.length === 1 ? "" : "s"}</span>
            </div>
            <ul>
              {activitySignals.map((signal) => (
                <li key={signal.source}>
                  <span>{signal.source === "homebrew"
                    ? "Homebrew distribution"
                    : signal.source === "github-releases" ? "GitHub installers" : "GitHub repository"}</span>
                  <strong>{new Intl.NumberFormat("en-US").format(signal.value)}</strong>
                  <p>{signal.source === "homebrew"
                    ? `install events over 30 days · v${signal.latestVersion.split(",")[0]}`
                    : signal.source === "github-releases"
                      ? `stable installer downloads · ${signal.recentReleaseCount} releases in ${signal.recentReleaseWindowDays} days`
                      : `stars · ${new Intl.NumberFormat("en-US").format(signal.forks)} forks`}</p>
                  <small>Observed <time dateTime={signal.observedAt}>{signal.observedAt}</time></small>
                  <a href={signal.artifactUrl} target="_blank" rel="noreferrer">Open source record</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="profile-support gui-profile-harnesses" aria-labelledby="gui-harnesses-heading">
          <div className="profile-section-heading">
            <div className="profile-section-title-with-icon">
              <VisualIcon name="harness-coverage" />
              <div>
                <h2 id="gui-harnesses-heading">Harness coverage</h2>
                <p>{product.harnessSupportNote}</p>
              </div>
            </div>
            <span>{product.acceptsArbitraryCli
              ? "Custom CLI accepted"
              : `${namedIntegrations.length} named integration${namedIntegrations.length === 1 ? "" : "s"}`}</span>
          </div>
          <ul>
            {namedIntegrations.map((harness) => <li key={harness}>{harness}</li>)}
          </ul>
        </section>

        <section className="gui-profile-capabilities" aria-labelledby="gui-capabilities-heading">
          <div className="profile-section-heading">
            <div>
              <h2 id="gui-capabilities-heading">Workflow mechanisms</h2>
              <p>Unknown means the current first-party record does not establish the mechanism; it is not converted into evidence of absence.</p>
            </div>
            <span>{Object.values(product.capabilities).filter((claim) => claim.state === "documented").length} of 5 documented</span>
          </div>
          <ul>
            {Object.entries(product.capabilities).map(([key, claim]) => (
              <li key={key}>
                <div className="gui-profile-capability-heading">
                  <VisualIcon name={capabilityIcons[key as GuiCapabilityKey]} />
                  <div>
                    <h3>{guiCapabilityLabels[key as keyof typeof guiCapabilityLabels]}</h3>
                    <span className={`gui-claim-state gui-claim-state--${claim.state}`}>{claimStateLabels[claim.state]}</span>
                  </div>
                </div>
                <p>{claim.summary}</p>
                {claim.sourceUrls.length > 0 && (
                  <div className="gui-profile-claim-sources">
                    {claim.sourceUrls.map((url, index) => (
                      <a href={url} target="_blank" rel="noreferrer" key={url}>Source {index + 1}</a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="gui-profile-record-grid">
          <section className="profile-evidence" id="evidence" aria-labelledby="gui-evidence-heading">
            <div className="profile-section-heading">
              <div>
                <h2 id="gui-evidence-heading">First-party evidence</h2>
                <p>Sources establish specific current claims; their count does not add fit points.</p>
              </div>
              <span>{product.evidence.length} source{product.evidence.length === 1 ? "" : "s"}</span>
            </div>
            <div className="profile-evidence-list">
              {product.evidence.map((evidence) => (
                <a href={evidence.url} target="_blank" rel="noreferrer" key={evidence.url}>
                  <span><strong>{evidence.title}</strong><small>{evidence.covers}</small></span>
                  <span className="profile-evidence-meta">
                    <span>{evidenceKindLabels[evidence.kind]}</span>
                    <time dateTime={evidence.verifiedAt}>Checked {evidence.verifiedAt}</time>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <aside className="gui-profile-code-record" aria-labelledby="gui-code-record-heading">
            <h2 id="gui-code-record-heading">Implementation record</h2>
            {audit ? (
              <>
                <p>Inspected at commit <a href={`${audit.repositoryUrl}/tree/${audit.inspectedRef}`} target="_blank" rel="noreferrer"><code>{audit.inspectedRef.slice(0, 12)}</code></a>.</p>
                <ul>{audit.established.map((finding) => <li key={finding}>{finding}</li>)}</ul>
                <details>
                  <summary>Inspected paths</summary>
                  <ul>{audit.inspectedPaths.map((path) => <li key={path}><code>{path}</code></li>)}</ul>
                </details>
                <p className="gui-audit-limitation">{audit.limitation}</p>
              </>
            ) : (
              <p>The GUI implementation is proprietary. Current claims rely on first-party product documentation rather than a public-code inspection.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
