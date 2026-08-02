import type { GuiRepositoryAudit } from "@/lib/gui-types";
import { agetorAudit } from "./agetor";
import { aionUiAudit } from "./aionui";
import { blackcrabAudit } from "./blackcrab";
import { codegAudit } from "./codeg";
import { emdashAudit } from "./emdash";
import { hapiAudit } from "./hapi";
import { nimbalystAudit } from "./nimbalyst";
import { openChamberAudit } from "./openchamber";
import { openHandsAgentCanvasAudit } from "./openhands-agent-canvas";
import { qmAudit } from "./qm";
import { qwenCodeDesktopAudit } from "./qwen-code-desktop";
import { supersetAudit } from "./superset";
import { t3CodeAudit } from "./t3-code";
import { webmuxAudit } from "./webmux";

export const guiRepositoryAudits: GuiRepositoryAudit[] = [
  agetorAudit,
  aionUiAudit,
  blackcrabAudit,
  codegAudit,
  emdashAudit,
  hapiAudit,
  nimbalystAudit,
  openChamberAudit,
  openHandsAgentCanvasAudit,
  qmAudit,
  qwenCodeDesktopAudit,
  supersetAudit,
  t3CodeAudit,
  webmuxAudit,
];

export function guiRepositoryAuditFor(guiId: string) {
  return guiRepositoryAudits.find((audit) => audit.guiId === guiId);
}
