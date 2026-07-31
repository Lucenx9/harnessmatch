import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HarnessEcosystemSection } from "../src/components/harness-ecosystem-section";
import { openRouterAttributionSnapshots } from "../src/data/openrouter-attribution";

describe("harness ecosystem section", () => {
  it("links directly to the harness usage ledger", () => {
    const snapshot = openRouterAttributionSnapshots.find((candidate) => candidate.harnessId === "codex");
    if (!snapshot) throw new Error("Expected the Codex OpenRouter snapshot.");

    const html = renderToStaticMarkup(
      <HarnessEcosystemSection
        harnessId="codex"
        inUsageLedger
        releaseSnapshot={undefined}
        openRouterSnapshot={snapshot}
        ecosystemSignals={[]}
        checkedAt={snapshot.observedAt}
      />,
    );

    expect(html).toContain('href="/usage?mode=harness&amp;id=codex"');
    expect(html).toContain("View this harness in Usage");
  });

  it("does not deep-link harnesses the usage ledger excludes", () => {
    const snapshot = openRouterAttributionSnapshots.find((candidate) => candidate.harnessId === "codex");
    if (!snapshot) throw new Error("Expected the Codex OpenRouter snapshot.");

    const html = renderToStaticMarkup(
      <HarnessEcosystemSection
        harnessId="continue-cli"
        inUsageLedger={false}
        releaseSnapshot={undefined}
        openRouterSnapshot={snapshot}
        ecosystemSignals={[]}
        checkedAt={snapshot.observedAt}
      />,
    );

    expect(html).not.toContain("mode=harness");
    expect(html).toContain('href="/usage"');
    expect(html).toContain("Compare all signals");
  });
});
