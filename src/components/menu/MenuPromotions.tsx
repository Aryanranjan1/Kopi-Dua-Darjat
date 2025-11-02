
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MenuItem } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import PromotionCard from './PromotionCard';
import PromotionCarouselCard from './PromotionCarouselCard';
import BigPromotionCard from './BigPromotionCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

export default function MenuPromotions() {
  const firestore = useFirestore();

  // This logic is a placeholder for a more robust promotion system.
  // We'll fetch items that happen to have promotionIds as a proxy for "being on sale".
  const promotionsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'promotions'), where('status', '==', 'active'), limit(10)) : null,
    [firestore]
  );
  const { data: promotions, isLoading } = useCollection<MenuItem>(promotionsQuery);

  if (isLoading) {
    return (
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[450px] w-full rounded-3xl" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-[217px] w-full rounded-3xl" />
              <Skeleton className="h-[217px] w-full rounded-3xl" />
              <Skeleton className="h-[217px] w-full rounded-3xl" />
              <Skeleton className="h-[217px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!promotions || promotions.length < 5) {
    return null; // Don't render if we don't have enough promotions for the layout
  }

  const mainPromo = promotions[0];
  const gridPromos = promotions.slice(1, 5);
  const remainingPromos = promotions.slice(5);
  const showRemainingCarousel = remainingPromos.length > 0;

  return (
    <div className="py-12 sm:py-16">
      <div
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BigPromotionCard drink={mainPromo} />

          {/* Right Grid */}
          <div className="grid grid-cols-2 gap-6">
            {gridPromos.map((drink) => (
              <PromotionCard key={drink.id} drink={drink} />
            ))}
          </div>
        </div>
      </div>

      {showRemainingCarousel && (
        <div
          className="container mx-auto px-4 mt-16"
        >
          <Carousel
            opts={{
              align: 'start',
              loop: remainingPromos.length > 5,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-24">
              {remainingPromos.map((drink) => (
                <CarouselItem
                  key={drink.id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4 overflow-visible"
                >
                  <PromotionCarouselCard drink={drink} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {remainingPromos.length > 5 && (
              <>
                <CarouselPrevious className="ml-14" />
                <CarouselNext className="mr-14" />
              </>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
}
