import type { GuiRepositoryAudit } from "@/lib/gui-types";
import { agetorAudit } from "./agetor";
import { aionUiAudit } from "./aionui";
import { blackcrabAudit } from "./blackcrab";
import { codegAudit } from "./codeg";
import { emdashAudit } from "./emdash";
import { hapiAudit } from "./hapi";
import { maestroAudit } from "./maestro";
import { nimbalystAudit } from "./nimbalyst";
import { openChamberAudit } from "./openchamber";
import { openHandsAgentCanvasAudit } from "./openhands-agent-canvas";
import { qmAudit } from "./qm";
import { qwenCodeDesktopAudit } from "./qwen-code-desktop";
import { supersetAudit } from "./superset";
import { t3CodeAudit } from "./t3-code";
import { traycerAudit } from "./traycer";
import { webmuxAudit } from "./webmux";

export const guiRepositoryAudits: GuiRepositoryAudit[] = [
  agetorAudit,
  aionUiAudit,
  blackcrabAudit,
  codegAudit,
  emdashAudit,
  hapiAudit,
  maestroAudit,
  nimbalystAudit,
  openChamberAudit,
  openHandsAgentCanvasAudit,
  qmAudit,
  qwenCodeDesktopAudit,
  supersetAudit,
  t3CodeAudit,
  traycerAudit,
  webmuxAudit,
];

export function guiRepositoryAuditFor(guiId: string) {
  return guiRepositoryAudits.find((audit) => audit.guiId === guiId);
}
