
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Database } from 'lucide-react';
import MigrationManager from './(components)/MigrationManager';
import DemoDataSeeder from './(components)/DemoDataSeeder';

export default function DataSeedingPage() {
  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-2"><Database />Data Migration & Seeding</h1>
        
        <Card className="bg-destructive/20 border-destructive text-destructive-foreground">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <AlertTriangle />
                    Caution: Developer Use Only
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    This area is for migrating and seeding database content. These are powerful tools that can modify or delete large amounts of data. Use with extreme caution.
                </p>
            </CardContent>
        </Card>

        <DemoDataSeeder />
        <MigrationManager />
    </div>
  );
}
