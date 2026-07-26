import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">H/</span>
            <strong>HarnessMatch</strong>
          </Link>
          <p>Workflow fit, verified against first-party product evidence.</p>
        </div>
        <div className="footer-links">
          <Link href="/data">Data & sources</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/benchmarks">Benchmark policy</Link>
        </div>
      </div>
      <div className="shell footer-meta">
        <span>Independent. No affiliate ranking.</span>
        <span>Capability data verified 2026-07-26.</span>
      </div>
    </footer>
  );
}
