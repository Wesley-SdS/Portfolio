import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/routing";

export type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** force external behaviour (target=_blank + rel); auto for http(s) URLs */
  external?: boolean;
  children?: ReactNode;
};

export const isExternalHref = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");

/**
 * One link primitive for the whole site:
 * - "#anchor"         → plain <a> (same page)
 * - "/route", "/#id"  → next-intl <Link> (keeps the current locale)
 * - "https://…"       → <a target="_blank" rel="noopener noreferrer">
 * - "mailto:"         → plain <a>
 * Placeholder hrefs like "#URL-DO-SITE-DA-ORBITMIND" are plain anchors.
 */
export function SmartLink({ href, external, children, ...rest }: SmartLinkProps) {
  const ext = external ?? /^(https?:)?\/\//.test(href);
  if (ext) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
