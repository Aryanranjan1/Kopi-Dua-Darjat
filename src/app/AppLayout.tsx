

'use client';

import { useSettings } from '@/components/layout/SettingsProvider';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/layout/LoadingScreen';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(true);

  // Dynamically update theme colors from settings
  useEffect(() => {
    if (settings?.brand?.primaryColor && settings?.brand?.accentColor) {
      document.documentElement.style.setProperty('--primary', settings.brand.primaryColor);
      document.documentElement.style.setProperty('--accent', settings.brand.accentColor);
    }
  }, [settings]);

  // Hide loading screen after initial mount and a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && children}
    </>
  );
}
