import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui-v3/Button";

/** 404 inside a locale (paper, no effects). */
export default function NotFound() {
  const t = useTranslations("notFound");
  const tm = useTranslations("meta");
  return (
    <section className="sec">
      {/* not-found cannot export generateMetadata; React 19 hoists this <title> into <head> */}
      <title>{tm("notFoundTitle")}</title>
      <div className="inner py-24">
        <p className="eb" style={{ color: "var(--accent-ink)" }}>
          {t("code")}
        </p>
        <h1 className="h2 mt-4">{t("title")}</h1>
        <p className="lead mt-4 max-w-lead">{t("text")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" arrow>
            {t("home")}
          </ButtonLink>
          <ButtonLink href="/#todos-os-produtos" variant="secondary">
            {t("products")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
