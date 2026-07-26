import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  ["Recommend", "/recommend"],
  ["Compare", "/compare"],
  ["Harnesses", "/harnesses"],
  ["Sources", "/data"],
  ["Methodology", "/methodology"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="HarnessMatch home">
          <span className="brand-mark" aria-hidden="true">H/</span>
          <span>HarnessMatch</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/recommend">Find your fit</Link>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {nav.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <Link href="/benchmarks">Benchmark policy</Link>
          </nav>
        </details>
        <ThemeToggle />
      </div>
    </header>
  );
}
