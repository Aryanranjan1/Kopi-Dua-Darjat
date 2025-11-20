
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/layout/LoadingScreen';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  // This effect runs once on the client after initial hydration is complete.
  useEffect(() => {
    // We set a minimum time for the loader to be visible to ensure the animation can be seen.
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000); // Corresponds to the animation duration in LoadingScreen.

    return () => clearTimeout(timer);
  }, []);
  
  // The site is considered "loading" only on the first client-side load and not for admin pages.
  const showLoader = isInitialLoad && !isAdminPage;

  return (
    <>
      <LoadingScreen isLoading={showLoader} />
      {/* We render children immediately; the loading screen will cover it. */}
      {children}
    </>
  );
}
