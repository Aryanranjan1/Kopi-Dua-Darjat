
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Database } from 'lucide-react';
import MigrationManager from './(components)/MigrationManager';
import DemoDataSeeder from './(components)/DemoDataSeeder';
import MasterDataSeeder from './(components)/MasterDataSeeder';
import MenuDataSeeder from './(components)/MenuDataSeeder';

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
                    These are powerful tools that can modify or delete large amounts of data. Use with extreme caution.
                </p>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DemoDataSeeder />
            <MasterDataSeeder />
            <MenuDataSeeder />
        </div>
        <MigrationManager />
    </div>
  );
}
