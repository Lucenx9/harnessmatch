// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GuiLiveSignals } from "../src/components/gui-live-signals";
import { guiEcosystemSignalSnapshots } from "../src/data/gui-ecosystem-signals";
import { guiProducts } from "../src/data/gui-products";
import { buildGuiLiveSignalsViewModel } from "../src/lib/gui-view-models";

const viewModel = buildGuiLiveSignalsViewModel(
  guiProducts,
  guiEcosystemSignalSnapshots,
);

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
});
