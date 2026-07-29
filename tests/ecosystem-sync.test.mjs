import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  parseGitHubRepository,
  parseGitHubReleaseDownloads,
  parseHomebrewAnalytics,
  parseJetBrainsPlugin,
  parseNpmDownloads,
  parseOpenVsxExtension,
  parseRepositoryAudits,
  parseVsCodeExtension,
  renderEcosystemSignalsFile,
  validateNpmPackageIdentity,
} from "../scripts/lib/ecosystem-signals.mjs";

const observedAt = "2026-07-28";

describe("ecosystem signal sync", () => {
  it("parses exact Homebrew base artifacts without adding HEAD variants", () => {
    const signals = parseHomebrewAnalytics({
      start_date: "2026-06-28",
      end_date: "2026-07-28",
      formulae: {
        opencode: [
          { formula: "opencode", count: "34,964" },
          { formula: "opencode --HEAD", count: "12" },
        ],
      },
    }, [{ harnessId: "opencode", artifactId: "opencode", artifactKind: "formula" }], "formula", observedAt);
    expect(signals[0]).toMatchObject({ value: 34_964, windowDays: 30, artifactKind: "formula" });
  });

  it("fails closed when package or extension identity changes", () => {
    expect(() => parseNpmDownloads({
      package: "wrong-package",
      downloads: 10,
      start: "2026-06-25",
      end: "2026-07-24",
    }, { harnessId: "codex", artifactId: "@openai/codex" }, observedAt)).toThrow(/identity changed/);

    expect(() => parseVsCodeExtension({ results: [{ extensions: [] }] }, {
      harnessId: "codex",
      artifactId: "openai.chatgpt",
    }, observedAt)).toThrow(/identity changed/);

    expect(() => validateNpmPackageIdentity({
      name: "@openai/codex",
      repository: { url: "git+https://github.com/example/not-codex.git" },
    }, {
      artifactId: "@openai/codex",
      identity: { kind: "repository", value: "https://github.com/openai/codex" },
    })).toThrow(/repository identity changed/);

    expect(() => parseOpenVsxExtension({
      namespace: "someone-else",
      name: "chatgpt",
      displayName: "Codex – OpenAI’s coding agent",
      verified: true,
      version: "1.0.0",
      downloadCount: 10,
    }, {
      harnessId: "codex",
      artifactId: "openai/chatgpt",
      displayName: "Codex – OpenAI’s coding agent",
    }, observedAt)).toThrow(/identity changed/);
  });

  it("parses exact Open VSX and JetBrains marketplace identities", () => {
    expect(parseOpenVsxExtension({
      namespace: "openai",
      name: "chatgpt",
      displayName: "Codex – OpenAI’s coding agent",
      verified: true,
      version: "26.1.0",
      downloadCount: 123,
    }, {
      harnessId: "codex",
      artifactId: "openai/chatgpt",
      displayName: "Codex – OpenAI’s coding agent",
    }, observedAt)).toMatchObject({ source: "openvsx", value: 123, latestVersion: "26.1.0" });

    expect(parseJetBrainsPlugin({
      id: 26_104,
      xmlId: "org.jetbrains.junie",
      name: "Junie, the AI coding agent by JetBrains",
      downloads: 456,
    }, {
      harnessId: "junie-cli",
      pluginId: 26_104,
      artifactId: "org.jetbrains.junie",
      name: "Junie, the AI coding agent by JetBrains",
    }, observedAt)).toMatchObject({ source: "jetbrains", value: 456, pluginId: 26_104 });
  });

  it("parses the canonical repository audit list and GitHub scope", async () => {
    const source = await readFile(new URL("../src/data/repository-audits.ts", import.meta.url), "utf8");
    const audits = parseRepositoryAudits(source);
    const signal = parseGitHubRepository({
      full_name: "openai/codex",
      stargazers_count: 100,
      forks_count: 20,
    }, audits.find((audit) => audit.harnessId === "codex"), observedAt);
    expect(signal).toMatchObject({ harnessId: "codex", value: 100, forks: 20, repositoryScope: "client-source" });
  });

  it("sums only stable GitHub release assets admitted by the mapping", () => {
    const signal = parseGitHubReleaseDownloads([
      {
        tag_name: "v1.0.0",
        published_at: "2026-07-01T10:00:00Z",
        html_url: "https://github.com/example/tool/releases/tag/v1.0.0",
        draft: false,
        prerelease: false,
        assets: [
          { id: 1, name: "tool-linux-x64.tar.gz", download_count: 100 },
          { id: 2, name: "SHA256SUMS", download_count: 80 },
        ],
      },
      {
        tag_name: "v1.1.0-beta",
        published_at: "2026-07-20T10:00:00Z",
        draft: false,
        prerelease: true,
        assets: [{ id: 3, name: "tool-linux-x64.tar.gz", download_count: 900 }],
      },
      {
        tag_name: "v0.9.0",
        published_at: "2026-03-01T10:00:00Z",
        html_url: "https://github.com/example/tool/releases/tag/v0.9.0",
        draft: false,
        prerelease: false,
        assets: [{ id: 4, name: "tool-linux-x64.tar.gz", download_count: 50 }],
      },
    ], {
      harnessId: "tool",
      includePatterns: [String.raw`^tool-.+\.(?:tar\.gz|zip)$`],
      artifactScope: "Stable tool platform archives",
    }, {
      harnessId: "tool",
      repositoryUrl: "https://github.com/example/tool",
      sourceScope: "full-source",
    }, observedAt);
    expect(signal).toMatchObject({
      source: "github-releases",
      value: 150,
      assetCount: 2,
      releaseCount: 2,
      recentReleaseCount: 1,
      recentReleaseWindowDays: 90,
      latestVersion: "v1.0.0",
      latestReleaseAt: "2026-07-01",
      latestReleaseUrl: "https://github.com/example/tool/releases/tag/v1.0.0",
    });
  });

  it("renders an explicitly context-only generated file", () => {
    const output = renderEcosystemSignalsFile([{
      source: "npm",
      metric: "downloads",
      harnessId: "codex",
      artifactId: "@openai/codex",
      value: 1,
      windowDays: 30,
      windowStart: "2026-06-25",
      windowEnd: "2026-07-24",
      observedAt,
      artifactUrl: "https://www.npmjs.com/package/@openai/codex",
      sourceUrl: "https://github.com/npm/download-counts",
    }]);
    expect(output).toContain("never affect capability claims or classification");
    expect(output).toContain('source: "npm"');
  });
});
