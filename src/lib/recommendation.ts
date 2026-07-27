import { harnesses } from "../data/harnesses";
import { getHarnessMembershipAssessment } from "../data/harness-membership";
import { getOperationalProfile } from "../data/operational-profiles";
import { evidenceStateFor } from "./evaluation";
import {
  membershipCriterionLabels,
  productLayerLabels,
} from "./harness-classification";
import {
  capabilityValueFunction,
  changeScopeWeights,
  controlStyleWeights,
  evidenceCoverageThresholds,
  fitBandThresholds,
  implicitRequiredFeatures,
  operatingModeWeights,
  operationalPostureScores,
  recommendationSensitivity,
  recommendationWeights,
} from "./recommendation-config";
import type {
  EligibilityFailure,
  EligibilityAssessment,
  FeatureKey,
  Harness,
  RankRobustness,
  Recommendation,
  RecommendationAnswers,
  RecommendationFactor,
} from "./types";

type FactorWeights = Record<RecommendationFactor, number>;

const featureLabels: Record<FeatureKey, string> = {
  mcp: "MCP",
  localModels: "local model support",
  subagents: "subagents or parallel agents",
  headless: "headless execution",
  browser: "a browser tool",
  sandbox: "an execution sandbox",
  checkpoints: "checkpoint or file rollback",
};

const interfaceLabels: Record<RecommendationAnswers["interface"], string> = {
  terminal: "terminal",
  ide: "IDE",
  web: "desktop or web app",
  automation: "automation workflow",
};

const modelAccessLabels: Record<RecommendationAnswers["modelAccess"], string> = {
  subscription: "your existing subscription",
  "model-agnostic": "multiple model providers",
  local: "local models",
  enterprise: "an enterprise access path",
};

const priorityReason: Record<RecommendationAnswers["priority"], string> = {
  simplicity: "Its documented setup and workflow are relatively straightforward.",
  flexibility: "It offers strong flexibility across models, providers, tools, or workflows.",
  security: "It documents strong controls for safer code execution.",
  autonomy: "It is designed for longer tasks with fewer interruptions.",
};

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const capabilityValue = (value: number) =>
  capabilityValueFunction[value as keyof typeof capabilityValueFunction] ?? 0;

/** Missing evidence is not renormalized away: the item remains unranked. */
function completeWeightedValue(values: Array<{ score: number | null; weight: number }>): number | null {
  if (values.some((value) => value.score === null)) return null;
  const totalWeight = values.reduce((total, value) => total + value.weight, 0);
  if (totalWeight === 0) return null;
  return values.reduce(
    (total, value) => total + (value.score ?? 0) * (value.weight / totalWeight),
    0,
  );
}

function controlScore(harness: Harness, answers: RecommendationAnswers): number | null {
  const operational = getOperationalProfile(harness.id);
  const scores = {
    humanControl: capabilityValue(harness.capabilities.humanControl),
    autonomy: capabilityValue(harness.capabilities.autonomy),
    automation: capabilityValue(harness.capabilities.automation),
    security: capabilityValue(harness.capabilities.security),
    permissions: operationalPostureScores.permissions[operational.permissions],
    verification: operationalPostureScores.verification[operational.verification],
    recovery: operationalPostureScores.recovery[operational.recovery],
    observability: operationalPostureScores.observability[operational.observability],
  };
  const weights = controlStyleWeights[answers.control];
  return completeWeightedValue(Object.entries(weights).map(([key, weight]) => ({
    score: scores[key as keyof typeof scores],
    weight,
  })));
}

function changeScopeScore(harness: Harness, answers: RecommendationAnswers): number | null {
  const operational = getOperationalProfile(harness.id);
  const scores = {
    simplicity: capabilityValue(harness.capabilities.simplicity),
    flexibility: capabilityValue(harness.capabilities.flexibility),
    largeRepo: capabilityValue(harness.capabilities.largeRepo),
    humanControl: capabilityValue(harness.capabilities.humanControl),
    context: operationalPostureScores.context[operational.context],
  };
  const weights = changeScopeWeights[answers.changeScope];
  return completeWeightedValue(Object.entries(weights).map(([key, weight]) => ({
    score: scores[key as keyof typeof scores],
    weight,
  })));
}

function operatingModeScore(harness: Harness, answers: RecommendationAnswers): number | null {
  const operational = getOperationalProfile(harness.id);
  const scores = {
    simplicity: capabilityValue(harness.capabilities.simplicity),
    humanControl: capabilityValue(harness.capabilities.humanControl),
    autonomy: capabilityValue(harness.capabilities.autonomy),
    automation: capabilityValue(harness.capabilities.automation),
    security: capabilityValue(harness.capabilities.security),
    context: operationalPostureScores.context[operational.context],
    verification: operationalPostureScores.verification[operational.verification],
    recovery: operationalPostureScores.recovery[operational.recovery],
    observability: operationalPostureScores.observability[operational.observability],
  };
  const weights = operatingModeWeights[answers.operatingMode];
  return completeWeightedValue(Object.entries(weights).map(([key, weight]) => ({
    score: scores[key as keyof typeof scores],
    weight,
  })));
}

