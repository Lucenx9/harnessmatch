export const releaseTriageModel: "openai/gpt-oss-20b";
export const releaseReviewQueuePath: string;
export const maxReleaseNotesCharacters: number;
export const releaseTriageResponseFormat: Record<string, unknown>;
export const releaseTriageTool: Record<string, unknown>;
export const releaseTriageOutputSchema: { parse(value: unknown): unknown };

export interface ReleaseWithNotesDigest {
  harnessId: string;
  version: string;
  releasedAt: string;
  releaseNotesSha256: string;
}

export function emptyReleaseReviewQueue(updatedAt: string): Record<string, unknown>;
export function parseReleaseReviewQueue(source: string): Record<string, unknown>;
export function pendingReleaseCandidates<T extends ReleaseWithNotesDigest>(
  releases: ReadonlyArray<T>,
  queue: Record<string, unknown>,
): Array<T>;
export function hashReleaseNotes(releasePayload: Record<string, unknown>): string;
export function buildReleaseTriageMessages(release: Record<string, string>, releasePayload: Record<string, unknown>): Record<string, unknown>;
export function validateReleaseTriageOutput(value: unknown): Record<string, unknown>;
export function mergeReleaseReviewQueue(queue: Record<string, unknown>, newItems: Array<Record<string, unknown>>, updatedAt: string): Record<string, unknown>;
export function recordEditorialReleaseReview(queue: Record<string, unknown>, key: string, review: Record<string, unknown>, updatedAt: string): Record<string, unknown>;
export function renderReleaseReviewQueue(queue: Record<string, unknown>): string;
