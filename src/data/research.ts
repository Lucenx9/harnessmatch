export type ResearchMaturity = "peer-reviewed" | "preprint";

export type ResearchSource = {
  title: string;
  venue: string;
  maturity: ResearchMaturity;
  url: string;
  supports: string;
  limitation: string;
};

export const researchSources: ResearchSource[] = [
  {
    title: "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
    venue: "NeurIPS 2024",
    maturity: "peer-reviewed",
    url: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/5a7c947568c1b1328ccc5230172e1e7c-Abstract-Conference.html",
    supports:
      "Treats the interface around the model as a first-class variable: prompts, commands, control flow, environment, and feedback format.",
    limitation:
      "It studies SWE-agent and benchmark tasks; it is not a current capability audit of commercial products.",
  },
  {
    title: "OpenHands: An Open Platform for AI Software Developers as Generalist Agents",
    venue: "ICLR 2025",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2407.16741",
    supports:
      "Separates the agent loop from the execution runtime and documents sandbox, event stream, tools, and multi-agent coordination.",
    limitation:
      "Its architecture is a strong reference model, not proof that every product implements the same boundaries.",
  },
  {
    title: "Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces",
    venue: "ICLR 2026",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2601.11868",
    supports:
      "Requires realistic tasks, pinned environments, executable tests, repeated attempts, and explicit agent-harness configuration.",
    limitation:
      "A score belongs to a particular model, harness, environment, budget, and run policy—not to the harness in isolation.",
  },
  {
    title: "Harness Engineering for Agentic AI Coding Tools: An Exploratory Study",
    venue: "AIware 2026",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2602.14690",
    supports:
      "Defines eight repository-level mechanisms: context files, settings, skills, subagents, commands, hooks, rules, and MCP.",
    limitation:
      "The product matrix is a February 2026 snapshot of five tools, so current capability labels still need live first-party verification.",
  },
  {
    title: "Harness-Bench: Measuring Harness Effects across Models in Realistic Agent Workflows",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.27922",
    supports:
      "Frames a harness through context, tools, state, constraints, permissions, tracing, and recovery, and compares model-harness pairings.",
    limitation:
      "It is a recent preprint and its aggregate results are not imported as permanent product ratings.",
  },
];
