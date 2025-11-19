
'use client';

import Header from '@/components/layout/Header';
import SiteFooter from '@/components/layout/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <Header />
        {children}
        <SiteFooter />
    </>
    );
}
