/**
 * Root layout — a pass-through. <html>/<body> live in app/[locale]/layout.tsx
 * (lang per locale). The middleware redirects "/" to the default locale.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
