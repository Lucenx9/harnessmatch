import { featureClaimsForHarness } from "./feature-claims";
import { harnessRecords } from "./harness-records";
import type { Harness } from "../lib/types";

export const harnesses: Harness[] = harnessRecords.map((harness) => ({
  ...harness,
  featureClaims: featureClaimsForHarness(harness),
}));

export const harnessBySlug = new Map(harnesses.map((harness) => [harness.slug, harness]));
