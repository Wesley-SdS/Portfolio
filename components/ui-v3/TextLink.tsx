import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { SmartLink, isExternalHref, type SmartLinkProps } from "./SmartLink";

export type TextLinkProps = SmartLinkProps & {
  /**
   * accent = `.lnk` (--accent-ink, the one onward action per block)
   * quiet  = `.qlnk` (--ink with a --line-strong underline: GitHub, sources…)
   */
  variant?: "accent" | "quiet";
  /** trailing arrow: → internal, ↗ external. Default true. */
  arrow?: boolean;
  /** Host 500 15/20 for quiet links (the artboards set it inline); default true for quiet */
  ui?: boolean;
};

/**
 * <TextLink> — accent or quiet inline link (finalSpec §4.3).
 * External links (http/https) open in a new tab and get an sr-only
 * "(abre em nova aba)" suffix; the arrow becomes ↗ and nudges diagonally.
 *
 * @example <TextLink href="/contratar">Ver como funciona a contratação</TextLink>
 * @example <TextLink variant="quiet" href="https://github.com/Wesley-SdS">GitHub</TextLink>
 */
export function TextLink({ variant = "accent", arrow = true, ui, href, className, children, ...rest }: TextLinkProps) {
  const t = useTranslations("common");
  const ext = rest.external ?? /^(https?:)?\/\//.test(href);
  const glyph = ext || (isExternalHref(href) && !href.startsWith("mailto:")) ? "↗" : "→";
  const useUi = ui ?? variant === "quiet";
  return (
    <SmartLink
      href={href}
      className={cn(variant === "accent" ? "lnk" : "qlnk", ext && "ext", useUi && variant === "quiet" && "ui", className)}
      {...rest}
    >
      {children}
      {arrow && (
        <>
          {" "}
          <span className="arr" aria-hidden="true">
            {glyph}
          </span>
        </>
      )}
      {ext && <span className="sr"> {t("opensInNewTab")}</span>}
    </SmartLink>
  );
}
