import type { Metadata } from "next";
import { HarnessLensExplorer } from "@/components/harness-lens-explorer";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";

export const metadata: Metadata = {
  title: "Coding harness profiles",
};

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
          harnesses={harnesses.map((harness) => ({
            id: harness.id,
            slug: harness.slug,
            name: harness.name,
            logo: harness.logo,
            tagline: harness.tagline,
            layer: getHarnessMembershipAssessment(harness)!.layer,
            role: harness.classification.role,
            orchestration: harness.classification.orchestration,
            runtime: harness.classification.runtime,
            isolation: harness.classification.isolation,
            state: harness.classification.state,
            interfaces: harness.interfaces,
            providerStyle: harness.providerStyle,
            features: harness.features,
            evidenceCount: harness.evidence.length,
            verifiedAt: harness.verifiedAt,
          }))}
        />
      </div>
    </section>
  );
}
