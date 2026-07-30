import { classifyGuiFit, guiFitBandLabels } from "./gui-fit";
import { buildGuiEcosystemViewRecords } from "./gui-ecosystem-view";
import { namedHarnesses } from "./gui-harness-coverage";
import { guiCapabilityKeys, guiCapabilityLabels } from "./gui-labels";
import type {
  GuiCapabilityKey,
  GuiClaimState,
  GuiEcosystemSignalSnapshot,
  GuiFitBand,
  GuiLayer,
  GuiLogo,
  GuiPlatform,
  GuiProduct,
  GuiRepositoryAudit,
  GuiSourceAccess,
  GuiWorkflow,
  GuiWorkflowId,
} from "./gui-types";

export type GuiMatcherWorkflow = {
  id: GuiWorkflowId;
  label: string;
  requiredLabels: string[];
  preferredLabels: string[];
};

export type GuiMatcherProduct = {
  id: string;
  name: string;
  logo: Pick<GuiLogo, "src">;
  layer: GuiLayer;
  sourceAccess: GuiSourceAccess;
  platforms: GuiPlatform[];
  namedHarnesses: string[];
  acceptsArbitraryCli: boolean;
  supportsMultipleHarnesses: boolean;
  harnessCoverage: string;
  harnessSupportNote: string;
  summary: string;
  bestFor: string;
  limitation: string;
  capabilities: Array<{
    key: GuiCapabilityKey;
    label: string;
    state: GuiClaimState;
    summary: string;
  }>;
  evidence: Array<{
    title: string;
    url: string;
    covers: string;
  }>;
  audit: {
    repositoryUrl: string;
    inspectedRef: string;
    inspectedPaths: string[];
    established: string[];
    limitation: string;
  } | null;
  workflowFits: Array<{
    workflowId: GuiWorkflowId;
    fitBand: GuiFitBand;
    why: string;
    watchOut: string;
  }>;
};

export type GuiWorkflowMatcherViewModel = {
  products: GuiMatcherProduct[];
  workflows: GuiMatcherWorkflow[];
  harnessOptions: string[];
  fitBandLabels: Record<GuiFitBand, string>;
};

function compactHarnessCoverage(product: GuiProduct, harnesses: string[]) {
  if (product.acceptsArbitraryCli) return "Any CLI, with documented presets";
  if (harnesses.length <= 3) return harnesses.join(", ");
  return `${harnesses.slice(0, 2).join(", ")} + ${harnesses.length - 2} more`;
}

export function buildGuiWorkflowMatcherViewModel(
  products: GuiProduct[],
  audits: GuiRepositoryAudit[],
  workflows: GuiWorkflow[],
): GuiWorkflowMatcherViewModel {
  const auditByProductId = new Map(audits.map((audit) => [audit.guiId, audit]));
  const activeProducts = products
    .filter((product) => product.status === "active")
    .toSorted((left, right) => left.name.localeCompare(right.name));
  const matcherProducts = activeProducts.map((product) => {
    const harnesses = namedHarnesses(product);
    const audit = auditByProductId.get(product.id);

    return {
      id: product.id,
      name: product.name,
      logo: { src: product.logo.src },
      layer: product.layer,
      sourceAccess: product.sourceAccess,
      platforms: product.platforms,
      namedHarnesses: harnesses,
      acceptsArbitraryCli: product.acceptsArbitraryCli,
      supportsMultipleHarnesses: product.acceptsArbitraryCli || harnesses.length > 1,
      harnessCoverage: compactHarnessCoverage(product, harnesses),
      harnessSupportNote: product.harnessSupportNote,
      summary: product.summary,
      bestFor: product.bestFor,
      limitation: product.limitation,
      capabilities: guiCapabilityKeys.map((key) => ({
        key,
        label: guiCapabilityLabels[key],
        state: product.capabilities[key].state,
        summary: product.capabilities[key].summary,
      })),
      evidence: product.evidence.map(({ title, url, covers }) => ({ title, url, covers })),
      audit: audit
        ? {
            repositoryUrl: audit.repositoryUrl,
            inspectedRef: audit.inspectedRef,
            inspectedPaths: audit.inspectedPaths,
            established: audit.established,
            limitation: audit.limitation,
          }
        : null,
      workflowFits: workflows.map((workflow) => {
        const fit = classifyGuiFit(product, workflow);
        return {
          workflowId: workflow.id,
          fitBand: fit.fitBand,
          why: fit.why,
          watchOut: fit.watchOut,
        };
      }),
    };
  });

  return {
    products: matcherProducts,
    workflows: workflows.map((workflow) => ({
      id: workflow.id,
      label: workflow.label,
      requiredLabels: workflow.required.map((key) => guiCapabilityLabels[key]),
      preferredLabels: workflow.preferred.map((key) => guiCapabilityLabels[key]),
    })),
    harnessOptions: [...new Set(matcherProducts.flatMap((product) => product.namedHarnesses))]
      .sort((left, right) => left.localeCompare(right)),
    fitBandLabels: guiFitBandLabels,
  };
}

