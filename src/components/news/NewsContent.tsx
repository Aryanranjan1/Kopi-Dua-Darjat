
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Blog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from './Pagination';
import { format } from 'date-fns';

const POSTS_PER_PAGE = 9;

type SortOption = 'Latest' | 'Popular';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const gridVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function NewsContent({ allPosts }: { allPosts: Blog[] }) {
  const [activeSort, setActiveSort] = useState<SortOption>('Latest');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const allCategories = useMemo(() => {
    if (!allPosts) return ['All'];
    const categories = new Set<string>(['All']);
    allPosts.forEach(post => {
      if (post.category) categories.add(post.category);
    });
    return Array.from(categories);
  }, [allPosts]);

  const filteredAndSortedPosts = useMemo(() => {
    if (!allPosts) return [];
    let posts = [...allPosts];

    // Filter by search query
    if (searchQuery) {
      posts = posts.filter(
        post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    // Sort
    if (activeSort === 'Popular') {
      posts.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      // Default to 'Latest'
      posts.sort((a, b) => (b.createdAt?.toDate().getTime() || 0) - (a.createdAt?.toDate().getTime() || 0));
    }

    return posts;
  }, [allPosts, searchQuery, selectedCategory, activeSort]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  const featuredPost = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return null;
    const nonPaginated = allPosts.filter(p => !paginatedPosts.some(pp => pp.id === p.id));
    return nonPaginated.length > 0 ? nonPaginated[0] : allPosts.find(p => p.id !== allPosts[0].id) || null;
  }, [paginatedPosts, allPosts]);


  return (
    <>
      {/* Filters and Search */}
      <motion.section
        variants={sectionVariants}
        className="container mx-auto px-6 py-6 border-y border-border"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setActiveSort('Latest')}
              className={`rounded-full ${
                activeSort === 'Latest'
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : ''
              }`}
            >
              Latest
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveSort('Popular')}
              className={`rounded-full ${
                activeSort === 'Popular'
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : ''
              }`}
            >
              Popular
            </Button>
            <Select onValueChange={handleCategoryChange} defaultValue="All">
              <SelectTrigger className="w-[180px] rounded-full">
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
          </div>
          <div className="relative w-full md:w-64">
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
      </motion.section>

      {/* Featured Post - if there's space */}
      {featuredPost && (
        <motion.section variants={sectionVariants} className="container mx-auto px-6 py-16">
            <h2 className="text-3xl font-headline font-bold mb-8">Editor's Pick</h2>
            <Link href={`/news/${featuredPost.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                   <Image
                      src={featuredPost.coverImage.url}
                      alt={featuredPost.coverImage.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={featuredPost.coverImage.alt}
                    />
                </div>
                <div>
                  <p className="font-semibold text-accent">{featuredPost.category}</p>
                  <h3 className="text-3xl font-headline font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.createdAt ? format(featuredPost.createdAt.toDate(), 'PPP') : ''}</span>
                    </div>
                  </div>
                  <span className="mt-4 inline-block font-semibold text-primary group-hover:underline">
                    Read More <ArrowRight className="inline-block ml-1 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.section>
      )}


      {/* Latest Articles */}
      <motion.section
        variants={sectionVariants}
        className="container mx-auto px-6 py-16 border-t border-border"
      >
        <h2 className="text-3xl font-headline font-bold mb-8">
          {selectedCategory !== 'All' ? selectedCategory : 'All Articles'}
        </h2>
        {paginatedPosts.length > 0 ? (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginatedPosts.map(post => (
              <motion.div key={post.id} variants={itemVariants}>
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
                  <p className="font-semibold text-accent text-sm">
                    {post.category}
                  </p>
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
                      <span>
                        {post.createdAt
                          ? format(post.createdAt.toDate(), 'PPP')
                          : ''}
                      </span>
                    </div>
                  </div>
                  <span className="mt-3 inline-block text-sm font-semibold text-primary group-hover:underline">
                    Read More
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No articles found. Try a different search or category.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </motion.section>
    </>
  );
}
