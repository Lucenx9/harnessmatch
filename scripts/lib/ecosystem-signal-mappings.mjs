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
  { harnessId: "antigravity-cli", artifactId: "antigravity-cli", artifactKind: "cask" },
  { harnessId: "grok-build", artifactId: "grok-build", artifactKind: "cask" },
  { harnessId: "kiro-cli", artifactId: "kiro-cli", artifactKind: "cask" },
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
  { harnessId: "amp", artifactId: "@ampcode/cli", identity: { kind: "homepage", value: "https://ampcode.com/" } },
  { harnessId: "factory-droid", artifactId: "@factory/cli", identity: { kind: "repository", value: "https://github.com/Factory-AI/factory" } },
  { harnessId: "crush", artifactId: "@charmland/crush", identity: { kind: "repository", value: "https://github.com/charmbracelet/crush" } },
];

export const vsCodeExtensions = [
  { harnessId: "cline", artifactId: "saoudrizwan.claude-dev" },
  { harnessId: "kilo-code", artifactId: "kilocode.Kilo-Code" },
  { harnessId: "claude-code", artifactId: "anthropic.claude-code" },
  { harnessId: "codex", artifactId: "openai.chatgpt" },
  { harnessId: "factory-droid", artifactId: "Factory.factory-vscode-extension" },
  { harnessId: "qwen-code", artifactId: "qwenlm.qwen-code-vscode-ide-companion" },
  { harnessId: "gemini-cli", artifactId: "Google.gemini-cli-vscode-ide-companion" },
  { harnessId: "mistral-vibe", artifactId: "mistralai.mistral-vibe-code" },
  { harnessId: "zoo-code", artifactId: "ZooCodeOrganization.zoo-code" },
];

export const openVsxExtensions = [
  { harnessId: "cline", artifactId: "saoudrizwan/claude-dev", displayName: "Cline", repositoryUrl: "https://github.com/cline/cline" },
  { harnessId: "kilo-code", artifactId: "kilocode/Kilo-Code", displayName: "Kilo Code: AI Coding Agent, Copilot, and Autocomplete", repositoryUrl: "https://github.com/Kilo-Org/kilocode" },
  { harnessId: "continue-cli", artifactId: "Continue/continue", displayName: "Continue - open-source AI code agent", repositoryUrl: "https://github.com/continuedev/continue" },
  { harnessId: "claude-code", artifactId: "anthropic/claude-code", displayName: "Claude Code for VS Code" },
  { harnessId: "codex", artifactId: "openai/chatgpt", displayName: "Codex – OpenAI’s coding agent" },
  { harnessId: "qwen-code", artifactId: "qwenlm/qwen-code-vscode-ide-companion", displayName: "Qwen Code Companion", repositoryUrl: "https://github.com/QwenLM/qwen-code" },
  { harnessId: "gemini-cli", artifactId: "Google/gemini-cli-vscode-ide-companion", displayName: "Gemini CLI Companion", repositoryUrl: "https://github.com/google-gemini/gemini-cli" },
  { harnessId: "mistral-vibe", artifactId: "mistralai/mistral-vibe-code", displayName: "Mistral Vibe VS Code", repositoryUrl: "https://github.com/mistralai/mistral-vibe" },
  { harnessId: "zoo-code", artifactId: "ZooCodeOrganization/zoo-code", displayName: "Zoo Code", repositoryUrl: "https://github.com/Zoo-Code-Org/Zoo-Code" },
];

export const jetBrainsPlugins = [
  { harnessId: "continue-cli", pluginId: 22_707, artifactId: "com.github.continuedev.continueintellijextension", name: "Continue" },
  { harnessId: "junie-cli", pluginId: 26_104, artifactId: "org.jetbrains.junie", name: "Junie, the AI coding agent by JetBrains" },
  { harnessId: "cline", pluginId: 28_247, artifactId: "bot.cline", name: "Cline" },
  { harnessId: "kilo-code", pluginId: 28_350, artifactId: "ai.kilocode.jetbrains", name: "Kilo Code" },
  { harnessId: "claude-code", pluginId: 27_310, artifactId: "com.anthropic.code.plugin", name: "Claude Code [Beta]" },
  { harnessId: "factory-droid", pluginId: 28_649, artifactId: "com.factory.jetbrains-plugin", name: "Factory Droid" },
];

/**
 * GitHub release totals are admitted only when asset names isolate the user-facing
 * harness distribution from SDKs, checksums, source archives, GUI packages, and
 * unrelated monorepo artifacts. Drafts and prereleases are excluded by the parser.
 */