export type GuiLiveSourceKey = "homebrew" | "github-releases" | "github";

export type GuiLiveSignalRow = {
  id: string;
  name: string;
  logo: Pick<GuiLogo, "src">;
  detail: string;
  valueLabel: string;
  secondary: string;
  barPercent: number;
};

export type GuiLiveSignalSource = {
  id: GuiLiveSourceKey;
  tab: string;
  title: string;
  coverage: string;
  columns: string[];
  note: string;
  href: string;
  link: string;
  rows: GuiLiveSignalRow[];
};

export type GuiLiveSignalsViewModel = {
  observedAt: string | null;
  sources: GuiLiveSignalSource[];
};

type GuiSignalRecord = {
  product: GuiProduct;
  signal: GuiEcosystemSignalSnapshot;
};

const integer = new Intl.NumberFormat("en-US");

function unreachableSignal(signal: never): never {
  throw new Error(`Unsupported GUI signal: ${JSON.stringify(signal)}`);
}

function rankedRows(records: GuiSignalRecord[]): GuiLiveSignalRow[] {
  const maximum = Math.max(...records.map(({ signal }) => signal.value), 1);

  return records.map(({ product, signal }) => {
    switch (signal.source) {
      case "homebrew":
        return {
          id: product.id,
          name: product.name,
          logo: { src: product.logo.src },
          detail: `v${signal.latestVersion.split(",")[0]}`,
          valueLabel: `${integer.format(signal.value)} installs`,
          secondary: "30 days",
          barPercent: Math.max((signal.value / maximum) * 100, 3),
        };
      case "github-releases":
        return {
          id: product.id,
          name: product.name,
          logo: { src: product.logo.src },
          detail: signal.latestVersion,
          valueLabel: `${integer.format(signal.value)} downloads`,
          secondary: `${signal.recentReleaseCount} releases / ${signal.recentReleaseWindowDays}d`,
          barPercent: Math.max((signal.value / maximum) * 100, 3),
        };
      case "github":
        return {
          id: product.id,
          name: product.name,
          logo: { src: product.logo.src },
          detail: signal.artifactId,
          valueLabel: `${integer.format(signal.value)} stars`,
          secondary: `${integer.format(signal.forks)} forks`,
          barPercent: Math.max((signal.value / maximum) * 100, 3),
        };
    }

    return unreachableSignal(signal);
  });
}

export function buildGuiLiveSignalsViewModel(
  products: GuiProduct[],
  signals: GuiEcosystemSignalSnapshot[],
): GuiLiveSignalsViewModel {
  const activeProducts = products.filter((product) => product.status === "active");
  const records = buildGuiEcosystemViewRecords(activeProducts, signals);
  const homebrew = records.homebrew;
  const githubReleases = records.githubReleases;
  const github = records.github;
  const homebrewWindow = homebrew[0]?.signal;
  const productCount = activeProducts.length;

  return {
    observedAt: signals.map((signal) => signal.observedAt).toSorted().at(-1) ?? null,
    sources: [
      {
        id: "homebrew",
        tab: "Homebrew · 30d",
        title: "macOS install activity",
        coverage: `${homebrew.length}/${productCount} mapped`,
        columns: ["Rank", "Interface", "30-day events", "Window"],
        note: `${homebrewWindow?.source === "homebrew"
          ? `${homebrewWindow.windowStart}–${homebrewWindow.windowEnd}. `
          : ""}Install events are not unique users.`,
        href: "https://formulae.brew.sh/docs/api/",
        link: "Homebrew source",
        rows: rankedRows(homebrew),
      },
      {
        id: "github-releases",
        tab: "GitHub installers",
        title: "Stable installer downloads",
        coverage: `${githubReleases.length}/${productCount} measurable`,
        columns: ["Rank", "Interface", "Cumulative downloads", "Recent releases"],
        note:
          "Matched stable installers only. Counts can include reinstalls and updater retrievals; they are not unique users.",
        href: "https://docs.github.com/en/rest/releases/releases",
        link: "GitHub releases source",
        rows: rankedRows(githubReleases),
      },
      {
        id: "github",
        tab: "GitHub interest",
        title: "Repository interest",
        coverage: `${github.length}/${productCount} audited`,
        columns: ["Rank", "Interface", "Stars", "Forks"],
        note:
          "Only the exact repository already used for the code audit is counted. Missing is not zero.",
        href: "https://docs.github.com/en/rest/activity/starring",
        link: "GitHub stars source",
        rows: rankedRows(github),
      },
    ],
  };
}
