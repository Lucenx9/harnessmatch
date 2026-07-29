"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NavLinks } from "@/components/nav-links";
import { primaryNavigationItems, secondaryNavigationItems } from "@/lib/navigation";

export function MobileNavigation() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const menu = detailsRef.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false;
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      const menu = detailsRef.current;
      if (event.key === "Escape" && menu?.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <details className="mobile-menu" ref={detailsRef}>
      <summary>Menu</summary>
      <nav aria-label="Mobile navigation">
        <div className="mobile-nav-group">
          <span>Explore data</span>
          <NavLinks items={primaryNavigationItems} onNavigate={closeMenu} />
        </div>
        <div className="mobile-nav-group">
          <span>More</span>
          <NavLinks items={secondaryNavigationItems} onNavigate={closeMenu} />
        </div>
      </nav>
    </details>
  );
}
