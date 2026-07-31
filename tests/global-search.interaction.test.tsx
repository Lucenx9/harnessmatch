// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlobalSearch } from "../src/components/global-search";
import type { GlobalSearchItem } from "../src/lib/search";

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush }),
}));

const items: GlobalSearchItem[] = [
  {
    id: "gui-t3-code",
    kind: "gui",
    title: "T3 Code",
    description: "Fixture GUI",
    href: "/guis/t3-code",
    keywords: ["multi-harness"],
    meta: "Agent workspace",
  },
  {
    id: "page-benchmarks",
    kind: "page",
    title: "Benchmarks",
    description: "Fixture page",
    href: "/benchmarks",
    keywords: ["measurement"],
    meta: "Page",
  },
];

beforeEach(() => {
  routerPush.mockReset();
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    },
  });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("global search interactions", () => {
  it("opens, focuses, filters, and navigates with the keyboard", async () => {
    render(<GlobalSearch items={items} recordCount={1} />);

    fireEvent.click(screen.getByRole("button", { name: "Search HarnessMatch" }));

    const input = screen.getByRole("combobox");
    await waitFor(() => expect(document.activeElement).toBe(input));

    fireEvent.change(input, { target: { value: "T3 Code" } });
    expect(screen.getByRole("option").textContent).toContain("T3 Code");

    fireEvent.keyDown(input, { key: "Enter" });

    expect(routerPush).toHaveBeenCalledOnce();
    expect(routerPush).toHaveBeenCalledWith("/guis/t3-code");
  });
});
