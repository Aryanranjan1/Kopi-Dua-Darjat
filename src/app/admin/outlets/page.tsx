
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import OutletDataMigration from './(components)/OutletDataMigration';

export const metadata: Metadata = {
  title: 'Outlet Management',
  description: 'Manage outlets for Kopi Dua Darjat.',
};

export default function OutletsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white">Outlet Management</h1>
      <p className="text-zinc-400">
        This section is under construction. Here you will be able to manage all outlet locations, view their details, and link them to promotions.
      </p>
      <OutletDataMigration />
    </div>
  );
}