export const githubReleaseArtifacts = [
  {
    harnessId: "claude-code",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^claude-(?:darwin|linux|win32)-.+\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable Claude Code platform archives",
  },
  {
    harnessId: "codex",
    includeTagPatterns: [String.raw`^rust-v\d+\.\d+\.\d+$`],
    includePatterns: [
      "^codex$",
      String.raw`^codex-(?:aarch64|x86_64)-(?:apple-darwin|pc-windows-msvc|unknown-linux-musl)(?:\.exe|\.dmg|\.tar\.gz|\.zst|\.exe\.(?:tar\.gz|zip|zst))$`,
    ],
    artifactScope: "Stable Codex CLI binaries and platform archives",
  },
  {
    harnessId: "opencode",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^opencode-(?:darwin|linux|windows)-.+\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable OpenCode CLI platform archives",
  },
  {
    harnessId: "pi",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^pi-(?:darwin|linux|windows)-(?:arm64|x64)\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable Pi coding-agent platform archives",
  },
  {
    harnessId: "omp",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^omp-(?:darwin|linux|windows)-.+(?:\.exe)?$`],
    artifactScope: "Stable Oh My Pi platform binaries",
  },
  {
    harnessId: "goose",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^goose-(?:aarch64|x86_64)-.+\.(?:tar\.bz2|tar\.gz|zip)$`],
    artifactScope: "Stable Goose CLI platform archives",
  },
  {
    harnessId: "gemini-cli",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^(?:gemini-cli-bundle|gemini-(?:darwin|linux|windows)-.+)\.(?:zip|tar\.gz)$`],
    artifactScope: "Stable Gemini CLI bundle and platform archives",
  },
  {
    harnessId: "antigravity-cli",
    includeTagPatterns: [String.raw`^\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^agy_cli_(?:linux|mac|windows)_(?:arm64|x64)\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable Antigravity CLI platform archives",
  },
  {
    harnessId: "copilot-cli",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [
      String.raw`^copilot-(?:darwin|linux|linuxmusl|win32)-(?:arm64|x64)\.(?:tar\.gz|zip)$`,
      String.raw`^copilot-(?:arm64|x64)\.msi$`,
    ],
    artifactScope: "Stable GitHub Copilot CLI platform archives and installers",
  },
  {
    harnessId: "junie-cli",
    includeTagPatterns: [String.raw`^\d+\.\d+$`],
    includeNamePatterns: [String.raw`^Junie Release\b`],
    includePatterns: [String.raw`^junie-release-.+\.(?:zip|tar\.gz)$`],
    artifactScope: "Stable Junie CLI platform archives",
  },
  {
    harnessId: "forgecode",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^forge-(?:aarch64|x86_64)-.+(?:\.exe)?$`],
    artifactScope: "Stable ForgeCode platform binaries",
  },
  {
    harnessId: "qwen-code",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^qwen-code-(?:darwin|linux|win)-(?:arm64|x64)\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable Qwen Code platform archives",
  },
  {
    harnessId: "cline",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^cline-\d+\.\d+\.\d+\.vsix$`],
    artifactScope: "Stable Cline VSIX extension archives",
  },
  {
    harnessId: "crush",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [
      String.raw`^crush_\d+\.\d+\.\d+_(?:Android|Darwin|Freebsd|Linux|Netbsd|Openbsd|Windows)_.+\.(?:tar\.gz|zip)$`,
      String.raw`^crush[_-]\d+\.\d+\.\d+.*\.(?:apk|deb|rpm|pkg\.tar\.zst)$`,
    ],
    artifactScope: "Stable Crush platform archives and package-manager installers",
  },
  {
    harnessId: "deepagents-code",
    includeTagPatterns: [String.raw`^deepagents-code==\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^deepagents_code-\d+\.\d+\.\d+(?:-py3-none-any\.whl|\.tar\.gz)$`],
    artifactScope: "Stable Deep Agents Code Python distributions",
  },
  {
    harnessId: "kilo-code",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^kilo-(?:darwin|linux|windows)-.+\.(?:zip|tar\.gz)$`],
    artifactScope: "Stable Kilo Code CLI platform archives",
  },
  {
    harnessId: "kimi-code",
    includeTagPatterns: [String.raw`^@moonshot-ai/kimi-code@\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^kimi-code-(?:darwin|linux|win32)-(?:arm64|x64)\.zip$`],
    artifactScope: "Stable Kimi Code CLI platform archives",
  },
  {
    harnessId: "mistral-vibe",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^vibe-(?:acp-)?(?:darwin|linux|windows)-.+\.(?:zip|tar\.gz)$`],
    artifactScope: "Stable Mistral Vibe CLI and ACP platform archives",
  },
  {
    harnessId: "opensquilla",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^opensquilla-\d+\.\d+\.\d+-py3-none-any\.whl$`],
    artifactScope: "Stable OpenSquilla Python wheels",
  },
  {
    harnessId: "poolside-cli",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^pool-(?:darwin|linux|windows)-.+\.tar\.gz$`],
    artifactScope: "Stable Poolside CLI platform archives",
  },
  {
    harnessId: "zoo-code",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^zoo-code-\d+\.\d+\.\d+\.vsix$`],
    artifactScope: "Stable Zoo Code VSIX extension archives",
  },
  {
    harnessId: "ggcode",
    includeTagPatterns: [String.raw`^v\d+\.\d+\.\d+$`],
    includePatterns: [String.raw`^ggcode_(?:darwin|linux|windows)_(?:arm64|x86_64)\.(?:tar\.gz|zip)$`],
    artifactScope: "Stable GGCode CLI platform archives",
  },
];
