"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["Recommend", "/recommend"],
  ["Compare", "/compare"],
  ["Harnesses", "/harnesses"],
  ["Data", "/data"],
  ["Benchmarks", "/benchmarks"],
  ["Methodology", "/methodology"],
] as const;

export function NavLinks() {
  const pathname = usePathname();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  return items.map(([label, href]) => {
    const current = normalizedPath === href || (href === "/harnesses" && normalizedPath.startsWith("/harnesses/"));
    return (
      <Link href={href} aria-current={current ? "page" : undefined} key={href}>
        {label}
      </Link>
    );
  });
}
