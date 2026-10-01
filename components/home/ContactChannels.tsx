import { useTranslations } from "next-intl";
import { CONTACT_CHANNELS } from "@/src/content/contact";
import { SITE } from "@/src/content/site";
import { StatusTag } from "@/components/ui-v3/StatusTag";
import { CopyEmailButton } from "@/components/quote/CopyEmailButton";

/**
 * 05 Contato channels (v3spec §5.10 / §6.4): one 5-column `dl` row on desktop
 * (E-MAIL with Copiar · LINKEDIN · GITHUB · ORBITMIND · STATUS); stacked on mobile.
 */
export function ContactChannels() {
  const t = useTranslations();
  return (
    <dl className="ct-chn">
      {CONTACT_CHANNELS.map((c) => (
        <div key={c.id} className={`ct-chn-i ct-chn-${c.id}`}>
          <dt>{t(`contact.channels.${c.id}.dt`)}</dt>
          <dd>
            {c.id === "email" ? (
              <>
                <a className="lnk" href={c.href!}>
                  {c.text}
                </a>
                <CopyEmailButton />
              </>
            ) : c.id === "status" ? (
              <StatusTag status="available" bare ping="loop" pingDelay="1400ms" />
            ) : c.id === "orbitmind" ? (
              // OWNER-FLAG: placeholder href until the OrbitMind site URL exists (v3spec §13 A.3)
              <a className="lnk ext" href={c.href!} title={SITE.orbitmindUrlTitle}>
                {t("contact.channels.orbitmind.dd")}&nbsp;
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : (
              <a className="lnk ext" href={c.href!} target="_blank" rel="noopener noreferrer">
                {c.text}&nbsp;
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
                <span className="sr"> {t("common.opensInNewTab")}</span>
              </a>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
