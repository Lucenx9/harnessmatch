export const MAX_COMPARE_SELECTION = 4;

export function normalizeCompareSelection(
  ids: readonly string[],
  activeHarnessIds: ReadonlySet<string>,
): string[] {
  const normalized: string[] = [];

  for (const rawId of ids) {
    const id = rawId.trim();
    if (!id || !activeHarnessIds.has(id) || normalized.includes(id)) continue;

    normalized.push(id);
    if (normalized.length === MAX_COMPARE_SELECTION) break;
  }

  return normalized;
}

export function parseCompareSelection(
  search: string,
  activeHarnessIds: ReadonlySet<string>,
): string[] | null {
  const searchParams = new URLSearchParams(search);
  if (!searchParams.has("ids")) return null;

  return normalizeCompareSelection(
    (searchParams.get("ids") ?? "").split(","),
    activeHarnessIds,
  );
}
