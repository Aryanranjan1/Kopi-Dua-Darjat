
'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { CtaSection } from '@/components/shared/CtaSection';
import { Pagination } from '@/components/shared/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getLocalized } from '@/lib/utils';
import { useMediaAsset } from '@/lib/media';


const POSTS_PER_PAGE = 6;

const HeroSection = () => {
    const { asset: heroImage, isLoading } = useMediaAsset('brewing-method');
    return (
        <section className="bg-primary py-24 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-headline font-bold text-primary-foreground">
                            Unlocking Insights: Your Guide to Modern Content Creation
                        </h1>
                        <p className="mt-4 text-primary-foreground/80">
                            Explore strategies, tips, and inspiration for creators, marketers, and entrepreneurs navigating the digital landscape. Stay ahead with our expert analysis and practical advice.
                        </p>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        {isLoading ? <Skeleton className="w-full h-full" /> : heroImage && (
                             <Image
                                src={heroImage.imageUrl}
                                alt={heroImage.description}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                data-ai-hint={heroImage.imageHint}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

const FeaturedPost = ({ post }: { post: Blog }) => {
    const { language } = useLanguage();
    const localizedPost = getLocalized(post, language);

    return (
    <AnimateOnScroll animationType="fadeIn">
        <div className="container mx-auto px-6 pt-16 pb-12">
             <h2 className="text-3xl font-headline font-bold mb-8">Featured Post</h2>
            <div className="bg-black rounded-2xl p-8 grid md:grid-cols-2 gap-8 items-center text-white">
                <Link href={`/news/${post.slug}`} className="relative aspect-video rounded-lg overflow-hidden group">
                    <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || localizedPost.title || ''}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={post.coverImage.alt}
                        priority
                    />
                </Link>
                <div className="max-w-lg">
                    <p className="font-semibold text-accent text-sm">{post.category}</p>
                    <h3 className="text-2xl font-headline font-bold text-white mt-2 group-hover:text-primary transition-colors">
                        <Link href={`/news/${post.slug}`}>{localizedPost.title}</Link>
                    </h3>
                    <p className="mt-4 text-base text-zinc-300 line-clamp-3">{localizedPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 mt-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{post.publishedAt ? format(post.publishedAt.toDate(), 'PPP') : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{post.author.name}</span>
                        </div>
                    </div>
                    <Button asChild variant="link" className="p-0 h-auto mt-4 text-accent">
                        <Link href={`/news/${post.slug}`}>
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    </AnimateOnScroll>
)};

const ArticleCard = ({ post }: { post: Blog }) => {
    const { language } = useLanguage();
    const localizedPost = getLocalized(post, language);

    return (
     <AnimateOnScroll animationType="fadeIn">
        <Link href={`/news/${post.slug}`} className="group block h-full">
            <div className="flex flex-col h-full bg-black text-white rounded-2xl p-6 transition-shadow hover:shadow-lg hover:shadow-primary/20">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <Image
                        src={post.coverImage.url}
                        alt={localizedPost.title || ''}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={post.coverImage.alt}
                    />
                </div>
                <p className="font-semibold text-accent text-sm">{post.category}</p>
                <h4 className="text-xl font-headline font-bold text-white mt-1 group-hover:text-primary transition-colors">
                    {localizedPost.title}
                </h4>
                 <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.publishedAt ? format(post.publishedAt.toDate(), 'PPP') : ''}</span>
                    </div>
                </div>
                 <Button asChild variant="link" className="p-0 h-auto mt-auto text-accent justify-start">
                    <span tabIndex={-1}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                </Button>
            </div>
        </Link>
    </AnimateOnScroll>
)}


function NewsPageClient() {
    const firestore = useFirestore();
    const blogsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'blogs'), orderBy('publishedAt', 'desc')) : null,
        [firestore]
    );
    const { data: allPosts, isLoading } = useCollection<Blog>(blogsQuery);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    
    const publishedPosts = useMemo(() => {
        if (!allPosts) return [];
        return allPosts.filter(post => post.status === 'published');
    }, [allPosts]);

    const allCategories = useMemo(() => {
        if (!publishedPosts) return ['All'];
        const categories = new Set<string>(['All']);
        publishedPosts.forEach(post => {
            if (post.category) categories.add(post.category);
        });
        return Array.from(categories);
    }, [publishedPosts]);
    
    const { featuredPost, otherPosts } = useMemo(() => {
        if (!publishedPosts || publishedPosts.length === 0) {
            return { featuredPost: null, otherPosts: [] };
        }
        
        const featuredCandidates = publishedPosts.filter(p => p.isFeatured);
        
        let featurePost;
        if (featuredCandidates.length > 0) {
            // Randomly select one of the featured posts
            featurePost = featuredCandidates[Math.floor(Math.random() * featuredCandidates.length)];
        } else {
            // Fallback to the most recent post
            featurePost = publishedPosts[0];
        }

        const remainingPosts = publishedPosts.filter(p => p.id !== featurePost.id);
        
        return { featuredPost: featurePost, otherPosts: remainingPosts };
    }, [publishedPosts]);

    const filteredPosts = useMemo(() => {
        let posts = otherPosts;

        if (searchQuery) {
            posts = posts.filter(post =>
                post.translations.en.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.translations.en.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            posts = posts.filter(post => post.category === selectedCategory);
        }

        return posts;
    }, [otherPosts, searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );
    
    if (isLoading || !allPosts) {
        return (
            <div className="bg-background">
                <HeroSection />
                <div className="container mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-video w-full rounded-lg" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                 </div>
                 <CtaSection />
            </div>
        );
    }
    
    if (publishedPosts.length === 0) {
        return (
            <div className="bg-background text-foreground">
                <HeroSection />
                <div className="container mx-auto px-6 py-24 text-center">
                    <h2 className="text-3xl font-bold">No Articles Yet</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        No news articles have been published yet. Check back soon!
                    </p>
                </div>
                 <CtaSection />
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground">
            <HeroSection />

            {featuredPost && <FeaturedPost post={featuredPost} />}

            <section className="container mx-auto px-6 py-16">
                <h2 className="text-3xl font-headline font-bold mb-8">Latest Articles</h2>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
                        {allCategories.map(cat => (
                             <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'ghost'}
                                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                className="rounded-full"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Input
                            placeholder="Search articles..."
                            className="rounded-full pl-10 bg-card/50"
                            value={searchQuery}
                            onChange={e => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
                
                {paginatedPosts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedPosts.map(post => (
                            <ArticleCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-lg text-muted-foreground">No articles found for your search.</p>
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </section>
            
            <CtaSection />
        </div>
    );
}

export default function NewsPage() {
    return <NewsPageClient />;
}
