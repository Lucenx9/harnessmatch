import type { CapabilityScores } from "../lib/types";

export type ValidationPlanStatus = "protocol-published" | "not-started";

export const interRaterValidationPlan = {
  status: "protocol-published" as ValidationPlanStatus,
  unitOfAnalysis: "one harness × one capability axis",
  independentRaters: 2,
  sampleHarnessIds: [
    "claude-code",
    "codex",
    "opencode",
    "aider",
    "openhands",
    "cursor-cli",
    "qwen-code",
    "mini-swe-agent",
    "coder-agents",
  ],
  axes: [
    "simplicity",
    "flexibility",
    "security",
    "autonomy",
    "automation",
    "largeRepo",
    "humanControl",
  ] satisfies Array<keyof CapabilityScores>,
  samplingRationale:
    "The fixed sample spans open and closed products, terminal and IDE workflows, host-first, sandbox-first, and managed runtimes, plus pair-programmer, coding-agent, and platform roles.",
  procedure: [
    "Freeze the source packet and product revision before coding begins.",
    "Give both raters the same public anchors and source packet, without access to the other rater's assignments.",
    "Record one ordinal level plus the exact supporting source for every harness-axis unit.",
    "Calculate agreement before reconciliation; disagreements are preserved in the public audit artifact.",
    "Revise an ambiguous anchor, then independently recode a held-out set before changing production ratings.",
  ],
  primaryStatistic: "Ordinal Krippendorff's alpha reported separately for each capability axis",
  secondaryStatistic: "Quadratic-weighted Cohen's kappa by axis",
  uncertainty: "Bootstrap 95% intervals by resampling harnesses; pilot intervals are expected to be wide",
  workingThreshold: 0.8,
  thresholdCaveat:
    "This is a pre-specified working threshold, not a universal law. The coefficient, interval, raw agreement, disagreements, and sample composition must all be reported, and no pooled result may hide a weak axis.",
} as const;

export const contentValidityPlan = {
  status: "not-started" as ValidationPlanStatus,
  panel:
    "External developers, maintainers, DevOps practitioners, security engineers, and experienced terminal and IDE agent users.",
  task:
    "Rate whether each dimension and behavioral anchor is relevant, clear, and sufficient for choosing a coding harness. Product preference is not requested.",
  outputs: [
    "Item-level relevance and clarity distributions",
    "Panel composition and disagreements",
    "Dimensions or anchors retained, revised, added, or removed",
  ],
} as const;

export const userValidationPlan = {
  status: "not-started" as ValidationPlanStatus,
  design:
    "Prospective pilot: collect workflow preferences, lock the recommendation, counterbalance hands-on trials of two or three eligible harnesses, and keep the predicted winner hidden until pre-reveal ratings are complete.",
  outcomes: [
    "Pre-reveal match between the locked recommendation and the user's preferred harness",
    "Perceived recommendation quality and transparency",
    "Choice confidence and satisfaction after real use",
    "Switching frequency and reasons after a follow-up period",
  ],
  sampleSizePolicy:
    "Use the first pilot to estimate variance and completion rates, then set the confirmatory sample from a preregistered precision or power target. Pilot results alone do not establish predictive validity.",
} as const;
