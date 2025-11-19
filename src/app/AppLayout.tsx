
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import SiteFooter from '@/components/layout/Footer';
import { useSettings } from '@/components/layout/SettingsProvider';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isMicrositePage = /^\/[a-zA-Z0-9-]+$/.test(pathname) && pathname !== '/';


  const { settings } = useSettings();

  // Dynamically update theme colors from settings
  useEffect(() => {
    if (settings?.brand?.primaryColor && settings?.brand?.accentColor) {
      document.documentElement.style.setProperty('--primary', settings.brand.primaryColor);
      document.documentElement.style.setProperty('--accent', settings.brand.accentColor);
    }
  }, [settings]);


  return (
    <>
      {!isAdminPage && !isMicrositePage && <Header />}
      {children}
      {!isAdminPage && !isMicrositePage && <SiteFooter />}
    </>
  );
}
