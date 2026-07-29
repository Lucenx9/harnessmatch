import { benchmarkRunsForHarness } from "@/data/benchmark-runs";
import { getHarnessMembershipAssessment } from "@/data/harness-membership";
import { harnesses } from "@/data/harnesses";
import { getOperationalProfile } from "@/data/operational-profiles";
import { repositoryArtifactCount, repositoryAuditForHarness } from "@/data/repository-audits";
import {
  formatIsolationModes,
  harnessRoleLabels,
  modelPortabilityFor,
  modelPortabilityLabels,
  orchestrationLabels,
  productLayerLabels,
  runtimePostureLabels,
  stateModelLabels,
} from "@/lib/harness-classification";
import { architectureProfileFor } from "@/lib/evaluation";
import type { CompareHarnessRecord } from "@/lib/compare-types";

const interfaceLabels = {
  terminal: "Terminal",
  ide: "IDE",
  web: "Web / desktop",
  automation: "Automation",
} as const;

const providerLabels = {
  "single-vendor": "Single-vendor",
  "multi-provider": "Multi-provider",
  "enterprise-routing": "Enterprise routing",
} as const;

function postureLabel(value: string) {
  return value.split("-").map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ");
}

export function compareHarnessRecords(): CompareHarnessRecord[] {
  return harnesses
    .filter((harness) => harness.status === "active")
    .map((harness) => {
      const membership = getHarnessMembershipAssessment(harness);
      const operational = getOperationalProfile(harness.id);
      const repositoryAudit = repositoryAuditForHarness(harness.id);
      const documentedMembership = membership
        ? Object.values(membership.criteria).filter((criterion) => criterion.state === "documented").length
        : 0;
      const architecture = architectureProfileFor(harness);

      return {
        id: harness.id,
        name: harness.name,
        tagline: harness.tagline,
        logo: harness.logo,
        bestFit: harness.bestFor[0] ?? "No primary workflow documented",
        interfaces: harness.interfaces.map((item) => interfaceLabels[item]).join(", "),
        approvalStyle: postureLabel(operational.permissions),
        modelPortability: modelPortabilityLabels[modelPortabilityFor(harness)],
        featureClaims: harness.featureClaims,
        measuredRuns: benchmarkRunsForHarness(harness.id).map((run) => ({
          id: run.id,
          accuracy: run.accuracy,
          standardError: run.standardError,
          model: run.model,
          harnessVersion: run.harnessVersion,
        })),
        mainTradeoff: harness.tradeoffs[0] ?? "No primary trade-off documented",
        catalogLayer: membership ? productLayerLabels[membership.layer] : "Not assessed",
        membershipSummary: membership ? `${documentedMembership}/4 criteria documented` : "Not assessed",
        productRole: harnessRoleLabels[harness.classification.role],
        orchestration: orchestrationLabels[harness.classification.orchestration],
        runtimePosture: runtimePostureLabels[harness.classification.runtime],
        isolation: formatIsolationModes(harness.classification.isolation),
        stateModel: stateModelLabels[harness.classification.state],
        contextLifecycle: postureLabel(operational.context),
        verification: postureLabel(operational.verification),
        observability: postureLabel(operational.observability),
        recovery: postureLabel(operational.recovery),
        providerPosture: providerLabels[harness.providerStyle],
        license: harness.license,
        documentedArchitectureLayers: Object.values(architecture).filter((value) => value !== null).length,
        repositoryAudit: repositoryAudit
          ? {
              artifactCount: repositoryArtifactCount(repositoryAudit),
              inspectedRef: repositoryAudit.inspectedRef,
            }
          : null,
      };
    });
}
