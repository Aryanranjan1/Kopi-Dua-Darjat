
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
import { useEffect, useMemo, useState } from 'react';
import MenuItemCard from '../menu/MenuItemCard';

export default function FeaturedDrinks() {
  const firestore = useFirestore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([]);
  
  // Query for items marked as popular
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
  
  // A fallback query in case no items are marked as popular
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
  
  const drinksToShow = popularItems && popularItems.length > 0 ? popularItems : genericItems;
  const isLoading = isLoadingPopular || isLoadingGeneric;

  if (isLoading) {
    // You can return a skeleton loader here if you want
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

        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
          <Carousel
            opts={{
              align: 'start',
              loop: drinksToShow && drinksToShow.length > 3,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-16">
              {drinksToShow?.map((drink) => (
                <CarouselItem key={drink.id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4 overflow-visible">
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
