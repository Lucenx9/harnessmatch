import Link from "next/link";
import { HarnessLogo } from "@/components/harness-logo";
import {
  modelPortabilityDescriptions,
  modelPortabilityFor,
  modelPortabilityLabels,
} from "@/lib/harness-classification";
import type { ModelPortability, Recommendation } from "@/lib/types";

const portabilityOrder: ModelPortability[] = [
  "vendor-specific",
  "managed-routing",
  "provider-choice",
  "provider-and-local",
];

const fitBands: Recommendation["fitBand"][] = [
  "strong",
  "good",
  "conditional",
  "weak",
];

const fitBandLabels: Record<Recommendation["fitBand"], string> = {
  strong: "Strong match",
  good: "Good match",
  conditional: "Conditional match",
  weak: "Weak match",
};

export function WorkflowPortabilityLens({ results }: { results: Recommendation[] }) {
  const rankById = new Map(results.map((result, index) => [result.harness.id, index + 1]));
  const displayed = portabilityOrder.flatMap((portability) => (
    results
      .filter((result) => modelPortabilityFor(result.harness) === portability)
      .slice(0, 3)
  ));
  const visibleFitBands = fitBands.filter((fitBand) => (
    displayed.some((result) => result.fitBand === fitBand)
  ));

  return (
    <section className="portability-lens" aria-labelledby="portability-lens-title">
      <div className="portability-lens-heading">
        <div>
          <h3 id="portability-lens-title">Workflow fit × model portability</h3>
          <p>Rows use your preference bands. Columns describe documented model access, not product quality.</p>
        </div>
        <Link className="text-link" href="/methodology#classification">How the lens is defined</Link>
      </div>

      <div className="portability-table-wrap">
        <table className="portability-table" aria-describedby="portability-lens-note">
          <thead>
            <tr>
              <th scope="col">Workflow fit</th>
              {portabilityOrder.map((portability) => (
                <th scope="col" key={portability}>
                  <strong>{modelPortabilityLabels[portability]}</strong>
                  <small>{modelPortabilityDescriptions[portability]}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleFitBands.map((fitBand) => (
              <tr key={fitBand}>
                <th scope="row">{fitBandLabels[fitBand]}</th>
                {portabilityOrder.map((portability) => {
                  const matches = displayed.filter((result) => (
                    result.fitBand === fitBand
                    && modelPortabilityFor(result.harness) === portability
                  ));
                  return (
                    <td key={portability}>
                      <span className="portability-mobile-label">{modelPortabilityLabels[portability]}</span>
                      {matches.length === 0 ? (
                        <span className="portability-empty">No displayed match</span>
                      ) : (
                        <div className="portability-products">
                          {matches.map((result) => (
                            <Link
                              href={`/harnesses/${result.harness.slug}`}
                              key={result.harness.id}
                              aria-label={`Rank ${rankById.get(result.harness.id)}, ${result.harness.name}: ${fitBandLabels[result.fitBand]}, ${modelPortabilityLabels[portability]}`}
                            >
                              <span>#{rankById.get(result.harness.id)}</span>
                              <HarnessLogo logo={result.harness.logo} name={result.harness.name} size="small" />
                              <strong>{result.harness.name}</strong>
                            </Link>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="portability-caption" id="portability-lens-note">
          Up to three highest-ranked eligible products in each model-portability posture. The complete ordering remains below.
        </p>
      </div>
    </section>
  );
}
