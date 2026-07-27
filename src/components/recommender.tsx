"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import { benchmarkRunsForHarness } from "@/data/benchmark-runs";
import { harnesses } from "@/data/harnesses";
import { eligibilityFailuresFor, recommendHarnesses } from "@/lib/recommendation";
import type { FeatureKey, Recommendation, RecommendationAnswers, RecommendationFactor } from "@/lib/types";

const defaultAnswers: RecommendationAnswers = {
  interface: "terminal",
  priority: "simplicity",
  modelAccess: "subscription",
  control: "balanced",
  changeScope: "large-repo",
  operatingMode: "interactive",
  requiredFeatures: [],
};

const RESULT_SCROLL_OFFSET_PX = 88;

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
    description: "Pick the trade-off you care about most. There is no universally best option.",
    options: [
      ["simplicity", "Simplicity", "Fast setup and a focused product surface"],
      ["flexibility", "Flexibility", "Providers, models, tools, and custom workflows"],
      ["security", "Execution safety", "Isolation, permissions, and controlled execution"],
      ["autonomy", "Autonomy", "Longer tasks with fewer interruptions"],
    ],
  },
  {
    key: "modelAccess",
    title: "How do you access AI models?",
    description: "Choose how you expect to run most tasks. You can add strict requirements at the end.",
    options: [
      ["subscription", "Existing subscription", "Prefer ChatGPT, Claude, or another subscription"],
      ["model-agnostic", "Multiple providers", "Switch models and API providers freely"],
      ["local", "Local models", "Ollama, LM Studio, or self-hosted endpoints"],
      ["enterprise", "Enterprise routing", "Cloud platforms, gateways, and governance"],
    ],
  },
  {
    key: "control",
    title: "How closely do you want to supervise it?",
    description: "Think about a normal task, not the most autonomous mode the tool can offer.",
    options: [
      ["approval-heavy", "Stay close", "Review commands and changes as it works"],
      ["balanced", "Check risky actions", "Let routine work continue without interruption"],
      ["hands-off", "Let it run", "Prefer completing the task with fewer questions"],
    ],
  },
  {
    key: "changeScope",
    title: "What do you usually ask it to change?",
    description: "Choose the typical task size. You will choose how it runs in the next step.",
    options: [
      ["focused", "Focused changes", "Narrow edits with a small working set"],
      ["cross-file", "Cross-file work", "Features and fixes spanning several files"],
      ["large-repo", "Repository-wide", "Broad context across a large codebase"],
    ],
  },
  {
    key: "operatingMode",
    title: "Will you stay with it while it works?",
    description: "Choose the way you expect to use the tool most often.",
    options: [
      ["interactive", "Work together", "Stay in the loop during one task"],
      ["ci", "Run unattended", "Use scripts, CI, or scheduled jobs without an open UI"],
      ["parallel", "Split the work", "Use more agents or independent tasks at the same time"],
    ],
  },
] as const;

const featureOptions: Array<[FeatureKey, string]> = [
  ["mcp", "Connect external tools (MCP)"],
  ["localModels", "Run local models"],
  ["subagents", "Run agents in parallel or delegate"],
  ["headless", "Run without an open UI"],
  ["browser", "Control a browser"],
  ["sandbox", "Isolate command execution"],
  ["checkpoints", "Undo file changes"],
];

const featureLabels = Object.fromEntries(featureOptions) as Record<FeatureKey, string>;

const factorLabels: Record<RecommendationFactor, string> = {
  priority: "What matters most",
  control: "Approval style",
  changeScope: "Size of changes",
  operatingMode: "How work runs",
};

const interfaceLabels: Record<RecommendationAnswers["interface"], string> = {
  terminal: "Terminal",
  ide: "IDE",
  web: "Desktop / web",
  automation: "Automation",
};

const priorityLabels: Record<RecommendationAnswers["priority"], string> = {
  simplicity: "Simple setup",
  flexibility: "Flexibility",
  security: "Safer execution",
  autonomy: "More autonomy",
};

const modelAccessLabels: Record<RecommendationAnswers["modelAccess"], string> = {
  subscription: "Existing subscription",
  "model-agnostic": "Multiple providers",
  local: "Local models",
  enterprise: "Enterprise routing",
};

