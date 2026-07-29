import Link from "next/link";
import { VisualIcon } from "@/components/visual-icon";
import {
  membershipCriterionDescriptions,
  membershipCriterionLabels,
} from "@/lib/harness-classification";
import type {
  EvidenceSource,
  HarnessMembershipAssessment,
  MembershipEvidenceState,
} from "@/lib/types";

const membershipEvidenceLabels: Record<MembershipEvidenceState, string> = {
  documented: "Documented",
  contradicted: "Contradicted",
  unknown: "Not established",
};

export function HarnessMembershipSection({
  membership,
  evidenceByUrl,
  documentedCriteria,
  totalCriteria,
  qualifies,
}: {
  membership: HarnessMembershipAssessment;
  evidenceByUrl: ReadonlyMap<string, EvidenceSource>;
  documentedCriteria: number;
  totalCriteria: number;
  qualifies: boolean;
}) {
  const criteria = Object.keys(membership.criteria) as Array<keyof typeof membership.criteria>;

  return (
    <section className="profile-membership" id="membership" aria-labelledby="membership-heading">
      <div className="profile-section-heading">
        <div className="profile-section-title-with-icon">
          <VisualIcon name="membership" />
          <div>
            <h2 id="membership-heading">Why it qualifies as a coding harness</h2>
            <p>This confirms category fit, not product quality. Every required criterion links back to first-party evidence.</p>
          </div>
        </div>
        <div className={`profile-membership-verdict profile-membership-verdict--${qualifies ? "qualified" : "unconfirmed"}`}>
          <strong>{qualifies ? "Qualifies" : "Not established"}</strong>
          <span>{documentedCriteria} of {totalCriteria} required criteria evidenced</span>
        </div>
      </div>
      <ul className="profile-membership-grid">
        {criteria.map((criterion) => {
          const assessment = membership.criteria[criterion];
          return (
            <li className="profile-membership-criterion" key={criterion}>
              <h3>{membershipCriterionLabels[criterion]}</h3>
              <span className={`profile-membership-state profile-membership-state--${assessment.state}`}>
                <i aria-hidden="true" />
                {membershipEvidenceLabels[assessment.state]}
              </span>
              <p>{membershipCriterionDescriptions[criterion]}</p>
              <div className="profile-membership-sources">
                {assessment.sourceUrls.length > 0
                  ? assessment.sourceUrls.map((url) => (
                      <a href={url} target="_blank" rel="noreferrer" key={url}>
                        <span>Evidence</span>
                        {evidenceByUrl.get(url)?.title ?? "First-party source"}
                      </a>
                    ))
                  : <span className="profile-membership-source-missing">No first-party source linked</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <footer>
        <p>
          {membership.limitation} <time dateTime={membership.verifiedAt}>Checked {membership.verifiedAt}.</time>{" · "}
          <Link className="text-link" href="/methodology#eligibility">Read the membership rule.</Link>
        </p>
      </footer>
    </section>
  );
}
