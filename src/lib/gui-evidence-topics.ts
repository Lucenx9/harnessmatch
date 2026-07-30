import { guiEvidenceTopics, type GuiEvidenceTopic } from "@/lib/gui-types";

export const guiEvidencePreviewLimit = 3;

export const guiEvidenceTopicLabels: Record<GuiEvidenceTopic, string> = {
  "product-workflow": "Product and workflow",
  "harness-integrations": "Harness integrations",
  "sessions-isolation-review": "Sessions, isolation and review",
  "remote-collaboration": "Remote and collaboration",
  "public-code": "Public code and implementation",
};

export const guiEvidenceTopicOrder: readonly GuiEvidenceTopic[] = guiEvidenceTopics;
