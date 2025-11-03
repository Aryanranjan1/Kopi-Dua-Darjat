
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type BlogPost } from '@/lib/types';
import { useMedia } from '@/lib/media';
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
import { Skeleton } from '../ui/skeleton';

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

export default function NewsContent({ allPosts }: { allPosts: BlogPost[] }) {
  const [activeSort, setActiveSort] = useState<SortOption>('Latest');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: media, isLoading: isLoadingMedia } = useMedia();

  const getPostImage = (imageUrlId: string) => {
    if (!media) return null;
    return media.find((img) => img.id === imageUrlId);
  };
  
  const allCategories = useMemo(() => {
    const tags = new Set<string>(['All']);
    allPosts.forEach(post => {
        post.tags.forEach(tag => {
            if(tag !== 'All') tags.add(tag)
        });
    });
    return Array.from(tags);
  }, [allPosts]);

  const filteredAndSortedPosts = useMemo(() => {
    let posts = allPosts;

    // Filter by search query
    if (searchQuery) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      posts = posts.filter(post => post.tags.includes(selectedCategory));
    }

    // Sort
    if (activeSort === 'Popular') {
      posts.sort((a, b) => b.popularity - a.popularity);
    } else {
      // Default to 'Latest'
      posts.sort((a, b) => new Date(b.publishDateISO).getTime() - new Date(a.publishDateISO).getTime());
    }

    return posts;
  }, [allPosts, searchQuery, selectedCategory, activeSort]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  
  const featuredPost = useMemo(() => {
    // Find a post that's not in the current paginated view if possible
    const nonPaginated = allPosts.filter(p => !paginatedPosts.some(pp => pp.id === p.id));
    return nonPaginated.length > 0 ? nonPaginated[0] : allPosts[0];
  }, [paginatedPosts, allPosts]);
  
  const featuredImage = getPostImage(featuredPost.imageUrl);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  }

  return (
    <>
      {/* Filters and Search */}
      <motion.section variants={sectionVariants} className="container mx-auto px-6 py-6 border-y border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setActiveSort('Latest')}
                className={`rounded-full ${activeSort === 'Latest' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
              >
                Latest
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveSort('Popular')}
                className={`rounded-full ${activeSort === 'Popular' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
              >
                Popular
              </Button>
               <Select onValueChange={handleCategoryChange} defaultValue="All">
                    <SelectTrigger className="w-[180px] rounded-full">
                        <SelectValue placeholder="Categories" />
                    </SelectTrigger>
                    <SelectContent>
                         {allCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                         ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search articles..."
                className="rounded-full pl-10 bg-card/50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </motion.section>

      {/* Featured Post */}
      <motion.section variants={sectionVariants} className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-headline font-bold mb-8">Featured Post</h2>
          <Link href={`/news/${featuredPost.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                {isLoadingMedia ? <Skeleton className="w-full h-full"/> : featuredImage && (
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
        </motion.section>

      {/* Latest Articles */}
      <motion.section variants={sectionVariants} className="container mx-auto px-6 py-16 border-t border-border">
          <h2 className="text-3xl font-headline font-bold mb-8">
            {selectedCategory !== 'All' ? selectedCategory : 'All Articles'}
          </h2>
          {paginatedPosts.length > 0 ? (
            <motion.div variants={gridVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => {
                const image = getPostImage(post.imageUrl);
                return (
                  <motion.div key={post.id} variants={itemVariants}>
                    <Link href={`/news/${post.slug}`} className="group block">
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                        {isLoadingMedia ? <Skeleton className="w-full h-full"/> : image && (
                          <Image
                            src={image.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                      </div>
                      <p className="font-semibold text-accent text-sm">{post.tags.filter(t => t !== 'All').join(', ')}</p>
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
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No articles found. Try a different search or category.</p>
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
