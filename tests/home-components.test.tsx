import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HarnessCard } from "../src/components/harness-card";
import { HomeReleaseActivity } from "../src/components/home-release-activity";
import { harnesses } from "../src/data/harnesses";
import { harnessReleaseSnapshots } from "../src/data/release-signals";
import { buildRecentReleaseActivity } from "../src/lib/usage-view";

const releaseRecords = buildRecentReleaseActivity({
  harnesses,
  releaseSnapshots: harnessReleaseSnapshots,
});

describe("home presentation components", () => {
  it("renders a bounded release feed and its empty state", () => {
    const populated = renderToStaticMarkup(
      <HomeReleaseActivity
        records={releaseRecords}
        limit={2}
        action={{ href: "/data#stable-releases", label: "Open releases" }}
      />,
    );
    const empty = renderToStaticMarkup(
      <HomeReleaseActivity records={[]} />,
    );

    expect(populated).toContain("Showing 2 of");
    expect(populated).toContain("Open releases");
    expect(populated).toMatch(/\b(?:release|releases)\b/);
    expect(empty).toContain("No current stable release feeds are mapped.");
  });

  it("keeps compact harness cards concise", () => {
    const harness = harnesses[0];
    if (!harness) throw new Error("Expected a harness fixture.");

    const full = renderToStaticMarkup(
      <HarnessCard harness={harness} />,
    );
    const compact = renderToStaticMarkup(
      <HarnessCard harness={harness} compact />,
    );

    expect(full).toContain(harness.summary);
    expect(full).toContain("primary sources");
    expect(compact).not.toContain(harness.summary);
    expect(compact).toContain(`href="/harnesses/${harness.slug}"`);
  });
});
