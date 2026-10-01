import { useTranslations } from "next-intl";

/** First tab stop: "Pular para o conteúdo" → #main (visible only on focus). */
export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a href="#main" className="skip">
      {t("skipLink")}
    </a>
  );
}
