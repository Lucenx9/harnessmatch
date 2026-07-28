import { architectureAxisLabels, architectureLevelAnchors } from "@/lib/evaluation";
import type { ArchitectureAxis } from "@/lib/types";

const architectureLevelCount = 4;

export function ArchitectureLevelIndicator({
  axis,
  level,
  compact = false,
}: {
  axis: ArchitectureAxis;
  level: number | null;
  compact?: boolean;
}) {
  const accessibleLabel = level === null
    ? `${architectureAxisLabels[axis]}: excluded from comparison because the mechanism is not documented`
    : `${architectureAxisLabels[axis]}: ${architectureLevelAnchors[axis][level]}, documented level ${level} of ${architectureLevelCount}`;

  return (
    <span
      className={`profile-level-indicator${level === null ? " is-empty" : ""}${compact ? " is-compact" : ""}`}
      role="img"
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {Array.from({ length: architectureLevelCount }, (_, index) => (
        <span
          className={level !== null && index < level ? "is-filled" : undefined}
          aria-hidden="true"
          key={index}
        />
      ))}
    </span>
  );
}
