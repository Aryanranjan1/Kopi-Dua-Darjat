

'use client';

import { useSettings } from '@/components/layout/SettingsProvider';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/layout/LoadingScreen';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { settings, isLoading: isSettingsLoading } = useSettings();
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Dynamically update theme colors from settings
  useEffect(() => {
    if (settings?.brand?.primaryColor && settings?.brand?.accentColor) {
      document.documentElement.style.setProperty('--primary', settings.brand.primaryColor);
      document.documentElement.style.setProperty('--accent', settings.brand.accentColor);
    }
  }, [settings]);

  // This effect runs once on the client after initial hydration
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);
  
  // The site is considered "loading" until both settings are loaded from Firebase
  // AND the client has mounted and run its initial effects.
  const isLoading = isSettingsLoading || !isClientLoaded;


  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && children}
    </>
  );
}
