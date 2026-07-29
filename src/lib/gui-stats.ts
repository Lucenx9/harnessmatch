import { classifyGuiProducts } from "@/lib/gui-fit";
import type {
  GuiCapabilityKey,
  GuiFitBand,
  GuiPlatform,
  GuiProduct,
  GuiRepositoryAudit,
  GuiWorkflow,
} from "@/lib/gui-types";

const capabilityOrder: GuiCapabilityKey[] = [
  "parallelSessions",
  "workspaceIsolation",
  "visualReview",
  "remoteExecution",
  "teamCollaboration",
];

const platformOrder: GuiPlatform[] = ["macOS", "Windows", "Linux", "Browser", "iOS"];

const fitBands: GuiFitBand[] = ["strong", "good", "conditional", "not-eligible"];

export type GuiCatalogStats = ReturnType<typeof summarizeGuiCatalog>;

export function summarizeGuiCatalog(
  products: GuiProduct[],
  audits: GuiRepositoryAudit[],
  workflows: GuiWorkflow[],
) {
  const capabilityClaims = products.flatMap((product) => Object.values(product.capabilities));
  const evidenceUrls = new Set(products.flatMap((product) => product.evidence.map((source) => source.url)));

  return {
    activeProducts: products.filter((product) => product.status === "active").length,
    documentedClaims: capabilityClaims.filter((claim) => claim.state === "documented").length,
    totalClaims: capabilityClaims.length,
    evidenceSources: evidenceUrls.size,
    codeAudits: audits.length,
    previews: products.filter((product) => product.preview).length,
    publicCodeProducts: products.filter((product) => product.sourceAccess !== "proprietary").length,
    proprietaryProducts: products.filter((product) => product.sourceAccess === "proprietary").length,
    nativeProducts: products.filter((product) => product.layer === "harness-native").length,
    multiHarnessProducts: products.filter((product) => product.layer === "multi-harness-workspace").length,
    verifiedAt: products.reduce(
      (latest, product) => product.verifiedAt > latest ? product.verifiedAt : latest,
      "",
    ),
    capabilityCoverage: capabilityOrder.map((key) => ({
      key,
      documented: products.filter((product) => product.capabilities[key].state === "documented").length,
      unknown: products.filter((product) => product.capabilities[key].state === "unknown").length,
      contradicted: products.filter((product) => product.capabilities[key].state === "contradicted").length,
      total: products.length,
    })),
    platformCoverage: platformOrder.map((platform) => ({
      platform,
      products: products.filter((product) => product.platforms.includes(platform)).length,
      total: products.length,
    })),
    workflowCoverage: workflows.map((workflow) => {
      const results = classifyGuiProducts(products, workflow);
      return {
        id: workflow.id,
        label: workflow.label,
        counts: Object.fromEntries(
          fitBands.map((band) => [band, results.filter((result) => result.fitBand === band).length]),
        ) as Record<GuiFitBand, number>,
      };
    }),
  };
}
