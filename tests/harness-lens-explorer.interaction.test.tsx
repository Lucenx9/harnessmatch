// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { HarnessLensExplorer } from "../src/components/harness-lens-explorer";
import { lensHarness } from "./component-fixtures";

const scrolledElements: Element[] = [];

beforeEach(() => {
  scrolledElements.length = 0;
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    configurable: true,
    value(this: Element) {
      scrolledElements.push(this);
    },
  });
});

afterEach(() => {
  cleanup();
});

function catalog(size: number) {
  return Array.from({ length: size }, (_, index) => lensHarness({
    id: `harness-${index}`,
    name: `Harness ${String(index).padStart(2, "0")}`,
  }));
}

describe("harness lens explorer interactions", () => {
  it("returns the viewport to the explorer when collapsing the full list", () => {
    const { container } = render(<HarnessLensExplorer harnesses={catalog(10)} />);

    fireEvent.click(screen.getByRole("button", { name: "Show all 10 profiles" }));
    expect(container.querySelectorAll(".lens-card")).toHaveLength(10);
    expect(scrolledElements).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Show fewer profiles" }));
    expect(container.querySelectorAll(".lens-card")).toHaveLength(8);
    expect(scrolledElements).toHaveLength(1);
    expect(scrolledElements[0]).toBe(container.querySelector(".lens-explorer"));
  });
});
