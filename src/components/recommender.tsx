"use client";

import { useEffect, useMemo, useState } from "react";
import { recommendHarnesses } from "@/lib/recommendation";
import type {
  ControlStyle,
  FeatureKey,
  InterfaceType,
  ModelAccess,
  Priority,
  RecommendationAnswers,
  RepoContext,
} from "@/lib/types";

const defaultAnswers: RecommendationAnswers = {
  interface: "terminal",
  priority: "simplicity",
  modelAccess: "subscription",
  control: "balanced",
  repoContext: "large",
  requiredFeatures: [],
};

const questions = [
  {
    key: "interface",
    title: "Where do you want to work?",
    description: "Choose the surface you expect to use most often.",
    options: [
      ["terminal", "Terminal", "Keyboard-first, scriptable workflow"],
      ["ide", "IDE", "Inline diffs and editor-native review"],
      ["web", "Desktop / web", "Visual task management and sessions"],
      ["automation", "Automation", "Headless, CI, or scheduled execution"],
    ],
  },
  {
    key: "priority",
    title: "What matters most?",
    description: "This changes the largest scoring weight after interface fit.",
    options: [
      ["simplicity", "Simplicity", "Fast setup and a focused product surface"],
      ["flexibility", "Flexibility", "Providers, models, tools, and custom workflows"],
      ["security", "Security", "Isolation, permissions, and controlled execution"],
      ["autonomy", "Autonomy", "Longer tasks with fewer interruptions"],
    ],
  },
  {
    key: "modelAccess",
    title: "How do you access models?",
    description: "A great harness is a poor fit if the economics or provider path do not work for you.",
    options: [
      ["subscription", "Existing subscription", "Prefer ChatGPT, Claude, or another subscription"],
      ["model-agnostic", "Multiple providers", "Switch models and API providers freely"],
      ["local", "Local models", "Ollama, LM Studio, or self-hosted endpoints"],
      ["enterprise", "Enterprise routing", "Cloud platforms, gateways, and governance"],
    ],
  },
  {
    key: "control",
    title: "How much approval do you want?",
    description: "Choose the default posture, not the maximum possible autonomy.",
    options: [
      ["approval-heavy", "Review each step", "Diffs and commands stay human-in-the-loop"],
      ["balanced", "Balanced", "Approve risky actions, automate routine work"],
      ["hands-off", "Mostly autonomous", "Optimize for unattended task completion"],
    ],
  },
  {
    key: "repoContext",
    title: "What kind of workload is typical?",
    description: "Repository size and operating mode change which architecture feels best.",
    options: [
      ["small", "Focused changes", "Small repositories or narrow edits"],
      ["large", "Large codebase", "Broad context and cross-file changes"],
      ["ci", "CI / headless", "Repeatable execution without a persistent UI"],
      ["multi-agent", "Parallel work", "Subagents or multiple independent tasks"],
    ],
  },
] as const;

const featureOptions: Array<[FeatureKey, string]> = [
  ["mcp", "MCP"],
  ["localModels", "Local models"],
  ["subagents", "Subagents"],
  ["headless", "Headless mode"],
  ["browser", "Browser control"],
  ["sandbox", "Sandbox"],
  ["checkpoints", "Checkpoints"],
];

function encodeAnswers(answers: RecommendationAnswers) {
  return window.btoa(JSON.stringify(answers));
}

function decodeAnswers(value: string): RecommendationAnswers | null {
  try {
    return JSON.parse(window.atob(value)) as RecommendationAnswers;
  } catch {
    return null;
  }
}

