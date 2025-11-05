
'use client';

import { useState } from 'react';
import type { MenuItem } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import { Pagination } from '@/components/shared/Pagination';

const ITEMS_PER_PAGE = 10;

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

export default function MenuShowcaseSection({ items }: { items: MenuItem[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  return (
    <section id="menu" className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-left mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-black uppercase">
              Menu
            </h2>
            {/* Placeholder for Search, Filter, Sort controls */}
            <div className="hidden md:flex items-center gap-4">
               {/* Search/Filter/Sort components will go here */}
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
