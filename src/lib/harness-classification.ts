import { featureClaimFor, featureClaimSupportsRequirement } from "@/data/feature-claims";
import { isolationModeLabels } from "./harness-labels";
export {
  classificationAxes,
  harnessRoleLabels,
  isolationModeLabels,
  membershipCriterionDescriptions,
  membershipCriterionLabels,
  modelPortabilityDescriptions,
  modelPortabilityLabels,
  orchestrationLabels,
  productLayerLabels,
  runtimePostureLabels,
  stateModelLabels,
} from "./harness-labels";
import type {
  Harness,
  IsolationMode,
  ModelPortability,
} from "./types";

export function modelPortabilityFor(
  harness: Pick<Harness, "providerStyle" | "featureClaims">,
): ModelPortability {
  if (harness.providerStyle === "single-vendor") return "vendor-specific";
  if (harness.providerStyle === "enterprise-routing") return "managed-routing";
  if (featureClaimSupportsRequirement(featureClaimFor(harness, "localModels"))) {
    return "provider-and-local";
  }
  return "provider-choice";
}

export function formatIsolationModes(modes: IsolationMode[]) {
  if (modes.length === 0) return "No first-party isolation";
  return modes.map((mode) => isolationModeLabels[mode]).join(", ");
}
