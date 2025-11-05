
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
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { BookOpen } from 'lucide-react';
import { useMemo } from 'react';

export default function LatestStories() {
    const firestore = useFirestore();
    // Fetch the latest published posts without server-side ordering to avoid needing a composite index.
    const blogsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'blogs'), where('status', '==', 'published'), limit(10)) : null,
      [firestore]
    );
    const { data: blogPosts, isLoading: isLoadingBlogs } = useCollection<Blog>(blogsQuery);

    const sortedBlogPosts = useMemo(() => {
        if (!blogPosts) return [];
        // Sort the posts by date on the client side
        return blogPosts
            .sort((a, b) => b.publishedAt.toDate().getTime() - a.publishedAt.toDate().getTime())
            .slice(0, 4);
    }, [blogPosts]);

    if (isLoadingBlogs) {
      return (
        <section className="py-24 sm:py-40 bg-black">
          <div className="container mx-auto px-12">
            <Skeleton className="h-12 w-1/3 mb-12 bg-zinc-800" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Skeleton className="w-full h-[600px] mb-4 bg-zinc-800" />
                <Skeleton className="h-4 w-1/4 mb-2 bg-zinc-800" />
                <Skeleton className="h-8 w-3/4 mb-2 bg-zinc-800" />
                <Skeleton className="h-4 w-1/2 mb-4 bg-zinc-800" />
                <Skeleton className="h-16 w-full bg-zinc-800" />
              </div>
              <div className="space-y-8">
                <Skeleton className="h-32 w-full bg-zinc-800" />
                <Skeleton className="h-32 w-full bg-zinc-800" />
                <Skeleton className="h-32 w-full bg-zinc-800" />
              </div>
            </div>
          </div>
        </section>
      );
    }
    
    if (!sortedBlogPosts || sortedBlogPosts.length === 0) {
      return (
          <section className="py-24 sm:py-40 bg-black">
              <div className="container mx-auto px-12">
                  <h2 className="text-4xl md:text-5xl font-headline text-white inline-block underline decoration-primary decoration-4 underline-offset-8 mb-12">Latest Stories</h2>
                  <Alert className="bg-zinc-900 border-zinc-800 text-white">
                      <BookOpen className="h-4 w-4" />
                      <AlertTitle>No Posts to Display</AlertTitle>
                      <AlertDescription className="text-zinc-400">
                          This section is ready! To see your blog posts here, make sure they are in the 'blogs' collection in Firestore and have a status of "published".
                          <div className="mt-4">
                            <Button asChild>
                                <Link href="/admin/data-seeding">Seed Sample Blog Posts</Link>
                            </Button>
                          </div>
                      </AlertDescription>
                  </Alert>
              </div>
          </section>
      )
    }

    const featuredPost = sortedBlogPosts[0];
    const otherPosts = sortedBlogPosts.slice(1, 4);

    return (
        <section className="py-24 sm:py-40 bg-black">
            <div className="container mx-auto px-12">
                <AnimateOnScroll animationType="slideInFromBottom">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-headline text-white inline-block underline decoration-primary decoration-4 underline-offset-8">Latest Stories</h2>
                        <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-accent hover:text-black">
                            <Link href="/news">Read all articles</Link>
                        </Button>
                    </div>
                </AnimateOnScroll>
                
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Featured Post */}
                    <AnimateOnScroll animationType="fadeIn">
                        <Link href={`/news/${featuredPost.slug}`} className="group block rounded-2xl p-2 transition-all hover:ring-2 hover:ring-white/50">
                            <div className="overflow-hidden rounded-2xl mb-4">
                                <Image 
                                    src={featuredPost.coverImage.url} 
                                    alt={featuredPost.title} 
                                    width={800} 
                                    height={600}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={featuredPost.coverImage.alt}
                                />
                            </div>
                            <p className="text-sm font-semibold text-accent mb-2">{featuredPost.category}</p>
                            <h3 className="text-2xl font-bold text-white mb-2 transition-colors">{featuredPost.title}</h3>
                            <p className="text-sm text-zinc-400 mb-4">
                                {featuredPost.publishedAt ? format(featuredPost.publishedAt.toDate(), 'PPP') : ''} • by {featuredPost.author.name}
                            </p>
                            <p className="text-zinc-400">{featuredPost.excerpt}</p>
                        </Link>
                    </AnimateOnScroll>

                    {/* Other Posts */}
                    <div className="space-y-8">
                        {otherPosts.map((post, index) => (
                            <AnimateOnScroll key={post.id} animationType="slideInFromRight" delay={index * 0.1}>
                                <Link href={`/news/${post.slug}`} className="group flex items-center gap-6 rounded-2xl p-2 transition-all hover:ring-2 hover:ring-white/50">
                                    <div className="relative w-32 h-32 shrink-0">
                                         <Image 
                                            src={post.coverImage.url} 
                                            alt={post.title}
                                            fill
                                            sizes="128px"
                                            className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={post.coverImage.alt}
                                         />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-accent mb-1">{post.category}</p>
                                        <h4 className="font-bold text-lg text-white transition-colors">{post.title}</h4>
                                        <p className="text-xs text-zinc-400 mt-1">
                                            {post.publishedAt ? format(post.publishedAt.toDate(), 'PPP') : ''}
                                        </p>
                                    </div>
                                </Link>
                            </AnimateOnScroll>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
