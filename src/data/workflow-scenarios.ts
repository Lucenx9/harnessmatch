import type { RecommendationAnswers } from "../lib/types";

export type WorkflowScenario = {
  id: string;
  label: string;
  description: string;
  answers: RecommendationAnswers;
};

export const workflowScenarios: WorkflowScenario[] = [
  {
    id: "vibe-coding",
    label: "Vibe coding",
    description: "Describe the outcome in an IDE, let the agent write most of the code, and review the important steps.",
    answers: {
      interface: "ide",
      priority: "simplicity",
      modelAccess: "subscription",
      control: "balanced",
      changeScope: "cross-file",
      operatingMode: "interactive",
      requiredFeatures: [],
    },
  },
  {
    id: "local-flexibility",
    label: "Local and flexible",
    description: "Terminal work with local models and MCP required.",
    answers: {
      interface: "terminal",
      priority: "flexibility",
      modelAccess: "local",
      control: "balanced",
      changeScope: "large-repo",
      operatingMode: "interactive",
      requiredFeatures: ["localModels", "mcp"],
    },
  },
  {
    id: "ide-review",
    label: "IDE with review",
    description: "IDE-first changes with file rollback, MCP, and explicit approvals.",
    answers: {
      interface: "ide",
      priority: "security",
      modelAccess: "model-agnostic",
      control: "approval-heavy",
      changeScope: "cross-file",
      operatingMode: "interactive",
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
      changeScope: "large-repo",
      operatingMode: "ci",
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
      changeScope: "large-repo",
      operatingMode: "ci",
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
      changeScope: "cross-file",
      operatingMode: "interactive",
      requiredFeatures: ["browser"],
    },
  },
];
