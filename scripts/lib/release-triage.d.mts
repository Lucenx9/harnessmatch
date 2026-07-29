export const releaseTriageModel: "openai/gpt-oss-20b";
export const releaseReviewQueuePath: string;
export const maxReleaseNotesCharacters: number;
export const releaseTriageResponseFormat: Record<string, unknown>;
export const releaseTriageTool: Record<string, unknown>;
export const releaseTriageOutputSchema: { parse(value: unknown): unknown };

export function emptyReleaseReviewQueue(updatedAt: string): Record<string, unknown>;
export function parseReleaseReviewQueue(source: string): Record<string, unknown>;
export function pendingReleaseCandidates(releases: Array<Record<string, string>>, queue: Record<string, unknown>): Array<Record<string, string>>;
export function buildReleaseTriageMessages(release: Record<string, string>, releasePayload: Record<string, unknown>): Record<string, unknown>;
export function validateReleaseTriageOutput(value: unknown): Record<string, unknown>;
export function mergeReleaseReviewQueue(queue: Record<string, unknown>, newItems: Array<Record<string, unknown>>, updatedAt: string): Record<string, unknown>;
export function renderReleaseReviewQueue(queue: Record<string, unknown>): string;
