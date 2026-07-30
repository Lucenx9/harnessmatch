import type { GuiCapabilityKey } from "./gui-types";

export const guiCapabilityKeys = [
  "parallelSessions",
  "workspaceIsolation",
  "visualReview",
  "remoteExecution",
  "teamCollaboration",
] as const satisfies readonly GuiCapabilityKey[];

export const guiCapabilityLabels: Record<GuiCapabilityKey, string> = {
  parallelSessions: "parallel sessions",
  workspaceIsolation: "workspace isolation",
  visualReview: "visual review",
  remoteExecution: "remote execution or access",
  teamCollaboration: "shared team access",
};
