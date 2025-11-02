
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { MenuItem, MenuCategory } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import MenuShowcaseCard from './MenuShowcaseCard';
import { Skeleton } from '../ui/skeleton';


export default function MenuShowcase() {
  const firestore = useFirestore();
  const [activeFilterId, setActiveFilterId] = useState<string | 'Specials'>('Specials');

  const categoriesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuCategories'), limit(4)) : null,
    [firestore]
  );
  const { data: categories, isLoading: isLoadingCategories } = useCollection<MenuCategory>(categoriesQuery);

  const itemsQuery = useMemoFirebase(
    () => {
      if (!firestore) return null;
      let q = query(collection(firestore, 'menuItems'), where('status', '==', 'published'));
      if (activeFilterId !== 'Specials' && activeFilterId) {
        q = query(q, where('categoryId', '==', activeFilterId));
      } else if (activeFilterId === 'Specials') {
        // This is a simplification. A real "Specials" might be a tag or a separate flag.
        // We'll just fetch a few popular ones as a stand-in.
        q = query(q, limit(10));
      }
      return q;
    }, [firestore, activeFilterId]
  );
  const { data: menuItems, isLoading: isLoadingItems } = useCollection<MenuItem>(itemsQuery);

  const filterCategories = [
    { id: 'Specials', name: 'Specials' },
    ...(categories || [])
  ];

  return (
    <section className="py-24 sm:py-32 bg-black text-white group/showcase overflow-hidden">
      <div className="container mx-auto px-4 sm:px-12">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 mb-12">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-widest text-center md:text-left inline-block underline decoration-white decoration-4 underline-offset-8">
            MENU
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilterId(category.id)}
                className="relative text-lg font-medium text-white transition-colors hover:text-primary"
              >
                {category.name}
                {activeFilterId === category.id && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-16">
          {(isLoadingCategories || isLoadingItems) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[450px] rounded-3xl" />)}
            </div>
          ) : (
            <Carousel
              opts={{
                align: 'start',
                loop: menuItems && menuItems.length > 4,
                slidesToScroll: 1,
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-4 py-8">
                {menuItems?.map((drink) => (
                  <CarouselItem key={drink.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                    <div className="h-full">
                      <MenuShowcaseCard drink={drink as MenuItem} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/showcase:opacity-100 transition-opacity bg-transparent border-white border-2 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary hidden sm:flex" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/showcase:opacity-100 transition-opacity bg-transparent border-white border-2 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary hidden sm:flex" />
            </Carousel>
          )}
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.4} className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/menu">
              View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
