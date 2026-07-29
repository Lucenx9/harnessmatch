"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigationItems } from "@/lib/navigation";

type NavigationItem = {
  readonly href: string;
  readonly label: string;
};

export function NavLinks({
  items = primaryNavigationItems,
  onNavigate,
}: {
  items?: readonly NavigationItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  return items.map(({ label, href }) => {
    const current = normalizedPath === href || (href !== "/" && normalizedPath.startsWith(`${href}/`));
    return (
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        key={href}
        {...(onNavigate ? { onClick: onNavigate } : {})}
      >
        {label}
      </Link>
    );
  });
}