function scoreBreakdownFor(harness: Harness, answers: RecommendationAnswers) {
  const breakdown: Record<RecommendationFactor, number | null> = {
    priority: capabilityValue(harness.capabilities[answers.priority]),
    control: controlScore(harness, answers),
    changeScope: changeScopeScore(harness, answers),
    operatingMode: operatingModeScore(harness, answers),
  };
  if (Object.values(breakdown).some((value) => value === null)) return null;
  return breakdown as Record<RecommendationFactor, number>;
}

function weightedPreferenceValue(
  scoreBreakdown: Record<RecommendationFactor, number>,
  weights: FactorWeights,
) {
  const totalWeight = Object.values(weights).reduce((total, value) => total + value, 0);
  return (Object.keys(weights) as RecommendationFactor[]).reduce(
    (total, factor) => total + scoreBreakdown[factor] * (weights[factor] / totalWeight),
    0,
  );
}

export function fitBandFor(score: number): Recommendation["fitBand"] {
  if (score >= fitBandThresholds.strong) return "strong";
  if (score >= fitBandThresholds.good) return "good";
  if (score >= fitBandThresholds.conditional) return "conditional";
  return "weak";
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function sensitivityWeights(random: () => number): FactorWeights {
  return Object.fromEntries((Object.keys(recommendationWeights) as RecommendationFactor[]).map((factor) => {
    const multiplier = recommendationSensitivity.weightMultiplierMin
      + random() * (recommendationSensitivity.weightMultiplierMax - recommendationSensitivity.weightMultiplierMin);
    return [factor, recommendationWeights[factor] * multiplier];
  })) as FactorWeights;
}

function robustnessFor(candidates: Array<Pick<Recommendation, "harness" | "scoreBreakdown">>) {
  const counts = new Map<string, { top: number; topThree: number; ranks: number[] }>();
  for (const candidate of candidates) counts.set(candidate.harness.id, { top: 0, topThree: 0, ranks: [] });
  const random = seededRandom(recommendationSensitivity.seed);

  for (let scenario = 0; scenario < recommendationSensitivity.scenarios; scenario += 1) {
    const weights = sensitivityWeights(random);
    const ranked = candidates.map((candidate) => ({
      id: candidate.harness.id,
      value: weightedPreferenceValue(Object.fromEntries(
        (Object.keys(candidate.scoreBreakdown) as RecommendationFactor[]).map((factor) => [
          factor,
          clamp(
            candidate.scoreBreakdown[factor]
              + (random() * 2 - 1) * recommendationSensitivity.factorValueUncertainty,
          ),
        ]),
      ) as Record<RecommendationFactor, number>, weights),
    })).sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));

    ranked.forEach((candidate, index) => {
      const entry = counts.get(candidate.id)!;
      const rank = index + 1;
      entry.ranks.push(rank);
      if (rank === 1) entry.top += 1;
      if (rank <= 3) entry.topThree += 1;
    });
  }

  return new Map<string, RankRobustness>([...counts.entries()].map(([id, entry]) => [id, {
    scenarioCount: recommendationSensitivity.scenarios,
    topRankFrequency: Math.round((entry.top / recommendationSensitivity.scenarios) * 100),
    topThreeFrequency: Math.round((entry.topThree / recommendationSensitivity.scenarios) * 100),
    bestRank: Math.min(...entry.ranks),
    worstRank: Math.max(...entry.ranks),
    meanRank: Math.round((entry.ranks.reduce((total, rank) => total + rank, 0) / entry.ranks.length) * 10) / 10,
  }]));
}

export function requiredFeaturesFor(answers: RecommendationAnswers): FeatureKey[] {
  return Array.from(new Set([
    ...answers.requiredFeatures,
    ...(implicitRequiredFeatures[answers.operatingMode] ?? []),
  ]));
}

export function missingRequiredFeatures(harness: Harness, answers: RecommendationAnswers): FeatureKey[] {
  return requiredFeaturesFor(answers).filter((feature) => !harness.features[feature]);
}

function supportsRequestedModelAccess(harness: Harness, answers: RecommendationAnswers) {
  if (answers.modelAccess === "subscription") return harness.supportsSubscription;
  if (answers.modelAccess === "local") return harness.localModels;
  if (answers.modelAccess === "model-agnostic") return harness.providerStyle !== "single-vendor";
  return harness.supportsEnterpriseAccess === true;
}

