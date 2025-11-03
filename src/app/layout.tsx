
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import AppLayout from './AppLayout';
import { SettingsProvider } from '@/components/layout/SettingsProvider';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { initializeServerSideFirebase } from '@/firebase/server-init';
import type { SiteSettings } from '@/lib/types';


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

// This function can be called at the layout level to fetch settings
// It's a server-side function, so it runs once per request on the server.
async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        // We need a Firestore instance on the server.
        // We use a dedicated server-side helper for this.
        const { firestore } = initializeServerSideFirebase();
        const settingsDoc = await getDoc(doc(firestore, "settings", "main"));
        if (settingsDoc.exists()) {
            return settingsDoc.data() as SiteSettings;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch site settings:", error);
        return null; // Return null on error
    }
}


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings?.meta?.defaultTitle || 'Kopi Dua Darjat - Antara Warisan & Artisan',
      template: `%s | ${settings?.brand?.name || 'Kopi Dua Darjat'}`,
    },
    description: settings?.meta?.defaultDescription || 'Experience the perfect blend of heritage and artisan coffee. 50+ outlets serving quality Kopi Kampung from RM3.',
    keywords: settings?.meta?.keywords || ['Kopi Dua Darjat', 'kopi kampung', 'artisan coffee', 'malaysian cafe', 'franchise kopi'],
    icons: {
      icon: settings?.brand?.favicon || '/favicon.ico',
    },
    openGraph: {
      title: settings?.meta?.defaultTitle,
      description: settings?.meta?.defaultDescription,
      images: settings?.meta?.defaultImage ? [settings.meta.defaultImage] : [],
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          playfairDisplay.variable,
          ptSans.variable
        )}
      >
        <FirebaseClientProvider>
          <SettingsProvider>
            <AppLayout>{children}</AppLayout>
          </SettingsProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
