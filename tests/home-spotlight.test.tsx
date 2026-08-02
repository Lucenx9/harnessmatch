// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "../src/app/page";
import { HomeSpotlight } from "../src/components/home-spotlight";
import { harnesses } from "../src/data/harnesses";
import {
  buildHomeSpotlightRecords,
  formatHomeSpotlightPeriod,
  homeSpotlight,
} from "../src/data/home-spotlight";

const spotlightRecords = buildHomeSpotlightRecords(harnesses);

describe("monthly homepage spotlight", () => {
  it("keeps the August selection bounded, active, and alphabetical", () => {
    expect(formatHomeSpotlightPeriod(homeSpotlight.period)).toBe("August 2026");
    expect(homeSpotlight.selections.length).toBeGreaterThan(0);
    expect(homeSpotlight.selections.length).toBeLessThanOrEqual(3);
    expect(new Set(homeSpotlight.selections.map(({ harnessId }) => harnessId)).size).toBe(3);
    expect(spotlightRecords.map(({ id }) => id)).toEqual([
      "claude-code",
      "deepagents-code",
      "mini-swe-agent",
    ]);

    for (const record of spotlightRecords) {
      const harness = harnesses.find(({ id }) => id === record.id);
      const selection = homeSpotlight.selections.find(({ harnessId }) => harnessId === record.id);
      expect(harness?.status).toBe("active");
      expect(harness?.tradeoffs).toContain(record.limitation);
      expect(record.limitation).toBe(selection?.limitation);
      expect(record.verifiedAt).toBe(harness?.verifiedAt);
    }
  });

  it("requires the edition to match the current UTC month", () => {
    const now = new Date();

    expect(homeSpotlight.period).toEqual({
      year: now.getUTCFullYear(),
      month: now.getUTCMonth() + 1,
    });
  });

  it("fails closed for duplicate harnesses and changed trade-offs", () => {
    const firstSelection = homeSpotlight.selections[0];

    expect(() => buildHomeSpotlightRecords(harnesses, [firstSelection, firstSelection])).toThrow(
      /duplicate harness/i,
    );
    expect(() =>
      buildHomeSpotlightRecords(harnesses, [
        { ...firstSelection, limitation: "A limitation that is not in the catalog" },
      ]),
    ).toThrow(/changed trade-off/i);
  });

  it("renders the editorial disclaimer, evidence paths, and focused comparison", () => {
    const html = renderToStaticMarkup(
      <HomeSpotlight
        period={formatHomeSpotlightPeriod(homeSpotlight.period)}
        records={spotlightRecords}
      />,
    );

    expect(html).toContain("Under the lens: August 2026.");
    expect(html).toContain("selected by HarnessMatch");
    expect(html).toMatch(/not a ranking/i);
    expect(html).toContain("comparative product trials");
    expect(html).toContain(
      'href="/compare?ids=claude-code,deepagents-code,mini-swe-agent"',
    );

    const document = new DOMParser().parseFromString(html, "text/html");
    const renderedLimitations = Array.from(
      document.querySelectorAll(".home-spotlight-notes > div:last-child dd"),
      (element) => element.textContent,
    );

    for (const record of spotlightRecords) {
      expect(html).toContain(`href="/harnesses/${record.slug}"`);
    }
    expect(renderedLimitations).toEqual(spotlightRecords.map(({ limitation }) => limitation));
  });

  it("keeps count copy accurate for empty and single-item states", () => {
    const firstRecord = spotlightRecords[0];
    if (!firstRecord) throw new Error("Expected a spotlight record for the count-copy test");

    const singleHtml = renderToStaticMarkup(
      <HomeSpotlight period="August 2026" records={[firstRecord]} />,
    );
    const emptyHtml = renderToStaticMarkup(
      <HomeSpotlight period="August 2026" records={[]} />,
    );

    expect(singleHtml).toContain("One contrasting harness selected");
    expect(singleHtml).toContain("Compare this harness");
    expect(emptyHtml).toContain("No contrasting harnesses selected");
    expect(emptyHtml).not.toContain("Compare these");
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
