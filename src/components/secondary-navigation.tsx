"use client";

import { CaretDownIcon } from "@phosphor-icons/react/dist/icons/CaretDown";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NavLinks } from "@/components/nav-links";
import { secondaryNavigationItems } from "@/lib/navigation";

export function SecondaryNavigation() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const containsCurrentPage = secondaryNavigationItems.some(({ href }) => (
    pathname === href || pathname.startsWith(`${href}/`)
  ));

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

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
    <details className="desktop-more-menu" data-current={containsCurrentPage || undefined} ref={detailsRef} key={pathname}>
      <summary>
        More
        <CaretDownIcon aria-hidden="true" size={13} weight="bold" />
      </summary>
      <div className="desktop-more-links">
        <NavLinks items={secondaryNavigationItems} onNavigate={closeMenu} />
      </div>
    </details>
  );
}
