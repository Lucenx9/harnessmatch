import Link from "next/link";
import type { Harness } from "@/lib/types";
import { HarnessLogo } from "@/components/harness-logo";
import { harnessRoleLabels } from "@/lib/harness-labels";

export function HarnessCard({ harness, compact = false }: { harness: Harness; compact?: boolean }) {
  return (
    <article className={`harness-card ${compact ? "harness-card-compact" : "card"}`}>
      <div className="card-topline">
        <span className="pill">{harnessRoleLabels[harness.classification.role]}</span>
        <span className={`status ${harness.status}`}>{harness.status}</span>
      </div>
      <div className="harness-title-row">
        <HarnessLogo logo={harness.logo} name={harness.name} />
        <div>
          <h3>{harness.name}</h3>
          <p className="card-tagline">{harness.tagline}</p>
        </div>
      </div>
      {!compact && <p>{harness.summary}</p>}
      {!compact && (
        <div className="tag-row">
          {harness.interfaces.map((item) => (
            <span key={item} className="tag">{item}</span>
          ))}
        </div>
      )}
      <div className="card-footer-row">
        <span>{harness.evidence.length} primary sources<br />Product record checked {harness.verifiedAt}</span>
        <Link
          aria-label={`View ${harness.name} profile`}
          className="text-link"
          href={`/harnesses/${harness.slug}`}
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
