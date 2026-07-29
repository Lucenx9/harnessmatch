export type GitHubReleaseWatch = {
  harnessId: string;
  includeTagPatterns: string[];
  includeNamePatterns?: string[];
};

export const githubReleaseWatches: GitHubReleaseWatch[];
