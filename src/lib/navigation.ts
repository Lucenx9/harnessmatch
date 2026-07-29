export const searchablePageItems = [
  {
    label: "Home",
    href: "/",
    description: "Usage, catalog, and evidence-backed starting points.",
    keywords: ["home", "usage signals", "catalog", "evidence"],
    navigation: null,
  },
  {
    label: "Harnesses",
    href: "/harnesses",
    description: "Browse every cataloged coding harness and adjacent tool.",
    keywords: ["catalog", "tools", "agents", "profiles"],
    navigation: "primary",
  },
  {
    label: "Usage",
    href: "/usage",
    description: "Compare channel-specific usage signals across cataloged harnesses.",
    keywords: ["usage", "most used", "popular", "openrouter", "tokens", "requests"],
    navigation: "primary",
  },
  {
    label: "Compare",
    href: "/compare",
    description: "Compare harness capabilities and trade-offs side by side.",
    keywords: ["comparison", "versus", "capabilities", "tradeoffs"],
    navigation: "primary",
  },
  {
    label: "Data",
    href: "/data",
    description: "Inspect evidence coverage, freshness, and source records.",
    keywords: ["evidence", "sources", "freshness", "ledger"],
    navigation: "primary",
  },
  {
    label: "GUIs",
    href: "/guis",
    description: "Choose a coding-agent GUI by workflow, harness, platform, and evidence.",
    keywords: ["gui", "interface", "t3 code", "parallel agents", "desktop"],
    navigation: "secondary",
  },
  {
    label: "Benchmarks",
    href: "/benchmarks",
    description: "Review the exploratory archive of configuration-specific benchmark runs.",
    keywords: ["evaluation", "results", "terminal bench", "performance"],
    navigation: null,
  },
  {
    label: "Methodology",
    href: "/methodology",
    description: "Understand eligibility, scoring, evidence, and sensitivity.",
    keywords: ["methods", "scoring", "weights", "research", "science"],
    navigation: "secondary",
  },
  {
    label: "Recommend",
    href: "/recommend",
    description: "Find leading harness matches for your workflow.",
    keywords: ["recommendation", "quiz", "workflow fit", "choose"],
    navigation: "secondary",
  },
  {
    label: "Privacy",
    href: "/privacy",
    description: "Read the privacy and analytics disclosure.",
    keywords: ["legal", "analytics", "vercel", "contact"],
    navigation: null,
  },
] as const;

export const primaryNavigationItems = searchablePageItems
  .filter((item) => item.navigation === "primary")
  .map(({ href, label }) => ({ href, label }));

export const secondaryNavigationItems = searchablePageItems
  .filter((item) => item.navigation === "secondary")
  .map(({ href, label }) => ({ href, label }));
