"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link, usePathname } from "@/i18n/routing";

/** Pages that own the given anchor locally (so "#id" stays on the page). */
const LOCAL_ANCHORS: Record<string, string[]> = {
  "/contratar": ["cotacao", "modelos", "main", "footer"],
};

export function useAnchorHref(anchor: string) {
  const pathname = usePathname();
  if (pathname === "/" || LOCAL_ANCHORS[pathname]?.includes(anchor) || anchor === "main" || anchor === "footer") {
    return `#${anchor}`;
  }
  return `/#${anchor}`;
}

/**
 * <HomeAnchorLink anchor="servicos"> — "#servicos" on the home page,
 * "/#servicos" (locale-aware) elsewhere. `#cotacao` stays local on /contratar.
 */
export function HomeAnchorLink({
  anchor,
  children,
  ...rest
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { anchor: string; children?: ReactNode }) {
  const href = useAnchorHref(anchor);
  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
