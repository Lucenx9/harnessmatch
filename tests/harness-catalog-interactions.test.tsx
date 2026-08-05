// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  EvidenceLedger,
  type EvidenceLedgerRecord,
} from "../src/components/evidence-ledger";
import { compactSearchTerms } from "../src/lib/search";

const records: EvidenceLedgerRecord[] = [
  {
    id: "muse-code",
    slug: "muse-code",
    name: "Muse Code",
    summary: "Meta terminal coding agent",
    logo: {
      src: "/harnesses/muse-code.ico",
      sourceUrl: "https://example.test/logo",
      verifiedAt: "2026-08-05",
    },
    status: "active",
    productLayer: "coding-harness",
    role: "coding-agent",
    license: "Proprietary native binary",
    verifiedAt: "2026-08-05",
    primarySourceCount: 7,
    discoverySourceCount: 0,
    searchText: compactSearchTerms([
      "Default approval and OS sandbox",
      "Agent-to-agent orchestration",
    ]),
  },
];

afterEach(cleanup);

describe("harness catalog interactions", () => {
  it("matches compacted evidence across stop words and punctuation", () => {
    render(<EvidenceLedger records={records} />);

    fireEvent.change(screen.getByLabelText("Search evidence"), {
      target: { value: "default approval and sandbox" },
    });
    expect(screen.getByText("Muse Code")).toBeDefined();

    fireEvent.change(screen.getByLabelText("Search evidence"), {
      target: { value: "agent-to-agent" },
    });
    expect(screen.getByText("Muse Code")).toBeDefined();
  });
});
