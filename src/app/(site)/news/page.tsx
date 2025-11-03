
'use client';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import NewsContent from '@/components/news/NewsContent';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Hero from '@/components/news/Hero';

// export const metadata: Metadata = {
//   title: 'News & Stories',
//   description: 'The latest updates, stories, and announcements from Kopi Dua Darjat.',
// };

function NewsPageClient() {
  const firestore = useFirestore();
  const blogsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'blogs'),
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc')
          )
        : null,
    [firestore]
  );
  const { data: allPosts, isLoading } = useCollection<Blog>(blogsQuery);

  if (isLoading || !allPosts) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold">News</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          No news articles have been published yet. Check back soon!
        </p>
      </div>
    );
  }

  const heroPost = allPosts[0];

  return (
    <>
      <div className="bg-background text-foreground">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <Hero post={heroPost} />
          <Suspense fallback={<div>Loading content...</div>}>
            <NewsContent allPosts={allPosts} />
          </Suspense>
        </motion.div>
      </div>
      <NewsletterSignUp disableAnimations />
    </>
  );
}

export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <NewsPageClient />
    </Suspense>
  );
}
