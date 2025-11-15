'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import WebsiteContentManager from './(components)/WebsiteContentManager';

function WebsiteContentPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
              <FileText /> Website Content Management
            </h1>
            
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                     <CardTitle>Content & Media</CardTitle>
                    <CardDescription>Manage your website's static text content and uploaded media assets all in one place.</CardDescription>
                </CardHeader>
                <CardContent>
                    <WebsiteContentManager />
                </CardContent>
            </Card>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <WebsiteContentPage />
        </Suspense>
    )
}
