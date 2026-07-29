export const homebrewArtifacts = [
  { harnessId: "aider", artifactId: "aider", artifactKind: "formula" },
  { harnessId: "goose", artifactId: "block-goose-cli", artifactKind: "formula" },
  { harnessId: "cline", artifactId: "cline", artifactKind: "formula" },
  { harnessId: "forgecode", artifactId: "forgecode", artifactKind: "formula" },
  { harnessId: "gemini-cli", artifactId: "gemini-cli", artifactKind: "formula" },
  { harnessId: "hermes-agent", artifactId: "hermes-agent", artifactKind: "formula" },
  { harnessId: "kimi-code", artifactId: "kimi-code", artifactKind: "formula" },
  { harnessId: "letta-code", artifactId: "letta-code", artifactKind: "formula" },
  { harnessId: "mistral-vibe", artifactId: "mistral-vibe", artifactKind: "formula" },
  { harnessId: "openclaw", artifactId: "openclaw-cli", artifactKind: "formula" },
  { harnessId: "opencode", artifactId: "opencode", artifactKind: "formula" },
  { harnessId: "pi", artifactId: "pi-coding-agent", artifactKind: "formula" },
  { harnessId: "qwen-code", artifactId: "qwen-code", artifactKind: "formula" },
  { harnessId: "claude-code", artifactId: "claude-code", artifactKind: "cask" },
  { harnessId: "codex", artifactId: "codex", artifactKind: "cask" },
  { harnessId: "copilot-cli", artifactId: "copilot-cli", artifactKind: "cask" },
  { harnessId: "cursor-cli", artifactId: "cursor-cli", artifactKind: "cask" },
  { harnessId: "factory-droid", artifactId: "droid", artifactKind: "cask" },
];

export const npmPackages = [
  { harnessId: "claude-code", artifactId: "@anthropic-ai/claude-code", identity: { kind: "homepage", value: "https://github.com/anthropics/claude-code" } },
  { harnessId: "codex", artifactId: "@openai/codex", identity: { kind: "repository", value: "https://github.com/openai/codex" } },
  { harnessId: "gemini-cli", artifactId: "@google/gemini-cli", identity: { kind: "repository", value: "https://github.com/google-gemini/gemini-cli" } },
  { harnessId: "qwen-code", artifactId: "@qwen-code/qwen-code", identity: { kind: "repository", value: "https://github.com/QwenLM/qwen-code" } },
  { harnessId: "pi", artifactId: "@earendil-works/pi-coding-agent", identity: { kind: "repository", value: "https://github.com/earendil-works/pi" } },
  { harnessId: "letta-code", artifactId: "@letta-ai/letta-code", identity: { kind: "repository", value: "https://github.com/letta-ai/letta-code" } },
  { harnessId: "kilo-code", artifactId: "@kilocode/cli", identity: { kind: "repository", value: "https://github.com/Kilo-Org/kilocode" } },
  { harnessId: "kimi-code", artifactId: "@moonshot-ai/kimi-code", identity: { kind: "repository", value: "https://github.com/MoonshotAI/kimi-code" } },
  { harnessId: "opencode", artifactId: "opencode-ai", identity: { kind: "install-page", value: "https://opencode.ai/docs/", contains: "npm install -g opencode-ai" } },
  { harnessId: "openclaw", artifactId: "openclaw", identity: { kind: "repository", value: "https://github.com/openclaw/openclaw" } },
  { harnessId: "cline", artifactId: "cline", identity: { kind: "repository", value: "https://github.com/cline/cline" } },
  { harnessId: "postqode", artifactId: "@postqode/agent-tui", identity: { kind: "repository", value: "https://github.com/postqode/postqode-extension" } },
  { harnessId: "copilot-cli", artifactId: "@github/copilot", identity: { kind: "repository", value: "https://github.com/github/copilot-cli" } },
  { harnessId: "codebuff", artifactId: "codebuff", identity: { kind: "repository", value: "https://github.com/CodebuffAI/codebuff" } },
  { harnessId: "omp", artifactId: "@oh-my-pi/pi-coding-agent", identity: { kind: "repository", value: "https://github.com/can1357/oh-my-pi" } },
];

export const vsCodeExtensions = [
  { harnessId: "cline", artifactId: "saoudrizwan.claude-dev" },
  { harnessId: "kilo-code", artifactId: "kilocode.Kilo-Code" },
  { harnessId: "claude-code", artifactId: "anthropic.claude-code" },
  { harnessId: "codex", artifactId: "openai.chatgpt" },
];