export function eligibilityFailuresFor(
  harness: Harness,
  answers: RecommendationAnswers,
): EligibilityFailure[] {
  const failures: EligibilityFailure[] = [];
  const membership = getHarnessMembershipAssessment(harness);
  if (!membership) {
    failures.push({
      kind: "membership",
      label: "documented coding-harness membership assessment",
    });
  } else if (membership.layer !== "coding-harness") {
    failures.push({
      kind: "product-layer",
      layer: membership.layer,
      label: `own coding-harness runtime (cataloged as ${productLayerLabels[membership.layer].toLowerCase()})`,
    });
  } else {
    for (const [criterion, assessment] of Object.entries(membership.criteria)) {
      if (assessment.state === "documented") continue;
      failures.push({
        kind: "membership",
        criterion: criterion as keyof typeof membership.criteria,
        state: assessment.state,
        label: `documented ${membershipCriterionLabels[criterion as keyof typeof membership.criteria].toLowerCase()}`,
      });
    }
  }
  if (!harness.interfaces.includes(answers.interface)) {
    failures.push({ kind: "interface", label: interfaceLabels[answers.interface] });
  }
  if (!supportsRequestedModelAccess(harness, answers)) {
    failures.push({ kind: "model-access", label: `${answers.modelAccess} model access` });
  }
  for (const feature of missingRequiredFeatures(harness, answers)) {
    failures.push({ kind: "feature", feature, label: featureLabels[feature] });
  }
  return failures;
}

export function eligibilityAssessmentFor(
  harness: Harness,
  answers: RecommendationAnswers,
): EligibilityAssessment {
  const failures = eligibilityFailuresFor(harness, answers);
  return failures.length === 0
    ? { state: "eligible", label: "Eligible", failures }
    : {
        state: "not-eligible-on-current-evidence",
        label: "Not eligible on current evidence",
        failures,
      };
}

export function isCompatible(harness: Harness, answers: RecommendationAnswers): boolean {
  return eligibilityFailuresFor(harness, answers).length === 0;
}

export function evidenceCoverageFor(harness: Harness): Recommendation["evidenceCoverage"] {
  const sourceKinds = new Set(harness.evidence.map((source) => source.kind)).size;
  if (harness.evidence.length >= evidenceCoverageThresholds.high.sources
    && sourceKinds >= evidenceCoverageThresholds.high.sourceKinds) return "high";
  if (harness.evidence.length >= evidenceCoverageThresholds.medium.sources
    && sourceKinds >= evidenceCoverageThresholds.medium.sourceKinds) return "medium";
  return "limited";
}

function explain(harness: Harness, answers: RecommendationAnswers) {
  const reasons: string[] = [];
  const compromises: string[] = [];
  const operational = getOperationalProfile(harness.id);
  const documentedUseCase = harness.bestFor[0]?.replace(/[.!?]$/, "");
  if (documentedUseCase) reasons.push(`Documented use case: ${documentedUseCase}.`);
  if (harness.capabilities[answers.priority] >= 4) reasons.push(priorityReason[answers.priority]);
  if (
    answers.control === "approval-heavy"
    && harness.capabilities.humanControl >= 4
    && operational.permissions !== "host"
  ) reasons.push("It documents scoped policy or approval controls.");
  if (answers.control === "approval-heavy" && operational.permissions === "host") {
    compromises.push("Its documented default gives the agent host access instead of asking before each command.");
  }
  if (answers.control === "hands-off" && harness.capabilities.autonomy >= 4) reasons.push("It supports longer autonomous task loops.");
  if (answers.changeScope === "large-repo" && harness.capabilities.largeRepo >= 4) reasons.push("It is documented for changes across a large repository.");
  if (answers.operatingMode === "ci") reasons.push("It can run unattended in CI or headless mode.");
  if (answers.operatingMode === "parallel") reasons.push("It can split work across subagents or parallel tasks.");
  reasons.push(`Works in your preferred ${interfaceLabels[answers.interface]} and supports ${modelAccessLabels[answers.modelAccess]}.`);
  if (evidenceCoverageFor(harness) === "limited") compromises.push("Fewer first-party sources are currently available for this product.");
  if (harness.tradeoffs.length > 0 && compromises.length < 3) compromises.push(harness.tradeoffs[0]);
  return { reasons: reasons.slice(0, 4), compromises: compromises.slice(0, 3) };
}

export function recommendHarnesses(
  answers: RecommendationAnswers,
  source: Harness[] = harnesses,
): Recommendation[] {
  const provisional = source
    .filter((harness) => harness.status === "active" && isCompatible(harness, answers))
    .flatMap((harness) => {
      const scoreBreakdown = scoreBreakdownFor(harness, answers);
      if (!scoreBreakdown) return [];
      const score = Math.round(clamp(weightedPreferenceValue(scoreBreakdown, recommendationWeights)));
      return [{
        harness,
        score,
        fitBand: fitBandFor(score),
        robustness: null,
        evidenceState: evidenceStateFor(harness.id),
        evidenceCoverage: evidenceCoverageFor(harness),
        evidenceSourceCount: harness.evidence.length,
        scoreBreakdown,
        ...explain(harness, answers),
      }];
    });
  const robustness = robustnessFor(provisional);

  return provisional.map((candidate) => ({
    ...candidate,
    robustness: robustness.get(candidate.harness.id)!,
  })).sort((a, b) => (
    b.score - a.score
    || b.robustness.topThreeFrequency - a.robustness.topThreeFrequency
    || a.harness.name.localeCompare(b.harness.name)
  ));
}
