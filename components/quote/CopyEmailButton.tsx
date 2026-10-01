"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Check, Copy, Icon } from "@/components/ui-v3/Icon";
import { SITE } from "@/src/content/site";

/**
 * Ghost "Copiar" → "Copiado" (v2 micro-state, 2000ms) for the e-mail address.
 * Used by 05 Contato (channels row) and /contratar (#cotacao e-mail line).
 */
export function CopyEmailButton({ email = SITE.email, className, size = "md" }: { email?: string; className?: string; size?: "md" | "sm" }) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(email);
    } catch {
      /* clipboard blocked — the address stays visible next to the button */
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        className={cn("btn btn-g copy-email", size === "sm" && "btn-sm", className)}
        aria-label={t("contact.copyEmail")}
        onClick={copy}
      >
        <span className="copy-email-ic" aria-hidden="true">
          {copied ? <Icon icon={Check} size={16} className="pop-in" style={{ color: "var(--ok)" }} /> : <Icon icon={Copy} size={16} />}
        </span>
        <span className="copy-email-l">{copied ? t("common.actions.copied") : t("common.actions.copy")}</span>
      </button>
      <span className="sr" role="status" aria-live="polite">
        {copied ? t("contact.emailCopied") : ""}
      </span>
    </>
  );
}
