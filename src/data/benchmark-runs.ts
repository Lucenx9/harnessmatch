export type BenchmarkRun = {
  id: string;
  harnessId: string;
  harnessVersion: string;
  model: string;
  reasoningEffort: string;
  benchmark: "Terminal-Bench";
  benchmarkVersion: "2.1";
  taskCount: 89;
  attemptsPerTask: 5;
  totalTrials: 445;
  accuracy: number;
  standardError: number;
  passAt: { 2: number; 3: number; 4: number; 5: number };
  tokenUsage: {
    uncachedInput: number;
    cachedInput: number;
    output: number;
  };
  totalCostUsd: number;
  averageTrialDurationSeconds: number;
  integrityAdjustmentPercent: number;
  disqualifiedTrials: number;
  runDate: string;
  verifiedAt: string;
  environment: string;
  networkPolicy: string;
  budgetPolicy: string;
  resultSourceUrl: string;
  submissionUrl: string;
  benchmarkSourceUrl: string;
};

const benchmarkSourceUrl = "https://github.com/harbor-framework/terminal-bench-2-1";
const rawBase = "https://raw.githubusercontent.com/harbor-framework/terminal-bench-2-1/main/leaderboard/submissions";
const verifiedAt = "2026-07-27";

export const benchmarkRuns: BenchmarkRun[] = [
  {
    id: "tb21-claude-code-fable-5",
    harnessId: "claude-code",
    harnessVersion: "2.1.167",
    model: "anthropic/claude-fable-5",
    reasoningEffort: "xhigh",
    benchmark: "Terminal-Bench",
    benchmarkVersion: "2.1",
    taskCount: 89,
    attemptsPerTask: 5,
    totalTrials: 445,
    accuracy: 83.82,
    standardError: 1.16,
    passAt: { 2: 0.8978, 3: 0.918, 4: 0.9281, 5: 0.9326 },
    tokenUsage: { uncachedInput: 20_480_925, cachedInput: 174_066_133, output: 9_954_945 },
    totalCostUsd: 552.67,
    averageTrialDurationSeconds: 579.7,
    integrityAdjustmentPercent: 0.22,
    disqualifiedTrials: 1,
    runDate: "2026-06-07",
    verifiedAt,
    environment: "Harbor-managed Docker task containers using the official Terminal-Bench 2.1 dataset.",
    networkPolicy: "Task-defined network access; passing trajectories were reviewed for solution lookup and reward hacking.",
    budgetPolicy: "Official per-task time and resource limits with no timeout or resource overrides; five trials per task.",
    resultSourceUrl: `${rawBase}/2026-06-07-anthropic-claude-fable-5-xhigh-claude-code.json`,
    submissionUrl: "https://github.com/harbor-framework/terminal-bench-2-1/pull/75",
    benchmarkSourceUrl,
  },
  {
    id: "tb21-codex-gpt-5-5",
    harnessId: "codex",
    harnessVersion: "0.125.0",
    model: "openai/gpt-5.5",
    reasoningEffort: "xhigh",
    benchmark: "Terminal-Bench",
    benchmarkVersion: "2.1",
    taskCount: 89,
    attemptsPerTask: 5,
    totalTrials: 445,
    accuracy: 83.15,
    standardError: 1.13,
    passAt: { 2: 0.8888, 3: 0.9135, 4: 0.9303, 5: 0.9438 },
    tokenUsage: { uncachedInput: 336_797_311, cachedInput: 392_433_664, output: 5_966_373 },
    totalCostUsd: 2_059.19,
    averageTrialDurationSeconds: 482.6,
    integrityAdjustmentPercent: 0.22,
    disqualifiedTrials: 1,
    runDate: "2026-05-01",
    verifiedAt,
    environment: "Harbor-managed Docker task containers using the official Terminal-Bench 2.1 dataset.",
    networkPolicy: "Task-defined network access; passing trajectories were reviewed for solution lookup and reward hacking.",
    budgetPolicy: "Official per-task time and resource limits with no timeout or resource overrides; five trials per task.",
    resultSourceUrl: `${rawBase}/2026-05-01-openai-gpt-5-5-xhigh-codex.json`,
    submissionUrl: "https://github.com/harbor-framework/terminal-bench-2-1/pull/45",
    benchmarkSourceUrl,
  },
  {
    id: "tb21-cursor-grok-4-5",
    harnessId: "cursor-cli",
    harnessVersion: "2026.07.08-0c04a8a",
    model: "cursor/grok-4.5",
    reasoningEffort: "high",
    benchmark: "Terminal-Bench",
    benchmarkVersion: "2.1",
    taskCount: 89,
    attemptsPerTask: 5,
    totalTrials: 445,
    accuracy: 79.33,
    standardError: 1.46,
    passAt: { 2: 0.8888, 3: 0.9236, 4: 0.9416, 5: 0.9551 },
    tokenUsage: { uncachedInput: 12_570_445, cachedInput: 161_079_936, output: 4_734_062 },
    totalCostUsd: 134.09,
    averageTrialDurationSeconds: 443,
    integrityAdjustmentPercent: 8.99,
    disqualifiedTrials: 40,
    runDate: "2026-07-09",
    verifiedAt,
    environment: "Harbor-managed Docker task containers using the official Terminal-Bench 2.1 dataset.",
    networkPolicy: "Task-defined network access; passing trajectories were reviewed for solution lookup and reward hacking.",
    budgetPolicy: "Official per-task time and resource limits with no timeout or resource overrides; five trials per task.",
    resultSourceUrl: `${rawBase}/2026-07-09-cursor-grok-4-5-none-cursor-cli.json`,
    submissionUrl: "https://github.com/harbor-framework/terminal-bench-2-1/pull/86",
    benchmarkSourceUrl,
  },
  {
    id: "tb21-gemini-cli-gemini-3-pro",
    harnessId: "gemini-cli",
    harnessVersion: "0.40.0",
    model: "gemini/gemini-3-pro-preview",
    reasoningEffort: "high",
    benchmark: "Terminal-Bench",
    benchmarkVersion: "2.1",
    taskCount: 89,
    attemptsPerTask: 5,
    totalTrials: 445,
    accuracy: 65.84,
    standardError: 1.38,
    passAt: { 2: 0.7427, 3: 0.7831, 4: 0.8067, 5: 0.8202 },
    tokenUsage: { uncachedInput: 47_653_156, cachedInput: 329_123_284, output: 7_219_388 },
    totalCostUsd: 247.76,
    averageTrialDurationSeconds: 436.6,
    integrityAdjustmentPercent: 0.45,
    disqualifiedTrials: 2,
    runDate: "2026-05-01",
    verifiedAt,
    environment: "Harbor-managed Docker task containers using the official Terminal-Bench 2.1 dataset.",
    networkPolicy: "Task-defined network access; passing trajectories were reviewed for solution lookup and reward hacking.",
    budgetPolicy: "Official per-task time and resource limits with no timeout or resource overrides; five trials per task.",
    resultSourceUrl: `${rawBase}/2026-05-01-gemini-gemini-3-pro-preview-high-gemini-cli.json`,
    submissionUrl: "https://github.com/harbor-framework/terminal-bench-2-1/pull/66",
    benchmarkSourceUrl,
  },
  {
    id: "tb21-mini-swe-agent-muse-spark-1-1",
    harnessId: "mini-swe-agent",
    harnessVersion: "2.4.5",
    model: "openai/muse-spark-1.1",
    reasoningEffort: "xhigh",
    benchmark: "Terminal-Bench",
    benchmarkVersion: "2.1",
    taskCount: 89,
    attemptsPerTask: 5,
    totalTrials: 445,
    accuracy: 76.18,
    standardError: 1.23,
    passAt: { 2: 0.8292, 3: 0.8697, 4: 0.8966, 5: 0.9101 },
    tokenUsage: { uncachedInput: 60_996, cachedInput: 932_239_373, output: 13_679_953 },
    totalCostUsd: 198.05,
    averageTrialDurationSeconds: 687,
    integrityAdjustmentPercent: 0,
    disqualifiedTrials: 0,
    runDate: "2026-07-09",
    verifiedAt,
    environment: "Harbor-managed Docker task containers using the official Terminal-Bench 2.1 dataset.",
    networkPolicy: "Task-defined network access; passing trajectories were reviewed for solution lookup and reward hacking.",
    budgetPolicy: "Official per-task time and resource limits with no timeout or resource overrides; five trials per task.",
    resultSourceUrl: `${rawBase}/2026-07-09-openai-muse-spark-1-1-xhigh-mini-swe-agent.json`,
    submissionUrl: "https://github.com/harbor-framework/terminal-bench-2-1/pull/94",
    benchmarkSourceUrl,
  },
];

export function benchmarkRunsForHarness(harnessId: string) {
  return benchmarkRuns.filter((run) => run.harnessId === harnessId);
}
