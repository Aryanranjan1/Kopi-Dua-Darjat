
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { featuredDrinks } from '@/lib/data';
import MenuItemCard from '../menu/MenuItemCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const filterCategories = ['Specials', 'Coffee', 'Matcha', 'Tea'];

export default function MenuShowcase() {
  const [activeFilter, setActiveFilter] = useState('Specials');

  const filteredDrinks = featuredDrinks.filter((drink) =>
    drink.tags.includes(activeFilter)
  );

  return (
    <section className="py-24 sm:py-32 bg-black text-white group/showcase">
      <div className="container mx-auto px-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-widest">
            MENU
          </h1>
          <div className="flex items-center gap-6">
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
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {filteredDrinks.map((drink, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
                  <MenuItemCard drink={drink} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="opacity-0 group-hover/showcase:opacity-100 transition-opacity" />
            <CarouselNext className="opacity-0 group-hover/showcase:opacity-100 transition-opacity" />
          </Carousel>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.4} className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/menu">
              View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
