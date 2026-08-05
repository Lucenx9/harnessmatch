// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
const clipboardWriteText = vi.fn(async (_value: string) => {});

beforeEach(() => {
  window.history.replaceState(null, "", "/usage");
  clipboardWriteText.mockClear();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: clipboardWriteText },
  });
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

    fireEvent.click(view.getByRole("tab", { name: "Latest day" }));
    fireEvent.click(view.getByRole("button", { name: "Trending" }));
    expect(view.getByRole("tab", { name: "7 days" }).getAttribute("aria-selected")).toBe("true");
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

    fireEvent.change(view.getByRole("combobox", { name: "Signal source" }), {
      target: { value: "homebrew" },
    });
    expect(view.getByRole("heading", { name: "Homebrew install events" })).toBeDefined();

    fireEvent.click(view.getByRole("tab", { name: "GitHub" }));
    const githubTab = view.getByRole("tab", { name: "GitHub" });
    fireEvent.keyDown(githubTab, { key: "ArrowRight" });
    expect(document.activeElement).toBe(view.getByRole("tab", { name: "OpenRouter" }));

    const showAll = view.queryByRole("button", { name: /Show all/ });
    if (showAll) {
      fireEvent.click(showAll);
      expect(view.getByRole("button", { name: "Show top 12" })).toBeDefined();
    }
  });

  it("distinguishes true zero values from positive origin markers", async () => {
    const [positiveRecord, zeroBaseRecord] = usageRecords.ecosystemRecords.filter(
      (record) => record.signal.source === "github" && record.signal.value > 0,
    );
    if (!positiveRecord || !zeroBaseRecord) throw new Error("Expected two positive GitHub usage records.");
    const zeroRecord = {
      ...zeroBaseRecord,
      signal: {
        ...zeroBaseRecord.signal,
        value: 0,
      },
    };
    window.history.replaceState(null, "", "/usage?source=github");

    const { container } = render(
      <UsageSignalsExplorer
        {...usageRecords}
        ecosystemRecords={[positiveRecord, zeroRecord]}
      />,
    );

    await waitFor(() => {
      expect(container.querySelector(`a[href="/harnesses/${zeroRecord.slug}"]`)).not.toBeNull();
    });
    const zeroTrack = container.querySelector(`a[href="/harnesses/${zeroRecord.slug}"] .usage-bar-track`);
    const positiveTrack = container.querySelector(`a[href="/harnesses/${positiveRecord.slug}"] .usage-bar-track`);
    expect(zeroTrack).not.toBeNull();
    expect(zeroTrack?.classList.contains("usage-bar-track-positive")).toBe(false);
    expect(positiveTrack?.classList.contains("usage-bar-track-positive")).toBe(true);
  });

  it("switches to a deep-linkable per-harness source ledger", async () => {
    const ompRecord = usageRecords.openRouterRecords.find(({ id }) => id === "omp");
    if (!ompRecord) throw new Error("Expected an OpenRouter record for Oh My Pi.");
    const interactionRecords = {
      ...usageRecords,
      openRouterRecords: usageRecords.openRouterRecords.map((record) => (
        record.id === "omp"
          ? {
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
          }
          : record
      )),
    };
    const { container } = render(
      <UsageSignalsExplorer {...interactionRecords} />,
    );
    const explorer = container.querySelector(".usage-explorer");
    if (!(explorer instanceof HTMLElement)) {
      throw new Error("Expected the usage signals explorer.");
    }
    const view = within(explorer);

    fireEvent.click(view.getByRole("button", { name: "By harness" }));
    expect(view.getByRole("tabpanel", { name: "7 days" }).getAttribute("id")).toBe("usage-harness-panel");
    fireEvent.change(view.getByRole("searchbox", { name: "Find harness" }), {
      target: { value: "Oh My" },
    });
    expect(view.getByRole("option", { name: "Oh My Pi" })).toBeDefined();
    fireEvent.change(view.getByRole("combobox", { name: "Harness" }), {
      target: { value: "omp" },
    });
    expect(view.getByText("Mapped but unlisted")).toBeDefined();

    fireEvent.change(view.getByRole("searchbox", { name: "Find harness" }), {
      target: { value: "Codex" },
    });
    expect(view.getByRole("option", { name: "Codex" })).toBeDefined();
    fireEvent.change(view.getByRole("combobox", { name: "Harness" }), {
      target: { value: "codex" },
    });

    expect(view.getByRole("heading", { name: "Codex usage signals" })).toBeDefined();
    const table = view.getByRole("table");
    expect(view.getAllByRole("row")).toHaveLength(9);
    expect(view.getAllByText("Observed").length).toBeGreaterThan(0);
    expect(view.getAllByText("Not mapped").length).toBeGreaterThan(0);
    expect(table.textContent).toContain("Values retain their native units and cannot be added together.");

    await waitFor(() => {
      expect(window.location.search).toBe("?mode=harness&id=codex");
    });

    fireEvent.click(view.getByRole("button", { name: "Trending" }));
    fireEvent.click(view.getByRole("tab", { name: "30 days" }));

    expect(view.getByText("growth rank", { exact: false })).toBeDefined();
    await waitFor(() => {
      expect(window.location.search).toBe("?mode=harness&id=codex&view=trending&window=month");
    });
  });

  it("restores the per-harness view from a validated URL", async () => {
    window.history.replaceState(null, "", "/usage?mode=harness&id=aider");

    const { container } = render(
      <UsageSignalsExplorer {...usageRecords} />,
    );
    const explorer = container.querySelector(".usage-explorer");
    if (!(explorer instanceof HTMLElement)) {
      throw new Error("Expected the usage signals explorer.");
    }
    const view = within(explorer);

    await waitFor(() => {
      expect(view.getByRole("heading", { name: "Aider usage signals" })).toBeDefined();
    });
    expect(view.getByRole("combobox", { name: "Harness" })).toHaveProperty("value", "aider");
  });

  it("compares at most four harnesses within one deep-linked source view", async () => {
    const { container } = render(
      <UsageSignalsExplorer {...usageRecords} />,
    );
    const explorer = container.querySelector(".usage-explorer");
    if (!(explorer instanceof HTMLElement)) {
      throw new Error("Expected the usage signals explorer.");
    }
    const view = within(explorer);

    fireEvent.click(view.getByRole("button", { name: "Compare" }));
    expect(view.getByText("2 selected")).toBeDefined();

    const initiallyUnselected = view.getAllByRole("checkbox").filter((checkbox) => (
      checkbox instanceof HTMLInputElement && !checkbox.checked
    ));
    const third = initiallyUnselected[0];
    const fourth = initiallyUnselected[1];
    if (!third || !fourth) throw new Error("Expected at least four active harnesses.");
    fireEvent.click(third);
    fireEvent.click(fourth);

    expect(view.getByText("4 selected")).toBeDefined();
    expect(view.getAllByRole("checkbox").filter((checkbox) => (
      checkbox instanceof HTMLInputElement && !checkbox.checked
    )).every((checkbox) => checkbox.hasAttribute("disabled"))).toBe(true);
    expect(view.getByText(/Linear bars use the largest mapped value in this source as 100%/)).toBeDefined();

    fireEvent.change(view.getByRole("searchbox", { name: "Find harness" }), {
      target: { value: "Aider" },
    });
    expect(view.getAllByRole("checkbox", { checked: true })).toHaveLength(4);
    expect(view.getAllByRole("checkbox")).toHaveLength(4);
    expect(explorer.querySelectorAll(".usage-ranking-row")).toHaveLength(4);

    await waitFor(() => {
      expect(window.location.search).toContain("mode=compare");
      expect(window.location.search).toContain("ids=");
    });

    const currentViewCsv = view.getByRole("link", { name: "Download current view (CSV)" });
    const csvHref = currentViewCsv.getAttribute("href");
    if (!csvHref) throw new Error("Expected a current-view CSV data URL.");
    const csv = decodeURIComponent(csvHref.replace("data:text/csv;charset=utf-8,", ""));
    expect(csv).toContain("rank_scope");
    expect(csv).toContain("harness_id");

    fireEvent.click(view.getByRole("button", { name: "Copy view link" }));
    await waitFor(() => {
      expect(clipboardWriteText).toHaveBeenCalledWith(window.location.href);
      expect(view.getByRole("button", { name: "Link copied" })).toBeDefined();
    });
  });

  it("restores and validates a focused comparison URL", async () => {
    window.history.replaceState(null, "", "/usage?mode=compare&source=github&ids=codex,aider,unknown");

    const { container } = render(
      <UsageSignalsExplorer {...usageRecords} />,
    );
    const explorer = container.querySelector(".usage-explorer");
    if (!(explorer instanceof HTMLElement)) {
      throw new Error("Expected the usage signals explorer.");
    }
    const view = within(explorer);

    await waitFor(() => {
      expect(view.getByRole("heading", { name: "GitHub repository interest comparison" })).toBeDefined();
      expect(view.getByText("2 selected")).toBeDefined();
      expect(window.location.search).toBe("?mode=compare&ids=codex%2Caider&source=github");
    });
    expect(view.getByText("Forks / scope")).toBeDefined();
    expect(view.getByText(/Rank scope: Rank among mapped HarnessMatch products\./)).toBeDefined();
    expect(view.queryByText(/global source rank/i)).toBeNull();
    expect(view.getAllByText(/repository/).length).toBeGreaterThan(0);
  });

  it("does not substitute another harness when the requested id is unavailable", async () => {
    window.history.replaceState(null, "", "/usage?mode=harness&id=continue-cli");

    const { container } = render(
      <UsageSignalsExplorer {...usageRecords} />,
    );
    const explorer = container.querySelector(".usage-explorer");
    if (!(explorer instanceof HTMLElement)) {
      throw new Error("Expected the usage signals explorer.");
    }
    const view = within(explorer);

    await waitFor(() => {
      expect(window.location.search).toBe("");
    });
    expect(view.queryByRole("combobox", { name: "Harness" })).toBeNull();
    expect(view.queryByRole("heading", { name: /usage signals$/ })).toBeNull();
  });
});
