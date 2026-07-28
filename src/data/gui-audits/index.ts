import type { GuiRepositoryAudit } from "@/lib/gui-types";
import { emdashAudit } from "./emdash";
import { nimbalystAudit } from "./nimbalyst";
import { supersetAudit } from "./superset";
import { t3CodeAudit } from "./t3-code";
import { webmuxAudit } from "./webmux";

export const guiRepositoryAudits: GuiRepositoryAudit[] = [
  emdashAudit,
  nimbalystAudit,
  supersetAudit,
  t3CodeAudit,
  webmuxAudit,
];

export function guiRepositoryAuditFor(guiId: string) {
  return guiRepositoryAudits.find((audit) => audit.guiId === guiId);
}
