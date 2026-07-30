import {
  ProfileEvidenceLedger,
  type ProfileEvidenceSource,
} from "@/components/profile-evidence-ledger";
import {
  evidencePreviewLimit,
  evidenceTopicLabels,
  evidenceTopicOrder,
  type EvidenceTopic,
} from "@/lib/evidence-topics";
import type { EvidenceSource } from "@/lib/types";

export function HarnessEvidenceLedger({
  sources,
  recordVerifiedAt,
}: {
  sources: readonly EvidenceSource[];
  recordVerifiedAt: string;
}) {
  const ledgerSources: ProfileEvidenceSource<EvidenceTopic>[] = sources.map((source) => ({
    ...source,
    topic: source.topic ?? "additional",
  }));

  return (
    <ProfileEvidenceLedger
      sources={ledgerSources}
      recordVerifiedAt={recordVerifiedAt}
      recordLabel="Product record"
      headingId="evidence-heading"
      description="Each capability claim links to the first-party record that supports it."
      topicOrder={evidenceTopicOrder}
      topicLabels={evidenceTopicLabels}
      previewLimit={evidencePreviewLimit}
    />
  );
}
