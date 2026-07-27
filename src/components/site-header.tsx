import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          <BrandMark />
          <span>HarnessMatch</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavLinks />
        </nav>
        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <NavLinks />
          </nav>
        </details>
        <ThemeToggle />
      </div>
    </header>
  );
}
