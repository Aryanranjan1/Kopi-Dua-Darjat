
'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OutletsManager from './(components)/OutletsManager';
import GooglePlacesSync from './(components)/GooglePlacesSync';

function OutletsPageContent() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold text-white">Outlet Management</h1>
            
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>All Outlets</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Manage all outlet locations and their microsite content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <OutletsManager />
                </CardContent>
            </Card>

            <GooglePlacesSync />
        </div>
    );
}

export default function OutletsPage() {
    return (
        <Suspense fallback={<div>Loading outlets...</div>}>
            <OutletsPageContent />
        </Suspense>
    )
}
