import type { EvidenceSource } from "@/lib/types";

export type EvidenceTopic = NonNullable<EvidenceSource["topic"]> | "additional";

export const evidencePreviewLimit = 3;
export const evidenceTopicLabels: Record<EvidenceTopic, string> = {
  "product-surfaces": "Product and interfaces",
  "execution-control": "Execution and control",
  "orchestration-state": "Agents, state and recovery",
  "automation-extensions": "Automation and extensions",
  "enterprise-operations": "Enterprise and operations",
  "releases-code-audit": "Releases and public code audit",
  additional: "Additional first-party sources",
};
export const evidenceTopicOrder: readonly EvidenceTopic[] = [
  "product-surfaces",
  "execution-control",
  "orchestration-state",
  "automation-extensions",
  "enterprise-operations",
  "releases-code-audit",
  "additional",
];
