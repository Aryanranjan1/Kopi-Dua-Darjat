
'use client';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlogPostsManager from './(components)/BlogPostsManager';

// export const metadata: Metadata = {
//   title: 'Blog Management',
//   description: 'Create and manage blog posts for Kopi Dua Darjat.',
// };

function BlogPageContent() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold text-white">Blog Management</h1>
            
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>All Posts</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Here you can create, edit, and manage all blog posts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BlogPostsManager />
                </CardContent>
            </Card>
        </div>
    );
}

export default function BlogPage() {
    return (
        <Suspense fallback={<div>Loading blog posts...</div>}>
            <BlogPageContent />
        </Suspense>
    )
}
