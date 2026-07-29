import type {
  EcosystemSignalSnapshot,
  GitHubReleaseDownloadSignal,
  Harness,
  OpenRouterAttributionSnapshot,
  OpenRouterUsageWindow,
  OpenRouterUsageWindowKey,
} from "@/lib/types";

export type UsageProduct = Pick<Harness, "id" | "slug" | "name" | "tagline" | "logo">;

export type OpenRouterUsageRecord = UsageProduct & {
  windows: Record<OpenRouterUsageWindowKey, OpenRouterUsageWindow>;
};

export type EcosystemUsageRecord = UsageProduct & {
  signal: EcosystemSignalSnapshot;
};

export type ReleaseActivityRecord = UsageProduct & {
  signal: GitHubReleaseDownloadSignal;
};

export function buildRecentReleaseActivity({
  harnesses,
  ecosystemSignals,
  limit = 6,
}: {
  harnesses: Harness[];
  ecosystemSignals: EcosystemSignalSnapshot[];
  limit?: number;
}): ReleaseActivityRecord[] {
  const activeHarnessById = new Map(
    harnesses
      .filter((harness) => harness.status === "active")
      .map((harness) => [harness.id, harness]),
  );

  return ecosystemSignals
    .flatMap((signal): ReleaseActivityRecord[] => {
      if (signal.source !== "github-releases") return [];
      const harness = activeHarnessById.get(signal.harnessId);
      if (!harness) return [];
      return [{
        id: harness.id,
        slug: harness.slug,
        name: harness.name,
        tagline: harness.tagline,
        logo: harness.logo,
        signal,
      }];
    })
    .sort((left, right) => (
      right.signal.latestReleaseAt.localeCompare(left.signal.latestReleaseAt)
      || right.signal.value - left.signal.value
      || left.name.localeCompare(right.name)
    ))
    .slice(0, Math.max(0, limit));
}

export function buildUsageViewRecords({
  harnesses,
  openRouterSnapshots,
  ecosystemSignals,
}: {
  harnesses: Harness[];
  openRouterSnapshots: OpenRouterAttributionSnapshot[];
  ecosystemSignals: EcosystemSignalSnapshot[];
}) {
  const activeHarnesses = harnesses.filter((harness) => harness.status === "active");
  const harnessById = new Map(activeHarnesses.map((harness) => [harness.id, harness]));
  const productFor = (harnessId: string): UsageProduct | null => {
    const harness = harnessById.get(harnessId);
    if (!harness) return null;
    return {
      id: harness.id,
      slug: harness.slug,
      name: harness.name,
      tagline: harness.tagline,
      logo: harness.logo,
    };
  };

  const openRouterRecords = openRouterSnapshots.flatMap((snapshot): OpenRouterUsageRecord[] => {
    const product = productFor(snapshot.harnessId);
    return product ? [{ ...product, windows: snapshot.windows }] : [];
  });
  const ecosystemRecords = ecosystemSignals.flatMap((signal): EcosystemUsageRecord[] => {
    const product = productFor(signal.harnessId);
    return product ? [{ ...product, signal }] : [];
  });

  return {
    activeHarnessCount: activeHarnesses.length,
    openRouterRecords,
    ecosystemRecords,
  };
}
