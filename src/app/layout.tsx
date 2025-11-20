
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Montserrat, Nunito_Sans as Nunito_Sans_Condensed } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import AppLayout from './AppLayout';
import { getDoc, doc } from 'firebase/firestore';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import type { SiteSettings, Media } from '@/lib/types';
import { SettingsProvider } from '@/components/layout/SettingsProvider';
import { LanguageProvider } from '@/components/layout/LanguageProvider';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const nunitoSansCondensed = Nunito_Sans_Condensed({
  subsets: ['latin'],
  variable: '--font-nunito-sans-condensed',
  display: 'swap',
});

async function getSiteSettings(): Promise<{ settings: SiteSettings | null; faviconUrl: string | null; ogImageUrl: string | null }> {
    try {
        const { firestore } = initializeServerSideFirebase();
        const settingsDoc = await getDoc(doc(firestore, "settings", "main"));
        
        if (!settingsDoc.exists()) {
            return { settings: null, faviconUrl: null, ogImageUrl: null };
        }
        
        const settings = settingsDoc.data() as SiteSettings;
        let faviconUrl: string | null = null;
        let ogImageUrl: string | null = null;

        if (settings.brand?.favicon) {
            const svgString = settings.brand.favicon;
            const base64 = Buffer.from(svgString).toString('base64');
            faviconUrl = `data:image/svg+xml;base64,${base64}`;
        }
        if (settings.meta?.defaultImageId) {
             const ogImageDoc = await getDoc(doc(firestore, 'media', settings.meta.defaultImageId));
            if (ogImageDoc.exists()) {
                ogImageUrl = (ogImageDoc.data() as Media).imageUrl;
            }
        }
        
        return { settings, faviconUrl, ogImageUrl };
    } catch (error) {
        console.error("Failed to fetch site settings:", error);
        return { settings: null, faviconUrl: null, ogImageUrl: null };
    }
}


export async function generateMetadata(): Promise<Metadata> {
  const { settings, faviconUrl, ogImageUrl } = await getSiteSettings();

  return {
    title: {
      default: settings?.meta?.defaultTitle || 'Kopi Dua Darjat - Antara Warisan & Artisan',
      template: `%s | ${settings?.brand?.name || 'Kopi Dua Darjat'}`,
    },
    description: settings?.meta?.defaultDescription || 'Experience the perfect blend of heritage and artisan coffee. 50+ outlets serving quality Kopi Kampung from RM3.',
    keywords: settings?.meta?.keywords || ['Kopi Dua Darjat', 'kopi kampung', 'artisan coffee', 'malaysian cafe', 'franchise kopi'],
    icons: {
      icon: faviconUrl || '/favicon.ico',
    },
    openGraph: {
      title: settings?.meta?.defaultTitle,
      description: settings?.meta?.defaultDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-body antialiased overflow-x-hidden',
          montserrat.variable,
          nunitoSansCondensed.variable
        )}
      >
        <FirebaseClientProvider>
            <SettingsProvider>
              <LanguageProvider>
                <AppLayout>{children}</AppLayout>
              </LanguageProvider>
            </SettingsProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
