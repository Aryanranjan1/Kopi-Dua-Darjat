
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Database } from 'lucide-react';
import MasterDataSeeder from './(components)/MasterDataSeeder';

export default function DataSeedingPage() {
  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-2"><Database />Master Data Seeding</h1>
        
        <Card className="bg-destructive/20 border-destructive text-destructive-foreground">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <AlertTriangle />
                    Caution: Developer Use Only
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    This area is intended for development and maintenance purposes. The tools here perform destructive actions like deleting all data in a collection before reseeding it. Use with extreme caution.
                </p>
            </CardContent>
        </Card>

        <MasterDataSeeder />
    </div>
  );
}
