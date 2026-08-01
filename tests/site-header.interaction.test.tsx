// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "../src/components/site-header";

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

let storedValues = new Map<string, string>();

function mediaQueryList(matches: boolean): MediaQueryList {
  return {
    matches,
    media: "(prefers-color-scheme: light)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  };
}

vi.mock("next/navigation", () => ({
  usePathname: () => "/guis",
  useRouter: () => ({ push: routerPush }),
}));

beforeEach(() => {
  routerPush.mockReset();
  storedValues = new Map();
  const localStorage = {
    get length() {
      return storedValues.size;
    },
    clear() {
      storedValues.clear();
    },
    getItem(key: string) {
      return storedValues.get(key) ?? null;
    },
    key(index: number) {
      return [...storedValues.keys()][index] ?? null;
    },
    removeItem(key: string) {
      storedValues.delete(key);
    },
    setItem(key: string, value: string) {
      storedValues.set(key, value);
    },
  } satisfies Storage;
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: localStorage,
  });
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue(mediaQueryList(false)),
  });
});

afterEach(cleanup);

describe("site header interactions", () => {
  it("loads and persists the theme while keeping mobile navigation keyboard accessible", async () => {
    window.localStorage.setItem("harnessmatch-theme", "light");
    render(<SiteHeader />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("light");
    });

    fireEvent.click(screen.getByRole("button", {
      name: "Switch to dark theme",
    }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("harnessmatch-theme")).toBe("dark");

    const summary = screen.getByText("Menu");
    const menu = summary.closest("details");
    if (!(menu instanceof HTMLDetailsElement)) {
      throw new Error("Expected the mobile navigation details element.");
    }

    menu.open = true;
    fireEvent.keyDown(document, { key: "Escape" });
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(summary);

    menu.open = true;
    fireEvent.pointerDown(document.body);
    expect(menu.open).toBe(false);
  });

  it("keeps theme switching available when local storage is blocked", async () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new DOMException("Storage access denied", "SecurityError");
    });
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("Storage access denied", "SecurityError");
    });
    vi.mocked(window.matchMedia).mockReturnValue(mediaQueryList(true));

    render(<SiteHeader />);

    await waitFor(() => {
      expect(document.documentElement.dataset.theme).toBe("light");
    });

    fireEvent.click(screen.getByRole("button", {
      name: "Switch to dark theme",
    }));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
