import type { FeatureKey, Recommendation, RecommendationAnswers, RecommendationFactor } from "@/lib/types";

export const questions = [
  {
    key: "interface",
    title: "Where do you want to work?",
    description: "Choose the surface you expect to use most often.",
    options: [
      ["terminal", "Terminal", "Keyboard-first, scriptable workflow"],
      ["ide", "IDE", "Inline diffs and editor-native review"],
      ["web", "Desktop / web", "Visual task management and sessions"],
      ["automation", "Automation", "Headless, CI, or scheduled execution"],
    ],
  },
  {
    key: "priority",
    title: "What matters most?",
    description: "Pick the trade-off you care about most. There is no universally best option.",
    options: [
      ["simplicity", "Simplicity", "Fast setup and a focused product surface"],
      ["flexibility", "Flexibility", "Providers, models, tools, and custom workflows"],
      ["security", "Execution safety", "Isolation, permissions, and controlled execution"],
      ["autonomy", "Autonomy", "Longer tasks with fewer interruptions"],
    ],
  },
  {
    key: "modelAccess",
    title: "How do you access AI models?",
    description: "Choose the access path you expect to use most often.",
    options: [
      ["subscription", "Existing subscription", "Prefer ChatGPT, Claude, or another subscription"],
      ["model-agnostic", "API keys / providers", "Bring API keys or choose among supported providers"],
      ["local", "Local models", "Ollama, LM Studio, or self-hosted endpoints"],
      ["no-preference", "No preference", "Keep every documented access path in consideration"],
    ],
  },
  {
    key: "control",
    title: "How closely do you want to supervise it?",
    description: "Think about a normal task, not the most autonomous mode the tool can offer.",
    options: [
      ["approval-heavy", "Stay close", "Review commands and changes as it works"],
      ["balanced", "Check risky actions", "Let routine work continue without interruption"],
      ["hands-off", "Let it run", "Prefer completing the task with fewer questions"],
    ],
  },
  {
    key: "changeScope",
    title: "What do you usually ask it to change?",
    description: "Choose the typical task size. You will choose how it runs in the next step.",
    options: [
      ["focused", "Focused changes", "Narrow edits with a small working set"],
      ["cross-file", "Cross-file work", "Features and fixes spanning several files"],
      ["large-repo", "Repository-wide", "Broad context across a large codebase"],
    ],
  },
  {
    key: "operatingMode",
    title: "Will you stay with it while it works?",
    description: "Choose the way you expect to use the tool most often.",
    options: [
      ["interactive", "Work together", "Stay in the loop during one task"],
      ["ci", "Run unattended", "Use scripts, CI, or scheduled jobs without an open UI"],
      ["parallel", "Split the work", "Use more agents or independent tasks at the same time"],
    ],
  },
] as const;

export const featureOptions: Array<[FeatureKey, string]> = [
  ["mcp", "Connect external tools (MCP)"],
  ["localModels", "Run local models"],
  ["subagents", "Run agents in parallel or delegate"],
  ["headless", "Run without an open UI"],
  ["browser", "Control a browser"],
  ["sandbox", "Isolate command execution"],
  ["checkpoints", "Undo file changes"],
];

export const featureLabels = Object.fromEntries(featureOptions) as Record<FeatureKey, string>;

export const factorLabels: Record<RecommendationFactor, string> = {
  priority: "What matters most",
  control: "Approval style",
  changeScope: "Size of changes",
  operatingMode: "How work runs",
};

export const interfaceLabels: Record<RecommendationAnswers["interface"], string> = {
  terminal: "Terminal",
  ide: "IDE",
  web: "Desktop / web",
  automation: "Automation",
};

export const priorityLabels: Record<RecommendationAnswers["priority"], string> = {
  simplicity: "Simple setup",
  flexibility: "Flexibility",
  security: "Safer execution",
  autonomy: "More autonomy",
};

export const modelAccessLabels: Record<RecommendationAnswers["modelAccess"], string> = {
  subscription: "Existing subscription",
  "model-agnostic": "API keys / providers",
  local: "Local models",
  enterprise: "Enterprise access",
  "no-preference": "No model-access constraint",
};

export const controlLabels: Record<RecommendationAnswers["control"], string> = {
  "approval-heavy": "Review each step",
  balanced: "Balanced approvals",
  "hands-off": "Mostly autonomous",
};

export const changeScopeLabels: Record<RecommendationAnswers["changeScope"], string> = {
  focused: "Focused changes",
  "cross-file": "Cross-file work",
  "large-repo": "Repository-wide",
};

export const operatingModeLabels: Record<RecommendationAnswers["operatingMode"], string> = {
  interactive: "Interactive",
  ci: "CI / headless",
  parallel: "Parallel work",
};

export const fitBandLabels: Record<Recommendation["fitBand"], string> = {
  strong: "Strong match",
  good: "Good match",
  conditional: "Conditional match",
  weak: "Weak match",
};
