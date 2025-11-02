
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { blogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

const getPostImage = (imageUrlId: string) => {
    return PlaceHolderImages.find((img) => img.id === imageUrlId);
};

export default function LatestStories() {
    const featuredPost = blogPosts[0];
    const otherPosts = blogPosts.slice(1, 4);
  
    const featuredPostImage = getPostImage(featuredPost.imageUrl);

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
                                {featuredPostImage && (
                                    <Image 
                                        src={featuredPostImage.imageUrl} 
                                        alt={featuredPost.title} 
                                        width={800} 
                                        height={600}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={featuredPostImage.imageHint}
                                    />
                                )}
                            </div>
                            <p className="text-sm font-semibold text-accent mb-2">{featuredPost.tags[0]}</p>
                            <h3 className="text-2xl font-bold text-foreground mb-2 transition-colors">{featuredPost.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{featuredPost.publishDate} • by {featuredPost.author}</p>
                            <p className="text-muted-foreground">{featuredPost.excerpt}</p>
                        </Link>
                    </AnimateOnScroll>

                    {/* Other Posts */}
                    <div className="space-y-8">
                        {otherPosts.map((post, index) => {
                            const postImage = getPostImage(post.imageUrl);
                            return (
                                <AnimateOnScroll key={post.id} animationType="slideInFromRight" delay={index * 0.1}>
                                    <Link href={`/news/${post.slug}`} className="group flex items-center gap-6 rounded-2xl p-2 transition-all hover:ring-2 hover:ring-foreground/50">
                                        <div className="relative w-32 h-32 shrink-0">
                                            {postImage && (
                                                 <Image 
                                                    src={postImage.imageUrl} 
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                                                    data-ai-hint={postImage.imageHint}
                                                 />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-accent mb-1">{post.tags[0]}</p>
                                            <h4 className="font-bold text-lg text-foreground transition-colors">{post.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">{post.publishDate}</p>
                                        </div>
                                    </Link>
                                </AnimateOnScroll>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
