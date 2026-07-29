import type { Harness } from "@/lib/types";

export type HarnessRecord = Omit<Harness, "featureClaims">;
