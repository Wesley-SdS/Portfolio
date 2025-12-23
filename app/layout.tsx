// Root layout - redirects to locale-based layout
import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout only renders on the root path
  // All other paths are handled by [locale]/layout.tsx
  return children;
}
