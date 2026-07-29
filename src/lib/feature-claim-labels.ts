import type { FeatureClaimState } from "@/lib/types";

export const featureClaimStateLabels: Record<FeatureClaimState, string> = {
  default: "Available by default",
  documented: "Documented",
  optional: "Optional",
  "surface-specific": "Depends on surface",
  "not-documented": "Not documented",
  "explicitly-absent": "No built-in support",
  deprecated: "Deprecated",
};
