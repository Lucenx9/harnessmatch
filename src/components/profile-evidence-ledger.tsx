import { ArrowSquareOutIcon } from "@phosphor-icons/react/ssr";

type EvidenceKind = "official-docs" | "official-repository" | "official-announcement";

const evidenceKindLabels: Record<EvidenceKind, string> = {
  "official-docs": "Official docs",
  "official-repository": "Official repository",
  "official-announcement": "Official announcement",
};

export type ProfileEvidenceSource<Topic extends string> = {
  readonly title: string;
  readonly topic: Topic;
  readonly url: string;
  readonly covers: string;
  readonly kind: EvidenceKind;
  readonly verifiedAt: string;
};

type EvidenceGroup<Topic extends string> = {
  readonly topic: Topic;
  readonly label: string;
  readonly sources: readonly ProfileEvidenceSource<Topic>[];
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

function groupEvidence<Topic extends string>(
  sources: readonly ProfileEvidenceSource<Topic>[],
  topicOrder: readonly Topic[],
  topicLabels: Readonly<Record<Topic, string>>,
): EvidenceGroup<Topic>[] {
  const grouped = sources.reduce((groups, source) => {
    groups.set(source.topic, [...(groups.get(source.topic) ?? []), source]);
    return groups;
  }, new Map<Topic, ProfileEvidenceSource<Topic>[]>());

  return topicOrder.flatMap((topic) => {
    const topicSources = grouped.get(topic);
    return topicSources ? [{ topic, label: topicLabels[topic], sources: topicSources }] : [];
  });
}

function EvidenceLinks<Topic extends string>({
  sources,
}: {
  sources: readonly ProfileEvidenceSource<Topic>[];
}) {
  return (
    <ul className="profile-evidence-ledger-list">
      {sources.map((source) => (
        <li key={source.url}>
          <a className="profile-evidence-ledger-link" href={source.url} target="_blank" rel="noreferrer">
            <span className="profile-evidence-ledger-copy">
              <span className="profile-evidence-ledger-title">
                <strong>{source.title}</strong>
                <ArrowSquareOutIcon size={15} weight="regular" aria-hidden="true" />
                <span className="sr-only">Opens in a new tab</span>
              </span>
              <span className="profile-evidence-ledger-covers">{source.covers}</span>
            </span>
            <span className="profile-evidence-ledger-meta">
              <span>{evidenceKindLabels[source.kind]}</span>
              <time dateTime={source.verifiedAt}>Source checked {source.verifiedAt}</time>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ProfileEvidenceLedger<Topic extends string>({
  sources,
  recordVerifiedAt,
  recordLabel,
  headingId,
  description,
  topicOrder,
  topicLabels,
  previewLimit,
}: {
  sources: readonly ProfileEvidenceSource<Topic>[];
  recordVerifiedAt: string;
  recordLabel: string;
  headingId: string;
  description: string;
  topicOrder: readonly Topic[];
  topicLabels: Readonly<Record<Topic, string>>;
  previewLimit: number;
}) {
  const groups = groupEvidence(sources, topicOrder, topicLabels);

  return (
    <>
      <div className="profile-section-heading profile-evidence-ledger-heading">
        <div>
          <h2 id={headingId}>First-party evidence</h2>
          <p>{description}</p>
        </div>
        <div className="profile-evidence-ledger-overview">
          <strong>{firstPartySourceCountLabel(sources.length)}</strong>
          <span>{recordLabel} checked <time dateTime={recordVerifiedAt}>{recordVerifiedAt}</time></span>
        </div>
      </div>

      {groups.length > 0
        ? (
            <div className="profile-evidence-ledger-groups">
              {groups.map((group) => {
                const visibleSources = group.sources.slice(0, previewLimit);
                const remainingSources = group.sources.slice(previewLimit);
                const topicHeadingId = `${headingId}-${group.topic}`;

                return (
                  <section className="profile-evidence-ledger-group" aria-labelledby={topicHeadingId} key={group.topic}>
                    <header className="profile-evidence-ledger-group-header">
                      <h3 id={topicHeadingId}>{group.label}</h3>
                      <span>{sourceCountLabel(group.sources.length)}</span>
                    </header>
                    <EvidenceLinks sources={visibleSources} />
                    {remainingSources.length > 0
                      ? (
                          <details className="profile-evidence-ledger-more">
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
        : <p className="profile-evidence-ledger-empty">No first-party sources are currently linked.</p>}
    </>
  );
}
