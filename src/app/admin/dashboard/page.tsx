
import type { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardPageClient from './DashboardPageClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin Dashboard for Kopi Dua Darjat',
};


export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-[80vh] w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
        <DashboardPageClient />
    </Suspense>
  );
}
