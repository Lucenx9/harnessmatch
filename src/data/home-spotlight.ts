import type { Harness, HarnessLogo } from "@/lib/types";

export type HomeSpotlightPeriod = {
  year: number;
  month: number;
};

export type HomeSpotlightSelection = {
  harnessId: string;
  angle: string;
  limitation: string;
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
  period: { year: 2026, month: 8 },
  selections: [
    {
      harnessId: "claude-code",
      angle: "Integrated product",
      limitation:
        "Hosted model access is Claude-only, local open-weight models are unsupported, and Chrome integration requires a direct Anthropic plan",
    },
    {
      harnessId: "deepagents-code",
      angle: "Extensible harness",
      limitation:
        "Local execution is host-first and trusts the working directory; project artifacts can influence the agent before the first approval prompt",
    },
    {
      harnessId: "mini-swe-agent",
      angle: "Minimal harness",
      limitation:
        "The default local environment executes directly with the user's host privileges; isolation is opt-in",
    },
  ],
} as const satisfies {
  period: HomeSpotlightPeriod;
  selections: readonly HomeSpotlightSelection[];
};

const periodFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatHomeSpotlightPeriod(period: HomeSpotlightPeriod): string {
  if (!Number.isInteger(period.year) || !Number.isInteger(period.month) || period.month < 1 || period.month > 12) {
    throw new Error("Monthly spotlight period must contain a valid year and month");
  }

  return periodFormatter.format(new Date(Date.UTC(period.year, period.month - 1, 1)));
}

export function buildHomeSpotlightRecords(
  catalog: readonly Harness[],
  selections: readonly HomeSpotlightSelection[] = homeSpotlight.selections,
): HomeSpotlightRecord[] {
  if (selections.length === 0 || selections.length > 3) {
    throw new Error("Monthly spotlight requires between one and three harnesses");
  }

  const catalogById = new Map(catalog.map((harness) => [harness.id, harness] as const));
  const seenHarnessIds = new Set<string>();
  const records = selections.map((selection) => {
    if (seenHarnessIds.has(selection.harnessId)) {
      throw new Error(`Monthly spotlight references a duplicate harness: ${selection.harnessId}`);
    }
    seenHarnessIds.add(selection.harnessId);

    const harness = catalogById.get(selection.harnessId);
    if (!harness) {
      throw new Error(`Monthly spotlight references unknown harness: ${selection.harnessId}`);
    }
    if (harness.status !== "active") {
      throw new Error(`Monthly spotlight requires an active harness: ${selection.harnessId}`);
    }

    const documentedTradeoffs = new Set(harness.tradeoffs);
    if (!documentedTradeoffs.has(selection.limitation)) {
      throw new Error(`Monthly spotlight references a changed trade-off: ${selection.harnessId}`);
    }

    return {
      id: harness.id,
      slug: harness.slug,
      name: harness.name,
      logo: harness.logo,
      angle: selection.angle,
      tagline: harness.tagline,
      limitation: selection.limitation,
      verifiedAt: harness.verifiedAt,
    };
  });

  return records.toSorted((left, right) => left.name.localeCompare(right.name, "en"));
}
