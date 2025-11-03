
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Blog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { CtaSection } from '@/components/shared/CtaSection';
import { Pagination } from '@/components/shared/Pagination';

const POSTS_PER_PAGE = 9;

const HeroPost = ({ post }: { post: Blog }) => (
    <AnimateOnScroll animationType="fadeIn">
        <section className="container mx-auto px-6 pt-24 pb-16">
            <div className="bg-card/50 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
                <div className="max-w-lg">
                    <p className="font-semibold text-accent">{post.category}</p>
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mt-2">
                        {post.title}
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
                    <Button asChild size="lg" className="mt-6 rounded-full">
                        <Link href={`/news/${post.slug}`}>
                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <Link href={`/news/${post.slug}`} className="relative aspect-video rounded-2xl overflow-hidden group">
                <Image
                    src={post.coverImage.url}
                    alt={post.coverImage.alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={post.coverImage.alt}
                    priority
                />
                </Link>
            </div>
        </section>
    </AnimateOnScroll>
);

function NewsPageClient() {
    const firestore = useFirestore();
    const blogsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'blogs'), where('status', '==', 'published'), orderBy('createdAt', 'desc')) : null,
        [firestore]
    );
    const { data: allPosts, isLoading } = useCollection<Blog>(blogsQuery);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const allCategories = useMemo(() => {
        if (!allPosts) return ['All'];
        const categories = new Set<string>(['All']);
        allPosts.forEach(post => {
        if (post.category) categories.add(post.category);
        });
        return Array.from(categories);
    }, [allPosts]);

    const filteredPosts = useMemo(() => {
        if (!allPosts) return [];
        let posts = allPosts.slice(1); // Exclude hero post

        if (searchQuery) {
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            posts = posts.filter(post => post.category === selectedCategory);
        }

        return posts;
    }, [allPosts, searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const heroPost = allPosts?.[0];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!allPosts || allPosts.length === 0) {
         return (
            <div className="bg-background text-foreground">
                <div className="container mx-auto px-6 py-24 text-center">
                    <h1 className="text-4xl font-bold">News</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                    No news articles have been published yet. Check back soon!
                    </p>
                </div>
                 <CtaSection />
            </div>
        );
    }

    return (
        <>
            <div className="bg-background text-foreground">
                <HeroPost post={heroPost} />

                <section className="container mx-auto px-6 py-16 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <h2 className="text-3xl font-headline font-bold">
                            {selectedCategory !== 'All' ? selectedCategory : 'All Articles'}
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <Select onValueChange={(value) => { setSelectedCategory(value); setCurrentPage(1); }} defaultValue="All">
                                <SelectTrigger className="w-full sm:w-[180px] rounded-full">
                                    <SelectValue placeholder="Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                    </div>
                    
                    {paginatedPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedPosts.map(post => (
                                <AnimateOnScroll key={post.id} animationType="fadeIn">
                                    <Link href={`/news/${post.slug}`} className="group block">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                                            <Image
                                            src={post.coverImage.url}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={post.coverImage.alt}
                                            />
                                        </div>
                                        <p className="font-semibold text-accent text-sm">{post.category}</p>
                                        <h4 className="text-xl font-headline font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h4>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                <span>{post.author.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{post.createdAt ? format(post.createdAt.toDate(), 'PPP') : ''}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimateOnScroll>
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
            </div>
            <CtaSection />
        </>
    );
}

export default function NewsPage() {
    return <NewsPageClient />;
}
