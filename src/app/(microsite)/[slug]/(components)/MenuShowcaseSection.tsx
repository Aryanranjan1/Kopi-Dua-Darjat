
'use client';

import { useState, useMemo } from 'react';
import type { MenuItem, MenuCategory } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import Link from 'next/link';
import { ArrowUpRight, Star, Search } from 'lucide-react';
import { Pagination } from '@/components/shared/Pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ITEMS_PER_PAGE = 10;

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const DrinkCard = ({ item }: { item: MenuItem }) => (
  <Card className="rounded-3xl overflow-hidden group bg-[#fde047] border-black/10 transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
    <div className="relative aspect-square w-full">
      <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-4 drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
      {item.isPopular && <Badge className="absolute top-2 right-2 bg-black text-white">Popular</Badge>}
    </div>
    <CardContent className="p-4 flex flex-col flex-grow text-black">
      <h4 className="font-headline font-bold text-lg truncate">{item.name}</h4>
      <p className="text-sm text-black/70 line-clamp-2 mt-1 h-10 flex-grow">{item.description}</p>
      <div className="flex items-center gap-2 mt-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-black/80 fill-black/80" />
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="font-semibold text-black text-lg">RM{item.price.toFixed(2)}</p>
        <Link href="#" className="bg-black text-white rounded-full p-2 hover:bg-neutral-800">
            <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default function MenuShowcaseSection({ items, categories }: { items: MenuItem[]; categories: MenuCategory[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.categoryId === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sort items
    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'default':
      default:
        // Default sort is by displayOrder which is pre-sorted
        break;
    }
    
    return filtered;
  }, [items, searchQuery, sortOrder, selectedCategory]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  return (
    <section id="menu" className="bg-black py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-left mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white uppercase underline decoration-primary decoration-4 underline-offset-8">
              Menu
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-white w-full md:w-auto">
               <div className="relative w-full sm:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                 <Input 
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-zinc-800 border-zinc-700 w-full rounded-full"
                 />
               </div>
               <div className="flex gap-4 w-full sm:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700 rounded-full">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOption)}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700 rounded-full">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {paginatedItems.map((item, index) => (
            <AnimateOnScroll key={item.id} animationType="fadeIn" delay={index * 0.05}>
              <DrinkCard item={item} />
            </AnimateOnScroll>
          ))}
        </div>
        
        {totalPages > 1 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        )}

      </div>
    </section>
  );
}
