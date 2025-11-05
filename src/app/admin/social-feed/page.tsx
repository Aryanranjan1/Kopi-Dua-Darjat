'use client';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Instagram } from 'lucide-react';
import SocialFeedManager from './(components)/SocialFeedManager';

function SocialFeedPageContent() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
              <Instagram /> Social Feed Management
            </h1>
            
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Instagram Feed (#kopiduadarjat)</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Manage the posts that appear in the public social feed. The feed is synced automatically every 24 hours.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <SocialFeedManager />
                </CardContent>
            </Card>
        </div>
    );
}

export default function SocialFeedPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <SocialFeedPageContent />
        </Suspense>
    )
}
