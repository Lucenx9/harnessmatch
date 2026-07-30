import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/privacy/page";

describe("privacy page", () => {
  it("discloses analytics retention and external-link processing", () => {
    const html = renderToStaticMarkup(<PrivacyPage />);

    expect(html).toContain("discarded after 24 hours");
    expect(html).toContain("reporting window depends on the site&#x27;s current Vercel plan");
    expect(html).toContain("may retain analytics data beyond that window");
    expect(html).toContain("https://vercel.com/docs/analytics/limits-and-pricing");
    expect(html).toContain("External links");
    expect(html).toContain("unless you follow them");
  });
});
