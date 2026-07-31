// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HomeUsageSummary } from "../src/components/home-usage-summary";
import { UsageSignalsExplorer } from "../src/components/usage-signals-explorer";
import { ecosystemSignalSnapshots } from "../src/data/ecosystem-signals";
import { harnesses } from "../src/data/harnesses";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution";
import { buildUsageViewRecords } from "../src/lib/usage-view";

const usageRecords = buildUsageViewRecords({
  harnesses,
  openRouterSnapshots: openRouterAttributionSnapshots,
  ecosystemSignals: ecosystemSignalSnapshots,
});

afterEach(cleanup);

describe("usage component interactions", () => {
  it("switches every home summary source and OpenRouter view", () => {
    const { container } = render(
      <HomeUsageSummary {...usageRecords} />,
    );
    const summary = container.querySelector(".home-usage-summary");
    if (!(summary instanceof HTMLElement)) {
      throw new Error("Expected the home usage summary.");
    }
    const view = within(summary);

    const sourceExpectations = [
      ["Homebrew", "Homebrew install events"],
      ["npm", "npm package downloads"],
      ["Releases", "GitHub release downloads"],
      ["VS Code", "VS Code Marketplace installs"],
    ] as const;
    for (const [tab, title] of sourceExpectations) {
      fireEvent.click(view.getByRole("tab", { name: tab }));
      expect(view.getByText(title)).toBeDefined();
    }

    fireEvent.click(view.getByRole("tab", { name: "OpenRouter" }));
    fireEvent.click(view.getByRole("button", { name: "Trending" }));
    fireEvent.click(view.getByRole("button", { name: "30 days" }));

    expect(view.getByText("Trending on OpenRouter")).toBeDefined();
    expect(view.getByText("Window volume")).toBeDefined();

    const openRouterTab = view.getByRole("tab", { name: "OpenRouter" });
    fireEvent.keyDown(openRouterTab, { key: "End" });
    expect(document.activeElement).toBe(view.getByRole("tab", { name: "VS Code" }));
    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(document.activeElement).toBe(openRouterTab);
  });

  it("switches every full explorer source, ranking view, and window", () => {
    const { container } = render(
      <UsageSignalsExplorer {...usageRecords} />,
    );
    const explorer = container.querySelector(".usage-explorer");
    if (!(explorer instanceof HTMLElement)) {
      throw new Error("Expected the usage signals explorer.");
    }
    const view = within(explorer);

    fireEvent.click(view.getByRole("button", { name: "Trending" }));
    fireEvent.click(view.getByRole("tab", { name: "30 days" }));
    expect(view.getByRole("heading", { name: "Trending on OpenRouter" })).toBeDefined();

    const sourceExpectations = [
      ["Homebrew", "Homebrew install events"],
      ["npm", "npm package downloads"],
      ["Releases", "GitHub release asset downloads"],
      ["VS Code", "VS Code Marketplace installs"],
      ["Open VSX", "Open VSX extension downloads"],
      ["JetBrains", "JetBrains Marketplace downloads"],
      ["GitHub", "GitHub repository interest"],
    ] as const;
    for (const [tab, title] of sourceExpectations) {
      fireEvent.click(view.getByRole("tab", { name: tab }));
      expect(view.getByRole("heading", { name: title })).toBeDefined();
    }

    const githubTab = view.getByRole("tab", { name: "GitHub" });
    fireEvent.keyDown(githubTab, { key: "ArrowRight" });
    expect(document.activeElement).toBe(view.getByRole("tab", { name: "OpenRouter" }));

    const showAll = view.queryByRole("button", { name: /Show all/ });
    if (showAll) {
      fireEvent.click(showAll);
      expect(view.getByRole("button", { name: "Show top 12" })).toBeDefined();
    }
  });
});
