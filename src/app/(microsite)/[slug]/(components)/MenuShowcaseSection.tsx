
'use client';

import { useState } from 'react';
import type { MenuItem } from '@/lib/types';
import { Pagination } from '@/components/shared/Pagination';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import Link from 'next/link';

const ITEMS_PER_PAGE = 12;

const DrinkCard = ({ item }: { item: MenuItem }) => (
  <Card className="rounded-lg overflow-hidden group bg-white border-black/10 transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
    <div className="relative aspect-square w-full">
      <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <CardContent className="p-4 flex flex-col flex-grow">
      <h4 className="font-headline font-bold text-lg text-black truncate">{item.name}</h4>
      <p className="text-sm text-neutral-600 line-clamp-2 mt-1 h-10 flex-grow">{item.description}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="font-semibold text-black text-lg">RM{item.price.toFixed(2)}</p>
        <Button asChild className="bg-black text-white hover:bg-neutral-800 rounded-md">
          <Link href="#">Order Now</Link>
        </Button>
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
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">
            Our Full Menu
          </h2>
          <p className="mt-2 text-lg text-neutral-600">
            Explore every drink we have to offer.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
