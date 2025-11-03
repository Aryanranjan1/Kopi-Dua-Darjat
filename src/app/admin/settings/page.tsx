'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SettingsForm from './(components)/SettingsForm';
import { Loader2 } from 'lucide-react';

function SettingsPageContent() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold text-white">Site Settings</h1>
            
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Global Configuration</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Manage all global configuration for the Kopi Dua Darjat ecosystem. Changes here will affect the entire public-facing website.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm />
                </CardContent>
            </Card>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <SettingsPageContent />
        </Suspense>
    )
}
