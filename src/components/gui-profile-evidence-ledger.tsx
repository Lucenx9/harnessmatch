import { ProfileEvidenceLedger } from "@/components/profile-evidence-ledger";
import {
  guiEvidencePreviewLimit,
  guiEvidenceTopicLabels,
  guiEvidenceTopicOrder,
} from "@/lib/gui-evidence-topics";
import type { GuiEvidenceSource } from "@/lib/gui-types";

export function GuiProfileEvidenceLedger({
  sources,
  recordVerifiedAt,
}: {
  sources: readonly GuiEvidenceSource[];
  recordVerifiedAt: string;
}) {
  return (
    <ProfileEvidenceLedger
      sources={sources}
      recordVerifiedAt={recordVerifiedAt}
      recordLabel="GUI record"
      headingId="gui-evidence-heading"
      description="Sources establish specific current GUI claims; their count does not add fit points."
      topicOrder={guiEvidenceTopicOrder}
      topicLabels={guiEvidenceTopicLabels}
      previewLimit={guiEvidencePreviewLimit}
    />
  );
}
