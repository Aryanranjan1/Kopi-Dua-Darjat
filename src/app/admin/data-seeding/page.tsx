
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertTriangle } from 'lucide-react';

export default function DataSeedingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-2"><Database />Data Management</h1>
        
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Data Seeding</CardTitle>
          <CardDescription className="text-zinc-400">
            This section previously contained tools to seed data from local files. This functionality has been removed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
            <AlertTriangle className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-300">Update Notice</h3>
              <p className="text-sm text-blue-400/80">
                To prevent data conflicts, all data seeding from local files has been disabled. Your Firestore database is now the single source of truth. All content and data should be managed directly through the admin panel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
