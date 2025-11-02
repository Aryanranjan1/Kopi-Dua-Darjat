
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import AppLayout from './AppLayout';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

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
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          playfairDisplay.variable,
          ptSans.variable
        )}
      >
        <FirebaseClientProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
