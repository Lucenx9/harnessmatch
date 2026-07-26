import { harnesses } from "../data/harnesses";
import type {
  FeatureKey,
  Harness,
  Recommendation,
  RecommendationAnswers,
} from "./types";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const capabilityToPercent = (value: number) => (value / 5) * 100;

function modelAccessScore(harness: Harness, answers: RecommendationAnswers): number {
  switch (answers.modelAccess) {
    case "subscription":
      return harness.supportsSubscription
        ? 100
        : harness.providerStyle === "multi-provider"
          ? 55
          : 35;
    case "model-agnostic":
      return harness.providerStyle === "multi-provider"
        ? 100
        : harness.providerStyle === "enterprise-routing"
          ? 65
          : 35;
    case "local":
      return harness.localModels ? 100 : 0;
    case "enterprise":
      return clamp(
        capabilityToPercent(harness.capabilities.security) * 0.65 +
          (harness.providerStyle === "enterprise-routing" ? 35 : 20),
      );
  }
}

function controlScore(harness: Harness, answers: RecommendationAnswers): number {
  const human = capabilityToPercent(harness.capabilities.humanControl);
  const autonomy = capabilityToPercent(harness.capabilities.autonomy);
  const automation = capabilityToPercent(harness.capabilities.automation);

  switch (answers.control) {
    case "approval-heavy":
      return human;
    case "balanced":
      return human * 0.55 + autonomy * 0.45;
    case "hands-off":
      return autonomy * 0.6 + automation * 0.4;
  }
}

function repoScore(harness: Harness, answers: RecommendationAnswers): number {
  switch (answers.repoContext) {
    case "small":
      return capabilityToPercent(harness.capabilities.simplicity);
    case "large":
      return capabilityToPercent(harness.capabilities.largeRepo);
    case "ci":
      return harness.features.headless
        ? capabilityToPercent(harness.capabilities.automation)
        : 15;
    case "multi-agent":
      return harness.features.subagents
        ? capabilityToPercent(harness.capabilities.autonomy)
        : 20;
  }
}

function priorityScore(harness: Harness, answers: RecommendationAnswers): number {
  return capabilityToPercent(harness.capabilities[answers.priority]);
}

function featureScore(harness: Harness, required: FeatureKey[]): number {
  if (required.length === 0) return 75;
  const matched = required.filter((feature) => harness.features[feature]).length;
  return (matched / required.length) * 100;
}

function explain(harness: Harness, answers: RecommendationAnswers) {
  const reasons: string[] = [];
  const compromises: string[] = [];
  const blockers = answers.requiredFeatures.filter(
    (feature) => !harness.features[feature],
  );

  if (harness.interfaces.includes(answers.interface)) {
    reasons.push(`Strong ${answers.interface} workflow match.`);
  } else {
    compromises.push(`No first-class ${answers.interface} interface.`);
  }

  if (harness.capabilities[answers.priority] >= 4) {
    reasons.push(`Scores highly for ${answers.priority}.`);
  }

  if (answers.modelAccess === "local" && harness.localModels) {
    reasons.push("Supports local or self-hosted model endpoints.");
  }
  if (answers.modelAccess === "subscription" && harness.supportsSubscription) {
    reasons.push("Can fit a subscription-first model-access strategy.");
  }
  if (answers.modelAccess === "model-agnostic" && harness.providerStyle === "multi-provider") {
    reasons.push("Designed for switching across providers and models.");
  }
  if (answers.control === "approval-heavy" && harness.capabilities.humanControl >= 4) {
    reasons.push("Provides a strong review and approval loop.");
  }
  if (answers.control === "hands-off" && harness.capabilities.autonomy >= 4) {
    reasons.push("Well suited to longer autonomous task loops.");
  }
  if (answers.repoContext === "ci" && harness.features.headless) {
    reasons.push("Supports headless or automation-oriented execution.");
  }
  if (answers.repoContext === "multi-agent" && harness.features.subagents) {
    reasons.push("Includes subagent or parallel-agent capabilities.");
  }

  blockers.forEach((feature) => {
    compromises.push(`Missing required capability: ${feature}.`);
  });

  if (harness.tradeoffs.length > 0 && compromises.length < 3) {
    compromises.push(harness.tradeoffs[0]);
  }

  return { reasons: reasons.slice(0, 4), compromises: compromises.slice(0, 3), blockers };
}

export function recommendHarnesses(
  answers: RecommendationAnswers,
  source: Harness[] = harnesses,
): Recommendation[] {
  return source
    .filter((harness) => harness.status === "active")
    .map((harness) => {
      const interfaceScore = harness.interfaces.includes(answers.interface) ? 100 : 20;
      const priority = priorityScore(harness, answers);
      const model = modelAccessScore(harness, answers);
      const control = controlScore(harness, answers);
      const repo = repoScore(harness, answers);
      const features = featureScore(harness, answers.requiredFeatures);

      const explanation = explain(harness, answers);
      const blockerPenalty = explanation.blockers.length * 12;
      const raw =
        interfaceScore * 0.2 +
        priority * 0.2 +
        model * 0.2 +
        control * 0.15 +
        repo * 0.15 +
        features * 0.1 -
        blockerPenalty;

      const score = Math.round(clamp(raw));
      const confidence: Recommendation["confidence"] =
        explanation.blockers.length === 0 && score >= 80
          ? "high"
          : score >= 62
            ? "medium"
            : "low";

      return {
        harness,
        score,
        confidence,
        ...explanation,
      };
    })
    .sort((a, b) => b.score - a.score || a.harness.name.localeCompare(b.harness.name));
}
