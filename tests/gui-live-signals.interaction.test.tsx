// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GuiLiveSignals } from "../src/components/gui-live-signals";
import { guiEcosystemSignalSnapshots } from "../src/data/gui-ecosystem-signals";
import { guiProducts } from "../src/data/gui-products";
import type { GuiLiveSignalsViewModel } from "../src/lib/gui-view-models";
import { buildGuiLiveSignalsViewModel } from "../src/lib/gui-view-models";

const viewModel = buildGuiLiveSignalsViewModel(
  guiProducts,
  guiEcosystemSignalSnapshots,
);

const unmappedSourceViewModel: GuiLiveSignalsViewModel = {
  observedAt: "2026-08-04",
  sources: [
    {
      id: "homebrew",
      tab: "Homebrew · 30d",
      title: "macOS install activity",
      coverage: "0/18 mapped",
      columns: ["Rank", "Interface", "30-day events", "Window"],
      note: "Install events are not unique users.",
      href: "https://formulae.brew.sh/docs/api/",
      link: "Homebrew source",
      rows: [],
    },
  ],
};

afterEach(cleanup);

describe("GUI live signals interactions", () => {
  it("keeps a single source tab in the page tab order", () => {
    render(<GuiLiveSignals viewModel={viewModel} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.filter((tab) => tab.getAttribute("tabindex") === "0")).toHaveLength(1);
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
  });

  it("moves between sources with the arrow, Home, and End keys", () => {
    render(<GuiLiveSignals viewModel={viewModel} />);

    const tabs = screen.getAllByRole("tab");
    const first = tabs[0];
    const second = tabs[1];
    const last = tabs.at(-1);
    if (!first || !second || !last) throw new Error("Expected at least two source tabs.");

    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(second.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(second);

    fireEvent.keyDown(second, { key: "ArrowLeft" });
    expect(first.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(first, { key: "End" });
    expect(last.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(last, { key: "Home" });
    expect(first.getAttribute("aria-selected")).toBe("true");
  });

  it("wraps from the last source back to the first", () => {
    render(<GuiLiveSignals viewModel={viewModel} />);

    const tabs = screen.getAllByRole("tab");
    const first = tabs[0];
    const last = tabs.at(-1);
    if (!first || !last) throw new Error("Expected at least two source tabs.");

    fireEvent.keyDown(first, { key: "ArrowLeft" });
    expect(last.getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(last, { key: "ArrowRight" });
    expect(first.getAttribute("aria-selected")).toBe("true");
  });

  it("reads an unmapped source as missing instead of rendering an empty ranking", () => {
    const { container } = render(<GuiLiveSignals viewModel={unmappedSourceViewModel} />);

    expect(screen.getByText(
      "No active interface is currently mapped to this source. Missing is not zero.",
    )).toBeDefined();
    expect(container.querySelector(".gui-live-columns")).toBeNull();
    expect(container.querySelector(".gui-live-ranking")).toBeNull();

    // The source caveat and its first-party link stay visible without any row.
    expect(screen.getByText("Install events are not unique users.")).toBeDefined();
    expect(screen.getByRole("link", { name: "Homebrew source" })).toBeDefined();
  });
});
