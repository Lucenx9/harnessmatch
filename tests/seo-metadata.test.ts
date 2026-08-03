import { describe, expect, it } from "vitest";
import { metadata as dataMetadata } from "../src/app/data/page";
import { generateMetadata as generateHarnessMetadata } from "../src/app/harnesses/[slug]/page";
import { metadata as methodologyMetadata } from "../src/app/methodology/page";
import { harnesses } from "../src/data/harnesses";
import { harnessProfileTitle, siteName } from "../src/lib/site";

describe("search-result metadata", () => {
  it("builds concise, intent-specific titles for the first profile opportunities", () => {
    for (const name of ["Claude Code", "Cline", "Codex", "OpenCode"] as const) {
      const title = harnessProfileTitle(name);

      expect(title).toBe(`${name} coding harness capabilities`);
      expect(`${title} | ${siteName}`.length).toBeLessThanOrEqual(60);
    }

    expect(harnessProfileTitle("Letta Harness")).toBe("Letta Harness capabilities and controls");
    expect(() => harnessProfileTitle("A".repeat(80))).toThrow(
      "Unable to build a search-result title",
    );

    const titles = harnesses.map((harness) => harnessProfileTitle(harness.name));

    expect(new Set(titles).size).toBe(titles.length);
    for (const title of titles) {
      expect(`${title} | ${siteName}`.length).toBeLessThanOrEqual(60);
    }
  });

  it("emits intent-specific metadata for the priority pages", async () => {
    expect(dataMetadata).toEqual(expect.objectContaining({
      title: "AI coding harness data and primary sources",
      alternates: { canonical: "/data" },
      openGraph: expect.objectContaining({
        title: "AI coding harness data and primary sources | HarnessMatch",
        url: "/data",
      }),
      twitter: expect.objectContaining({
        title: "AI coding harness data and primary sources | HarnessMatch",
      }),
    }));
    expect(methodologyMetadata).toEqual(expect.objectContaining({
      title: "AI coding harness research methodology",
      alternates: { canonical: "/methodology" },
      openGraph: expect.objectContaining({
        title: "AI coding harness research methodology | HarnessMatch",
        url: "/methodology",
      }),
      twitter: expect.objectContaining({
        title: "AI coding harness research methodology | HarnessMatch",
      }),
    }));

    const harnessMetadata = await generateHarnessMetadata({
      params: Promise.resolve({ slug: "claude-code" }),
    });

    expect(harnessMetadata).toEqual(expect.objectContaining({
      title: "Claude Code coding harness capabilities",
      alternates: { canonical: "/harnesses/claude-code" },
      openGraph: expect.objectContaining({
        title: "Claude Code coding harness capabilities | HarnessMatch",
        url: "/harnesses/claude-code",
      }),
      twitter: expect.objectContaining({
        title: "Claude Code coding harness capabilities | HarnessMatch",
      }),
    }));
  });
});