export function Recommender() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!window.location.hash.startsWith("#result=")) return;
    const decoded = decodeAnswers(window.location.hash.replace("#result=", ""));
    if (decoded) {
      setAnswers(decoded);
      setShowResults(true);
      setStep(questions.length);
    }
  }, []);

  const results = useMemo(() => recommendHarnesses(answers), [answers]);

  function choose(key: string, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    if (step < questions.length - 1) setStep((current) => current + 1);
    else setStep(questions.length);
  }

  function toggleFeature(feature: FeatureKey) {
    setAnswers((current) => ({
      ...current,
      requiredFeatures: current.requiredFeatures.includes(feature)
        ? current.requiredFeatures.filter((item) => item !== feature)
        : [...current.requiredFeatures, feature],
    }));
  }

  async function copyLink() {
    const hash = `#result=${encodeAnswers(answers)}`;
    window.history.replaceState(null, "", hash);
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function restart() {
    setAnswers(defaultAnswers);
    setStep(0);
    setShowResults(false);
    window.history.replaceState(null, "", window.location.pathname);
  }

  if (showResults) {
    return (
      <div className="results-stack">
        <div className="results-header">
          <div>
            <span className="eyebrow">Your recommendation</span>
            <h2>{results[0].harness.name} is the strongest fit</h2>
            <p>
              The score reflects your workflow answers and required capabilities. It is not a model-intelligence benchmark.
            </p>
          </div>
          <div className="button-row">
            <button className="button secondary" onClick={copyLink}>{copied ? "Copied" : "Copy result link"}</button>
            <button className="button ghost" onClick={restart}>Start over</button>
          </div>
        </div>

        {results.slice(0, 3).map((result, index) => (
          <article className={`result-card ${index === 0 ? "winner" : ""}`} key={result.harness.id}>
            <div className="result-rank">#{index + 1}</div>
            <div className="result-main">
              <div className="result-title-row">
                <div>
                  <h3>{result.harness.name}</h3>
                  <p>{result.harness.tagline}</p>
                </div>
                <div className="fit-score">
                  <strong>{result.score}%</strong>
                  <span>{result.confidence} confidence</span>
                </div>
              </div>
              <div className="result-grid">
                <div>
                  <h4>Why it fits</h4>
                  <ul className="check-list">
                    {result.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                  </ul>
                </div>
                <div>
                  <h4>Watch for</h4>
                  <ul className="plain-list">
                    {result.compromises.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
              <a className="text-link" href={`/harnesses/${result.harness.slug}`}>Read the full profile →</a>
            </div>
          </article>
        ))}

        <div className="notice">
          <strong>Interpretation note:</strong> a 90% fit means the harness matches your stated workflow well. It does not mean it solves 90% of coding tasks.
        </div>
      </div>
    );
  }

  const current = questions[step];

  return (
    <div className="quiz-shell">
      <div className="quiz-progress" aria-label={`Question ${Math.min(step + 1, 6)} of 6`}>
        <span style={{ width: `${(step / 6) * 100}%` }} />
      </div>

      {step < questions.length ? (
        <div className="quiz-panel">
          <div className="quiz-meta">Question {step + 1} of 6</div>
          <h2>{current.title}</h2>
          <p>{current.description}</p>
          <div className="option-grid">
            {current.options.map(([value, label, description]) => (
              <button
                className="option-card"
                key={value}
                type="button"
                onClick={() => choose(current.key, value)}
              >
                <strong>{label}</strong>
                <span>{description}</span>
              </button>
            ))}
          </div>
          {step > 0 && <button className="back-button" onClick={() => setStep((currentStep) => currentStep - 1)}>← Back</button>}
        </div>
      ) : (
        <div className="quiz-panel">
          <div className="quiz-meta">Question 6 of 6</div>
          <h2>Which capabilities are non-negotiable?</h2>
          <p>Select only true requirements. Missing a requirement directly lowers the fit score.</p>
          <div className="feature-picker">
            {featureOptions.map(([feature, label]) => (
              <button
                key={feature}
                type="button"
                className={answers.requiredFeatures.includes(feature) ? "feature-chip selected" : "feature-chip"}
                onClick={() => toggleFeature(feature)}
              >
                {answers.requiredFeatures.includes(feature) ? "✓ " : "+ "}{label}
              </button>
            ))}
          </div>
          <div className="button-row quiz-actions">
            <button className="back-button" onClick={() => setStep(questions.length - 1)}>← Back</button>
            <button className="button primary" onClick={() => setShowResults(true)}>Show my matches</button>
          </div>
        </div>
      )}
    </div>
  );
}
