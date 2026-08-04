import "../styles/responsive.css";
import type { Metadata } from "next";
import { HarnessLensExplorer } from "@/components/harness-lens-explorer";
import { featureSupportFor } from "@/data/feature-claims";
import { requireHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Coding harness profiles",
  description:
    "Browse source-backed AI coding harness profiles by workflow, interfaces, providers, capabilities, trade-offs, and evidence.",
  path: "/harnesses",
});

const activeHarnesses = harnesses.filter((harness) => harness.status === "active");

export default function HarnessesPage() {
  return (
    <section className="section page-section">
      <div className="shell">
        <div className="page-intro">
          <h1>Browse coding harnesses.</h1>
          <p>Filter the catalog, compare practical differences, and open a profile for the complete evidence.</p>
        </div>
        <HarnessLensExplorer
          initialVisibleCount={12}
          cardHeadingLevel={2}
          harnesses={activeHarnesses.map((harness) => ({
            id: harness.id,
            slug: harness.slug,
            name: harness.name,
            logo: harness.logo,
            tagline: harness.tagline,
            layer: requireHarnessMembershipAssessment(harness).layer,
            role: harness.classification.role,
            orchestration: harness.classification.orchestration,
            runtime: harness.classification.runtime,
            isolation: harness.classification.isolation,
            state: harness.classification.state,
            interfaces: harness.interfaces,
            providerStyle: harness.providerStyle,
            featureSupport: featureSupportFor(harness),
            evidenceCount: harness.evidence.length,
            verifiedAt: harness.verifiedAt,
          }))}
        />
      </div>
    </section>
  );
}
