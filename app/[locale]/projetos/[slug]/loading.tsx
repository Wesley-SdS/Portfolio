"use client";

import { useTranslations } from "next-intl";

/**
 * Route loading UI for /projetos/[slug]: shown the instant a case link is clicked, while the case
 * renders — a stage-dark cover with three slow rings and a pulsing label, so the click always answers.
 */
export default function CaseLoading() {
  const t = useTranslations("common");
  return (
    <div className="cs-loading" role="status" aria-live="polite">
      <span className="cs-loading-rings" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="cs-loading-core" aria-hidden="true" />
      <p className="cs-loading-l">
        <span className="eb">{t("loadingCase")}</span>
        <span className="cs-loading-bar">
          <i />
        </span>
      </p>
    </div>
  );
}
