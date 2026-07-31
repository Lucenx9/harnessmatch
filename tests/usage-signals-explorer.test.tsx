import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { UsageSignalsExplorer } from "../src/components/usage-signals-explorer";
import { ecosystemSignalSnapshots } from "../src/data/ecosystem-signals";
import { harnesses } from "../src/data/harnesses";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution";
import { buildUsageViewRecords } from "../src/lib/usage-view";

describe("usage signals explorer", () => {
  it("renders missing OpenRouter window data as not listed rather than zero traffic", () => {
    const records = buildUsageViewRecords({
      harnesses,
      openRouterSnapshots: openRouterAttributionSnapshots,
      ecosystemSignals: ecosystemSignalSnapshots,
    });
    const unlistedRecord = records.openRouterRecords.find(
      (record) => record.windows.week.attributedTokens === null,
    );

    expect(unlistedRecord).toBeDefined();

    const html = renderToStaticMarkup(
      <UsageSignalsExplorer
        products={records.products}
        openRouterRecords={[unlistedRecord!]}
        ecosystemRecords={[]}
        activeHarnessCount={records.activeHarnessCount}
      />,
    );

    expect(html).toContain("Not listed");
    expect(html).not.toContain("No attributed traffic");
    expect(html).not.toContain("No attributed requests");
  });
});
