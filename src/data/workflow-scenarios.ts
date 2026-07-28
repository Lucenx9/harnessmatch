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
    label: "Local & flexible",
    description: "Use the terminal, local models, and MCP without locking the workflow to one provider.",
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
    label: "IDE with approvals",
    description: "Work inside an IDE with file rollback, MCP, and explicit approval before risky actions.",
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
    label: "Automated CI",
    description: "Run headless repository tasks in CI with sandboxing and minimal intervention.",
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
    description: "Run CI workloads with enterprise routing, isolation, and approval gates.",
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
    label: "Browser-first",
    description: "Complete web-facing tasks with browser control built into the coding workflow.",
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
