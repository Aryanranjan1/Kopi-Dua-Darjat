
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

export default function LatestStories() {
    const firestore = useFirestore();
    const blogsQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'blogs'), where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(4)) : null,
      [firestore]
    );
    const { data: blogPosts, isLoading: isLoadingBlogs } = useCollection<Blog>(blogsQuery);

    if (isLoadingBlogs) {
      return (
        <section className="py-24 sm:py-40 bg-[#F7F4EF]">
          <div className="container mx-auto px-12">
            <Skeleton className="h-12 w-1/3 mb-12" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Skeleton className="w-full h-[600px] mb-4" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-8">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </section>
      );
    }
    
    if (!blogPosts || blogPosts.length === 0) {
      return null; // Or a placeholder saying "No stories yet"
    }

    const featuredPost = blogPosts[0];
    const otherPosts = blogPosts.slice(1, 4);

    return (
        <section className="py-24 sm:py-40 bg-[#F7F4EF]">
            <div className="container mx-auto px-12">
                <AnimateOnScroll animationType="slideInFromBottom">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-headline text-foreground inline-block underline decoration-primary decoration-4 underline-offset-8">Latest Stories</h2>
                        <Button asChild variant="outline" className="rounded-full border-foreground/50 hover:bg-foreground hover:text-background">
                            <Link href="/news">Read all articles</Link>
                        </Button>
                    </div>
                </AnimateOnScroll>
                
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Featured Post */}
                    <AnimateOnScroll animationType="fadeIn">
                        <Link href={`/news/${featuredPost.slug}`} className="group block rounded-2xl p-2 transition-all hover:ring-2 hover:ring-foreground/50">
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
                            <h3 className="text-2xl font-bold text-foreground mb-2 transition-colors">{featuredPost.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {featuredPost.createdAt ? format(featuredPost.createdAt.toDate(), 'PPP') : ''} • by {featuredPost.author.name}
                            </p>
                            <p className="text-muted-foreground">{featuredPost.excerpt}</p>
                        </Link>
                    </AnimateOnScroll>

                    {/* Other Posts */}
                    <div className="space-y-8">
                        {otherPosts.map((post, index) => (
                            <AnimateOnScroll key={post.id} animationType="slideInFromRight" delay={index * 0.1}>
                                <Link href={`/news/${post.slug}`} className="group flex items-center gap-6 rounded-2xl p-2 transition-all hover:ring-2 hover:ring-foreground/50">
                                    <div className="relative w-32 h-32 shrink-0">
                                         <Image 
                                            src={post.coverImage.url} 
                                            alt={post.title}
                                            fill
                                            className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={post.coverImage.alt}
                                         />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-accent mb-1">{post.category}</p>
                                        <h4 className="font-bold text-lg text-foreground transition-colors">{post.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {post.createdAt ? format(post.createdAt.toDate(), 'PPP') : ''}
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
