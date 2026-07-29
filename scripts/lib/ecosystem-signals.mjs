const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const sourceDefinitions = {
  homebrew: {
    sourceUrl: "https://formulae.brew.sh/docs/api/",
  },
  npm: {
    sourceUrl: "https://github.com/npm/download-counts",
  },
  vscode: {
    sourceUrl: "https://learn.microsoft.com/en-us/javascript/api/azure-devops-extension-api/eventcounts",
  },
  github: {
    sourceUrl: "https://docs.github.com/en/rest/activity/starring",
  },
};

function assertIsoDate(value, label) {
  if (!isoDatePattern.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${label} must be an ISO date`);
  }
}

function nonNegativeInteger(value, label) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`${label} must be a non-negative safe integer`);
  }
  return parsed;
}

function elapsedUtcDays(startDate, endDate) {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

export function parseHomebrewAnalytics(payload, artifacts, artifactKind, observedAt) {
  if (!payload?.formulae || typeof payload.formulae !== "object" || typeof payload.start_date !== "string" || typeof payload.end_date !== "string") {
    throw new Error(`Homebrew ${artifactKind} analytics schema is incomplete`);
  }
  assertIsoDate(payload.start_date, "Homebrew start date");
  assertIsoDate(payload.end_date, "Homebrew end date");
  assertIsoDate(observedAt, "Homebrew observation date");
  if (elapsedUtcDays(payload.start_date, payload.end_date) !== 30) {
    throw new Error(`Homebrew ${artifactKind} analytics is not the 30d dataset`);
  }

  return artifacts.map((artifact) => {
    const items = payload.formulae[artifact.artifactId];
    if (!Array.isArray(items)) {
      throw new Error(`Homebrew ${artifact.artifactId} is missing from ${artifactKind} analytics`);
    }
    const exactItems = items.filter((item) => (
      (artifactKind === "formula" ? item.formula : item.cask) === artifact.artifactId
    ));
    if (exactItems.length !== 1) {
      throw new Error(`Homebrew ${artifact.artifactId} must have exactly one base-artifact row`);
    }
    const value = nonNegativeInteger(
      String(exactItems[0].count).replaceAll(",", ""),
      `Homebrew ${artifact.artifactId} count`,
    );
    const artifactUrl = artifactKind === "formula"
      ? `https://formulae.brew.sh/formula/${artifact.artifactId}`
      : `https://formulae.brew.sh/cask/${artifact.artifactId}`;
    return {
      source: "homebrew",
      metric: "install-events",
      ...artifact,
      value,
      windowDays: 30,
      windowStart: payload.start_date,
      windowEnd: payload.end_date,
      observedAt,
      artifactUrl,
      sourceUrl: artifactKind === "formula"
        ? "https://formulae.brew.sh/api/analytics/install-on-request/homebrew-core/30d.json"
        : "https://formulae.brew.sh/api/analytics/cask-install/homebrew-cask/30d.json",
    };
  });
}

export function parseNpmDownloads(payload, artifact, observedAt) {
  if (payload?.package !== artifact.artifactId) {
    throw new Error(`npm package identity changed for ${artifact.artifactId}`);
  }
  assertIsoDate(payload.start, `npm ${artifact.artifactId} start date`);
  assertIsoDate(payload.end, `npm ${artifact.artifactId} end date`);
  assertIsoDate(observedAt, "npm observation date");
  if (elapsedUtcDays(payload.start, payload.end) !== 29) {
    throw new Error(`npm ${artifact.artifactId} window is not 30 days`);
  }
  return {
    source: "npm",
    metric: "downloads",
    ...artifact,
    value: nonNegativeInteger(payload.downloads, `npm ${artifact.artifactId} downloads`),
    windowDays: 30,
    windowStart: payload.start,
    windowEnd: payload.end,
    observedAt,
    artifactUrl: `https://www.npmjs.com/package/${artifact.artifactId}`,
    sourceUrl: `https://api.npmjs.org/downloads/point/last-month/${artifact.artifactId.split("/").map(encodeURIComponent).join("/")}`,
  };
}

