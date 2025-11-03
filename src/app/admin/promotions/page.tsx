'use client';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PromotionsManager from './(components)/PromotionsManager';

// export const metadata: Metadata = {
//   title: 'Promotion Management',
//   description: 'Create and manage promotions for menu items and outlets.',
// };

function PromotionsPageContent() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-headline font-bold text-white">Promotion Management</h1>
            </div>
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>All Promotions</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Create, edit, and manage all promotional campaigns for your brand.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PromotionsManager />
                </CardContent>
            </Card>
        </div>
    );
}

export default function PromotionsPage() {
    return (
        <Suspense fallback={<div>Loading promotions...</div>}>
            <PromotionsPageContent />
        </Suspense>
    )
}
