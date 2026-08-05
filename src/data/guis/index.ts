import type { GuiProduct } from "@/lib/gui-types";
import { agetor } from "./agetor";
import { aionUi } from "./aionui";
import { aq } from "./aq";
import { blackcrab } from "./blackcrab";
import { claudeCodeDesktop } from "./claude-code-desktop";
import { codeg } from "./codeg";
import { codexDesktop } from "./codex-desktop";
import { conductor } from "./conductor";
import { emdash } from "./emdash";
import { hapi } from "./hapi";
import { maestro } from "./maestro";
import { nimbalyst } from "./nimbalyst";
import { openChamber } from "./openchamber";
import { openHandsAgentCanvas } from "./openhands-agent-canvas";
import { qm } from "./qm";
import { qwenCodeDesktop } from "./qwen-code-desktop";
import { superset } from "./superset";
import { t3Code } from "./t3-code";
import { traycer } from "./traycer";
import { webmux } from "./webmux";

export { guiExclusions } from "./exclusions";

export const guiProducts: GuiProduct[] = [
  agetor,
  aionUi,
  aq,
  blackcrab,
  claudeCodeDesktop,
  codeg,
  codexDesktop,
  conductor,
  emdash,
  hapi,
  maestro,
  nimbalyst,
  openChamber,
  openHandsAgentCanvas,
  qm,
  qwenCodeDesktop,
  superset,
  t3Code,
  traycer,
  webmux,
];

export const guiProductById = new Map(guiProducts.map((product) => [product.id, product]));
