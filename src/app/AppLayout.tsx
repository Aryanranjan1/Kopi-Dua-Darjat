
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/layout/LoadingScreen';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  // This effect runs once on the client after initial hydration
  useEffect(() => {
    // We use a short timeout to ensure all initial rendering is complete
    // before we consider the app "loaded".
    const timer = setTimeout(() => {
      setIsClientLoaded(true);
    }, 500); 
    return () => clearTimeout(timer);
  }, []);
  
  // The site is considered "loading" only on the first client-side load and not for admin pages.
  const isAppLoading = !isClientLoaded && !isAdminPage;

  return (
    <>
      <LoadingScreen isLoading={isAppLoading} />
      {/* We render children immediately, the loading screen will cover it */}
      {children}
    </>
  );
}
