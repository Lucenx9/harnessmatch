/**
 * Reviewed gaps for the eight public usage sources. Each active harness must be
 * either present in that source's exact mapping or listed here. Unmapped means
 * no artifact has been admitted; it is not evidence of zero activity.
 */
export const unmappedHarnessIdsByUsageSource = {
  openrouter: [
    "amp", "antigravity-cli", "coder-agents", "copilot-cli", "cursor-cli",
    "deepagents-code", "factory-droid", "forgecode", "gemini-cli", "grok-build",
    "kimi-code", "kiro-cli", "letta-code", "mini-swe-agent", "mistral-vibe",
    "mux", "opencode", "stagewise", "zcode", "zoo-code",
  ],
  homebrew: [
    "amp", "codebuff", "coder-agents", "command-code", "crush",
    "deepagents-code", "junie-cli", "kern", "kilo-code", "mini-swe-agent", "mux",
    "omp", "openhands", "opensquilla", "poolside-cli", "postqode", "stagewise",
    "wakil", "zcode", "zoo-code",
  ],
  npm: [
    "aider", "antigravity-cli", "coder-agents", "command-code", "cursor-cli",
    "deepagents-code", "forgecode", "goose", "grok-build", "hermes-agent",
    "junie-cli", "kern", "kiro-cli", "mini-swe-agent", "mistral-vibe", "mux",
    "openhands", "opensquilla", "poolside-cli", "stagewise", "wakil", "zcode",
    "zoo-code",
  ],
  vscode: [
    "aider", "amp", "antigravity-cli", "codebuff", "coder-agents", "command-code",
    "copilot-cli", "crush", "cursor-cli", "deepagents-code", "forgecode", "goose",
    "grok-build", "hermes-agent", "junie-cli", "kern", "kimi-code", "kiro-cli",
    "letta-code", "mini-swe-agent", "mux", "omp", "openclaw", "opencode",
    "openhands", "opensquilla", "pi", "poolside-cli", "postqode", "stagewise",
    "wakil", "zcode",
  ],
  openvsx: [
    "aider", "amp", "antigravity-cli", "codebuff", "coder-agents", "command-code",
    "copilot-cli", "crush", "cursor-cli", "deepagents-code", "factory-droid",
    "forgecode", "goose", "grok-build", "hermes-agent", "junie-cli", "kern",
    "kimi-code", "kiro-cli", "letta-code", "mini-swe-agent", "mux", "omp",
    "openclaw", "opencode", "openhands", "opensquilla", "pi", "poolside-cli",
    "postqode", "stagewise", "wakil", "zcode",
  ],
  jetbrains: [
    "aider", "amp", "antigravity-cli", "codebuff", "coder-agents", "codex",
    "command-code", "copilot-cli", "crush", "cursor-cli", "deepagents-code",
    "forgecode", "gemini-cli", "goose", "grok-build", "hermes-agent", "kern",
    "kimi-code", "kiro-cli", "letta-code", "mini-swe-agent", "mistral-vibe",
    "mux", "omp", "openclaw", "opencode", "openhands", "opensquilla", "pi",
    "poolside-cli", "postqode", "qwen-code", "stagewise", "wakil", "zcode",
    "zoo-code",
  ],
  "github-releases": [
    "aider", "amp", "codebuff", "coder-agents", "command-code", "cursor-cli",
    "factory-droid", "grok-build", "hermes-agent", "kern", "kiro-cli",
    "letta-code", "mini-swe-agent", "mux", "openclaw", "openhands", "postqode",
    "stagewise", "wakil", "zcode",
  ],
  github: ["postqode", "zcode"],
};
