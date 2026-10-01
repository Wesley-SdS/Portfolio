import { notFound } from "next/navigation";

/**
 * Catch-all inside a locale: any unknown path (e.g. /pagina-inexistente → /pt/pagina-inexistente
 * after the middleware rewrite) calls notFound() so it renders app/[locale]/not-found.tsx inside
 * the locale layout (header, footer, theme). Without it Next falls back to the global 404, which
 * has no <html>/<body> here (the root layout is a pass-through) and breaks hydration.
 */
export default function CatchAllNotFound() {
  notFound();
}
