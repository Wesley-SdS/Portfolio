import { SITE } from "./site";

/**
 * Contact channels row (v3spec §5.10). Label: contact.channels.<id>.{dt, dd?}.
 * `copy: true` → render the ghost "Copiar" button with the 2000ms micro-state.
 */
export const CONTACT_CHANNELS = [
  { id: "email", href: `mailto:${SITE.email}`, text: SITE.email, external: false, copy: true },
  { id: "linkedin", href: SITE.linkedin, text: SITE.linkedinLabel, external: true, copy: false },
  { id: "github", href: SITE.github, text: SITE.githubLabel, external: true, copy: false },
  { id: "orbitmind", href: SITE.orbitmindUrl, text: null, external: true, copy: false },
  { id: "status", href: null, text: null, external: false, copy: false },
] as const;

export type ContactChannelId = (typeof CONTACT_CHANNELS)[number]["id"];
