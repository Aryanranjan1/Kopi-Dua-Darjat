
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { MenuItem, MenuCategory, Promotion, DailySpecial } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import Link from 'next/link';
import { ArrowUpRight, Star, Search } from 'lucide-react';
import { Pagination } from '@/components/shared/Pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDiscountDisplay, getLocalized } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { useLanguage } from '../layout/LanguageProvider';

const ITEMS_PER_PAGE = 10;

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const DrinkCard = ({ item }: { item: MenuItem }) => {
  const { language } = useLanguage();
  const localized = getLocalized(item, language);
  return (
    <Card className="rounded-3xl overflow-hidden group bg-primary border-black/10 transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
      <div className="relative aspect-square w-full">
        <Image src={item.imageUrl} alt={localized.name || ''} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        {item.isPopular && <Badge className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-black shadow-md">Popular</Badge>}
      </div>
      <CardContent className="p-4 flex flex-col flex-grow text-black">
        <h4 className="font-headline font-bold text-base sm:text-lg truncate">{localized.name}</h4>
        <p className="text-sm text-black/70 line-clamp-2 mt-1 h-10 flex-grow hidden sm:block">{localized.description}</p>
        <div className="flex items-center gap-2 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black/80 fill-black/80" />
          ))}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold text-black text-base sm:text-lg">RM{item.price.toFixed(2)}</p>
          <Link href={`/outlets?item=${item.slug}`} className="bg-black text-white rounded-full p-1.5 sm:p-2 hover:bg-neutral-800">
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MenuShowcase() {
  const firestore = useFirestore();
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: categories, isLoading: isLoadingCategories } = useCollection<MenuCategory>(
    useMemoFirebase(() => firestore ? query(collection(firestore, 'menuCategories')) : null, [firestore])
  );
  
  const { data: items, isLoading: isLoadingItems } = useCollection<MenuItem>(
    useMemoFirebase(() => firestore ? query(collection(firestore, 'menuItems'), where('status', '==', 'published')) : null, [firestore])
  );

  const filteredAndSortedItems = useMemo(() => {
    if (!items) return [];

    let filtered = [...items];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.categoryId === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const localized = getLocalized(item, language);
        return localized.name?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => {
          const nameA = getLocalized(a, language).name || '';
          const nameB = getLocalized(b, language).name || '';
          return nameA.localeCompare(nameB);
        });
        break;
      case 'default':
      default:
        break;
    }
    
    return filtered;
  }, [items, searchQuery, sortOrder, selectedCategory, language]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isLoading = isLoadingCategories || isLoadingItems;

  return (
    <section id="menu" className="bg-black py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-left mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white uppercase underline decoration-primary decoration-4 underline-offset-8">
              Our Menu
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-white w-full md:w-auto">
               <div className="relative w-full sm:w-auto md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                 <Input 
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-zinc-800 border-zinc-700 w-full rounded-full"
                 />
               </div>
               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700 rounded-full">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map(cat => {
                          const localized = getLocalized(cat, language);
                          return (
                            <SelectItem key={cat.id} value={cat.id}>{localized.name}</SelectItem>
                          )
                        })}
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

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-96 rounded-3xl bg-zinc-800" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {paginatedItems.map((item, index) => (
              <AnimateOnScroll key={item.id} animationType="fadeIn" delay={index * 0.05}>
                <DrinkCard item={item} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
        
        {totalPages > 1 && (
           <div className="mt-12 flex justify-center">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
          </div>
        )}

      </div>
    </section>
  );
}