export const openVsxExtensions = [
  { harnessId: "cline", artifactId: "saoudrizwan/claude-dev", displayName: "Cline", repositoryUrl: "https://github.com/cline/cline" },
  { harnessId: "kilo-code", artifactId: "kilocode/Kilo-Code", displayName: "Kilo Code: AI Coding Agent, Copilot, and Autocomplete", repositoryUrl: "https://github.com/Kilo-Org/kilocode" },
  { harnessId: "continue-cli", artifactId: "Continue/continue", displayName: "Continue - open-source AI code agent", repositoryUrl: "https://github.com/continuedev/continue" },
  { harnessId: "claude-code", artifactId: "anthropic/claude-code", displayName: "Claude Code for VS Code" },
  { harnessId: "codex", artifactId: "openai/chatgpt", displayName: "Codex – OpenAI’s coding agent" },
];

export const jetBrainsPlugins = [
  { harnessId: "continue-cli", pluginId: 22_707, artifactId: "com.github.continuedev.continueintellijextension", name: "Continue" },
  { harnessId: "junie-cli", pluginId: 26_104, artifactId: "org.jetbrains.junie", name: "Junie, the AI coding agent by JetBrains" },
  { harnessId: "cline", pluginId: 28_247, artifactId: "bot.cline", name: "Cline" },
  { harnessId: "kilo-code", pluginId: 28_350, artifactId: "ai.kilocode.jetbrains", name: "Kilo Code" },
];

/**
 * GitHub release totals are admitted only when asset names isolate the user-facing
 * harness distribution from SDKs, checksums, source archives, GUI packages, and
 * unrelated monorepo artifacts. Drafts and prereleases are excluded by the parser.
 */
export const githubReleaseArtifacts = [
  {
    harnessId: "claude-code",
    includePatterns: [String.raw`^claude-(?:darwin|linux|win32)-.+\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable Claude Code platform archives",
  },
  {
    harnessId: "codex",
    includePatterns: [
      String.raw`^codex$`,
      String.raw`^codex-(?:aarch64|x86_64)-(?:apple-darwin|pc-windows-msvc|unknown-linux-musl)(?:\.exe|\.dmg|\.tar\.gz|\.zst|\.exe\.(?:tar\.gz|zip|zst))$`,
    ],
    artifactScope: "Stable Codex CLI binaries and platform archives",
  },
  {
    harnessId: "opencode",
    includePatterns: [String.raw`^opencode-(?:darwin|linux|windows)-.+\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable OpenCode CLI platform archives",
  },
  {
    harnessId: "pi",
    includePatterns: [String.raw`^pi-(?:darwin|linux|windows)-(?:arm64|x64)\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable Pi coding-agent platform archives",
  },
  {
    harnessId: "omp",
    includePatterns: [String.raw`^omp-(?:darwin|linux|windows)-.+(?:\.exe)?$`],
    artifactScope: "Stable Oh My Pi platform binaries",
  },
  {
    harnessId: "goose",
    includePatterns: [String.raw`^goose-(?:aarch64|x86_64)-.+\.(?:tar\.bz2|tar\.gz|zip)$`],
    artifactScope: "Stable Goose CLI platform archives",
  },
  {
    harnessId: "gemini-cli",
    includePatterns: [String.raw`^(?:gemini-cli-bundle|gemini-(?:darwin|linux|windows)-.+)\.(?:zip|tar\.gz)$`],
    artifactScope: "Stable Gemini CLI bundle and platform archives",
  },
  {
    harnessId: "antigravity-cli",
    includePatterns: [String.raw`^agy_cli_(?:linux|mac|windows)_(?:arm64|x64)\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable Antigravity CLI platform archives",
  },
  {
    harnessId: "copilot-cli",
    includePatterns: [
      String.raw`^copilot-(?:darwin|linux|linuxmusl|win32)-(?:arm64|x64)\.(?:tar\.gz|zip)$`,
      String.raw`^copilot-(?:arm64|x64)\.msi$`,
    ],
    artifactScope: "Stable GitHub Copilot CLI platform archives and installers",
  },
  {
    harnessId: "junie-cli",
    includePatterns: [String.raw`^junie-release-.+\.(?:zip|tar\.gz)$`],
    artifactScope: "Stable Junie CLI platform archives",
  },
  {
    harnessId: "forgecode",
    includePatterns: [String.raw`^forge-(?:aarch64|x86_64)-.+(?:\.exe)?$`],
    artifactScope: "Stable ForgeCode platform binaries",
  },
  {
    harnessId: "qwen-code",
    includePatterns: [String.raw`^qwen-code-(?:darwin|linux|win)-(?:arm64|x64)\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable Qwen Code platform archives",
  },
];