const controlLabels: Record<RecommendationAnswers["control"], string> = {
  "approval-heavy": "Review each step",
  balanced: "Balanced approvals",
  "hands-off": "Mostly autonomous",
};

const changeScopeLabels: Record<RecommendationAnswers["changeScope"], string> = {
  focused: "Focused changes",
  "cross-file": "Cross-file work",
  "large-repo": "Repository-wide",
};

const operatingModeLabels: Record<RecommendationAnswers["operatingMode"], string> = {
  interactive: "Interactive",
  ci: "CI / headless",
  parallel: "Parallel work",
};

const fitBandLabels: Record<Recommendation["fitBand"], string> = {
  strong: "Strong match",
  good: "Good match",
  conditional: "Conditional match",
  weak: "Weak match",
};

function stabilityLabel(value: number) {
  if (value >= 80) return "High stability";
  if (value >= 50) return "Moderate stability";
  return "Low stability";
}

function alignmentLabel(value: number) {
  if (value >= 85) return "Very strong";
  if (value >= 70) return "Strong";
  if (value >= 55) return "Good";
  if (value >= 40) return "Mixed";
  return "Weak";
}

function encodeAnswers(answers: RecommendationAnswers) {
  return window.btoa(JSON.stringify(answers));
}

function decodeAnswers(value: string): RecommendationAnswers | null {
  try {
    const parsed = JSON.parse(window.atob(value)) as Partial<RecommendationAnswers> & {
      repoContext?: "small" | "large" | "ci" | "multi-agent";
    };
    const legacyScope = parsed.repoContext === "small" ? "focused" : "large-repo";
    const legacyMode = parsed.repoContext === "ci"
      ? "ci"
      : parsed.repoContext === "multi-agent"
        ? "parallel"
        : "interactive";

    return {
      ...defaultAnswers,
      ...parsed,
      changeScope: parsed.changeScope ?? legacyScope,
      operatingMode: parsed.operatingMode ?? legacyMode,
    };
  } catch {
    return null;
  }
}

