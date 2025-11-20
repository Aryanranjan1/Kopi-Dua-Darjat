
"use client";

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import type { MenuItem, Promotion, DailySpecial } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { useEffect, useMemo, useState, Suspense } from 'react';
import MenuItemCard from '../menu/MenuItemCard';
import { Skeleton } from '../ui/skeleton';

export const FeaturedDrinksSkeleton = () => {
    return (
        <section className="py-24 sm:py-32 bg-[#F7F4EF] text-foreground">
            <div className="container mx-auto px-4 sm:px-12">
                <div className="text-center mb-16">
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                </div>
                <div className="relative">
                    <div className="flex -ml-4 py-16">
                        {[...Array(3)].map((_, index) => (
                             <div key={index} className="basis-1/2 md:basis-1/2 lg:basis-1/3 pl-4 overflow-visible">
                                <div className="p-1">
                                    <Skeleton className="h-[450px] w-full rounded-3xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function FeaturedDrinksContent() {
  const firestore = useFirestore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([]);
  
  const popularQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, 'menuItems'), 
      where('status', '==', 'published'),
      where('isPopular', '==', true),
      limit(6)
    ) : null,
    [firestore]
  );
  const { data: popularItems, isLoading: isLoadingPopular } = useCollection<MenuItem>(popularQuery);
  
  const genericQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, 'menuItems'), 
      where('status', '==', 'published'),
      limit(6)
    ) : null,
    [firestore]
  );
  const { data: genericItems, isLoading: isLoadingGeneric } = useCollection<MenuItem>(genericQuery);

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
  
  const drinksToShow = useMemo(() => {
    const items = popularItems && popularItems.length > 0 ? popularItems : genericItems;
    return items || [];
  }, [popularItems, genericItems]);

  const isLoading = isLoadingPopular || isLoadingGeneric;

  if (isLoading) {
    return <FeaturedDrinksSkeleton />;
  }
  
  if (drinksToShow.length === 0) {
      return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-[#F7F4EF] text-foreground">
      <div className="container mx-auto px-4 sm:px-12">
        <AnimateOnScroll animationType="fadeIn">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground tracking-wide inline-block underline decoration-primary decoration-4 underline-offset-8">
              Popular products
            </h2>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="slideInFromLeft" delay={0.2}>
          <Carousel
            opts={{
              align: 'start',
              loop: drinksToShow && drinksToShow.length > 3,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-16">
              {drinksToShow.map((drink) => (
                <CarouselItem key={drink.id} className="basis-1/2 md:basis-1/2 lg:basis-1/3 pl-4 overflow-visible">
                  <div className="p-1">
                    <MenuItemCard 
                      drink={drink}
                      promotions={promotions}
                      dailySpecials={dailySpecials}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export default function FeaturedDrinks() {
    return (
        <Suspense fallback={<FeaturedDrinksSkeleton />}>
            <FeaturedDrinksContent />
        </Suspense>
    )
}
