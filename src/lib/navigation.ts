export const searchablePageItems = [
  {
    label: "Home",
    href: "/",
    description: "Workflow explorer and evidence-backed starting points.",
    keywords: ["home", "workflow explorer", "ranking stability"],
    primary: false,
  },
  {
    label: "Recommend",
    href: "/recommend",
    description: "Find leading harness matches for your workflow.",
    keywords: ["recommendation", "quiz", "workflow fit", "choose"],
    primary: true,
  },
  {
    label: "Compare",
    href: "/compare",
    description: "Compare harness capabilities and trade-offs side by side.",
    keywords: ["comparison", "versus", "capabilities", "tradeoffs"],
    primary: true,
  },
  {
    label: "Harnesses",
    href: "/harnesses",
    description: "Browse every cataloged coding harness and adjacent tool.",
    keywords: ["catalog", "tools", "agents", "profiles"],
    primary: true,
  },
  {
    label: "Data",
    href: "/data",
    description: "Inspect evidence coverage, freshness, and source records.",
    keywords: ["evidence", "sources", "freshness", "ledger"],
    primary: true,
  },
  {
    label: "Benchmarks",
    href: "/benchmarks",
    description: "Review admitted configuration-specific benchmark runs.",
    keywords: ["evaluation", "results", "terminal bench", "performance"],
    primary: true,
  },
  {
    label: "Methodology",
    href: "/methodology",
    description: "Understand eligibility, scoring, evidence, and sensitivity.",
    keywords: ["methods", "scoring", "weights", "research", "science"],
    primary: true,
  },
  {
    label: "Privacy",
    href: "/privacy",
    description: "Read the privacy and analytics disclosure.",
    keywords: ["legal", "analytics", "vercel", "contact"],
    primary: false,
  },
] as const;

export const primaryNavigationItems = searchablePageItems
  .filter((item) => item.primary)
  .map(({ href, label }) => ({ href, label }));
