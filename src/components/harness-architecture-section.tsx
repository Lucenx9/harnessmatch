import Link from "next/link";
import { ArchitectureLevelIndicator } from "@/components/architecture-level-indicator";
import { VisualIcon } from "@/components/visual-icon";
import {
  architectureAxisLabels,
  architectureLevelAnchors,
} from "@/lib/evaluation";
import type { ArchitectureAxis, ArchitectureProfile } from "@/lib/types";

const architectureAxes = Object.keys(architectureAxisLabels) as ArchitectureAxis[];

export function HarnessArchitectureSection({
  architecture,
  sourceUrls,
  verifiedAt,
}: {
  architecture: ArchitectureProfile;
  sourceUrls: string[];
  verifiedAt: string;
}) {
  const documentedLayers = Object.values(architecture).filter((value) => value !== null).length;

  return (
    <section className="profile-signals" aria-labelledby="operational-evidence-heading">
      <div className="profile-section-heading">
        <div className="profile-section-title-with-icon">
          <VisualIcon name="operating-model" />
          <div>
            <h2 id="operational-evidence-heading">How it works under the hood</h2>
            <p>Seven mechanisms mapped from first-party records. These labels describe what the harness provides, not how intelligent its model is.</p>
          </div>
        </div>
        <div className="profile-operational-summary">
          <strong>{documentedLayers}/7</strong>
          <span>layers documented</span>
        </div>
      </div>

      <ul className="profile-operational-grid">
        {architectureAxes.map((axis) => {
          const level = architecture[axis];
          return (
            <li key={axis}>
              <span>{architectureAxisLabels[axis]}</span>
              <strong>{level === null ? "Not documented" : architectureLevelAnchors[axis][level] ?? "Unmapped rubric position"}</strong>
              <small>Documented mechanism, not a performance score.</small>
              <ArchitectureLevelIndicator axis={axis} level={level} />
            </li>
          );
        })}
      </ul>
      <footer className="profile-operational-footer">
        <p>{documentedLayers} of 7 layers documented. Mechanism sources checked {verifiedAt}. Missing layers stay missing; they do not lower or inflate a total score.</p>
        <div>
          {sourceUrls.map((url, index) => (
            <a className="text-link" href={url} target="_blank" rel="noreferrer" key={url}>Operational source {index + 1}</a>
          ))}
          <Link className="text-link" href="/methodology">Rubric</Link>
        </div>
      </footer>
    </section>
  );
}
