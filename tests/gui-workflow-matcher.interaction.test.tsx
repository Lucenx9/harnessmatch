// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GuiWorkflowMatcher } from "../src/components/gui-workflow-matcher";
import { guiProducts } from "../src/data/gui-products";
import { guiRepositoryAudits } from "../src/data/gui-repository-audits";
import { guiWorkflows } from "../src/lib/gui-fit";
import { buildGuiWorkflowMatcherViewModel } from "../src/lib/gui-view-models";

const viewModel = buildGuiWorkflowMatcherViewModel(
  guiProducts,
  guiRepositoryAudits,
  guiWorkflows,
);

afterEach(cleanup);

describe("GUI workflow matcher interactions", () => {
  it("treats a named harness filter as a named integration requirement", () => {
    render(<GuiWorkflowMatcher viewModel={viewModel} />);

    expect(screen.getByRole("link", { name: "webmux profile" })).toBeDefined();

    fireEvent.change(screen.getByLabelText("Harness"), {
      target: { value: "Kimi" },
    });

    expect(screen.queryByRole("link", { name: "webmux profile" })).toBeNull();
    expect(screen.getByRole("link", { name: "Superset profile" })).toBeDefined();
  });

  it("keeps arbitrary CLI products in the explicit multi-harness filter", () => {
    render(<GuiWorkflowMatcher viewModel={viewModel} />);

    fireEvent.change(screen.getByLabelText("Harness"), {
      target: { value: "multi" },
    });

    expect(screen.getByRole("link", { name: "webmux profile" })).toBeDefined();
  });

  it("restores the whole catalog from the empty state without lowering evidence gates", () => {
    render(<GuiWorkflowMatcher viewModel={viewModel} />);

    const filterLabels = ["Workflow", "Harness", "Platform", "Source access"] as const;
    const [workflowSelect, harnessSelect, platformSelect, sourceSelect] = filterLabels
      .map((label) => screen.getByLabelText(label) as HTMLSelectElement);
    if (!workflowSelect || !harnessSelect || !platformSelect || !sourceSelect) {
      throw new Error("Expected every matcher filter to be rendered.");
    }

    // Amp is documented only by desktop interfaces, so pairing it with Browser
    // leaves no product and exposes the empty state.
    fireEvent.change(workflowSelect, { target: { value: "team-workspace" } });
    fireEvent.change(harnessSelect, { target: { value: "Amp" } });
    fireEvent.change(platformSelect, { target: { value: "Browser" } });
    fireEvent.change(sourceSelect, { target: { value: "proprietary" } });

    expect(screen.getByText("No GUI matches every selected filter.")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    for (const select of [workflowSelect, harnessSelect, platformSelect, sourceSelect]) {
      expect(select.value).toBe("any");
    }
    expect(screen.queryByText("No GUI matches every selected filter.")).toBeNull();
    expect(screen.getByText("All documented interfaces")).toBeDefined();
    expect(screen.getByRole("link", { name: "webmux profile" })).toBeDefined();
  });
});
