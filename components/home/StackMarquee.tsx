import { useTranslations } from "next-intl";
import { ABOUT } from "@/src/content/about";

/**
 * Stack marquee — two endless strips right under the hero: the stack (proper nouns from
 * src/content/about.ts) and what gets built with it (messages `marquee.capabilities`).
 * Pure CSS (two copies per track, translateX -50%); pauses on hover/focus; with reduced motion
 * the strips stand still and scroll horizontally. The duplicate copy is aria-hidden.
 */
export function StackMarquee() {
  const t = useTranslations("marquee");
  const stack: readonly string[] = ABOUT.marquee;
  const capabilities = t.raw("capabilities") as string[];

  const strip = (items: readonly string[], label: string, reverse = false) => (
    <div className={reverse ? "smq smq-rev" : "smq"} role="group" aria-label={label}>
      <div className="smq-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="smq-set" aria-hidden={copy === 1 ? true : undefined}>
            {items.map((item) => (
              <li key={item} className="smq-i">
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );

  return (
    <div className="home-mq">
      {strip(stack, t("stackAria"))}
      {strip(capabilities, t("capabilitiesAria"), true)}
    </div>
  );
}
