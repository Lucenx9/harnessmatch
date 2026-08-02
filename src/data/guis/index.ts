import type { GuiProduct } from "@/lib/gui-types";
import { aq } from "./aq";
import { claudeCodeDesktop } from "./claude-code-desktop";
import { codexDesktop } from "./codex-desktop";
import { conductor } from "./conductor";
import { emdash } from "./emdash";
import { nimbalyst } from "./nimbalyst";
import { qm } from "./qm";
import { superset } from "./superset";
import { t3Code } from "./t3-code";
import { webmux } from "./webmux";

export { guiExclusions } from "./exclusions";

export const guiProducts: GuiProduct[] = [
  aq,
  claudeCodeDesktop,
  codexDesktop,
  conductor,
  emdash,
  nimbalyst,
  qm,
  superset,
  t3Code,
  webmux,
];

export const guiProductById = new Map(guiProducts.map((product) => [product.id, product]));
