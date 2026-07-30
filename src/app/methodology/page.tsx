import type { Metadata } from "next";
import Link from "next/link";
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
  usabilityValidationPlan,
} from "@/data/validation-plan";
import {
  classificationAxes,
  membershipCriterionDescriptions,
  membershipCriterionLabels,
  modelPortabilityDescriptions,
  modelPortabilityLabels,
  productLayerLabels,
} from "@/lib/harness-classification";
import {
  architectureAxisLabels,
  benchmarkFamilyCount,
  operationalReadinessWeights,
} from "@/lib/evaluation";
import {
  capabilityAxisLabels,
  capabilityLevelAnchors,
  operationalPostureScores,
} from "@/lib/evaluation-config";
import {
  evidencePreviewLimit,
  evidenceTopicLabels,
  evidenceTopicOrder,
} from "@/lib/evidence-topics";
import {
  guiEvidencePreviewLimit,
  guiEvidenceTopicLabels,
  guiEvidenceTopicOrder,
} from "@/lib/gui-evidence-topics";
import { guiFitBandLabels, guiWorkflows } from "@/lib/gui-fit";
import { guiCapabilityLabels } from "@/lib/gui-labels";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Methodology",
  description:
    "See how HarnessMatch defines catalog scope, classifies mechanisms, separates evidence from usage, and limits measured comparisons.",
  path: "/methodology",
});

const methodologyVersion = "3.0 / 2026-07-30";
const capabilityLevels = [1, 2, 3, 4, 5] as const;
const methodologySections = [
  ["scope", "Question and scope"],
  ["eligibility", "Catalog membership"],
  ["gui-classification", "GUI classification"],
  ["capability-rubric", "Capability rubric"],
  ["architecture", "Architecture layers"],
  ["evidence-states", "Evidence states"],
  ["research-process", "Research process"],
  ["public-code", "Public-code artifacts"],
  ["measured-systems", "Measured systems"],
  ["classification", "Classification axes"],
  ["validation", "Validation status"],
  ["operational-values", "Operational values"],
  ["scientific-basis", "Scientific basis"],
] as const;

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

