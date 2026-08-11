export const guiHomebrewArtifacts = [
  { guiId: "aionui", artifactId: "aionui", name: "AionUi", homepage: "https://www.aionui.com/" },
  { guiId: "conductor", artifactId: "conductor", name: "Conductor", homepage: "https://conductor.build/" },
  { guiId: "emdash", artifactId: "emdash", name: "Emdash", homepage: "https://www.emdash.sh/" },
  { guiId: "maestro", artifactId: "maestro", name: "Maestro", homepage: "https://runmaestro.ai/" },
  { guiId: "nimbalyst", artifactId: "nimbalyst", name: "Nimbalyst", homepage: "https://nimbalyst.com/" },
  { guiId: "openchamber", artifactId: "openchamber", name: "OpenChamber", homepage: "https://openchamber.dev/" },
  { guiId: "superset", artifactId: "superset", name: "Superset", homepage: "https://superset.sh/" },
  { guiId: "t3-code", artifactId: "t3-code", name: "T3 Code", homepage: "https://t3.codes/" },
];

/**
 * Stable installer assets only. Auto-update metadata, blockmaps, checksums,
 * source archives, portable zip bundles, and prereleases remain excluded.
 */
export const guiGitHubReleaseArtifacts = [
  {
    guiId: "agetor",
    includePatterns: [String.raw`^Agetor-arm64\.dmg$`],
    artifactScope: "Stable Agetor desktop installers",
  },
  {
    guiId: "aionui",
    includePatterns: [String.raw`^AionUi-(?:\d+\.){2}\d+-(?:linux-(?:amd64|arm64)\.deb|mac-(?:arm64|x64)\.dmg|win-(?:arm64|x64)\.exe)$`],
    artifactScope: "Stable AionUi desktop installers",
  },
  {
    guiId: "blackcrab",
    includePatterns: [
      String.raw`^Blackcrab_(?:\d+\.){2}\d+_(?:amd64\.(?:AppImage|deb)|universal\.dmg|x64-setup\.exe|x64_en-US\.msi)$`,
      String.raw`^Blackcrab-(?:\d+\.){2}\d+-1\.x86_64\.rpm$`,
    ],
    artifactScope: "Stable Blackcrab desktop installers",
  },
  {
    guiId: "codeg",
    includePatterns: [
      String.raw`^codeg_(?:\d+\.){2}\d+_(?:aarch64|x64)\.dmg$`,
      String.raw`^codeg_(?:\d+\.){2}\d+_(?:amd64\.AppImage|(?:amd64|arm64)\.deb|(?:arm64|x64)-setup\.exe)$`,
      String.raw`^codeg-(?:\d+\.){2}\d+-1\.(?:aarch64|x86_64)\.rpm$`,
    ],
    artifactScope: "Stable Codeg desktop installers",
  },
  {
    guiId: "emdash",
    includePatterns: [String.raw`^emdash-(?:amd64\.deb|arm64\.dmg|x64\.(?:dmg|exe|msi)|x86_64\.(?:AppImage|rpm))$`],
    artifactScope: "Stable Emdash desktop installers",
  },
  {
    guiId: "maestro",
    includeTagPatterns: [String.raw`^v(?:\d+\.){2}\d+$`],
    includePatterns: [
      String.raw`^[Mm]aestro-(?:\d+\.){2}\d+-(?:arm64|x64)-mac\.dmg$`,
      String.raw`^Maestro-(?:\d+\.){2}\d+(?:-arm64)?\.dmg$`,
      String.raw`^[Mm]aestro-(?:\d+\.){2}\d+-(?:arm64|x86_64)\.AppImage$`,
      String.raw`^Maestro-(?:\d+\.){2}\d+(?:-arm64)?\.AppImage$`,
      String.raw`^maestro[-_](?:\d+\.){2}\d+[-_](?:amd64|arm64)\.deb$`,
      String.raw`^maestro-(?:\d+\.){2}\d+(?:-|\.)(?:aarch64|x86_64)\.rpm$`,
      String.raw`^Maestro-Setup-(?:\d+\.){2}\d+(?:-x64)?\.exe$`,
    ],
    artifactScope: "Stable Maestro desktop installers",
  },
  {
    guiId: "nimbalyst",
    includePatterns: [String.raw`^Nimbalyst-(?:Linux\.AppImage|macOS(?:-(?:arm64|x64))?\.dmg|Windows(?:-(?:arm64|x64))?\.exe)$`],
    artifactScope: "Stable Nimbalyst desktop installers",
  },
  {
    guiId: "openchamber",
    includePatterns: [String.raw`^OpenChamber-(?:\d+\.){2}\d+-(?:linux-(?:arm64|x86_64)\.AppImage|mac-(?:arm64|x64)\.dmg|win-(?:arm64|x64)\.exe)$`],
    artifactScope: "Stable OpenChamber desktop installers",
  },
  {
    guiId: "openhands-agent-canvas",
    includePatterns: [
      String.raw`^Agent-Canvas-(?:\d+\.){2}\d+-arm64\.dmg$`,
      String.raw`^Agent-Canvas-Setup-(?:\d+\.){2}\d+\.exe$`,
    ],
    artifactScope: "Stable OpenHands Agent Canvas desktop installers",
  },
  {
    guiId: "superset",
    includePatterns: [
      String.raw`^Superset-(?:(?:\d+\.){2}\d+-)?(?:arm64|x64)\.dmg$`,
      String.raw`^Superset-(?:\d+\.){2}\d+\.dmg$`,
      String.raw`^Superset-(?:(?:\d+\.){2}\d+-)?x86_64\.AppImage$`,
    ],
    artifactScope: "Stable Superset desktop installers",
  },
  {
    guiId: "t3-code",
    includePatterns: [String.raw`^T3-Code-(?:\d+\.){2}\d+-(?:arm64|x64)\.(?:dmg|exe)$|^T3-Code-(?:\d+\.){2}\d+-x86_64\.AppImage$`],
    artifactScope: "Stable T3 Code desktop installers",
  },
  {
    guiId: "traycer",
    includeTagPatterns: [String.raw`^desktop-v(?:\d+\.){2}\d+$`],
    includePatterns: [
      String.raw`^traycer-desktop-(?:linux-(?:amd64\.deb|x86_64\.(?:AppImage|rpm))|macos-(?:arm64|x64)\.dmg|windows-x64\.(?:exe|msi))$`,
    ],
    artifactScope: "Stable Traycer desktop installers",
  },
];
