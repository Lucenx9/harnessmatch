import { featureClaimStateLabels } from "@/lib/feature-claim-labels";
import type { FeatureClaim } from "@/lib/types";

export function FeatureClaimValue({
  claim,
  compact = false,
}: {
  claim: FeatureClaim;
  compact?: boolean;
}) {
  const source = claim.sourceUrls[0];
  const accessibleDetail = `${featureClaimStateLabels[claim.state]}. ${claim.scope}. ${claim.limitation}`;

  return (
    <span className={`feature-claim feature-claim--${claim.state}${compact ? " is-compact" : ""}`} title={accessibleDetail}>
      <span className="feature-claim-state">
        <i aria-hidden="true" />
        <strong>{featureClaimStateLabels[claim.state]}</strong>
      </span>
      {!compact && <small>{claim.scope}</small>}
      {!compact && source && (
        <a href={source} target="_blank" rel="noreferrer">
          Source · checked {claim.verifiedAt}
        </a>
      )}
      <span className="sr-only">{claim.limitation}</span>
    </span>
  );
}
