// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CompareClient } from "../src/components/compare-client";
import { compareRecord } from "./component-fixtures";

beforeEach(() => {
  window.history.replaceState(null, "", "/compare?ids=codex");
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
    },
  });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("compare client interactions", () => {
  it("hydrates from the URL and persists an applied selection", async () => {
    render(
      <CompareClient
        harnesses={[
          compareRecord({ id: "codex", name: "Codex" }),
          compareRecord({ id: "claude-code", name: "Claude Code" }),
        ]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", {
        name: "Remove Codex from comparison",
      })).toBeDefined();
    });

    fireEvent.click(screen.getByRole("button", { name: /Change harnesses/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Claude Code/ }));
    fireEvent.click(screen.getByRole("button", { name: "Compare 2 harnesses" }));

    await waitFor(() => {
      expect(window.location.search).toBe("?ids=codex%2Cclaude-code");
    });
    expect(screen.getByRole("button", {
      name: "Remove Claude Code from comparison",
    })).toBeDefined();
  });

  it("closes the picker on backdrop click without applying the draft", async () => {
    const { container } = render(
      <CompareClient
        harnesses={[
          compareRecord({ id: "codex", name: "Codex" }),
          compareRecord({ id: "claude-code", name: "Claude Code" }),
        ]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", {
        name: "Remove Codex from comparison",
      })).toBeDefined();
    });

    fireEvent.click(screen.getByRole("button", { name: /Change harnesses/ }));
    const dialog = container.querySelector("dialog");
    if (!dialog) throw new Error("Picker dialog not rendered");
    expect(dialog.open).toBe(true);

    fireEvent.click(screen.getByRole("checkbox", { name: /Claude Code/ }));
    const shell = dialog.querySelector(".compare-picker-dialog-shell");
    if (!shell) throw new Error("Picker dialog shell not rendered");
    fireEvent.click(shell);
    expect(dialog.open).toBe(true);

    fireEvent.click(dialog);
    expect(dialog.open).toBe(false);
    expect(window.location.search).toBe("?ids=codex");
  });
});
