
'use client';

import SiteFooter from '@/components/layout/Footer';
import MicrositeHeader from './[slug]/(components)/MicrositeHeader';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Outlet } from '@/lib/types';
import { useParams } from 'next/navigation';


// This is the layout for the outlet microsites.
// It's intentionally minimal to allow each microsite to have its own identity.
export default function MicrositeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const outletRef = useMemoFirebase(
    () => (firestore && slug) ? doc(firestore, 'outlets', slug) : null,
    [firestore, slug]
  );
  
  const { data: outlet, isLoading } = useDoc<Outlet>(outletRef);

  return (
    <>
        {outlet && <MicrositeHeader outlet={outlet} />}
        {children}
        <SiteFooter />
    </>
    );
}

