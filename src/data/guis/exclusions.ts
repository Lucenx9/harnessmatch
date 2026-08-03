import type { GuiExclusion } from "@/lib/gui-types";
import { guiVerifiedAt } from "./helpers";

export const guiExclusions: GuiExclusion[] = [
  {
    id: "1code",
    name: "1Code",
    reason: "The official repository was archived and made read-only on July 7, 2026, and the product site now resolves to that repository, so it is excluded from active workflow matches.",
    sourceUrl: "https://github.com/21st-dev/1code",
    verifiedAt: "2026-08-02",
  },
  {
    id: "vibe-kanban",
    name: "Vibe Kanban",
    reason: "The company announced its shutdown and the repository release feed records the sunset, so it is excluded from active workflow matches.",
    sourceUrl: "https://github.com/BloopAI/vibe-kanban/releases",
    verifiedAt: guiVerifiedAt,
  },
];
