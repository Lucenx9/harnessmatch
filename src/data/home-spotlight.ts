import type { Harness, HarnessLogo } from "@/lib/types";

type HomeSpotlightSelection = {
  harnessId: string;
  angle: string;
  tradeoffIndex: number;
};

export type HomeSpotlightRecord = {
  id: string;
  slug: string;
  name: string;
  logo: HarnessLogo;
  angle: string;
  tagline: string;
  limitation: string;
  verifiedAt: string;
};

export const homeSpotlight = {
  period: "August 2026",
  selections: [
    { harnessId: "claude-code", angle: "Integrated product", tradeoffIndex: 4 },
    { harnessId: "deepagents-code", angle: "Extensible harness", tradeoffIndex: 0 },
    { harnessId: "mini-swe-agent", angle: "Minimal harness", tradeoffIndex: 0 },
  ],
} as const satisfies {
  period: string;
  selections: readonly HomeSpotlightSelection[];
};

export function buildHomeSpotlightRecords(catalog: readonly Harness[]): HomeSpotlightRecord[] {
  const records = homeSpotlight.selections.map((selection) => {
    const harness = catalog.find(({ id }) => id === selection.harnessId);
    if (!harness) {
      throw new Error(`Monthly spotlight references unknown harness: ${selection.harnessId}`);
    }
    if (harness.status !== "active") {
      throw new Error(`Monthly spotlight requires an active harness: ${selection.harnessId}`);
    }

    const limitation = harness.tradeoffs[selection.tradeoffIndex];
    if (!limitation) {
      throw new Error(`Monthly spotlight references a missing trade-off: ${selection.harnessId}`);
    }

    return {
      id: harness.id,
      slug: harness.slug,
      name: harness.name,
      logo: harness.logo,
      angle: selection.angle,
      tagline: harness.tagline,
      limitation,
      verifiedAt: harness.verifiedAt,
    };
  });

  return records.toSorted((left, right) => left.name.localeCompare(right.name, "en"));
}
