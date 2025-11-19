'use client';

import SiteFooter from '@/components/layout/Footer';

// This is the layout for the outlet microsites.
// It's intentionally minimal to allow each microsite to have its own identity.
export default function MicrositeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        {children}
        <SiteFooter />
    </>
    );
}
