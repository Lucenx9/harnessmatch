import { ArrowSquareOutIcon } from "@phosphor-icons/react/ssr";
import {
  evidencePreviewLimit,
  evidenceTopicLabels,
  evidenceTopicOrder,
  type EvidenceTopic,
} from "@/lib/evidence-topics";
import type { EvidenceSource } from "@/lib/types";

const evidenceKindLabels = {
  "official-docs": "Official docs",
  "official-repository": "Official repository",
  "official-announcement": "Official announcement",
} as const;

type EvidenceGroup = {
  readonly topic: EvidenceTopic;
  readonly label: string;
  readonly sources: readonly EvidenceSource[];
};

function sourceCountLabel(count: number) {
  return `${count} ${count === 1 ? "source" : "sources"}`;
}

function firstPartySourceCountLabel(count: number) {
  return `${count} first-party ${count === 1 ? "source" : "sources"}`;
}

function additionalSourceCountLabel(count: number) {
  return `${count} more ${count === 1 ? "source" : "sources"}`;
}

function groupEvidence(sources: readonly EvidenceSource[]): EvidenceGroup[] {
  const grouped = sources.reduce((groups, source) => {
    const topic: EvidenceTopic = source.topic ?? "additional";
    groups.set(topic, [...(groups.get(topic) ?? []), source]);
    return groups;
  }, new Map<EvidenceTopic, EvidenceSource[]>());

  return evidenceTopicOrder.flatMap((topic) => {
    const topicSources = grouped.get(topic);
    return topicSources
      ? [{ topic, label: evidenceTopicLabels[topic], sources: topicSources }]
      : [];
  });
}

function EvidenceLinks({ sources }: { sources: readonly EvidenceSource[] }) {
  return (
    <ul className="harness-evidence-list">
      {sources.map((source) => (
        <li key={source.url}>
          <a className="harness-evidence-link" href={source.url} target="_blank" rel="noreferrer">
            <span className="harness-evidence-copy">
              <span className="harness-evidence-title">
                <strong>{source.title}</strong>
                <ArrowSquareOutIcon size={15} weight="regular" aria-hidden="true" />
                <span className="sr-only">Opens in a new tab</span>
              </span>
              <span className="harness-evidence-covers">{source.covers}</span>
            </span>
            <span className="harness-evidence-meta">
              <span>{evidenceKindLabels[source.kind]}</span>
              <time dateTime={source.verifiedAt}>Source checked {source.verifiedAt}</time>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function HarnessEvidenceLedger({
  sources,
  recordVerifiedAt,
}: {
  sources: readonly EvidenceSource[];
  recordVerifiedAt: string;
}) {
  const groups = groupEvidence(sources);

  return (
    <>
      <div className="profile-section-heading harness-evidence-heading">
        <div>
          <h2 id="evidence-heading">First-party evidence</h2>
          <p>Each capability claim links to the first-party record that supports it.</p>
        </div>
        <div className="harness-evidence-overview">
          <strong>{firstPartySourceCountLabel(sources.length)}</strong>
          <span>Product record checked <time dateTime={recordVerifiedAt}>{recordVerifiedAt}</time></span>
        </div>
      </div>

      {groups.length > 0
        ? (
            <div className="harness-evidence-groups">
              {groups.map((group) => {
                const visibleSources = group.sources.slice(0, evidencePreviewLimit);
                const remainingSources = group.sources.slice(evidencePreviewLimit);
                const headingId = `evidence-topic-${group.topic}`;

                return (
                  <section className="harness-evidence-group" aria-labelledby={headingId} key={group.topic}>
                    <header className="harness-evidence-group-header">
                      <h3 id={headingId}>{group.label}</h3>
                      <span>{sourceCountLabel(group.sources.length)}</span>
                    </header>
                    <EvidenceLinks sources={visibleSources} />
                    {remainingSources.length > 0
                      ? (
                          <details className="harness-evidence-more">
                            <summary>View {additionalSourceCountLabel(remainingSources.length)}</summary>
                            <EvidenceLinks sources={remainingSources} />
                          </details>
                        )
                      : null}
                  </section>
                );
              })}
            </div>
          )
        : <p className="harness-evidence-empty">No first-party sources are currently linked.</p>}
    </>
  );
}
