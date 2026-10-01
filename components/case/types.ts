import type { getTranslations } from "next-intl/server";

/** A next-intl server translator (namespaced or root). */
export type Tr = Awaited<ReturnType<typeof getTranslations>>;
