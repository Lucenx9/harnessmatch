import { GithubLogoIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { latestVerifiedAt } from "@/lib/evidence-freshness";

const repositoryUrl = "https://github.com/Lucenx9/harnessmatch";

export function SiteFooter() {
  const verifiedAt = latestVerifiedAt();

  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <Link href="/" className="brand footer-brand">
            <BrandMark />
            <strong>HarnessMatch</strong>
          </Link>
          <p>Source-backed records for inspecting AI coding harnesses.</p>
        </div>
        <div className="footer-links">
          <Link href="/data">Data</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/usage">Usage</Link>
          <Link href="/guis">GUIs</Link>
          <Link href="/privacy">Privacy</Link>
          <a
            href={repositoryUrl}
            className="footer-link-with-icon"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the HarnessMatch repository on GitHub"
          >
            <GithubLogoIcon aria-hidden="true" size={17} weight="regular" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
      <div className="shell footer-meta">
        <span>Independent. No affiliation, endorsement, or affiliate ranking.</span>
        <span className="footer-license-links">
          <a href={`${repositoryUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            Code Apache-2.0
          </a>
          <a href={`${repositoryUrl}/blob/main/LICENSE-DATA`} target="_blank" rel="noreferrer">
            Data CC BY 4.0
          </a>
        </span>
        <span>Capability data verified {verifiedAt}.</span>
      </div>
    </footer>
  );
}
