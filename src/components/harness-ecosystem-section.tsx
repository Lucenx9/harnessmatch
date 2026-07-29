import Link from "next/link";
import type {
  EcosystemSignalSnapshot,
  HarnessReleaseSnapshot,
  OpenRouterAttributionSnapshot,
} from "@/lib/types";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const signalLabels: Record<EcosystemSignalSnapshot["source"], string> = {
  homebrew: "Homebrew 30d events",
  npm: "npm last-month downloads",
  "github-releases": "Release asset downloads",
  vscode: "VS Code installs",
  openvsx: "Open VSX downloads",
  jetbrains: "JetBrains downloads",
  github: "GitHub stars",
};

const repositoryScopeLabels = {
  "full-source": "Full-source repository",
  "client-source": "Client-source repository",
  "support-repository": "Support repository",
} as const;

function signalUnit(signal: EcosystemSignalSnapshot) {
  if (signal.source === "homebrew") return `${signal.artifactKind === "formula" ? "Formula" : "Cask"}: ${signal.artifactId}`;
  if (signal.source === "npm") return `Package: ${signal.artifactId}`;
  if (signal.source === "github-releases") return `${signal.releaseCount} stable releases; ${signal.assetCount} matched assets`;
  if (signal.source === "vscode") return `Extension: ${signal.artifactId}`;
  if (signal.source === "openvsx") return `Extension: ${signal.artifactId}; latest ${signal.latestVersion}`;
  if (signal.source === "jetbrains") return `Plugin ${signal.pluginId}: ${signal.artifactId}`;
  return `${repositoryScopeLabels[signal.repositoryScope]}; ${compactNumberFormatter.format(signal.forks)} forks`;
}

type HarnessEcosystemSectionProps = {
  releaseSnapshot: HarnessReleaseSnapshot | undefined;
  openRouterSnapshot: OpenRouterAttributionSnapshot | undefined;
  ecosystemSignals: EcosystemSignalSnapshot[];
  checkedAt: string | undefined;
};

export function HarnessEcosystemSection({
  releaseSnapshot,
  openRouterSnapshot,
  ecosystemSignals,
  checkedAt,
}: HarnessEcosystemSectionProps) {
  const openRouterMonth = openRouterSnapshot?.windows.month;
  if (!releaseSnapshot && !openRouterMonth && ecosystemSignals.length === 0) return null;

  return (
    <section className="profile-ecosystem" id="ecosystem-signals" aria-labelledby="ecosystem-signals-heading">
      <header>
        <div>
          <span>Context, not quality</span>
          <h2 id="ecosystem-signals-heading">Public ecosystem signals</h2>
          <p>Source-native observations for exact mapped artifacts and reviewed stable release trains. Different units and populations stay separate, and missing coverage is never treated as zero.</p>
        </div>
        <Link className="text-link" href="/usage">Compare all signals</Link>
      </header>
      <ul className="profile-ecosystem-metrics">
        {releaseSnapshot && (
          <li>
            <span className="profile-ecosystem-label">Latest stable release</span>
            <strong className="profile-ecosystem-value" title={`Latest stable version ${releaseSnapshot.latestVersion}`}>
              {releaseSnapshot.latestVersion}
            </strong>
            <small>
              Released {releaseSnapshot.latestReleaseAt}; {releaseSnapshot.recentReleaseCount} stable {releaseSnapshot.recentReleaseCount === 1 ? "release" : "releases"} in {releaseSnapshot.recentReleaseWindowDays} days
            </small>
            <a className="text-link" href={releaseSnapshot.latestReleaseUrl} target="_blank" rel="noreferrer">Open release</a>
          </li>
        )}
        {openRouterSnapshot && openRouterMonth && (
          <li>
            <span className="profile-ecosystem-label">OpenRouter 30d tokens</span>
            <strong className="profile-ecosystem-value" title={openRouterMonth.attributedTokens === null ? undefined : `${openRouterMonth.attributedTokens.toLocaleString("en-US")} attributed tokens`}>
              {openRouterMonth.attributedTokens === null ? "Not listed" : compactNumberFormatter.format(openRouterMonth.attributedTokens)}
            </strong>
            <small>{openRouterMonth.rank === null ? "Not ranked" : `#${openRouterMonth.rank} coding app`}; {openRouterMonth.windowStart} to {openRouterMonth.windowEnd}</small>
            <a className="text-link" href={openRouterSnapshot.sourceUrl} target="_blank" rel="noreferrer">Open app page</a>
          </li>
        )}
        {ecosystemSignals.map((signal) => (
          <li key={`${signal.source}:${signal.artifactId}`}>
            <span className="profile-ecosystem-label">{signalLabels[signal.source]}</span>
            <strong className="profile-ecosystem-value" title={`${signal.value.toLocaleString("en-US")} ${signal.metric}`}>{compactNumberFormatter.format(signal.value)}</strong>
            <small>{signalUnit(signal)}</small>
            <a className="text-link" href={signal.artifactUrl} target="_blank" rel="noreferrer">Open artifact</a>
          </li>
        ))}
      </ul>
      <footer>
        <p>Routing, package retrievals, release downloads, editor installs, and repository interest observe different populations. They are never added together and never affect capability evidence, classification, or measured results.</p>
        <div>
          <Link className="text-link" href="/methodology#eligibility">Interpretation rules</Link>
          {checkedAt && <span>Signals checked <time dateTime={checkedAt}>{checkedAt}</time></span>}
        </div>
      </footer>
    </section>
  );
}
