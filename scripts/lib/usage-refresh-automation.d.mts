export const allowedUsageRefreshPaths: readonly string[];

export function changedPathsFromPorcelain(source: string): string[];

export function unexpectedUsageRefreshPaths(paths: string[]): string[];
