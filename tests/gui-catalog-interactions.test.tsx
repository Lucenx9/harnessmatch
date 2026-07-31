// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  GuiEvidenceLedger,
  type GuiEvidenceLedgerRecord,
} from "../src/components/gui-evidence-ledger";
import { GuiProductPreview } from "../src/components/gui-product-preview";
import type { GuiPreview } from "../src/lib/gui-types";

const logo = {
  src: "/guis/fixture.svg",
  sourceUrl: "https://example.test/logo",
  verifiedAt: "2026-07-31",
};

const records: GuiEvidenceLedgerRecord[] = [
  {
    id: "native",
    name: "Native Fixture",
    summary: "Native summary",
    logo,
    status: "active",
    layer: "harness-native",
    sourceAccess: "proprietary",
    license: "Proprietary",
    verifiedAt: "2026-07-31",
    evidenceRecordCount: 2,
    searchText: "Codex macOS",
  },
  {
    id: "workspace",
    name: "Workspace Fixture",
    summary: "Workspace summary",
    logo,
    status: "active",
    layer: "multi-harness-workspace",
    sourceAccess: "open-source",
    license: "MIT",
    verifiedAt: "2026-07-31",
    evidenceRecordCount: 3,
    searchText: "Claude Code Linux",
  },
];

const preview: GuiPreview = {
  kind: "image",
  src: "/gui-previews/fixture.png",
  width: 1200,
  height: 800,
  alt: "Fixture interface showing coding agent sessions",
  caption: "Fixture preview",
  sourceUrl: "https://example.test/preview",
  provenance: "official-media",
  verifiedAt: "2026-07-31",
};

beforeEach(() => {
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
});

afterEach(cleanup);

describe("GUI catalog interactions", () => {
  it("filters the evidence ledger and restores it from the empty state", () => {
    render(<GuiEvidenceLedger records={records} />);

    fireEvent.change(screen.getByLabelText("GUI layer"), {
      target: { value: "harness-native" },
    });
    expect(screen.getByText("Native Fixture")).toBeDefined();
    expect(screen.queryByText("Workspace Fixture")).toBeNull();

    fireEvent.change(screen.getByLabelText("Search GUI evidence"), {
      target: { value: "no-match" },
    });
    expect(screen.getByRole("heading", {
      name: "No GUI evidence records match.",
    })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Native Fixture")).toBeDefined();
    expect(screen.getByText("Workspace Fixture")).toBeDefined();
  });

  it("opens and closes an image preview dialog", () => {
    render(
      <GuiProductPreview
        id="fixture"
        name="Fixture GUI"
        preview={preview}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open full size" }));
    const dialog = screen.getByRole("dialog");
    expect((dialog as HTMLDialogElement).open).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect((dialog as HTMLDialogElement).open).toBe(false);
  });
});
