
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { getLocalized } from '@/lib/utils';
import { useLanguage } from '../layout/LanguageProvider';

export default function LatestStories({ content }: { content: any }) {
    const firestore = useFirestore();
    const { language } = useLanguage();

    const blogsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'blogs'), where('status', '==', 'published'), limit(10)) : null,
      [firestore]
    );
    const { data: blogPosts, isLoading: isLoadingBlogs } = useCollection<Blog>(blogsQuery);
    
    if (!content) return null;
    const { title, buttonText, buttonLink } = content;

    const sortedBlogPosts = useMemo(() => {
        if (!blogPosts) return [];
        return blogPosts
            .sort((a, b) => {
                const timeA = a.publishedAt ? a.publishedAt.toDate().getTime() : 0;
                const timeB = b.publishedAt ? b.publishedAt.toDate().getTime() : 0;
                return timeB - timeA;
            })
            .slice(0, 4);
    }, [blogPosts]);

    if (isLoadingBlogs) {
      return (
        <section className="py-24 sm:py-40 bg-black">
          <div className="container mx-auto px-6 sm:px-12">
            <Skeleton className="h-12 w-2/3 md:w-1/3 mb-12 bg-zinc-800" />
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <Skeleton className="w-full aspect-[4/3] mb-4 bg-zinc-800 rounded-2xl" />
                <Skeleton className="h-4 w-1/4 mb-2 bg-zinc-800" />
                <Skeleton className="h-8 w-3/4 mb-4 bg-zinc-800" />
                <Skeleton className="h-4 w-1/2 mb-4 bg-zinc-800" />
                <Skeleton className="h-24 w-full bg-zinc-800" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-32 w-full bg-zinc-800 rounded-2xl" />
                <Skeleton className="h-32 w-full bg-zinc-800 rounded-2xl" />
                <Skeleton className="h-32 w-full bg-zinc-800 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>
      );
    }
    
    if (!sortedBlogPosts || sortedBlogPosts.length === 0) {
      return null;
    }

    const featuredPost = sortedBlogPosts[0];
    const otherPosts = sortedBlogPosts.slice(1, 4);
    const featuredPostLocalized = getLocalized(featuredPost, language);
    
    return (
        <section className="py-24 sm:py-40 bg-black">
            <div className="container mx-auto px-6 sm:px-12">
                <AnimateOnScroll animationType="slideInFromBottom">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-headline text-white inline-block underline decoration-primary decoration-4 underline-offset-8 mb-6 sm:mb-0">{title}</h2>
                        <Button asChild variant="outline" className="rounded-full bg-transparent text-white border-white/50 hover:border-primary hover:text-primary">
                            <Link href={buttonLink || '/news'}>{buttonText}</Link>
                        </Button>
                    </div>
                </AnimateOnScroll>
                
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Featured Post */}
                    <AnimateOnScroll animationType="fadeIn">
                        <Link href={`/news/${featuredPost.slug}`} className="group block rounded-2xl p-2 transition-all hover:ring-2 hover:ring-white/50">
                            <div className="overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
                                <Image 
                                    src={featuredPost.coverImage.url} 
                                    alt={featuredPostLocalized.title || ''} 
                                    width={800} 
                                    height={600}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={featuredPost.coverImage.alt}
                                />
                            </div>
                            <p className="text-sm font-semibold text-accent mb-2">{featuredPost.category}</p>
                            <h3 className="text-2xl font-bold text-white mb-2 transition-colors group-hover:text-primary">{featuredPostLocalized.title}</h3>
                            <p className="text-sm text-zinc-400 mb-4">
                                {featuredPost.publishedAt ? format(featuredPost.publishedAt.toDate(), 'PPP') : ''} • by {featuredPost.author?.name || 'Admin'}
                            </p>
                            <p className="text-zinc-400 line-clamp-3">{featuredPostLocalized.excerpt}</p>
                        </Link>
                    </AnimateOnScroll>

                    {/* Other Posts */}
                    <div className="space-y-6">
                        {otherPosts.map((post, index) => {
                            const postLocalized = getLocalized(post, language);
                            return (
                                <AnimateOnScroll key={post.id} animationType="slideInFromRight" delay={index * 0.1}>
                                    <Link href={`/news/${post.slug}`} className="group flex items-center gap-4 sm:gap-6 rounded-2xl p-2 transition-all hover:ring-2 hover:ring-white/50">
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                                            <Image 
                                                src={post.coverImage.url} 
                                                alt={postLocalized.title || ''}
                                                fill
                                                sizes="(max-width: 640px) 96px, 128px"
                                                className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint={post.coverImage.alt}
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold text-accent mb-1">{post.category}</p>
                                            <h4 className="font-bold text-base sm:text-lg text-white transition-colors group-hover:text-primary line-clamp-2">{postLocalized.title}</h4>
                                            <p className="text-xs text-zinc-400 mt-1">
                                                {post.publishedAt ? format(post.publishedAt.toDate(), 'PPP') : ''}
                                            </p>
                                        </div>
                                    </Link>
                                </AnimateOnScroll>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
