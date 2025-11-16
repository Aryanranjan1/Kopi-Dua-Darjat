
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DataSeedingPage() {
  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-headline font-bold text-white">Master Data Seeding Tool</h1>
        
        <Card className="bg-destructive/20 border-destructive text-destructive-foreground">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <AlertTriangle />
                    Caution: Developer Use Only
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    This area is intended for development and maintenance purposes only. The tools previously here were for seeding sample data and have been removed. Any further operations in this section should be performed with extreme caution.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
