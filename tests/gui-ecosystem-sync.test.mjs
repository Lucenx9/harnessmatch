import { describe, expect, it } from "vitest";
import { guiGitHubReleaseArtifacts } from "../scripts/lib/gui-ecosystem-signal-mappings.mjs";
import {
  parseGuiGitHubRepository,
  parseGuiGitHubReleaseDownloads,
  parseGuiHomebrewAnalytics,
  parseGuiRepositoryAuditSource,
  renderGuiEcosystemSignalsFile,
  validateGuiHomebrewIdentity,
} from "../scripts/lib/gui-ecosystem-signals.mjs";

const observedAt = "2026-07-29";

describe("GUI ecosystem signal sync", () => {
  const artifact = {
    guiId: "t3-code",
    artifactId: "t3-code",
    name: "T3 Code",
    homepage: "https://t3.codes/",
  };

  it("validates the exact Homebrew cask identity and keeps its current version", () => {
    const identity = {
      token: "t3-code",
      name: ["T3 Code"],
      homepage: "https://t3.codes/",
      version: "0.0.30",
    };
    expect(() => validateGuiHomebrewIdentity(identity, artifact)).not.toThrow();
    const signals = parseGuiHomebrewAnalytics({
      start_date: "2026-06-29",
      end_date: "2026-07-29",
      formulae: { "t3-code": [{ cask: "t3-code", count: "1,396" }] },
    }, [artifact], [identity], observedAt);
    expect(signals[0]).toMatchObject({
      guiId: "t3-code",
      value: 1_396,
      latestVersion: "0.0.30",
      windowDays: 30,
    });
  });

  it("fails closed when a Homebrew identity changes", () => {
    expect(() => validateGuiHomebrewIdentity({
      token: "t3-code",
      name: ["Different app"],
      homepage: "https://example.com/",
      version: "1.0.0",
    }, artifact)).toThrow(/name changed/);
  });

  it("parses the canonical GUI repository audit and GitHub scope", () => {
    const audit = parseGuiRepositoryAuditSource(`
      export const t3CodeAudit = {
        guiId: "t3-code",
        repositoryUrl: "https://github.com/pingdotgg/t3code",
        sourceScope: "full-source",
      };
    `);
    expect(audit).toEqual({
      guiId: "t3-code",
      repositoryUrl: "https://github.com/pingdotgg/t3code",
      sourceScope: "full-source",
    });
    const signal = parseGuiGitHubRepository({
      full_name: "pingdotgg/t3code",
      stargazers_count: 100,
      forks_count: 20,
    }, audit, observedAt);
    expect(signal).toMatchObject({ guiId: "t3-code", value: 100, forks: 20 });
  });

  it("counts only mapped stable GUI installer assets", () => {
    const audit = {
      guiId: "t3-code",
      repositoryUrl: "https://github.com/pingdotgg/t3code",
      sourceScope: "full-source",
    };
    const signal = parseGuiGitHubReleaseDownloads([
      {
        tag_name: "v1.0.0",
        published_at: "2026-07-20T10:00:00Z",
        html_url: "https://github.com/pingdotgg/t3code/releases/tag/v1.0.0",
        draft: false,
        prerelease: false,
        assets: [
          { id: 1, name: "T3-Code-1.0.0-arm64.dmg", download_count: 100 },
          { id: 2, name: "latest-mac.yml", download_count: 10_000 },
          { id: 3, name: "T3-Code-1.0.0-arm64.dmg.blockmap", download_count: 9_000 },
        ],
      },
      {
        tag_name: "v1.1.0-beta",
        published_at: "2026-07-25T10:00:00Z",
        html_url: "https://github.com/pingdotgg/t3code/releases/tag/v1.1.0-beta",
        draft: false,
        prerelease: true,
        assets: [{ id: 4, name: "T3-Code-1.1.0-arm64.dmg", download_count: 500 }],
      },
    ], {
      guiId: "t3-code",
      includePatterns: [String.raw`^T3-Code-(?:\d+\.){2}\d+-arm64\.dmg$`],
      artifactScope: "Stable T3 Code desktop installers",
    }, audit, observedAt);

    expect(signal).toMatchObject({
      source: "github-releases",
      guiId: "t3-code",
      value: 100,
      assetCount: 1,
      releaseCount: 1,
      latestVersion: "v1.0.0",
    });
  });

  it("rejects Maestro release-candidate tags even when GitHub does not mark them prerelease", () => {
    const mapping = guiGitHubReleaseArtifacts.find((candidate) => candidate.guiId === "maestro");
    const audit = {
      guiId: "maestro",
      repositoryUrl: "https://github.com/RunMaestro/Maestro",
      sourceScope: "full-source",
    };
    const signal = parseGuiGitHubReleaseDownloads([
      {
        tag_name: "v0.17.3",
        published_at: "2026-08-02T10:00:00Z",
        html_url: "https://github.com/RunMaestro/Maestro/releases/tag/v0.17.3",
        draft: false,
        prerelease: false,
        assets: [
          { id: 1, name: "maestro-0.17.3-arm64-mac.dmg", download_count: 100 },
          { id: 2, name: "maestro-0.17.3-arm64-mac.zip", download_count: 1_000 },
        ],
      },
      {
        tag_name: "v0.15.4-RC",
        published_at: "2026-07-25T10:00:00Z",
        html_url: "https://github.com/RunMaestro/Maestro/releases/tag/v0.15.4-RC",
        draft: false,
        prerelease: false,
        assets: [{ id: 3, name: "Maestro-0.15.4-arm64.dmg", download_count: 500 }],
      },
    ], mapping, audit, observedAt);

    expect(signal).toMatchObject({
      guiId: "maestro",
      value: 100,
      assetCount: 1,
      releaseCount: 1,
      latestVersion: "v0.17.3",
    });
  });

  it("isolates Traycer desktop releases from host, CLI, and portable assets", () => {
    const mapping = guiGitHubReleaseArtifacts.find((candidate) => candidate.guiId === "traycer");
    const audit = {
      guiId: "traycer",
      repositoryUrl: "https://github.com/traycerai/traycer",
      sourceScope: "client-source",
    };
    const signal = parseGuiGitHubReleaseDownloads([
      {
        tag_name: "desktop-v1.2.3",
        published_at: "2026-08-03T10:00:00Z",
        html_url: "https://github.com/traycerai/traycer/releases/tag/desktop-v1.2.3",
        draft: false,
        prerelease: false,
        assets: [
          { id: 1, name: "traycer-desktop-linux-amd64.deb", download_count: 100 },
          { id: 2, name: "traycer-desktop-linux-x64.zip", download_count: 1_000 },
        ],
      },
      {
        tag_name: "host-v1.2.3",
        published_at: "2026-08-04T10:00:00Z",
        html_url: "https://github.com/traycerai/traycer/releases/tag/host-v1.2.3",
        draft: false,
        prerelease: false,
        assets: [{ id: 3, name: "traycer-desktop-linux-amd64.deb", download_count: 500 }],
      },
    ], mapping, audit, observedAt);

    expect(signal).toMatchObject({
      guiId: "traycer",
      value: 100,
      assetCount: 1,
      releaseCount: 1,
      latestVersion: "desktop-v1.2.3",
    });
  });

  it("renders a source-separated, context-only generated file", () => {
    const output = renderGuiEcosystemSignalsFile([{
      source: "github",
      metric: "stars",
      guiId: "t3-code",
      artifactId: "pingdotgg/t3code",
      value: 100,
      forks: 20,
      repositoryScope: "full-source",
      observedAt,
      artifactUrl: "https://github.com/pingdotgg/t3code",
      sourceUrl: "https://api.github.com/repos/pingdotgg/t3code",
    }]);
    expect(output).toContain("never enter GUI workflow-fit results");
    expect(output).toContain('guiId: "t3-code"');
  });
});
