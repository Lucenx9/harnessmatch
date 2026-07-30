import { architectureAxisLabels, architectureLevelAnchors } from "@/lib/evaluation-labels";
import type { ArchitectureAxis } from "@/lib/types";

const architectureLevelCount = 4;
const architectureLevels = [1, 2, 3, 4] as const;

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
    : `${architectureAxisLabels[axis]}: ${architectureLevelAnchors[axis][level]}, rubric position ${level} of ${architectureLevelCount}; this is not a performance score`;

  return (
    <span
      className={`profile-rubric-rail${level === null ? " is-empty" : ""}${compact ? " is-compact" : ""}`}
      role="img"
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {architectureLevels.map((position) => (
        <span
          className={level === position ? "is-selected" : undefined}
          aria-hidden="true"
          key={position}
        />
      ))}
    </span>
  );
}
