import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import SiteHeader from '@/components/layout/Header';
import SiteFooter from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Kopi Dua Darjat - Antara Warisan & Artisan',
    template: '%s | Kopi Dua Darjat',
  },
  description:
    'Experience the perfect blend of heritage and artisan coffee. 50+ outlets serving quality Kopi Kampung from RM3.',
  keywords: ['Kopi Dua Darjat', 'kopi kampung', 'artisan coffee', 'malaysian cafe', 'franchise kopi'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased')}
      >
        <div className="relative flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
