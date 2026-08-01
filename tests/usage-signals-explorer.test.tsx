import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import UsagePage from "../src/app/usage/page";
import { UsageSignalsExplorer } from "../src/components/usage-signals-explorer";
import { ecosystemSignalSnapshots } from "../src/data/ecosystem-signals";
import { harnesses } from "../src/data/harnesses";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution";
import { buildUsageViewRecords } from "../src/lib/usage-view";

describe("usage signals explorer", () => {
  it("puts interpretation rules before the explorer and keeps methodology secondary", () => {
    const html = renderToStaticMarkup(<UsagePage />);

    expect(html.indexOf("Different units")).toBeLessThan(html.indexOf("Usage explorer view"));
    expect(html).toContain("Missing is not zero");
    expect(html).toContain("Context, not quality");
    expect(html).toContain("How to read the source views");
    expect(html).toContain("Sources and API records");
    expect(html).not.toContain("Explore usage");
    expect(html).not.toContain("Source-separated rankings");
  });

  it("renders missing OpenRouter window data as not listed rather than zero traffic", () => {
    const records = buildUsageViewRecords({
      harnesses,
      openRouterSnapshots: openRouterAttributionSnapshots,
      ecosystemSignals: ecosystemSignalSnapshots,
    });
    const record = records.openRouterRecords[0];
    if (!record) throw new Error("Expected at least one OpenRouter usage record.");
    const unlistedRecord = {
      ...record,
      windows: {
        ...record.windows,
        week: {
          ...record.windows.week,
          rank: null,
          attributedTokens: null,
          attributedRequests: null,
        },
      },
    };

    const html = renderToStaticMarkup(
      <UsageSignalsExplorer
        products={records.products}
        openRouterRecords={[unlistedRecord]}
        ecosystemRecords={[]}
        activeHarnessCount={records.activeHarnessCount}
      />,
    );

    expect(html).toContain("Not listed");
    expect(html).not.toContain("No attributed traffic");
    expect(html).not.toContain("No attributed requests");
  });
});
