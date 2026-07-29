/**
 * Stable, product-scoped GitHub release feeds admitted for editorial triage.
 *
 * This watchlist is intentionally independent from `githubReleaseArtifacts`,
 * which exists only when downloadable assets can support a usage signal. A
 * release can be useful for source review without exposing countable binaries.
 * GUI products remain outside this list until they expose a reviewed official
 * release feed.
 */
export const githubReleaseWatches = [
  { harnessId: "aider", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "antigravity-cli", includeTagPatterns: [String.raw`^\d+\.\d+\.\d+$`] },
  { harnessId: "claude-code", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "cline", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "codex", includeTagPatterns: [String.raw`^rust-v\d+\.\d+\.\d+$`] },
  { harnessId: "copilot-cli", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "crush", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "deepagents-code", includeTagPatterns: [String.raw`^deepagents-code==\d+\.\d+\.\d+$`] },
  { harnessId: "forgecode", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "gemini-cli", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "goose", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "hermes-agent", includeTagPatterns: [String.raw`^v\d{4}\.\d+\.\d+$`] },
  {
    harnessId: "junie-cli",
    includeTagPatterns: [String.raw`^\d+\.\d+$`],
    includeNamePatterns: [String.raw`^Junie Release\b`],
  },
  { harnessId: "kern", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "kilo-code", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "kimi-code", includeTagPatterns: [String.raw`^@moonshot-ai/kimi-code@\d+\.\d+\.\d+$`] },
  { harnessId: "letta-code", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "mini-swe-agent", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "mistral-vibe", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "mux", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "omp", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "openclaw", includeTagPatterns: [String.raw`^v\d{4}\.\d+\.\d+$`] },
  { harnessId: "opencode", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "openhands", includeTagPatterns: [String.raw`^\d+\.\d+\.\d+$`] },
  { harnessId: "opensquilla", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "pi", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "poolside-cli", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "qwen-code", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
  { harnessId: "stagewise", includeTagPatterns: [String.raw`^stagewise@\d+\.\d+\.\d+$`] },
  { harnessId: "zoo-code", includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`] },
];