export default function MethodologyPage() {
  const benchmarkFamilies = benchmarkFamilyCount(benchmarkRuns);
  const benchmarkFamilyLabel = `${benchmarkFamilies} benchmark ${benchmarkFamilies === 1 ? "family" : "families"}`;

  return (
    <section className="section page-section">
      <div className="shell narrow-shell prose-page">
        <div className="page-intro">
          <p className="methodology-version">Methodology {methodologyVersion}</p>
          <h1>How the catalog is built.</h1>
          <p>HarnessMatch organizes source-backed facts for inspection and comparison. It does not select a winner or combine the catalog into one universal score.</p>
        </div>

        <section className="methodology-plain-summary" aria-label="Method in four steps">
          <div><span>1</span><strong>Define</strong><p>Category membership follows four documented harness criteria.</p></div>
          <div><span>2</span><strong>Record</strong><p>Every positive product claim links to a dated first-party source.</p></div>
          <div><span>3</span><strong>Separate</strong><p>Capabilities, popularity, code access, and benchmark results stay distinct.</p></div>
          <div><span>4</span><strong>Expose</strong><p>Unknowns, limitations, and verification dates remain visible.</p></div>
        </section>

        <details className="methodology-toc">
          <summary>Browse the technical methodology</summary>
          <nav aria-label="Methodology sections">
            {methodologySections.map(([id, sectionLabel]) => (
              <a href={`#${id}`} key={id}>{sectionLabel}</a>
            ))}
          </nav>
        </details>

        <section className="prose-section" id="scope">
          <h2>1. Question and scope</h2>
          <p><strong>Goal:</strong> make coding harnesses easier to inspect, filter, and compare without hiding editorial assumptions inside a personalized ranking. The catalog records what a product is, which mechanisms are documented, where it runs, which public signals are observable, and what remains unknown.</p>
          <p>Model intelligence is never treated as harness capability. Product mechanisms, public activity, documentation breadth, source-code access, and benchmark configurations remain separate throughout the data model and interface.</p>
        </section>

        <section className="prose-section" id="eligibility">
          <h2>2. Catalog membership</h2>
          <p>A product is classified as a coding harness only when all four conditions below have current first-party evidence. The boundary is adapted from <a href="https://arxiv.org/abs/2606.10106" target="_blank" rel="noreferrer">What makes a harness a harness</a>. That source is a single-author conceptual preprint, so HarnessMatch uses it as a conservative catalog rule rather than an accepted standard or performance model.</p>
          <div className="taxonomy-list membership-test-list">
            {Object.entries(membershipCriterionLabels).map(([criterion, criterionLabel]) => (
              <div key={criterion}>
                <strong>{criterionLabel}</strong>
                <p>{membershipCriterionDescriptions[criterion as keyof typeof membershipCriterionDescriptions]}</p>
              </div>
            ))}
          </div>
          <p>Each criterion is recorded as documented, contradicted, or unknown. Four documented criteria establish category membership only. Unknown evidence is not converted into a negative capability claim.</p>

          <h3>Neighboring layers remain visible but separate</h3>
          <div className="taxonomy-list">
            <div><strong>{productLayerLabels["coding-harness"]}</strong><p>Owns the adaptive loop, repository tools, context handling, and runtime controls needed to perform coding work.</p></div>
            <div><strong>{productLayerLabels["external-harness-orchestrator"]}</strong><p>Coordinates independent harnesses or user-supervised sessions but does not establish its own coding loop.</p></div>
            <div><strong>{productLayerLabels["framework-runtime"]}</strong><p>Supplies building blocks or durable execution for constructing agents rather than a ready-to-use coding harness.</p></div>
            <div><strong>{productLayerLabels["adjacent-tool"]}</strong><p>Covers gateways, pure editor assistance, evaluation harnesses, and other useful systems outside the coding-harness boundary.</p></div>
          </div>
          <p>Layer and product role are independent. A platform can qualify as a coding harness when it owns the loop; a control plane that only supervises external harnesses does not. Every layer remains available in the catalog and comparison view.</p>

          <h3>Claims and public activity</h3>
          <p>Capabilities are stored as source-linked claims rather than inferred from product names or model providers. Claim states preserve whether a mechanism is available by default, documented, optional, surface-specific, not documented, explicitly absent, or deprecated. “Not documented” remains uncertainty; “no built-in support” is used only when an admitted source says so explicitly.</p>
          <p>Active, dormant, and archived product states remain explicit. Dormant and archived records may stay available for research continuity, while active catalog views and measured rankings exclude them where the page states that scope.</p>
          <p>The Usage page records source-native observations from OpenRouter, Homebrew, npm, filtered GitHub release assets, VS Code Marketplace, Open VSX, JetBrains Marketplace, and GitHub repositories. Tokens, requests, downloads, installs, stars, forks, and release cadence observe different populations and denominators. They are never added together, used as capability evidence, or treated as a quality score. Missing coverage means no admitted mapping, not zero adoption.</p>
          <p>The stable-release tracker is factual and separate. It joins reviewed product-specific tag patterns to canonical repositories, excludes drafts, prereleases, and unrelated release trains, and publishes the latest tag, date, official URL, repository scope, observation date, and trailing 90-day count. Release frequency is maintenance context rather than quality or task-success evidence.</p>
        </section>

        <section className="prose-section" id="gui-classification">
          <h2>3. GUI workflow classification</h2>
          <p>The GUI catalog describes a different product layer. A harness-native GUI exposes its own coding harness, while a multi-harness workspace supervises independent CLIs or agent runtimes. Neither is universally better, and an external control plane does not inherit the capabilities of the harnesses it launches.</p>
          <div className="taxonomy-list">
            {guiWorkflows.map((workflow) => (
              <div key={workflow.id}>
                <strong>{workflow.label}</strong>
                <p>{workflow.description} Required: {workflow.required.map((key) => guiCapabilityLabels[key]).join(", ")}. Preferred: {workflow.preferred.map((key) => guiCapabilityLabels[key]).join(", ")}.</p>
              </div>
            ))}
          </div>
          <p>Every required and preferred claim documented yields <strong>{guiFitBandLabels.strong}</strong>. Documented requirements with an unresolved preferred claim yield <strong>{guiFitBandLabels.good}</strong>. An unresolved requirement yields <strong>{guiFitBandLabels.conditional}</strong>. Inactive products or contradicted requirements are <strong>{guiFitBandLabels["not-eligible"]}</strong>.</p>
          <p>Products are alphabetical inside each band. No numeric value, source count, popularity signal, price, or license contributes to GUI fit.</p>
          <p>GUI profiles group each source by one primary presentation topic in this fixed order: {guiEvidenceTopicOrder.map((topic) => guiEvidenceTopicLabels[topic]).join(", ")}. Each group shows the first {guiEvidencePreviewLimit} sources in record order and keeps every remaining source available behind a disclosure. Topic placement organizes the ledger only; it does not transfer harness capability, rank sources, or change workflow fit.</p>
        </section>

        <section className="prose-section" id="capability-rubric">
          <h2>4. Capability rubric</h2>
          <p>The editorial capability rubric is an inspectable coding aid, not a product score. Each axis is ordinal and independent. Levels are never summed into a universal grade or presented as measured performance.</p>
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
          <p>Publishing anchors makes editorial judgment inspectable. It does not establish inter-rater reliability, construct validity, or predictive performance.</p>
        </section>

        <section className="prose-section" id="architecture">
          <h2>5. Seven architecture layers</h2>
          <p>Architecture is described one layer at a time and never summed into a universal readiness grade.</p>
          <div className="taxonomy-list">
            {Object.entries(architectureAxisLabels).map(([axis, axisLabel]) => (
              <div key={axis}>
                <strong>{axisLabel}</strong>
                <p>Source-backed ordinal description of the most advanced documented mechanism on this layer.</p>
              </div>
            ))}
          </div>
          <p>Recovery remains visible inside lifecycle; permissions are interpreted as governance; execution and tooling are explicit instead of inferred from one overall label.</p>
        </section>

        <section className="prose-section" id="evidence-states">
          <h2>6. Evidence states</h2>
          <div className="taxonomy-list">
            <div><strong>Documented</strong><p>A first-party document, repository, or announcement directly supports the claim and records a verification date.</p></div>
            <div><strong>Code-verifiable</strong><p>The relevant client or full source is public and inspected at a pinned commit.</p></div>
            <div><strong>Independently measured</strong><p>A complete external benchmark configuration passes the metadata admission policy.</p></div>
            <div><strong>Replicated</strong><p>Two independent, compatible measurements reproduce the claim. No current harness receives this state by default.</p></div>
          </div>
          <p>States are claim-specific and need not form a simple ladder. Documentation volume is shown as coverage context only; it does not increase capability or scientific confidence.</p>
          <p>Harness profiles group first-party sources in this fixed presentation order: {evidenceTopicOrder.map((topic) => evidenceTopicLabels[topic]).join(", ")}. Each group shows the first {evidencePreviewLimit} sources in record order and keeps every remaining source available behind a disclosure. This layout does not rank, weight, or increase the confidence of any source.</p>
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
          <p>No result is admitted without model, exact harness version, benchmark version, budget, sandbox or environment, attempts, date, cost, and primary source. A result belongs to model × harness × configuration × environment × budget.</p>
          <p>The current archive contains {benchmarkFamilyLabel}: {benchmarkRuns.length} Terminal-Bench 2.1 configurations, each with 89 tasks, five attempts, and 445 trials. This is exploratory evidence, not a general harness leaderboard. HarnessMatch shows a descriptive 95% interval calculated as accuracy ± 1.96 × the reported standard error, marks interval overlap with the leading configuration, and identifies the non-dominated accuracy and cost Pareto frontier.</p>
          <p>The normal approximation does not model task clustering or benchmark sampling. Overlap is a visual uncertainty group, not a formal equivalence test. A task-cluster bootstrap or generalized mixed model remains preferable when raw trial data is available.</p>
          <p><Link className="text-link" href="/benchmarks">Inspect the benchmark archive</Link></p>
        </section>

        <section className="prose-section" id="classification">
          <h2>10. Classification is descriptive</h2>
          <div className="taxonomy-list">
            {classificationAxes.map((axis) => (
              <div key={axis.label}><strong>{axis.label}</strong><p>{axis.description}</p></div>
            ))}
          </div>
          <p>Runtime posture and available isolation remain separate. Multi-agent organization, autonomy, and a larger feature surface are not assumed to be universally better.</p>
          <h3>Model portability</h3>
          <p>Model portability is a categorical posture derived from the documented provider style and local-model path. It remains independent from product capability:</p>
          <div className="taxonomy-list">
            {Object.entries(modelPortabilityLabels).map(([portability, portabilityLabel]) => (
              <div key={portability}>
                <strong>{portabilityLabel}</strong>
                <p>{modelPortabilityDescriptions[portability as keyof typeof modelPortabilityDescriptions]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="prose-section" id="validation">
          <h2>11. Validation status</h2>
          <div className="taxonomy-list">
            <div><strong>Implemented</strong><p>Source-governed membership, explicit catalog layers, public ordinal anchors, dated claims, pinned repository commits, complete benchmark metadata, descriptive intervals, and Pareto status.</p></div>
            <div><strong>Protocol published</strong><p>A fixed stratified sample, independent coding procedure, agreement statistics, uncertainty reporting, and held-out recoding rule are defined in the repository.</p></div>
            <div><strong>Not yet established</strong><p>Inter-rater reliability, external content-validity review, criterion validity against controlled outcomes, and usability with real comparison tasks.</p></div>
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
              <strong>Comparison usability study</strong>
              <p>{usabilityValidationPlan.design}</p>
              <small>{usabilityValidationPlan.outcomes.join("; ")}.</small>
            </div>
          </div>
          <p>{usabilityValidationPlan.sampleSizePolicy}</p>
        </section>

        <section className="prose-section" id="operational-values">
          <h2>12. Operational reference values</h2>
          <p>The Data page can order complete operational profiles using five equally weighted axes: {Object.entries(operationalReadinessWeights).map(([axis, weight]) => `${label(axis)} ${weight}%`).join(", ")}. If any axis is unknown, the profile remains unranked.</p>
          <div className="operational-score-table">
            {Object.entries(operationalPostureScores).map(([axis, values]) => (
              <div key={axis}>
                <strong>{label(axis)}</strong>
                <span>{Object.entries(values).map(([posture, value]) => `${label(posture)} ${value ?? "unranked"}`).join(", ")}</span>
              </div>
            ))}
          </div>
          <p>These values describe documented operational posture for one analytical view. They are not probabilities, benchmark outcomes, or universal product-quality grades.</p>
        </section>

        <section className="prose-section" id="scientific-basis">
          <h2>Scientific basis</h2>
          <p>{researchSources.length} methodological sources inform measurement, uncertainty, benchmark validity, harness architecture, and claim limits. Papers guide the method; current first-party records still control product claims.</p>
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
