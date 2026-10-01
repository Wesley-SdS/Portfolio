import Link from "next/link";

/**
 * Global 404 for requests that never reach app/[locale] (outside the middleware matcher).
 * The root layout is a pass-through, so this page must render its own <html>/<body>.
 * Locale pages use app/[locale]/not-found.tsx (via app/[locale]/[...rest]).
 */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          background: "#faf9f7",
          color: "#1a1a1a",
        }}
      >
        <main style={{ padding: 24, textAlign: "center" }}>
          <p style={{ font: "500 12px/16px ui-monospace, monospace", letterSpacing: ".06em", color: "#666" }}>404</p>
          <h1 style={{ margin: "8px 0 16px", fontSize: 28 }}>Página não encontrada</h1>
          <Link href="/" style={{ color: "inherit" }}>
            Voltar ao início
          </Link>
        </main>
      </body>
    </html>
  );
}
