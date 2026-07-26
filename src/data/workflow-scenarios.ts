import type { RecommendationAnswers } from "../lib/types";

export type WorkflowScenario = {
  id: string;
  label: string;
  description: string;
  answers: RecommendationAnswers;
};

export const workflowScenarios: WorkflowScenario[] = [
  {
    id: "local-flexibility",
    label: "Local and flexible",
    description: "Terminal work with local models and MCP required.",
    answers: {
      interface: "terminal",
      priority: "flexibility",
      modelAccess: "local",
      control: "balanced",
      repoContext: "large",
      requiredFeatures: ["localModels", "mcp"],
    },
  },
  {
    id: "ide-review",
    label: "IDE with review",
    description: "IDE-first changes with checkpoints, MCP, and explicit approvals.",
    answers: {
      interface: "ide",
      priority: "security",
      modelAccess: "model-agnostic",
      control: "approval-heavy",
      repoContext: "large",
      requiredFeatures: ["checkpoints", "mcp"],
    },
  },
  {
    id: "autonomous-ci",
    label: "Autonomous CI",
    description: "Headless automation with sandboxing and hands-off control.",
    answers: {
      interface: "automation",
      priority: "autonomy",
      modelAccess: "model-agnostic",
      control: "hands-off",
      repoContext: "ci",
      requiredFeatures: ["headless", "sandbox"],
    },
  },
  {
    id: "enterprise-controls",
    label: "Enterprise controls",
    description: "CI execution with enterprise routing, sandboxing, and approval gates.",
    answers: {
      interface: "automation",
      priority: "security",
      modelAccess: "enterprise",
      control: "approval-heavy",
      repoContext: "ci",
      requiredFeatures: ["sandbox", "headless"],
    },
  },
  {
    id: "browser-work",
    label: "Browser work",
    description: "Web tasks where built-in browser support is mandatory.",
    answers: {
      interface: "web",
      priority: "autonomy",
      modelAccess: "subscription",
      control: "balanced",
      repoContext: "large",
      requiredFeatures: ["browser"],
    },
  },
];
