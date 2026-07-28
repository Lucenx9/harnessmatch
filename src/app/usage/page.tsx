import type { Metadata } from "next";
import { OpenRouterUsageLeaderboard } from "@/components/openrouter-usage-leaderboard";
import { harnesses } from "@/data/harnesses";
import { openRouterAttributionSnapshots } from "@/data/openrouter-attribution";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Coding harness usage signals",
  description:
    "Compare daily, 7-day, and 30-day OpenRouter-attributed traffic for cataloged AI coding harnesses, with explicit dates, scope, and limits.",
  path: "/usage",
});

export default function UsagePage() {
  const harnessById = new Map(harnesses.map((harness) => [harness.id, harness]));
  const records = openRouterAttributionSnapshots.flatMap((snapshot) => {
    const harness = harnessById.get(snapshot.harnessId);
    if (!harness || harness.status !== "active") return [];
    return [{
      id: harness.id,
      slug: harness.slug,
      name: harness.name,
      tagline: harness.tagline,
      logo: harness.logo,
      windows: snapshot.windows,
    }];
  });

  return (
    <section className="section page-section usage-page">
      <div className="shell wide-shell">
        <div className="page-intro usage-page-intro">
          <h1>Usage signals, with their limits.</h1>
          <p>See which cataloged harnesses receive the most publicly attributed traffic through OpenRouter. This measures one routing channel, not overall adoption or quality.</p>
        </div>

        <OpenRouterUsageLeaderboard records={records} />

        <section className="usage-scope" aria-labelledby="usage-scope-heading">
          <div>
            <h2 id="usage-scope-heading">Why these sources stay separate</h2>
            <p>OpenRouter tokens, Homebrew install events, package downloads, editor installs, and repository activity observe different populations. Adding them together would create a precise-looking but invalid total.</p>
          </div>
          <dl>
            <div>
              <dt>Included now</dt>
              <dd>OpenRouter public app attribution, refreshed daily from its authenticated ranking dataset.</dd>
            </div>
            <div>
              <dt>Not included</dt>
              <dd>Direct provider APIs, subscriptions, local execution, unattributed traffic, and private OpenRouter apps.</dd>
            </div>
            <div>
              <dt>Evaluated separately</dt>
              <dd>Homebrew, package registries, extension marketplaces, and GitHub signals where product coverage is comparable.</dd>
            </div>
          </dl>
        </section>

        <aside className="usage-source-note" aria-label="OpenRouter source note">
          <p>Source: OpenRouter (openrouter.ai/apps). OpenRouter states that public rankings include apps opting into attribution and that token counts can vary by upstream tokenizer.</p>
          <div>
            <a href="https://openrouter.ai/docs/agent-sdk/typescript/api-reference/datasets" target="_blank" rel="noreferrer">Dataset definition</a>
            <a href="https://openrouter.ai/docs/app-attribution" target="_blank" rel="noreferrer">Attribution rules</a>
            <a href="/methodology#eligibility">Evidence policy</a>
          </div>
        </aside>
      </div>
    </section>
  );
}
