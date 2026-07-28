import type { GuiCapabilityKey, GuiProduct } from "@/lib/gui-types";
import { aq } from "./aq";
import { claudeCodeDesktop } from "./claude-code-desktop";
import { codexDesktop } from "./codex-desktop";
import { conductor } from "./conductor";
import { emdash } from "./emdash";
import { nimbalyst } from "./nimbalyst";
import { superset } from "./superset";
import { t3Code } from "./t3-code";
import { webmux } from "./webmux";

export { guiExclusions } from "./exclusions";

export const guiCapabilityLabels: Record<GuiCapabilityKey, string> = {
  parallelSessions: "parallel sessions",
  workspaceIsolation: "workspace isolation",
  visualReview: "visual review",
  remoteExecution: "remote execution or access",
  teamCollaboration: "shared team access",
};

export const guiProducts: GuiProduct[] = [
  aq,
  claudeCodeDesktop,
  codexDesktop,
  conductor,
  emdash,
  nimbalyst,
  superset,
  t3Code,
  webmux,
];

export const guiProductById = new Map(guiProducts.map((product) => [product.id, product]));
