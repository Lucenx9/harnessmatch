import type { GuiCapabilityClaim, GuiEvidenceSource } from "@/lib/gui-types";

export const guiVerifiedAt = "2026-07-28";

export function documented(summary: string, ...sourceUrls: string[]): GuiCapabilityClaim {
  return { state: "documented", summary, sourceUrls, verifiedAt: guiVerifiedAt };
}

export function unknown(
  summary: string,
  verifiedAt = guiVerifiedAt,
): GuiCapabilityClaim {
  return { state: "unknown", summary, sourceUrls: [], verifiedAt };
}

export function source(
  title: string,
  url: string,
  kind: GuiEvidenceSource["kind"],
  topic: GuiEvidenceSource["topic"],
  covers: string,
  verifiedAt = guiVerifiedAt,
): GuiEvidenceSource {
  return { title, url, kind, topic, covers, verifiedAt };
}
