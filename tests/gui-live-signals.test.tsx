import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GuiLiveSignals } from "../src/components/gui-live-signals";
import { guiEcosystemSignalSnapshots } from "../src/data/gui-ecosystem-signals";
import { guiProducts } from "../src/data/gui-products";
import { buildGuiLiveSignalsViewModel } from "../src/lib/gui-view-models";

const viewModel = buildGuiLiveSignalsViewModel(
  guiProducts,
  guiEcosystemSignalSnapshots,
);
const html = renderToStaticMarkup(<GuiLiveSignals viewModel={viewModel} />);

describe("GUI live signals", () => {
  it("renders the server-built source tabs and the initial Homebrew ranking", () => {
    expect(html).toContain("Public activity signals");
    expect(html).toContain("macOS install activity");
    expect(html).toContain("Homebrew · 30d");
    expect(html).toContain("GitHub installers");
    expect(html).toContain("GitHub interest");

    const homebrew = viewModel.sources.find((source) => source.id === "homebrew");
    expect(homebrew).toBeDefined();
    for (const row of homebrew?.rows ?? []) {
      expect(html).toContain(`href="/guis/${row.id}"`);
      expect(html).toContain(row.name);
      expect(html).toContain(row.valueLabel);
    }
  });

  it("publishes the latest observation date and source caveat", () => {
    expect(viewModel.observedAt).not.toBeNull();
    expect(html).toContain(`Observed ${viewModel.observedAt}`);
    expect(html).toContain("Install events are not unique users.");
    expect(html).toContain("Homebrew source");
  });
});
