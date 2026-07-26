import Link from "next/link";
import type { Harness } from "@/lib/types";

export function HarnessCard({ harness }: { harness: Harness }) {
  return (
    <article className="card harness-card">
      <div className="card-topline">
        <span className="pill">{harness.category}</span>
        <span className="status active">{harness.status}</span>
      </div>
      <h3>{harness.name}</h3>
      <p className="card-tagline">{harness.tagline}</p>
      <p>{harness.summary}</p>
      <div className="tag-row">
        {harness.interfaces.map((item) => (
          <span key={item} className="tag">{item}</span>
        ))}
      </div>
      <div className="card-footer-row">
        <span>{harness.evidence.length} primary sources · {harness.verifiedAt}</span>
        <Link className="text-link" href={`/harnesses/${harness.slug}`}>
          View profile <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
