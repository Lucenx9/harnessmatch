import type { Metadata } from "next";
import { benchmarkRuns } from "@/data/benchmark-runs";
import { harnesses } from "@/data/harnesses";
import {
  repositoryArtifactLabels,
  repositoryAudits,
} from "@/data/repository-audits";
import { researchSources } from "@/data/research";
import { researchProcessDisclosure } from "@/data/research-process";
import {
  contentValidityPlan,
  interRaterValidationPlan,
  userValidationPlan,
} from "@/data/validation-plan";
import {
  classificationAxes,
  membershipCriterionDescriptions,
  membershipCriterionLabels,
  modelPortabilityDescriptions,
  modelPortabilityLabels,
  productLayerLabels,
} from "@/lib/harness-classification";
import { architectureAxisLabels } from "@/lib/evaluation";
import {
  capabilityAxisLabels,
  capabilityLevelAnchors,
  capabilityValueFunction,
  changeScopeWeights,
  closeMatchScoreMargin,
  controlStyleWeights,
  evidenceCoverageThresholds,
  operatingModeWeights,
  operationalPostureScores,
  recommendationSensitivity,
  recommendationWeights,
} from "@/lib/recommendation-config";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Methodology",
  description:
    "See how HarnessMatch gates requirements, scores workflow fit, separates model and harness evidence, handles uncertainty, and validates recommendations.",
  path: "/methodology",
});

const methodologyVersion = "2.5 / 2026-07-28";
const capabilityLevels = [1, 2, 3, 4, 5] as const;
const methodologySections = [
  ["decision-question", "Decision question"],
  ["eligibility", "Scope and eligibility"],
  ["preference-model", "Preference model"],
  ["sensitivity", "Sensitivity"],
  ["architecture", "Architecture layers"],
  ["evidence-states", "Evidence states"],
  ["research-process", "Research process"],
  ["public-code", "Public-code artifacts"],
  ["measured-systems", "Measured systems"],
  ["classification", "Classification"],
  ["validation", "Validation status"],
  ["value-tables", "Internal value tables"],
  ["scientific-basis", "Scientific basis"],
] as const;

const weights = [
  ["Top priority", `${recommendationWeights.priority}%`],
  ["Control style", `${recommendationWeights.control}%`],
  ["Change scope", `${recommendationWeights.changeScope}%`],
  ["Operating mode", `${recommendationWeights.operatingMode}%`],
];

const validationSampleNames = interRaterValidationPlan.sampleHarnessIds.map((id) => (
  harnesses.find((harness) => harness.id === id)?.name ?? id
));

