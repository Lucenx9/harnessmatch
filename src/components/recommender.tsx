"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { HarnessLogo } from "@/components/harness-logo";
import { WorkflowPortabilityLens } from "@/components/workflow-portability-lens";
import { benchmarkRunsForHarness } from "@/data/benchmark-runs";
import { harnesses } from "@/data/harnesses";
import { eligibilityFailuresFor, leadingMatchCount, recommendHarnesses } from "@/lib/recommendation";
import type { FeatureKey, Recommendation, RecommendationAnswers, RecommendationFactor } from "@/lib/types";
import { changeScopeLabels, controlLabels, factorLabels, featureLabels, featureOptions, fitBandLabels, interfaceLabels, modelAccessLabels, operatingModeLabels, priorityLabels, questions } from "./recommender-config";

type QuestionKey = Exclude<keyof RecommendationAnswers, "requiredFeatures">;

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

function rankRangeLabel(result: Recommendation) {
  const { bestRank, scenarioCount, worstRank } = result.robustness;
  if (bestRank === worstRank) return `Rank ${bestRank} across all ${scenarioCount} sensitivity runs`;
  return `Rank range ${bestRank}-${worstRank} across ${scenarioCount} sensitivity runs`;
}

function eligibilityFailureLabel(failure: ReturnType<typeof eligibilityFailuresFor>[number]) {
  if (failure.kind === "product-layer") return `Catalog scope: ${failure.label}`;
  if (failure.kind === "membership") return `Membership evidence: ${failure.label}`;
  return `Workflow requirement: ${failure.label}`;
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
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<QuestionKey>>(() => new Set());
  const [returnToReview, setReturnToReview] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const stepEnteredRef = useRef(false);
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

  // Answering a question unmounts the button that was just pressed, which drops focus to the
  // document body. Move it to the new question instead so keyboard and screen reader users are
  // not sent back through the header on every step. The first render is left alone.
  useEffect(() => {
    if (!stepEnteredRef.current) {
      stepEnteredRef.current = true;
      return;
    }
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [step]);

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

  function choose(key: QuestionKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }) as RecommendationAnswers);
    setAnsweredQuestions((current) => new Set(current).add(key));
  }

  function continueFromQuestion() {
    if (returnToReview) {
      setReturnToReview(false);
      setStep(questions.length + 1);
      return;
    }
    setStep((current) => current + 1);
  }

  function editQuestion(index: number) {
    setReturnToReview(true);
    setStep(index);
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
    setAnsweredQuestions(new Set());
    setReturnToReview(false);
    setStep(0);
    setShowResults(false);
    window.history.replaceState(null, "", window.location.pathname);
  }

  function reviseAnswers() {
    setAnsweredQuestions(new Set(questions.map((question) => question.key)));
    setReturnToReview(false);
    setStep(questions.length + 1);
    setShowResults(false);
    window.history.replaceState(null, "", window.location.pathname);
  }

  if (showResults) {
    if (results.length === 0) {
      return (
        <div className="results-stack">
          <div className="results-header">
            <div>
              <h2 className="results-heading" ref={resultsHeadingRef} tabIndex={-1}>No current match.</h2>
              <p>Change one requirement to see more options. An exclusion can mean missing evidence, not technical impossibility.</p>
            </div>
            <button className="button secondary" onClick={reviseAnswers}>Edit my answers</button>
          </div>
          <details className="ranking-exclusions" open>
            <summary>Why {excluded.length} active harnesses do not match</summary>
            <p>Each product is outside the default coding-harness layer or lacks current evidence for at least one required condition.</p>
            <ul className="exclusion-list">
              {excluded.map((result) => (
                <li key={result.harness.id}>
                  <Link href={`/harnesses/${result.harness.slug}`}>
                    <span className="ranking-identity">
                      <HarnessLogo logo={result.harness.logo} name={result.harness.name} size="small" />
                      <strong>{result.harness.name}</strong>
                    </span>
                    <span>{result.failures.map(eligibilityFailureLabel).join("; ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      );
    }

    const leadingCount = leadingMatchCount(results);
    const hasLeadingGroup = leadingCount > 1;
    const comparisonCount = hasLeadingGroup ? Math.min(3, leadingCount) : Math.min(3, results.length);
    const comparisonHref = `/compare?ids=${results.slice(0, comparisonCount).map((result) => result.harness.id).join(",")}`;

    return (
      <div className="results-stack">
        <div className="results-header">
          <div>
            <h2 className="results-heading" ref={resultsHeadingRef} tabIndex={-1}>
              {hasLeadingGroup ? `${leadingCount} leading matches for your answers.` : `Best fit for your answers: ${results[0].harness.name}.`}
            </h2>
            <p>
              {hasLeadingGroup
                ? "The fit model does not separate this group enough to claim a unique winner. Compare the trade-offs before choosing."
                : "It passes your requirements, and the published reference preferences leave a clearer fit gap than the alternatives."}
            </p>
          </div>
          <div className="button-row">
            <Link className="button primary" href={comparisonHref}>
              {hasLeadingGroup ? `Compare ${comparisonCount} leading matches` : "Compare top matches"}
            </Link>
            <button className="button secondary" onClick={copyLink}>{copied ? "Copied" : "Copy link"}</button>
            <button className="button ghost" onClick={reviseAnswers}>Review answers</button>
          </div>
        </div>

        {results.slice(0, 3).map((result, index) => {
          const measuredRuns = benchmarkRunsForHarness(result.harness.id);
          return (
          <article className={`result-card ${index < leadingCount ? "leading" : ""}`} key={result.harness.id}>
            <div
              className="result-rank"
              aria-label={index < leadingCount ? "Leading match" : `Alternative ${index + 1 - leadingCount}`}
            >
              {index < leadingCount ? "Lead" : "Alt"}
            </div>
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
                  <small>{rankRangeLabel(result)}</small>
                  <span>Ordering sensitivity, not task success</span>
                </div>
              </div>
              <dl className="result-quick-facts" aria-label={`Decision summary for ${result.harness.name}`}>
                <div>
                  <dt>Workflow fit</dt>
                  <dd>{fitBandLabels[result.fitBand]}</dd>
                </div>
                <div>
                  <dt>Stability</dt>
                  <dd>{stabilityLabel(result.robustness.topThreeFrequency)}</dd>
                </div>
                <div>
                  <dt>Evidence</dt>
                  <dd>{result.evidenceState.label}</dd>
                </div>
              </dl>
              <div className="result-simple-readout">
                <div>
                  <h4>Why it fits</h4>
                  <p>{result.reasons[0] ?? result.harness.bestFor[0] ?? "Compatible with every required capability."}</p>
                </div>
                <div>
                  <h4>Check before choosing</h4>
                  <p>{result.compromises[0] ?? result.harness.tradeoffs[0] ?? "Review the full profile before adopting it."}</p>
                </div>
              </div>
              <details className="result-evidence-details">
                <summary>Evidence and scoring</summary>
                <div className="result-evidence-body">
                  <dl className="result-outcomes" aria-label={`Four-part evidence readout for ${result.harness.name}`}>
                    <div>
                      <dt>Eligibility</dt>
                      <dd>Eligible<span className="outcome-note">Every catalog and workflow gate is documented.</span></dd>
                    </div>
                    <div>
                      <dt>Workflow fit</dt>
                      <dd>{fitBandLabels[result.fitBand]}<span className="outcome-note">Preference match, not product quality.</span></dd>
                    </div>
                    <div>
                      <dt>Evidence basis</dt>
                      <dd>{result.evidenceState.label}<span className="outcome-note">Individual claims may have different evidence.</span></dd>
                    </div>
                    <div>
                      <dt>Measured performance</dt>
                      <dd>
                        {measuredRuns.length === 0 ? "No admitted configuration" : `${measuredRuns.length} admitted configuration${measuredRuns.length === 1 ? "" : "s"}`}
                        <span className="outcome-note">{measuredRuns.length === 0 ? "Unknown is not scored as zero." : "Shown separately and excluded from fit."}</span>
                      </dd>
                    </div>
                  </dl>
                  <div className="result-grid">
                    <div>
                      <h4>All fit reasons</h4>
                      <ul className="check-list">
                        {result.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4>All trade-offs</h4>
                      <ul className="plain-list">
                        {result.compromises.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="score-breakdown">
                    <p>These are alignment bands for your answers, not product-quality scores.</p>
                    <dl>
                      {Object.entries(result.scoreBreakdown).map(([factor, value]) => (
                        <div key={factor}>
                          <dt>{factorLabels[factor as RecommendationFactor]}</dt>
                          <dd>{alignmentLabel(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </details>
              <Link className="text-link" href={`/harnesses/${result.harness.slug}`}>Read the full profile</Link>
            </div>
          </article>
          );
        })}

        <details className="recommendation-details">
          <summary>
            <strong>Your setup and sensitivity check</strong>
            <span>Review your answers, model portability, and ranking stability.</span>
          </summary>
          <div className="recommendation-details-body">
            <section className="answer-recap" aria-labelledby="answer-recap-title">
              <div className="answer-recap-heading">
                <h3 id="answer-recap-title">What this recommendation uses</h3>
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
            <WorkflowPortabilityLens results={results} />
            <div className="notice stability-note">
              <strong>How to read the percentage:</strong> {results[0].harness.name} stays in the top three in {results[0].robustness.topThreeFrequency}% of the priority variations we tested. It is a stability check, not the chance that a coding task will succeed.
            </div>
          </div>
        </details>

        <details className="complete-ranking ranking-disclosure">
          <summary className="complete-ranking-header">
            <div>
              <h3>See all {results.length} eligible harnesses</h3>
              <p>
                {hasLeadingGroup
                  ? `${leadingCount} results are inside the published close-match margin. The full list follows the reference fit values.`
                  : "The first three are shown above. Open the full reference ordering for deeper comparison."}
              </p>
            </div>
            <span className="ranking-disclosure-label" aria-hidden="true" />
          </summary>
          <ol className="ranking-list">
            {results.map((result, index) => (
              <li key={result.harness.id}>
                <Link className="ranking-row" href={`/harnesses/${result.harness.slug}`}>
                  <span className="ranking-rank">{index < leadingCount ? "Lead" : index + 1}</span>
                  <span className="ranking-identity">
                    <HarnessLogo logo={result.harness.logo} name={result.harness.name} size="small" />
                    <strong>{result.harness.name}</strong>
                  </span>
                  <span className="ranking-why">
                    {result.reasons[0] ?? result.harness.bestFor[0] ?? "Compatible with every required capability."}
                  </span>
                  <strong className="ranking-score">Top 3 in {result.robustness.topThreeFrequency}%</strong>
                  <span className="ranking-evidence">{fitBandLabels[result.fitBand]}, average position {result.robustness.meanRank}, {result.evidenceState.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </details>

        {excluded.length > 0 && (
          <details className="ranking-exclusions">
            <summary>Why {excluded.length} harnesses do not match</summary>
            <p>These products are not ranked because they are outside the default coding-harness layer or at least one required condition is not currently documented.</p>
            <ul className="exclusion-list">
              {excluded.map((result) => (
                <li key={result.harness.id}>
                  <Link href={`/harnesses/${result.harness.slug}`}>
                    <span className="ranking-identity">
                      <HarnessLogo logo={result.harness.logo} name={result.harness.name} size="small" />
                      <strong>{result.harness.name}</strong>
                    </span>
                    <span>{result.failures.map(eligibilityFailureLabel).join("; ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}

      </div>
    );
  }

  const featureStep = questions.length;
  const reviewStep = questions.length + 1;
  const totalSteps = questions.length + 2;
  const current = questions[step];

  function selectedAnswerLabel(question: (typeof questions)[number]) {
    const selected = answers[question.key];
    return question.options.find(([value]) => value === selected)?.[1] ?? "Not answered";
  }

  return (
    <div className="quiz-shell">
      <div
        className="quiz-progress"
        role="progressbar"
        aria-label={`Step ${Math.min(step + 1, totalSteps)} of ${totalSteps}`}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={Math.min(step + 1, totalSteps)}
      >
        <span style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
      </div>

      {step < questions.length ? (
        <div className="quiz-panel">
          <div className="quiz-meta">Question {step + 1} of {questions.length + 1}</div>
          <h2 id={`recommend-question-${step}`} ref={stepHeadingRef} tabIndex={-1}>{current.title}</h2>
          <p>{current.description}</p>
          <fieldset className="question-fieldset">
            <legend className="sr-only">{current.title}</legend>
            <div className="option-grid">
              {current.options.map(([value, label, description]) => (
                <label className="option-card" key={value}>
                  <input
                    className="option-radio"
                    type="radio"
                    name={current.key}
                    value={value}
                    checked={answeredQuestions.has(current.key) && answers[current.key] === value}
                    onChange={() => choose(current.key, value)}
                  />
                  <span className="option-card-copy">
                    <strong>{label}</strong>
                    <span>{description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="button-row quiz-actions">
            {(step > 0 || returnToReview) && (
              <button
                className="back-button"
                onClick={() => {
                  if (returnToReview) {
                    setReturnToReview(false);
                    setStep(reviewStep);
                  } else {
                    setStep((currentStep) => currentStep - 1);
                  }
                }}
              >
                {returnToReview ? "Back to review" : "Back"}
              </button>
            )}
            <button
              className="button primary"
              disabled={!answeredQuestions.has(current.key)}
              onClick={continueFromQuestion}
            >
              {returnToReview ? "Save answer" : "Continue"}
            </button>
          </div>
        </div>
      ) : step === featureStep ? (
        <div className="quiz-panel">
          <div className="quiz-meta">Question {questions.length + 1} of {questions.length + 1}</div>
          <h2 ref={stepHeadingRef} tabIndex={-1}>What would you refuse to use a tool without?</h2>
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
            <button
              className="back-button"
              onClick={() => {
                if (returnToReview) {
                  setReturnToReview(false);
                  setStep(reviewStep);
                } else {
                  setStep(questions.length - 1);
                }
              }}
            >
              {returnToReview ? "Back to review" : "Back"}
            </button>
            <button
              className="button primary"
              onClick={() => {
                setReturnToReview(false);
                setStep(reviewStep);
              }}
            >
              Review answers
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-panel review-panel">
          <div className="quiz-meta">Review</div>
          <h2 ref={stepHeadingRef} tabIndex={-1}>Check your answers</h2>
          <p>Requirements remove incompatible products. The remaining answers only change workflow fit and ordering.</p>
          <dl className="review-answer-list">
            {questions.map((question, index) => (
              <div className="review-answer-row" key={question.key}>
                <div>
                  <dt>{question.title}</dt>
                  <dd>{selectedAnswerLabel(question)}</dd>
                </div>
                <button
                  className="text-button"
                  type="button"
                  aria-label={`Change answer for: ${question.title}`}
                  onClick={() => editQuestion(index)}
                >
                  Change
                </button>
              </div>
            ))}
            <div className="review-answer-row">
              <div>
                <dt>Must-haves</dt>
                <dd>{answers.requiredFeatures.map((feature) => featureLabels[feature]).join(", ") || "No extra must-haves"}</dd>
              </div>
              <button
                className="text-button"
                type="button"
                aria-label="Change must-have requirements"
                onClick={() => {
                  setReturnToReview(true);
                  setStep(featureStep);
                }}
              >
                Change
              </button>
            </div>
          </dl>
          <div className="button-row quiz-actions">
            <button className="back-button" onClick={() => setStep(featureStep)}>Back</button>
            <button className="button primary" onClick={() => setShowResults(true)}>Show my matches</button>
          </div>
        </div>
      )}
    </div>
  );
}
