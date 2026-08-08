/**
 * Reviewed gaps for the eight public usage sources. Each active harness must be
 * either present in that source's exact mapping or listed here. Unmapped means
 * no artifact has been admitted; it is not evidence of zero activity.
 */
export const unmappedHarnessIdsByUsageSource = {
  openrouter: [
    "amp", "antigravity-cli", "coder-agents", "copilot-cli",
    "codewhale", "factory-droid", "forgecode", "gemini-cli", "grok-build",
    "kimi-code", "kiro-cli", "letta-code", "mini-swe-agent", "mistral-vibe",
    "muse-code", "mux", "opencode", "openharness", "reasonix", "spectral-agent", "stagewise", "zcode", "zoo-code",
  ],
  homebrew: [
    "amp", "ante", "codebuff", "codewhale", "coder-agents", "command-code", "crush",
    "deepagents-code", "ggcode", "junie-cli", "kern", "kilo-code", "mini-swe-agent", "muse-code", "mux",
    "omp", "openhands", "openharness", "opensquilla", "poolside-cli", "postqode", "stagewise",
    "reasonix", "slate", "spectral-agent", "wakil", "zcode", "zoo-code",
  ],
  npm: [
    "aider", "ante", "antigravity-cli", "coder-agents", "command-code", "cursor-cli",
    "deepagents-code", "forgecode", "ggcode", "goose", "grok-build", "hermes-agent",
    "junie-cli", "kern", "kiro-cli", "mini-swe-agent", "mistral-vibe", "muse-code", "mux",
    "openhands", "openharness", "opensquilla", "poolside-cli", "stagewise", "wakil", "zcode",
    "zoo-code",
  ],
  vscode: [
    "aider", "amp", "ante", "antigravity-cli", "codebuff", "codewhale", "coder-agents", "command-code",
    "copilot-cli", "crush", "cursor-cli", "deepagents-code", "forgecode", "goose",
    "ggcode", "grok-build", "hermes-agent", "junie-cli", "kern", "kimi-code", "kiro-cli", "mimo-code",
    "letta-code", "mini-swe-agent", "muse-code", "mux", "omp", "openclaw", "opencode",
    "openhands", "openharness", "opensquilla", "pi", "poolside-cli", "postqode", "stagewise",
    "slate", "spectral-agent", "wakil", "zcode",
  ],
  openvsx: [
    "aider", "amp", "ante", "antigravity-cli", "codebuff", "codewhale", "coder-agents", "command-code",
    "copilot-cli", "crush", "cursor-cli", "deepagents-code", "factory-droid",
    "forgecode", "ggcode", "goose", "grok-build", "hermes-agent", "junie-cli", "kern",
    "kimi-code", "kiro-cli", "letta-code", "mimo-code", "mini-swe-agent", "muse-code", "mux", "omp",
    "openclaw", "opencode", "openhands", "openharness", "opensquilla", "pi", "poolside-cli",
    "postqode", "slate", "spectral-agent", "stagewise", "wakil", "zcode",
  ],
  jetbrains: [
    "aider", "amp", "ante", "antigravity-cli", "codebuff", "codewhale", "coder-agents", "codex",
    "command-code", "copilot-cli", "crush", "cursor-cli", "deepagents-code",
    "forgecode", "gemini-cli", "ggcode", "goose", "grok-build", "hermes-agent", "kern",
    "kimi-code", "kiro-cli", "letta-code", "mimo-code", "mini-swe-agent", "mistral-vibe",
    "muse-code", "mux", "omp", "openclaw", "opencode", "openhands", "openharness", "opensquilla", "pi",
    "poolside-cli", "postqode", "qwen-code", "reasonix", "stagewise", "wakil", "zcode",
    "slate", "spectral-agent", "zoo-code",
  ],
  "github-releases": [
    "aider", "amp", "ante", "codebuff", "coder-agents", "command-code", "cursor-cli",
    "factory-droid", "grok-build", "hermes-agent", "kern", "kiro-cli",
    "letta-code", "mini-swe-agent", "muse-code", "mux", "openclaw", "openhands", "postqode",
    "slate", "spectral-agent", "stagewise", "wakil", "zcode",
  ],
  github: ["muse-code", "postqode", "slate", "spectral-agent", "zcode"],
};