function label(value: string) {
  return value
    .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("-", " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function maturityLabel(maturity: (typeof researchSources)[number]["maturity"], venue: string) {
  if (maturity === "peer-reviewed") return venue;
  if (maturity === "preprint") return `${venue}, preprint`;
  if (maturity === "standard") return `${venue}, standard`;
  return `${venue}, guidance`;
}

function WeightGroup({ title, values }: { title: string; values: Record<string, Record<string, number>> }) {
  return (
    <section className="method-weight-group">
      <h3>{title}</h3>
      {Object.entries(values).map(([mode, factors]) => (
        <div className="method-weight-row" key={mode}>
          <strong>{label(mode)}</strong>
          <span>{Object.entries(factors).map(([factor, weight]) => `${label(factor)} ${weight}%`).join(", ")}</span>
        </div>
      ))}
    </section>
  );
}

export default function MethodologyPage() {
  return (
    <section className="section page-section">
      <div className="shell narrow-shell prose-page">
        <div className="page-intro">
          <p className="methodology-version">Methodology {methodologyVersion}</p>
          <h1>How recommendations are built.</h1>
          <p>We first check whether a tool can meet your requirements, then compare workflow fit and show how stable the result is. Sources and measured configurations remain separate from editorial judgments.</p>
        </div>

        <div className="methodology-plain-summary" aria-label="Method in four steps">
          <div><span>1</span><strong>Scope</strong><p>Only products that own a documented coding loop enter the default ranking.</p></div>
          <div><span>2</span><strong>Requirements</strong><p>Must-haves are gates. A strength elsewhere cannot cancel a missing requirement.</p></div>
          <div><span>3</span><strong>Workflow fit</strong><p>Eligible tools are compared against your preferences, not a universal quality score.</p></div>
          <div><span>4</span><strong>Uncertainty</strong><p>Sensitivity and evidence states show how much confidence to place in the order.</p></div>
        </div>

        <details className="methodology-toc">
          <summary>Browse the technical methodology</summary>
          <nav aria-label="Methodology sections">
            {methodologySections.map(([id, sectionLabel]) => (
              <a href={`#${id}`} key={id}>{sectionLabel}</a>
            ))}
          </nav>
        </details>

        <section className="prose-section" id="decision-question">
          <h2>1. Decision question: what should this person use?</h2>
          <p><strong>Goal:</strong> select a coding harness for a declared workflow. <strong>Questions:</strong> can it satisfy the non-negotiable constraints; among eligible tools, which mechanisms fit the workflow; how stable is that ordering; and what evidence supports each claim? <strong>Metrics:</strong> eligibility, preference value, rank robustness, evidence state, and measured system outcomes.</p>
          <p>Model intelligence is never treated as harness capability. Product mechanisms and benchmark configurations remain separate throughout the data model and interface.</p>
        </section>

        <section className="prose-section" id="eligibility">
          <h2>2. Scope and eligibility before preference</h2>
          <h3>Catalog membership test</h3>
          <p>A product enters the default coding-harness recommender only when all four conditions below have current first-party evidence. The boundary is adapted from <a href="https://arxiv.org/abs/2606.10106" target="_blank" rel="noreferrer">What makes a harness a harness</a>. That source is a single-author conceptual preprint, so HarnessMatch uses it as a conservative catalog rule rather than an accepted standard or performance model.</p>
          <div className="taxonomy-list membership-test-list">
            {Object.entries(membershipCriterionLabels).map(([criterion, criterionLabel]) => (
              <div key={criterion}>
                <strong>{criterionLabel}</strong>
                <p>{membershipCriterionDescriptions[criterion as keyof typeof membershipCriterionDescriptions]}</p>
              </div>
            ))}
          </div>
          <p>Each criterion is recorded as documented, contradicted, or unknown. Only four documented criteria pass. Unknown evidence is never converted into a negative capability claim, but it still blocks ranking because category membership has not been established.</p>

          <h3>Neighboring layers remain visible but separate</h3>
          <div className="taxonomy-list">
            <div><strong>{productLayerLabels["coding-harness"]}</strong><p>Owns the adaptive loop, repository tools, context handling, and runtime controls needed to perform coding work.</p></div>
            <div><strong>{productLayerLabels["external-harness-orchestrator"]}</strong><p>Coordinates independent harnesses or user-supervised sessions but does not establish its own coding loop.</p></div>
            <div><strong>{productLayerLabels["framework-runtime"]}</strong><p>Supplies building blocks or durable execution for constructing agents rather than a ready-to-use coding harness.</p></div>
            <div><strong>{productLayerLabels["adjacent-tool"]}</strong><p>Covers gateways, pure editor assistance, evaluation harnesses, and other useful systems outside the coding-harness boundary.</p></div>
          </div>
          <p>Layer and product role are independent. A platform can still qualify as a coding harness when it owns the loop; a control plane that only supervises external harnesses does not. Orchestrators, frameworks, and adjacent tools remain available to catalog and compare, but they do not enter the default recommendation ordering.</p>

          <h3>Workflow gates</h3>
          <p>After membership, interface, model-access path, explicit required features, and mode-implied requirements are non-compensatory gates. Consumer subscription access, enterprise access, provider breadth, and local-model support are recorded independently: one never establishes another by inference. Choosing no model-access preference skips that gate instead of inventing a default constraint. CI requires headless execution; parallel work requires documented subagents. A high value elsewhere cannot compensate for a failed gate.</p>
          <p>Each capability is stored once as a source-linked claim; catalog filters and eligibility gates are derived from that record rather than maintained as separate yes/no fields. Claims preserve operating state: available by default, documented, optional, surface-specific, not documented, explicitly absent, or deprecated. A supported gate must link to a first-party source and verification date. “Not documented” remains uncertainty; “no built-in support” is used only when an admitted source says so explicitly.</p>
          <p>Only active products are eligible: dormant and archived products remain visible for research but are excluded from recommendations and benchmark rankings. OpenRouter and GitHub are discovery sources only: they can create a research candidate, but cannot establish a capability.</p>
          <p>The current public status is deliberately conservative: “Eligible” means catalog membership and every declared workflow gate have current supporting documentation. “Not eligible on current evidence” can mean a neighboring product layer or at least one undocumented gate; it does not prove technical impossibility.</p>
        </section>

        <section className="prose-section" id="preference-model">
          <h2>3. Preference model and swing weights</h2>
          <p>Eligible products are compared with a provisional linear additive MCDA model. Interface and model access are absent from the score because they were already used as gates. The published reference swing weights sum to 100:</p>
          <div className="weight-list">
            {weights.map(([weightLabel, value]) => (
              <div key={weightLabel}><span>{weightLabel}</span><strong>{value}</strong></div>
            ))}
          </div>
          <p>The editorial 1-5 rubric is mapped through the explicit provisional value function {Object.entries(capabilityValueFunction).map(([level, value]) => `${level}→${value}`).join(", ")}. These internal values enable ordering; the public interface reports preference bands and rank robustness instead of presenting them as measured “quality out of 100”.</p>
          <div className="method-weight-groups">
            <WeightGroup title="Control style" values={controlStyleWeights} />
            <WeightGroup title="Change scope" values={changeScopeWeights} />
            <WeightGroup title="Operating mode" values={operatingModeWeights} />
          </div>
          <h3>Provisional capability anchors</h3>
          <p>Editors assign the most advanced level supported by first-party records. These anchors define the coding rule; they are not benchmark outcomes, model assessments, or validated performance scales.</p>
          <div className="capability-rubric-list">
            {(Object.keys(capabilityLevelAnchors) as Array<keyof typeof capabilityLevelAnchors>).map((axis) => (
              <details key={axis}>
                <summary>
                  <strong>{capabilityAxisLabels[axis]}</strong>
                  <span>View five behavioral anchors</span>
                </summary>
                <ol>
                  {capabilityLevels.map((level) => (
                    <li key={level}>
                      <b>Level {level}</b>
                      <span>{capabilityLevelAnchors[axis][level]}</span>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
          <p>Publishing an anchor makes an editorial judgment inspectable, not automatically reliable. Claim-level source mapping, independent dual coding, and external validity checks remain open work.</p>
          <p>The additive model assumes the displayed criteria are sufficiently preference-independent for this use. That assumption is provisional and is listed as a validation target below.</p>
        </section>

        <section className="prose-section" id="sensitivity">
          <h2>4. Sensitivity instead of false precision</h2>
          <p>For each answer set, HarnessMatch evaluates {recommendationSensitivity.scenarios} deterministic sensitivity scenarios. Every reference weight is multiplied by a value between {recommendationSensitivity.weightMultiplierMin} and {recommendationSensitivity.weightMultiplierMax}, then renormalized; each provisional factor value is also stressed by up to ±{recommendationSensitivity.factorValueUncertainty} points, half of one rubric step. The interface reports top-rank frequency, top-three frequency, mean rank, and best-worst rank.</p>
          <p>Any result within {closeMatchScoreMargin} internal preference points of the highest provisional value is presented as part of the leading group. This display rule does not change the calculation; it prevents a small editorial-value difference from being presented as a uniquely superior product.</p>
          <p>A “top three in 90%” result means 90% of tested preference-and-rating stress scenarios place the harness in the top three. It is not a 90% chance of task success and is not a Bayesian posterior. The uncertainty ranges are methodological stress bounds, not empirically estimated rating-error distributions.</p>
          <p>If any scored operational input is undocumented, the candidate remains unranked for that comparison. Missing values are not renormalized away and are never converted into evidence of absence.</p>
        </section>

        <section className="prose-section" id="architecture">
          <h2>5. Seven architecture layers</h2>
          <p>Architecture is described one layer at a time and never summed into a universal readiness grade.</p>
          <div className="taxonomy-list">
            {(Object.entries(architectureAxisLabels)).map(([axis, axisLabel]) => (
              <div key={axis}>
                <strong>{axisLabel}</strong>
                <p>Source-backed ordinal description of the most advanced documented mechanism on this layer.</p>
              </div>
            ))}
          </div>
          <p>Recovery is kept visible inside lifecycle; permissions are interpreted as governance; execution and tooling are now explicit instead of being inferred from a single “readiness” number.</p>
        </section>

        <section className="prose-section" id="evidence-states">
          <h2>6. Evidence states, not source-count confidence</h2>
          <div className="taxonomy-list">
            <div><strong>Documented</strong><p>A first-party document, repository, or announcement directly supports the claim and records a verification date.</p></div>
            <div><strong>Code-verifiable</strong><p>The relevant client or full source is public and inspected at a pinned commit.</p></div>
            <div><strong>Independently measured</strong><p>A complete external benchmark configuration passes the metadata admission policy.</p></div>
            <div><strong>Replicated</strong><p>Two independent, compatible measurements reproduce the claim. No current harness is awarded this state by default.</p></div>
          </div>
          <p>States are claim-specific and need not form a simple ladder. The legacy high/medium/limited coverage label only describes documentation breadth: high requires {evidenceCoverageThresholds.high.sources} sources across {evidenceCoverageThresholds.high.sourceKinds} kinds; it is not used as scientific confidence.</p>
          <p>Compact result cards summarize evidence available for the product record. They do not upgrade every individual feature claim to the strongest product-level state; the source rows on each profile remain authoritative.</p>
        </section>

        <section className="prose-section" id="research-process">
          <h2>7. {researchProcessDisclosure.label}</h2>
          <p>{researchProcessDisclosure.introduction}</p>
          <p>{researchProcessDisclosure.governance}</p>
          <p>{researchProcessDisclosure.crossCheck}</p>
          <div className="taxonomy-list">
            {researchProcessDisclosure.stages.map((stage) => (
              <div key={stage.label}>
                <strong>{stage.label}</strong>
                <p>{stage.description}</p>
              </div>
            ))}
          </div>
          <p>AI assistance improves research coverage and update speed. It does not replace source provenance, editorial judgment, inter-rater validation, or direct measurement.</p>
        </section>

        <section className="prose-section" id="public-code">
          <h2>8. Public-code artifacts</h2>
          <p>{repositoryAudits.length} official repositories are inspected at exact commits for {Object.values(repositoryArtifactLabels).join(", ")}. The interface reports a transparent count out of five, not a weighted product score.</p>
          <p>Presence does not establish adequacy, security, maintainability, or benchmark independence. Support-only repositories are shown but remain unranked.</p>
        </section>

        <section className="prose-section" id="measured-systems">
          <h2>9. Measured systems and uncertainty</h2>
          <p>No result is admitted without model, exact harness version, benchmark version, budget, sandbox/environment, attempts, date, cost, and primary source. A result belongs to model × harness × configuration × environment × budget.</p>
          <p>The current view contains {benchmarkRuns.length} Terminal-Bench 2.1 configurations, each with 89 tasks, five attempts, and 445 trials. HarnessMatch shows a descriptive 95% interval calculated as accuracy ± 1.96 × the reported standard error, marks interval overlap with the leading configuration, and identifies the non-dominated accuracy/cost Pareto frontier.</p>
          <p>The normal approximation does not model task clustering or benchmark sampling. Overlap is a visual uncertainty group, not a formal equivalence test. A task-cluster bootstrap or generalized mixed model remains the preferred future analysis when raw trial data is available.</p>
        </section>

        <section className="prose-section" id="classification">
          <h2>10. Classification is descriptive</h2>
          <div className="taxonomy-list">
            {classificationAxes.map((axis) => (
              <div key={axis.label}><strong>{axis.label}</strong><p>{axis.description}</p></div>
            ))}
          </div>
          <p>Runtime posture and available isolation remain separate. Multi-agent organization, autonomy, and a larger feature surface are not assumed to be universally better.</p>
          <h3>Workflow fit × model portability</h3>
          <p>The recommender result adds a two-dimensional reading aid, not another score. Rows reuse the user-specific workflow-fit bands. Columns derive a categorical model-portability posture from the separately documented provider style and local-model path:</p>
          <div className="taxonomy-list">
            {Object.entries(modelPortabilityLabels).map(([portability, portabilityLabel]) => (
              <div key={portability}>
                <strong>{portabilityLabel}</strong>
                <p>{modelPortabilityDescriptions[portability as keyof typeof modelPortabilityDescriptions]}</p>
              </div>
            ))}
          </div>
          <p>Column placement does not add points, change the ordering, or claim that provider freedom is universally preferable. It lets a user see the trade-off between the fit calculated from their answers and the model-access posture they are willing to accept.</p>
        </section>

        <section className="prose-section" id="validation">
          <h2>11. Validation status</h2>
          <div className="taxonomy-list">
            <div><strong>Implemented</strong><p>Source-governed membership gates, catalog layers, workflow gates, explicit weights, public provisional capability anchors, deterministic sensitivity analysis, missing-data non-renormalization, source dates, pinned repository commits, complete benchmark metadata, descriptive intervals, and Pareto status.</p></div>
            <div><strong>Protocol published</strong><p>A fixed stratified sample, independent coding procedure, agreement statistics, uncertainty reporting, and held-out recoding rule are now defined in the repository.</p></div>
            <div><strong>Not yet established</strong><p>Inter-rater reliability, content-validity review by external experts, criterion validity against controlled harness outcomes, and predictive validity in real user adoption.</p></div>
          </div>
          <details className="validation-protocol">
            <summary>
              <strong>Open the inter-rater validation protocol</strong>
              <span>{validationSampleNames.length} products, {interRaterValidationPlan.axes.length} axes, {interRaterValidationPlan.independentRaters} independent raters</span>
            </summary>
            <div className="validation-protocol-body">
              <p><strong>Fixed sample:</strong> {validationSampleNames.join(", ")}.</p>
              <p>{interRaterValidationPlan.samplingRationale}</p>
              <ol>
                {interRaterValidationPlan.procedure.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <dl>
                <div><dt>Unit</dt><dd>{interRaterValidationPlan.unitOfAnalysis}</dd></div>
                <div><dt>Primary statistic</dt><dd>{interRaterValidationPlan.primaryStatistic}</dd></div>
                <div><dt>Secondary statistic</dt><dd>{interRaterValidationPlan.secondaryStatistic}</dd></div>
                <div><dt>Uncertainty</dt><dd>{interRaterValidationPlan.uncertainty}</dd></div>
              </dl>
              <p>The pre-specified working threshold is α ≥ {interRaterValidationPlan.workingThreshold.toFixed(2)}. {interRaterValidationPlan.thresholdCaveat} Even high agreement would establish reliability, not construct validity.</p>
            </div>
          </details>
          <div className="taxonomy-list validation-next-studies">
            <div>
              <strong>Content validity study</strong>
              <p>{contentValidityPlan.panel} {contentValidityPlan.task}</p>
              <small>{contentValidityPlan.outputs.join("; ")}.</small>
            </div>
            <div>
              <strong>Prospective user study</strong>
              <p>{userValidationPlan.design}</p>
              <small>{userValidationPlan.outcomes.join("; ")}.</small>
            </div>
          </div>
          <p>{userValidationPlan.sampleSizePolicy}</p>
        </section>

        <section className="prose-section" id="value-tables">
          <h2>Published internal value tables</h2>
          <div className="operational-score-table">
            {Object.entries(operationalPostureScores).map(([axis, values]) => (
              <div key={axis}>
                <strong>{label(axis)}</strong>
                <span>{Object.entries(values).map(([posture, value]) => `${label(posture)} ${value ?? "unranked"}`).join(", ")}</span>
              </div>
            ))}
          </div>
          <p>These are transparent provisional value functions used inside workflow preference calculations. They are not benchmark outcomes, probabilities, or universal quality grades.</p>
        </section>

        <section className="prose-section" id="scientific-basis">
          <h2>Scientific basis</h2>
          <p>{researchSources.length} methodological sources define measurement, MCDA, uncertainty, benchmark validity, harness architecture, and claim limits. Papers guide the method; current first-party records still control product claims.</p>
          <details className="scientific-ledger">
            <summary>Open all {researchSources.length} research sources</summary>
            <div className="evidence-list research-source-list">
              {researchSources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                  <span>
                    <strong>{source.title}</strong>
                    <small>{source.supports}</small>
                    <small className="research-limitation">Limit: {source.limitation}</small>
                  </span>
                  <span className={`evidence-kind maturity-${source.maturity}`}>
                    {maturityLabel(source.maturity, source.venue)}
                  </span>
                </a>
              ))}
            </div>
          </details>
        </section>
      </div>
    </section>
  );
}
