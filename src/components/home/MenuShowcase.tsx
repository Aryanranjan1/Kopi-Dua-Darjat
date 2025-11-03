
'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import type { MenuItem, MenuCategory, Promotion, DailySpecial } from '@/lib/types';
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
  const [activeFilter, setActiveFilter] = useState<string>('featured');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([]);

  const categoriesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuCategories'), limit(4)) : null,
    [firestore]
  );
  const { data: categories, isLoading: isLoadingCategories } = useCollection<MenuCategory>(categoriesQuery);

  const itemsQuery = useMemoFirebase(
    () => {
      if (!firestore) return null;
      let q = query(collection(firestore, 'menuItems'), where('status', '==', 'published'), limit(10));
      
      if (activeFilter && !categories?.find(c => c.id === activeFilter)) {
        q = query(q, where('tags', 'array-contains', activeFilter));
      } else if (activeFilter) {
        q = query(q, where('categoryId', '==', activeFilter));
      }
      return q;
    },
    [firestore, activeFilter, categories]
  );
  const { data: menuItems, isLoading: isLoadingItems } = useCollection<MenuItem>(itemsQuery);

  useEffect(() => {
    if (!firestore) return;
    const fetchOffers = async () => {
      const promosQuery = query(collection(firestore, 'promotions'), where('status', '==', 'active'));
      const promosSnap = await getDocs(promosQuery);
      setPromotions(promosSnap.docs.map(d => ({id: d.id, ...d.data()} as Promotion)));
      
      const specialsQuery = query(collection(firestore, 'dailySpecials'));
      const specialsSnap = await getDocs(specialsQuery);
      setDailySpecials(specialsSnap.docs.map(d => d.data() as DailySpecial));
    }
    fetchOffers();
  }, [firestore]);

  const filterOptions = useMemo(() => {
    const filters = [{ id: 'featured', name: 'Featured' }];
    if (categories) {
        filters.push(...categories.slice(0, 3));
    }
    return filters;
  }, [categories]);

  const isLoading = isLoadingCategories || isLoadingItems;

  return (
    <section className="py-24 sm:py-32 bg-black text-white group/showcase overflow-hidden">
      <div className="container mx-auto px-4 sm:px-12">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 mb-12">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-widest text-center md:text-left inline-block underline decoration-white decoration-4 underline-offset-8">
            MENU
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className="relative text-lg font-medium text-white transition-colors hover:text-primary"
              >
                {option.name}
                {activeFilter === option.id && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-16">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[450px] rounded-3xl bg-zinc-800" />)}
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
                      <MenuShowcaseCard 
                        drink={drink as MenuItem} 
                        promotions={promotions}
                        dailySpecials={dailySpecials}
                      />
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
