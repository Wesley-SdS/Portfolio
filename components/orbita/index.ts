/**
 * Órbita widget (v3spec §5.11, §6.5, §8). Contract: docs/REDESIGN.md §10.3–§10.5.
 *  - OrbitaRoot       — launcher/FAB + panel/sheet; mounted once in the locale layout.
 *  - OrbitaInlineChat — an embedded chat instance (unused on the home since docs/REDESIGN.md §14).
 *  - OrbitaChat       — the 390×640 chat component (hosts size it).
 */
export { OrbitaRoot } from "./OrbitaRoot";
export { OrbitaInlineChat } from "./OrbitaInlineChat";
export { OrbitaChat, type OrbitaChatProps, type OrbitaChatHandle } from "./OrbitaChat";
