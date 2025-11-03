
'use client';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import { useMediaAsset } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import NewsContent from '@/components/news/NewsContent';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function NewsPageClient() {
    const firestore = useFirestore();
    const blogsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'blogs'), where('status', '==', 'published'), orderBy('publishedAt', 'desc')) : null,
      [firestore]
    );
    const { data: allPosts, isLoading } = useCollection<Blog>(blogsQuery);

    if (isLoading || !allPosts) {
      return (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
    }
    
    if (allPosts.length === 0) {
      return (
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-bold">News</h1>
          <p className="mt-4 text-lg text-muted-foreground">No news articles have been published yet. Check back soon!</p>
        </div>
      )
    }

    const heroPost = allPosts[0];

    return (
        <>
        <div className="bg-background text-foreground">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={pageVariants}
            >
                {/* Hero Section */}
                <motion.section variants={heroVariants} className="container mx-auto px-6 pt-24 pb-16">
                    <div className="bg-card/50 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                        <div className="max-w-lg">
                            <p className="font-semibold text-accent">{heroPost.category}</p>
                            <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mt-2">
                                {heroPost.title}
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                {heroPost.excerpt}
                            </p>
                            <Button asChild size="lg" className="mt-6 rounded-full">
                                <Link href={`/news/${heroPost.slug}`}>
                                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden">
                             <Image
                                src={heroPost.coverImage.url}
                                alt={heroPost.coverImage.alt || heroPost.title}
                                fill
                                className="object-cover"
                                data-ai-hint={heroPost.coverImage.alt}
                            />
                        </div>
                    </div>
                </motion.section>
            
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
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <NewsPageClient />
    </Suspense>
  )
}
