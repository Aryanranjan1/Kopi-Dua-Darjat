'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { allDrinks } from '@/lib/data';
import type { Drink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PromotionCard from './PromotionCard';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

export default function MenuPromotions() {
  const [promotedDrinks, setPromotedDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    const activePromotions = allDrinks.filter(drink => drink.hasPromotion);
    const shuffled = shuffleArray(activePromotions);
    setPromotedDrinks(shuffled.slice(0, 5)); // We need 5 items for the layout
  }, []);

  if (promotedDrinks.length < 5) {
    return null; // Don't render if we don't have enough promotions
  }

  const mainPromo = promotedDrinks[0];
  const gridPromos = promotedDrinks.slice(1, 5);

  return (
    <AnimateOnScroll animationType="fadeIn" className="container mx-auto px-4 py-12 sm:py-16">
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
                <Image src={promo.image} alt="" width={100} height={100} className="object-contain" />
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
              Explore Our <span className="text-primary">Latest Offers</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Discover limited-time deals and special promotions on your favourite Kopi Dua Darjat drinks.
            </p>
          </div>
          <div className="relative z-10 mt-6">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
              <Link href={`/order/${mainPromo.slug}`}>
                Check out the {mainPromo.name} Deal <ArrowRight className="ml-2 h-4 w-4" />
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
    </AnimateOnScroll>
  );
}
