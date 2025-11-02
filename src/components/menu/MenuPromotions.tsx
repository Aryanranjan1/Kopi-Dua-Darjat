
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { allDrinks } from '@/lib/data';
import type { Drink } from '@/lib/types';
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

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export default function MenuPromotions() {
  const [promotedDrinks, setPromotedDrinks] = useState<Drink[]>([]);
  const [remainingPromos, setRemainingPromos] = useState<Drink[]>([]);

  useEffect(() => {
    const activePromotions = allDrinks.filter((drink) => drink.hasPromotion);
    const shuffled = shuffleArray(activePromotions);
    setPromotedDrinks(shuffled.slice(0, 5)); // We need 5 items for the layout
    setRemainingPromos(shuffled.slice(5));
  }, []);

  if (promotedDrinks.length < 5) {
    return null; // Don't render if we don't have enough promotions for the main grid
  }

  const mainPromo = promotedDrinks[0];
  const gridPromos = promotedDrinks.slice(1, 5);
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
