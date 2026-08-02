import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "../src/app/page";
import { HomeSpotlight } from "../src/components/home-spotlight";
import { harnesses } from "../src/data/harnesses";
import {
  buildHomeSpotlightRecords,
  homeSpotlight,
} from "../src/data/home-spotlight";

const spotlightRecords = buildHomeSpotlightRecords(harnesses);

describe("monthly homepage spotlight", () => {
  it("keeps the August selection bounded, active, and alphabetical", () => {
    expect(homeSpotlight.period).toBe("August 2026");
    expect(homeSpotlight.selections).toHaveLength(3);
    expect(new Set(homeSpotlight.selections.map(({ harnessId }) => harnessId)).size).toBe(3);
    expect(spotlightRecords.map(({ id }) => id)).toEqual([
      "claude-code",
      "deepagents-code",
      "mini-swe-agent",
    ]);

    for (const record of spotlightRecords) {
      const harness = harnesses.find(({ id }) => id === record.id);
      expect(harness?.status).toBe("active");
      expect(harness?.tradeoffs).toContain(record.limitation);
      expect(record.verifiedAt).toBe(harness?.verifiedAt);
    }
  });

  it("renders the editorial disclaimer, evidence paths, and focused comparison", () => {
    const html = renderToStaticMarkup(
      <HomeSpotlight period={homeSpotlight.period} records={spotlightRecords} />,
    );

    expect(html).toContain("Under the lens: August 2026.");
    expect(html).toContain("selected by HarnessMatch");
    expect(html).toMatch(/not a ranking/i);
    expect(html).toContain("comparative product trials");
    expect(html).toContain(
      'href="/compare?ids=claude-code,deepagents-code,mini-swe-agent"',
    );

    for (const record of spotlightRecords) {
      expect(html).toContain(`href="/harnesses/${record.slug}"`);
      expect(html).toContain(record.limitation.replaceAll("'", "&#x27;"));
    }
  });

  it("places the spotlight between usage signals and the full catalog", () => {
    const html = renderToStaticMarkup(<HomePage />);
    const usagePosition = html.indexOf("Observed usage signals");
    const spotlightPosition = html.indexOf("Under the lens: August 2026.");
    const catalogPosition = html.indexOf("Browse all harnesses.");

    expect(usagePosition).toBeGreaterThan(-1);
    expect(spotlightPosition).toBeGreaterThan(usagePosition);
    expect(catalogPosition).toBeGreaterThan(spotlightPosition);
  });
});