function normalizedGitHubUrl(value) {
  return String(value ?? "")
    .replace(/^git\+/, "")
    .replace(/\.git$/, "")
    .replace(/#readme\/?$/i, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

export function validateNpmPackageIdentity(payload, artifact) {
  if (payload?.name !== artifact.artifactId) {
    throw new Error(`npm registry identity changed for ${artifact.artifactId}`);
  }
  if (artifact.identity.kind === "repository") {
    const repository = typeof payload.repository === "string" ? payload.repository : payload.repository?.url;
    if (normalizedGitHubUrl(repository) !== normalizedGitHubUrl(artifact.identity.value)) {
      throw new Error(`npm repository identity changed for ${artifact.artifactId}`);
    }
  } else if (artifact.identity.kind === "homepage") {
    if (!normalizedGitHubUrl(payload.homepage).startsWith(normalizedGitHubUrl(artifact.identity.value))) {
      throw new Error(`npm homepage identity changed for ${artifact.artifactId}`);
    }
  }
}

export function parseVsCodeExtension(payload, artifact, observedAt) {
  const extension = payload?.results?.[0]?.extensions?.[0];
  const canonicalId = extension ? `${extension.publisher?.publisherName}.${extension.extensionName}` : null;
  if (canonicalId?.toLowerCase() !== artifact.artifactId.toLowerCase()) {
    throw new Error(`VS Code extension identity changed for ${artifact.artifactId}`);
  }
  const install = extension.statistics?.find((statistic) => statistic.statisticName === "install")?.value;
  assertIsoDate(observedAt, "VS Code observation date");
  return {
    source: "vscode",
    metric: "installs",
    ...artifact,
    value: nonNegativeInteger(install, `VS Code ${artifact.artifactId} installs`),
    observedAt,
    artifactUrl: `https://marketplace.visualstudio.com/items?itemName=${artifact.artifactId}`,
    sourceUrl: sourceDefinitions.vscode.sourceUrl,
  };
}

export function parseGitHubRepository(payload, audit, observedAt) {
  const expectedSlug = audit.repositoryUrl.replace("https://github.com/", "");
  if (payload?.full_name?.toLowerCase() !== expectedSlug.toLowerCase()) {
    throw new Error(`GitHub repository identity changed for ${expectedSlug}`);
  }
  assertIsoDate(observedAt, "GitHub observation date");
  return {
    source: "github",
    metric: "stars",
    harnessId: audit.harnessId,
    artifactId: payload.full_name,
    value: nonNegativeInteger(payload.stargazers_count, `${expectedSlug} stars`),
    forks: nonNegativeInteger(payload.forks_count, `${expectedSlug} forks`),
    repositoryScope: audit.sourceScope,
    observedAt,
    artifactUrl: audit.repositoryUrl,
    sourceUrl: `https://api.github.com/repos/${payload.full_name}`,
  };
}

export function parseRepositoryAudits(source) {
  const recordLines = source.split("\n").filter((line) => line.trimStart().startsWith("{ harnessId:"));
  const audits = recordLines.map((line) => {
    const match = line.match(/^\s*\{ harnessId: "([^"]+)", repositoryUrl: "(https:\/\/github\.com\/[^"]+)",[\s\S]*?sourceScope: "(full-source|client-source|support-repository)"/);
    if (!match) throw new Error(`Could not parse repository audit line: ${line.slice(0, 160)}`);
    return { harnessId: match[1], repositoryUrl: match[2], sourceScope: match[3] };
  });
  if (audits.length === 0) throw new Error("No repository audits were found");
  const harnessIds = new Set(audits.map((audit) => audit.harnessId));
  if (harnessIds.size !== audits.length) throw new Error("Repository audits repeat a harness id");
  return audits;
}

function formatInteger(value) {
  return value.toLocaleString("en-US").replaceAll(",", "_");
}

function renderValue(key, value, indent) {
  if (typeof value === "number") return formatInteger(value);
  return JSON.stringify(value);
}

export function renderEcosystemSignalsFile(signals) {
  const records = signals.map((signal) => {
    const orderedKeys = [
      "source", "metric", "harnessId", "artifactId", "artifactKind", "value", "forks", "repositoryScope",
      "windowDays", "windowStart", "windowEnd", "observedAt", "artifactUrl", "sourceUrl",
    ];
    const lines = ["  {"];
    for (const key of orderedKeys) {
      if (signal[key] === undefined) continue;
      lines.push(`    ${key}: ${renderValue(key, signal[key], 4)},`);
    }
    lines.push("  },");
    return lines.join("\n");
  }).join("\n");

  return `import type { EcosystemSignalSnapshot } from "../lib/types";\n\n/**\n * Generated by \`npm run sync:ecosystem\` from the public Homebrew, npm,\n * VS Code Marketplace, and GitHub APIs. Each source keeps its native unit and\n * population. These signals never enter recommendation or capability scoring.\n */\nexport const ecosystemSignalSnapshots: EcosystemSignalSnapshot[] = [\n${records}\n];\n\nexport const ecosystemSignalsByHarness = new Map<string, EcosystemSignalSnapshot[]>();\nfor (const signal of ecosystemSignalSnapshots) {\n  const existing = ecosystemSignalsByHarness.get(signal.harnessId) ?? [];\n  existing.push(signal);\n  ecosystemSignalsByHarness.set(signal.harnessId, existing);\n}\n`;
}
