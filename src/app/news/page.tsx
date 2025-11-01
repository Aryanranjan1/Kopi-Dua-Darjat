
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import NewsletterSignUp from '@/components/home/NewsletterSignUp';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'News',
  description: 'News, stories, and updates from the world of Kopi Dua Darjat.',
};

const getPostImage = (imageUrlId: string) => {
    return PlaceHolderImages.find((img) => img.id === imageUrlId);
};

export default function NewsPage() {
    const featuredPost = blogPosts[0];
    const latestArticles = blogPosts.slice(1);
    const heroPost = blogPosts[3];

    const heroImage = getPostImage(heroPost.imageUrl);
    const featuredImage = getPostImage(featuredPost.imageUrl);

    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <AnimateOnScroll animationType="fadeIn">
                <section className="container mx-auto px-6 pt-24 pb-16">
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
                </section>
            </AnimateOnScroll>

            {/* Filters and Search */}
            <AnimateOnScroll animationType="fadeIn" delay={0.1}>
                <section className="container mx-auto px-6 py-6 border-y border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">Latest</Button>
                            <Button variant="ghost" className="rounded-full">Popular</Button>
                            <Button variant="ghost" className="rounded-full">Categories</Button>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Input placeholder="Search articles..." className="rounded-full pl-10 bg-card/50" />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>
                </section>
            </AnimateOnScroll>

            {/* Featured Post */}
            <AnimateOnScroll animationType="fadeIn" delay={0.2}>
                <section className="container mx-auto px-6 py-16">
                    <h2 className="text-3xl font-headline font-bold mb-8">Featured Post</h2>
                    <Link href={`/news/${featuredPost.slug}`} className="group block">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="relative aspect-video rounded-2xl overflow-hidden">
                                {featuredImage && (
                                    <Image
                                        src={featuredImage.imageUrl}
                                        alt={featuredImage.description}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={featuredImage.imageHint}
                                    />
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-accent">{featuredPost.tags[0]}</p>
                                <h3 className="text-3xl font-headline font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                                    {featuredPost.title}
                                </h3>
                                <p className="mt-4 text-muted-foreground">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{featuredPost.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{featuredPost.publishDate}</span>
                                    </div>
                                </div>
                                <span className="mt-4 inline-block font-semibold text-primary group-hover:underline">
                                    Read More <ArrowRight className="inline-block ml-1 h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </Link>
                </section>
            </AnimateOnScroll>

            {/* Latest Articles */}
            <AnimateOnScroll animationType="fadeIn" delay={0.3}>
                <section className="container mx-auto px-6 py-16 border-t border-border">
                    <h2 className="text-3xl font-headline font-bold mb-8">Latest Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestArticles.map((post) => {
                            const image = getPostImage(post.imageUrl);
                            return (
                                <Link key={post.id} href={`/news/${post.slug}`} className="group block">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                                        {image && (
                                            <Image
                                                src={image.imageUrl}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint={image.imageHint}
                                            />
                                        )}
                                    </div>
                                    <p className="font-semibold text-accent text-sm">{post.tags[0]}</p>
                                    <h4 className="text-xl font-headline font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{post.publishDate}</span>
                                        </div>
                                    </div>
                                    <span className="mt-3 inline-block text-sm font-semibold text-primary group-hover:underline">
                                        Read More
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </section>
            </AnimateOnScroll>
            
            <NewsletterSignUp disableAnimations />
        </div>
    );
}
