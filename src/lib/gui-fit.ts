import { guiCapabilityLabels } from "@/lib/gui-labels";
import type {
  GuiCapabilityKey,
  GuiFitBand,
  GuiFitResult,
  GuiProduct,
  GuiWorkflow,
  GuiWorkflowId,
} from "@/lib/gui-types";

export const guiWorkflows: GuiWorkflow[] = [
  {
    id: "focused-review",
    label: "One agent + review",
    description: "Stay close to one coding session and inspect changes in a dedicated visual surface.",
    required: ["visualReview"],
    preferred: ["workspaceIsolation"],
  },
  {
    id: "parallel-local",
    label: "Parallel local tasks",
    description: "Run several coding tasks on one machine without their branches or files colliding.",
    required: ["parallelSessions", "workspaceIsolation"],
    preferred: ["visualReview"],
  },
  {
    id: "remote-control",
    label: "Remote control",
    description: "Start or revisit coding work away from the machine where the repository is running.",
    required: ["remoteExecution"],
    preferred: ["teamCollaboration"],
  },
  {
    id: "team-workspace",
    label: "Shared team workspace",
    description: "Let teammates enter the same live workspace to watch, steer, preview, or review work.",
    required: ["remoteExecution", "teamCollaboration"],
    preferred: ["workspaceIsolation", "visualReview"],
  },
];

export const guiFitBandLabels: Record<GuiFitBand, string> = {
  strong: "Strong fit",
  good: "Good fit",
  conditional: "Conditional fit",
  "not-eligible": "Not eligible on current evidence",
};

const fitBandOrder: Record<GuiFitBand, number> = {
  strong: 0,
  good: 1,
  conditional: 2,
  "not-eligible": 3,
};

function labels(keys: GuiCapabilityKey[]) {
  return keys.map((key) => guiCapabilityLabels[key]).join(", ");
}

function unresolvedCapabilities(product: GuiProduct, keys: GuiCapabilityKey[]) {
  return keys.filter((key) => product.capabilities[key].state !== "documented");
}

export function guiWorkflowById(id: GuiWorkflowId) {
  const workflow = guiWorkflows.find((candidate) => candidate.id === id);
  if (!workflow) throw new Error(`Unknown GUI workflow: ${id}`);
  return workflow;
}

export function classifyGuiFit(product: GuiProduct, workflow: GuiWorkflow): GuiFitResult {
  const contradictedRequired = workflow.required.filter((key) => (
    product.capabilities[key].state === "contradicted"
  ));
  const missingRequired = unresolvedCapabilities(product, workflow.required);
  const missingPreferred = unresolvedCapabilities(product, workflow.preferred);

  let fitBand: GuiFitBand;
  if (product.status !== "active" || contradictedRequired.length > 0) {
    fitBand = "not-eligible";
  } else if (missingRequired.length > 0) {
    fitBand = "conditional";
  } else if (missingPreferred.length > 0) {
    fitBand = "good";
  } else {
    fitBand = "strong";
  }

  const why = fitBand === "strong"
    ? `Current sources document ${labels([...workflow.required, ...workflow.preferred])}.`
    : fitBand === "good"
      ? `Every required mechanism is documented; current sources do not establish the preferred ${labels(missingPreferred)} mechanism.`
      : fitBand === "conditional"
        ? `The product may fit, but current sources do not establish ${labels(missingRequired)}.`
        : "The product is inactive or a required mechanism is contradicted by current evidence.";

  const evidenceWarning = [...missingRequired, ...missingPreferred].length > 0
    ? ` Evidence gap: ${labels([...missingRequired, ...missingPreferred])}.`
    : "";

  return {
    product,
    fitBand,
    why,
    watchOut: `${product.limitation}${evidenceWarning}`,
    missingRequired,
    missingPreferred,
  };
}

export function classifyGuiProducts(products: GuiProduct[], workflow: GuiWorkflow): GuiFitResult[] {
  return products
    .map((product) => classifyGuiFit(product, workflow))
    .sort((left, right) => (
      fitBandOrder[left.fitBand] - fitBandOrder[right.fitBand]
      || left.product.name.localeCompare(right.product.name)
    ));
}
