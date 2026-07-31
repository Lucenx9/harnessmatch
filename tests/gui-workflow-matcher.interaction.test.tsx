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
});
