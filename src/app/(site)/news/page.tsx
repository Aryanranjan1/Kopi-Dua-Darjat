
'use client';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import NewsContent from '@/components/news/NewsContent';
import { motion } from 'framer-motion';

const getPostImage = (imageUrlId: string) => {
    return PlaceHolderImages.find((img) => img.id === imageUrlId);
};

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

export default function NewsPage() {
    const heroPost = blogPosts[Math.floor(Math.random() * blogPosts.length)];
    const heroImage = getPostImage(heroPost.imageUrl);

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
                            <p className="font-semibold text-accent">{heroPost.tags[0]}</p>
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
                             {heroImage && (
                                <Image
                                    src={heroImage.imageUrl}
                                    alt={heroImage.description}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={heroImage.imageHint}
                                />
                            )}
                        </div>
                    </div>
                </motion.section>
            
                <Suspense fallback={<div>Loading content...</div>}>
                    <NewsContent allPosts={blogPosts} />
                </Suspense>
           
            </motion.div>
        </div>
         <NewsletterSignUp disableAnimations />
        </>
    );
}

