import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SmartLink, isExternalHref, type SmartLinkProps } from "./SmartLink";
import { BusyDots } from "./BusyDots";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm" | "icon";

interface CommonProps {
  /** primary = vermilion fill (acts) · secondary = outline · ghost = text on hover mat */
  variant?: ButtonVariant;
  /** md 48px · sm 40px · icon 44×44 (give it an aria-label) */
  size?: ButtonSize;
  /**
   * Trailing arrow that nudges on hover. `true` picks → (internal) or ↗ (external links).
   * Default: false for <Button>, true for internal <ButtonLink> is NOT assumed — opt in.
   */
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
}

const VARIANT: Record<ButtonVariant, string> = { primary: "btn-p", secondary: "btn-s", ghost: "btn-g" };
const SIZE: Record<ButtonSize, string> = { md: "", sm: "btn-sm", icon: "btn-icon" };

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", busy = false, className?: string) {
  return cn("btn", VARIANT[variant], SIZE[size], busy && "btn-busy", className);
}

export type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Busy state (finalSpec §4.3): --mat fill, --ink-3 text, aria-busy, clicks ignored.
     * Never lowers opacity. Pass `busyLabel` to swap the label for "Enviando …" + dots.
     */
    busy?: boolean;
    busyLabel?: ReactNode;
  };

/**
 * <Button> — the v3 `.btn` recipe as a real <button type="button"> (default).
 *
 * @example <Button variant="primary" arrow>Solicitar orçamento</Button>
 * @example <Button variant="ghost" size="icon" aria-label="Fechar"><Icon icon={X} /></Button>
 * @example <Button type="submit" busy={sending} busyLabel={t("quote.sending")}>…</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", arrow = false, busy = false, busyLabel, className, children, type, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={buttonClass(variant, size, busy, className)}
      aria-busy={busy || undefined}
      aria-disabled={busy || rest["aria-disabled"] || undefined}
      onClick={busy ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {busy && busyLabel ? (
        <>
          {busyLabel}
          <BusyDots />
        </>
      ) : (
        <>
          {children}
          {arrow && (
            <span className="arr" aria-hidden="true">
              →
            </span>
          )}
        </>
      )}
    </button>
  );
});

export type ButtonLinkProps = CommonProps & SmartLinkProps;

/**
 * <ButtonLink> — a link styled as a button (hash, route or external; see SmartLink).
 *
 * @example <ButtonLink href="#cotacao" arrow>Solicitar orçamento</ButtonLink>
 * @example <ButtonLink href="/contratar" variant="secondary" size="sm">Contratar</ButtonLink>
 */
export function ButtonLink({ variant = "primary", size = "md", arrow = false, className, children, href, ...rest }: ButtonLinkProps) {
  const ext = rest.external ?? isExternalHref(href);
  return (
    <SmartLink href={href} className={buttonClass(variant, size, false, cn(ext && arrow && "ext", className))} {...rest}>
      {children}
      {arrow && (
        <span className="arr" aria-hidden="true">
          {ext && !href.startsWith("mailto:") ? "↗" : "→"}
        </span>
      )}
    </SmartLink>
  );
}
