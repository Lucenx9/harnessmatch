export type WatchlistCandidate = {
  name: string;
  status: "needs-more-evidence" | "adjacent-tool" | "archived-lineage";
  reason: string;
  sourceUrl: string;
  observedAt: string;
};

export const discoveryWatchlist: WatchlistCandidate[] = [
  {
    name: "Terminus 2",
    status: "adjacent-tool",
    reason: "Terminal-Bench documents Terminus as an autonomy-first evaluation agent outside the task container. It remains a research scaffold until first-party availability and daily-use support are documented well enough for catalog inclusion.",
    sourceUrl: "https://www.tbench.ai/news/terminus",
    observedAt: "2026-07-27",
  },
  {
    name: "Roo Code",
    status: "archived-lineage",
    reason: "The first-party repository was archived in May 2026. Active lineage is represented by Zoo Code and archived tools are excluded from active catalog summaries.",
    sourceUrl: "https://github.com/RooCodeInc/Roo-Code",
    observedAt: "2026-07-26",
  },
  {
    name: "Slate Agent",
    status: "needs-more-evidence",
    reason: "Discovered in ecosystem catalogs, but current first-party technical documentation is insufficient for source-backed capability classification.",
    sourceUrl: "https://openrouter.ai/apps",
    observedAt: "2026-07-26",
  },
  {
    name: "Ottili",
    status: "needs-more-evidence",
    reason: "Discovered in ecosystem catalogs, but current first-party technical documentation is insufficient for source-backed capability classification.",
    sourceUrl: "https://openrouter.ai/apps",
    observedAt: "2026-07-26",
  },
  {
    name: "Ante",
    status: "needs-more-evidence",
    reason: "Discovered in ecosystem catalogs, but current first-party technical documentation is insufficient for source-backed capability classification.",
    sourceUrl: "https://openrouter.ai/apps",
    observedAt: "2026-07-26",
  },
  {
    name: "Portkey and model gateways",
    status: "adjacent-tool",
    reason: "Provider gateways can be important harness dependencies, but they do not independently implement the coding-agent loop compared by HarnessMatch.",
    sourceUrl: "https://openrouter.ai/apps",
    observedAt: "2026-07-26",
  },
  {
    name: "General personal agents",
    status: "adjacent-tool",
    reason: "General agents without a documented software-engineering execution profile remain outside the primary catalog until coding workflows are first-party documented.",
    sourceUrl: "https://openrouter.ai/apps",
    observedAt: "2026-07-26",
  },
];
