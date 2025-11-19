
'use client';

import { useSettings } from '@/components/layout/SettingsProvider';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
      {children}
    </>
  );
}
