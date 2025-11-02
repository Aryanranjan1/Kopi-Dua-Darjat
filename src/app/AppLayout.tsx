
'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import SiteFooter from '@/components/layout/Footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      {children}
      {!isAdminPage && <SiteFooter />}
    </>
  );
}
