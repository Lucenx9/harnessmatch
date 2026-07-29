import rawReleaseSnapshots from "./release-signals.json";
import type { HarnessReleaseSnapshot } from "@/lib/types";

export const harnessReleaseSnapshots: HarnessReleaseSnapshot[] = rawReleaseSnapshots.map((snapshot) => {
  if (!["full-source", "client-source", "support-repository"].includes(snapshot.repositoryScope)) {
    throw new Error(`Invalid repository scope in generated release snapshot for ${snapshot.harnessId}`);
  }
  return {
    ...snapshot,
    repositoryScope: snapshot.repositoryScope as HarnessReleaseSnapshot["repositoryScope"],
  };
});

export const releaseSnapshotByHarness = new Map(
  harnessReleaseSnapshots.map((snapshot) => [snapshot.harnessId, snapshot]),
);
