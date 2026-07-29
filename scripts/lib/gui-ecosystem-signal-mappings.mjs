export const guiHomebrewArtifacts = [
  { guiId: "conductor", artifactId: "conductor", name: "Conductor", homepage: "https://conductor.build/" },
  { guiId: "emdash", artifactId: "emdash", name: "Emdash", homepage: "https://www.emdash.sh/" },
  { guiId: "nimbalyst", artifactId: "nimbalyst", name: "Nimbalyst", homepage: "https://nimbalyst.com/" },
  { guiId: "superset", artifactId: "superset", name: "Superset", homepage: "https://superset.sh/" },
  { guiId: "t3-code", artifactId: "t3-code", name: "T3 Code", homepage: "https://t3.codes/" },
];

/**
 * Stable installer assets only. Auto-update metadata, blockmaps, checksums,
 * source archives, portable zip bundles, and prereleases remain excluded.
 */
export const guiGitHubReleaseArtifacts = [
  {
    guiId: "emdash",
    includePatterns: [String.raw`^emdash-(?:amd64\.deb|arm64\.dmg|x64\.(?:dmg|exe|msi)|x86_64\.(?:AppImage|rpm))$`],
    artifactScope: "Stable Emdash desktop installers",
  },
  {
    guiId: "nimbalyst",
    includePatterns: [String.raw`^Nimbalyst-(?:Linux\.AppImage|macOS(?:-(?:arm64|x64))?\.dmg|Windows(?:-(?:arm64|x64))?\.exe)$`],
    artifactScope: "Stable Nimbalyst desktop installers",
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
];
