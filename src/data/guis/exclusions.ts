import type { GuiExclusion } from "@/lib/gui-types";
import { guiVerifiedAt } from "./helpers";

export const guiExclusions: GuiExclusion[] = [
  {
    id: "vibe-kanban",
    name: "Vibe Kanban",
    reason: "The company announced its shutdown and the repository release feed records the sunset, so it is excluded from active workflow matches.",
    sourceUrl: "https://github.com/BloopAI/vibe-kanban/releases",
    verifiedAt: guiVerifiedAt,
  },
];
