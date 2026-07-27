import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { latestVerifiedAt } from "@/lib/evidence-freshness";

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
          <p>Workflow fit, verified against first-party product evidence.</p>
        </div>
        <div className="footer-links">
          <Link href="/data">Data</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/benchmarks">Benchmark policy</Link>
        </div>
      </div>
      <div className="shell footer-meta">
        <span>Independent. No affiliate ranking.</span>
        <span>Capability data verified {verifiedAt}.</span>
      </div>
    </footer>
  );
}
