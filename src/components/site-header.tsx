import Link from "next/link";
import Image from "next/image";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          <Image
            className="brand-logo"
            src="/brand/harnessmatch-mark-64.png"
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            priority
          />
          <span>HarnessMatch</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavLinks />
        </nav>
        <Link className="header-cta" href="/recommend">Find my match</Link>
        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <NavLinks />
            <Link href="/benchmarks">Benchmark policy</Link>
          </nav>
        </details>
        <ThemeToggle />
      </div>
    </header>
  );
}
