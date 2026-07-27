import type { Metadata } from "next";
import { HarnessLensExplorer } from "@/components/harness-lens-explorer";
import { harnesses } from "@/data/harnesses";

export const metadata: Metadata = {
  title: "Coding harness profiles",
};

export default function HarnessesPage() {
  return (
    <section className="section page-section">
      <div className="shell">
        <div className="page-intro">
          <span className="eyebrow">Catalog</span>
          <h1>AI coding harness profiles.</h1>
          <p>Each profile uses the same role, orchestration, runtime, and capability schema, then links every claim group to first-party evidence.</p>
        </div>
        <HarnessLensExplorer
          initialVisibleCount={12}
          harnesses={harnesses.map((harness) => ({
            id: harness.id,
            slug: harness.slug,
            name: harness.name,
            logo: harness.logo,
            tagline: harness.tagline,
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
