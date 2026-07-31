import type {
  EcosystemSignalSnapshot,
  Harness,
  HarnessReleaseSnapshot,
  OpenRouterAttributionSnapshot,
  OpenRouterTrendingWindowKey,
  OpenRouterUsageWindow,
  OpenRouterUsageWindowKey,
} from "@/lib/types";

export type UsageProduct = Pick<Harness, "id" | "slug" | "name" | "tagline" | "logo">;

export type OpenRouterUsageRecord = UsageProduct & {
  appSlug: string;
  appUrl: string;
  windows: Record<OpenRouterUsageWindowKey, OpenRouterUsageWindow>;
  trendingWindows: Record<OpenRouterTrendingWindowKey, OpenRouterUsageWindow>;
};

export type EcosystemUsageRecord = UsageProduct & {
  signal: EcosystemSignalSnapshot;
};

export type ReleaseActivityRecord = UsageProduct & {
  signal: HarnessReleaseSnapshot;
};

export function buildRecentReleaseActivity({
  harnesses,
  releaseSnapshots,
  limit,
}: {
  harnesses: Harness[];
  releaseSnapshots: HarnessReleaseSnapshot[];
  limit?: number;
}): ReleaseActivityRecord[] {
  const activeHarnessById = new Map(
    harnesses
      .filter((harness) => harness.status === "active")
      .map((harness) => [harness.id, harness]),
  );

  const records = releaseSnapshots
    .flatMap((signal): ReleaseActivityRecord[] => {
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
      || right.signal.recentReleaseCount - left.signal.recentReleaseCount
      || left.name.localeCompare(right.name)
    ))
  return limit === undefined ? records : records.slice(0, Math.max(0, limit));
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
  const products = activeHarnesses
    .map((harness): UsageProduct => ({
      id: harness.id,
      slug: harness.slug,
      name: harness.name,
      tagline: harness.tagline,
      logo: harness.logo,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  const productById = new Map(products.map((product) => [product.id, product]));
  const productFor = (harnessId: string): UsageProduct | null => {
    return productById.get(harnessId) ?? null;
  };

  const openRouterRecords = openRouterSnapshots.flatMap((snapshot): OpenRouterUsageRecord[] => {
    const product = productFor(snapshot.harnessId);
    return product ? [{
      ...product,
      appSlug: snapshot.appSlug,
      appUrl: snapshot.sourceUrl,
      windows: snapshot.windows,
      trendingWindows: snapshot.trendingWindows,
    }] : [];
  });
  const ecosystemRecords = ecosystemSignals.flatMap((signal): EcosystemUsageRecord[] => {
    const product = productFor(signal.harnessId);
    return product ? [{ ...product, signal }] : [];
  });

  return {
    activeHarnessCount: products.length,
    products,
    openRouterRecords,
    ecosystemRecords,
  };
}
