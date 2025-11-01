'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { allDrinks } from '@/lib/data';
import type { Drink } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PromotionCard from './PromotionCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import MenuItemCard from './MenuItemCard';

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
          {/* Left Card */}
          <Card className="rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Background decorative images */}
            <div className="absolute inset-0 z-0 opacity-20">
              {gridPromos.map((promo, index) => (
                <div
                  key={promo.id}
                  className="absolute"
                  style={{
                    top: `${10 + index * 20}%`,
                    left: `${15 + (index % 2) * 50}%`,
                    transform: `rotate(${index * 45}deg)`,
                  }}
                >
                  <Image
                    src={promo.image}
                    alt=""
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
                Explore Our <span className="text-primary">Latest Offers</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-md">
                Discover limited-time deals and special promotions on your
                favourite Kopi Dua Darjat drinks.
              </p>
            </div>
            <div className="relative z-10 mt-6">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
              >
                <Link href={`/order/${mainPromo.slug}`}>
                  Check out the {mainPromo.name} Deal{' '}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

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
            <CarouselContent className="-ml-4 py-16">
              {remainingPromos.map((drink) => (
                <CarouselItem
                  key={drink.id}
                  className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4 overflow-visible"
                >
                  <MenuItemCard drink={drink} />
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
