
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { allDrinks } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Drink } from '@/lib/types';
import MenuShowcaseCard from './MenuShowcaseCard';


const filterCategories = ['Specials', 'Coffee', 'Matcha', 'Tea'];

export default function MenuShowcase() {
  const [activeFilter, setActiveFilter] = useState('Specials');

  const filteredDrinks = allDrinks.filter((drink) => {
    if (activeFilter === 'Specials') {
      return drink.tags.includes('Daily Special');
    }
    if (activeFilter === 'Coffee') {
        return drink.tags.includes('Coffee');
    }
     if (activeFilter === 'Matcha') {
        return drink.tags.includes('Matcha');
    }
     if (activeFilter === 'Tea') {
        return drink.tags.includes('Tea');
    }
    return drink.tags.includes(activeFilter);
  });

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
                key={category}
                onClick={() => setActiveFilter(category)}
                className="relative text-lg font-medium text-white transition-colors hover:text-primary"
              >
                {category}
                {activeFilter === category && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-16">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 py-8">
              {filteredDrinks.map((drink, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                  <div className="h-full">
                    <MenuShowcaseCard drink={drink} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/showcase:opacity-100 transition-opacity bg-transparent border-white border-2 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary hidden sm:flex" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/showcase:opacity-100 transition-opacity bg-transparent border-white border-2 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary hidden sm:flex" />
          </Carousel>
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
