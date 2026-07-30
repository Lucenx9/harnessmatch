import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";

describe("site footer", () => {
  it("links the public repository and scoped licenses", () => {
    const html = renderToStaticMarkup(<SiteFooter />);

    expect(html).toContain("https://github.com/Lucenx9/harnessmatch");
    expect(html).toContain("Code Apache-2.0");
    expect(html).toContain("Data CC BY 4.0");
    expect(html).toContain("LICENSE-DATA");
  });
});