export function Recommender() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const copiedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!window.location.hash.startsWith("#result=")) return;
    const decoded = decodeAnswers(window.location.hash.replace("#result=", ""));
    if (decoded) {
      setAnswers(decoded);
      setShowResults(true);
      setStep(questions.length);
    }
  }, []);

  useEffect(() => {
    if (!showResults) return;
    const heading = resultsHeadingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    window.scrollTo({
      top: Math.max(0, heading.getBoundingClientRect().top + window.scrollY - RESULT_SCROLL_OFFSET_PX),
      behavior: "auto",
    });
  }, [showResults]);

  useEffect(() => () => {
    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
  }, []);

  const results = useMemo(() => recommendHarnesses(answers), [answers]);
  const excluded = useMemo(() => harnesses
    .filter((harness) => harness.status === "active")
    .map((harness) => ({
      harness,
      failures: eligibilityFailuresFor(harness, answers),
    }))
    .filter((result) => result.failures.length > 0), [answers]);

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
    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copiedTimerRef.current = null;
    }, 1800);
  }

  function restart() {
    setAnswers(defaultAnswers);
    setStep(0);
    setShowResults(false);
    window.history.replaceState(null, "", window.location.pathname);
  }

  function reviseAnswers() {
    setStep(0);
    setShowResults(false);
    window.history.replaceState(null, "", window.location.pathname);
  }

  if (showResults) {
    if (results.length === 0) {
      return (
        <div className="results-stack">
          <div className="results-header">
            <div>
              <span className="eyebrow">No eligible match on current evidence</span>
              <h2 className="results-heading" ref={resultsHeadingRef} tabIndex={-1}>No active harness has documented support for every requirement.</h2>
              <p>Remove one requirement or change how you want the work to run to see more options. This does not prove that excluded products are technically incapable.</p>
            </div>
            <button className="button secondary" onClick={reviseAnswers}>Edit my answers</button>
          </div>
          <details className="ranking-exclusions" open>
            <summary>Why {excluded.length} active harnesses do not match</summary>
            <p>Each product lacks current documentation for at least one capability you marked as essential.</p>
            <ul className="exclusion-list">
              {excluded.map((result) => (
                <li key={result.harness.id}>
                  <Link href={`/harnesses/${result.harness.slug}`}>
                    <span className="ranking-identity">
                      <HarnessLogo logo={result.harness.logo} name={result.harness.name} size="small" />
                      <strong>{result.harness.name}</strong>
                    </span>
                    <span>Not documented: {result.failures.map((failure) => failure.label).join(", ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      );
    }

    const comparisonHref = `/compare?ids=${results.slice(0, 3).map((result) => result.harness.id).join(",")}`;

    return (
      <div className="results-stack">
        <div className="results-header">
          <div>
            <span className="eyebrow">Your recommendation</span>
            <h2 className="results-heading" ref={resultsHeadingRef} tabIndex={-1}>{results[0].harness.name} is the strongest match for your setup</h2>
            <p>
              Every selected requirement has current supporting documentation. We also varied your priorities 512 ways to check whether the recommendation stays near the top.
            </p>
          </div>
          <div className="button-row">
            <Link className="button primary" href={comparisonHref}>Compare top matches</Link>
            <button className="button secondary" onClick={copyLink}>{copied ? "Copied" : "Copy result link"}</button>
            <button className="button ghost" onClick={reviseAnswers}>Edit answers</button>
          </div>
        </div>

        <section className="answer-recap" aria-labelledby="answer-recap-title">
          <div className="answer-recap-heading">
            <div>
              <span className="eyebrow">Your setup</span>
              <h3 id="answer-recap-title">What this recommendation is based on</h3>
            </div>
            <button className="text-button" type="button" onClick={restart}>Clear and start over</button>
          </div>
          <dl>
            <div><dt>Work in</dt><dd>{interfaceLabels[answers.interface]}</dd></div>
            <div><dt>Main priority</dt><dd>{priorityLabels[answers.priority]}</dd></div>
            <div><dt>Model access</dt><dd>{modelAccessLabels[answers.modelAccess]}</dd></div>
            <div><dt>Approvals</dt><dd>{controlLabels[answers.control]}</dd></div>
            <div><dt>Typical change</dt><dd>{changeScopeLabels[answers.changeScope]}</dd></div>
            <div><dt>Work mode</dt><dd>{operatingModeLabels[answers.operatingMode]}</dd></div>
            <div><dt>Must-haves</dt><dd>{answers.requiredFeatures.map((feature) => featureLabels[feature]).join(", ") || "No extra must-haves"}</dd></div>
          </dl>
        </section>

        {results.slice(0, 3).map((result, index) => {
          const measuredRuns = benchmarkRunsForHarness(result.harness.id);
          return (
          <article className={`result-card ${index === 0 ? "winner" : ""}`} key={result.harness.id}>
            <div className="result-rank">#{index + 1}</div>
            <div className="result-main">
              <div className="result-title-row">
                <div className="result-brand">
                  <HarnessLogo logo={result.harness.logo} name={result.harness.name} />
                  <div>
                    <h3>{result.harness.name}</h3>
                    <p>{result.harness.tagline}</p>
                  </div>
                </div>
                <div className="fit-score">
                  <strong>{stabilityLabel(result.robustness.topThreeFrequency)}</strong>
                  <small>Top 3 in {result.robustness.topThreeFrequency}% of sensitivity runs</small>
                  <span>Robustness of the ordering, not task success</span>
                </div>
              </div>
              <dl className="result-outcomes" aria-label={`Four-part decision readout for ${result.harness.name}`}>
                <div>
                  <dt>Eligibility</dt>
                  <dd>Eligible<span className="outcome-note">Every declared gate is documented.</span></dd>
                </div>
                <div>
                  <dt>Workflow fit</dt>
                  <dd>{fitBandLabels[result.fitBand]}<span className="outcome-note">Preference match, not product quality.</span></dd>
                </div>
                <div>
                  <dt>Evidence basis</dt>
                  <dd>{result.evidenceState.label}<span className="outcome-note">Product-level summary; claim rows may differ.</span></dd>
                </div>
                <div>
                  <dt>Measured performance</dt>
                  <dd>
                    {measuredRuns.length === 0 ? "No admitted configuration" : `${measuredRuns.length} admitted configuration${measuredRuns.length === 1 ? "" : "s"}`}
                    <span className="outcome-note">{measuredRuns.length === 0 ? "Unknown is not scored as zero." : "Displayed separately and excluded from fit."}</span>
                  </dd>
                </div>
              </dl>
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
              <details className="score-breakdown">
                <summary>How this match was calculated</summary>
                <p>These are alignment bands for your answers, not product-quality scores.</p>
                <dl>
                  {Object.entries(result.scoreBreakdown).map(([factor, value]) => (
                    <div key={factor}>
                      <dt>{factorLabels[factor as RecommendationFactor]}</dt>
                      <dd>{alignmentLabel(value)}</dd>
                    </div>
                  ))}
                </dl>
              </details>
              <Link className="text-link" href={`/harnesses/${result.harness.slug}`}>Read the full profile</Link>
            </div>
          </article>
          );
        })}

        <div className="notice stability-note">
          <strong>How to read the percentage:</strong> {results[0].harness.name} stays in the top three in {results[0].robustness.topThreeFrequency}% of the priority variations we tested. It is a stability check, not the chance that a coding task will succeed.
        </div>

        <details className="complete-ranking ranking-disclosure">
          <summary className="complete-ranking-header">
            <div>
              <h3>See all {results.length} eligible harnesses</h3>
              <p>The first three are shown above. Open the full ordering for deeper comparison.</p>
            </div>
            <span className="ranking-disclosure-label" aria-hidden="true" />
          </summary>
          <ol className="ranking-list">
            {results.map((result, index) => (
              <li key={result.harness.id}>
                <Link className="ranking-row" href={`/harnesses/${result.harness.slug}`}>
                  <span className="ranking-rank">{index + 1}</span>
                  <span className="ranking-identity">
                    <HarnessLogo logo={result.harness.logo} name={result.harness.name} size="small" />
                    <strong>{result.harness.name}</strong>
                  </span>
                  <span className="ranking-why">
                    {result.reasons[0] ?? result.harness.bestFor[0] ?? "Compatible with every required capability."}
                  </span>
                  <strong className="ranking-score">Top 3 in {result.robustness.topThreeFrequency}%</strong>
                  <span className="ranking-evidence">{fitBandLabels[result.fitBand]} · average position {result.robustness.meanRank} · {result.evidenceState.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </details>

        {excluded.length > 0 && (
          <details className="ranking-exclusions">
            <summary>Why {excluded.length} harnesses do not match</summary>
            <p>These products are not ranked because at least one must-have is not currently documented.</p>
            <ul className="exclusion-list">
              {excluded.map((result) => (
                <li key={result.harness.id}>
                  <Link href={`/harnesses/${result.harness.slug}`}>
                    <span className="ranking-identity">
                      <HarnessLogo logo={result.harness.logo} name={result.harness.name} size="small" />
                      <strong>{result.harness.name}</strong>
                    </span>
                    <span>Not documented: {result.failures.map((failure) => failure.label).join(", ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}

      </div>
    );
  }

  const current = questions[step];
  const totalSteps = questions.length + 1;

  return (
    <div className="quiz-shell">
      <div
        className="quiz-progress"
        role="progressbar"
        aria-label={`Question ${Math.min(step + 1, totalSteps)} of ${totalSteps}`}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={Math.min(step + 1, totalSteps)}
      >
        <span style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
      </div>

      {step < questions.length ? (
        <div className="quiz-panel">
          <div className="quiz-meta">Question {step + 1} of {totalSteps}</div>
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
          {step > 0 && <button className="back-button" onClick={() => setStep((currentStep) => currentStep - 1)}>Back</button>}
        </div>
      ) : (
        <div className="quiz-panel">
          <div className="quiz-meta">Question {totalSteps} of {totalSteps}</div>
          <h2>What would you refuse to use a tool without?</h2>
          <p>Select only true deal-breakers. If you are unsure, leave everything unselected and compare the trade-offs in your results.</p>
          <div className="feature-picker">
            {featureOptions.map(([feature, label]) => (
              <button
                key={feature}
                type="button"
                className={answers.requiredFeatures.includes(feature) ? "feature-chip selected" : "feature-chip"}
                aria-pressed={answers.requiredFeatures.includes(feature)}
                onClick={() => toggleFeature(feature)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="button-row quiz-actions">
            <button className="back-button" onClick={() => setStep(questions.length - 1)}>Back</button>
            <button className="button primary" onClick={() => setShowResults(true)}>Show my matches</button>
          </div>
        </div>
      )}
    </div>
  );
}
