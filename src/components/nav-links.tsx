"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigationItems } from "@/lib/navigation";

export function NavLinks() {
  const pathname = usePathname();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  return primaryNavigationItems.map(({ label, href }) => {
    const current = normalizedPath === href || (href === "/harnesses" && normalizedPath.startsWith("/harnesses/"));
    return (
      <Link href={href} aria-current={current ? "page" : undefined} key={href}>
        {label}
      </Link>
    );
  });
}
