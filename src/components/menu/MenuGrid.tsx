
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { allDrinks } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import MenuItemCard from './MenuItemCard';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const filterCategories = ['All', 'Specials', 'Coffee', 'Matcha', 'Tea'];

export default function MenuGrid() {
  const [activeFilter, setActiveFilter] = useState('All');
  const heroImage = PlaceHolderImages.find((img) => img.id === 'brand-timeline');

  const filteredDrinks =
    activeFilter === 'All'
      ? allDrinks
      : allDrinks.filter((drink) => drink.tags.includes(activeFilter));
    
  const specialDrinks = allDrinks.filter((drink) => drink.tags.includes('Specials'));

  return (
    <div className="bg-background text-foreground">
      {/* Menu Grid Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          {/* Top Section: Title & Filters */}
          <div className="mb-12">
            <AnimateOnScroll animationType="slideInFromBottom">
                <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary drop-shadow-lg mb-4">
                Our Menu
                </h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                Discover your new favorite, from heritage-inspired kopi to modern artisan creations.
                </p>
            </AnimateOnScroll>
            <AnimateOnScroll animationType="fadeIn" className="mt-8 flex justify-start flex-wrap gap-4">
                {filterCategories.map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={cn(
                    'px-6 py-2 font-semibold rounded-full transition-colors duration-300 text-lg',
                    activeFilter === category
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-card text-card-foreground hover:bg-primary/80'
                    )}
                >
                    {category}
                </button>
                ))}
            </AnimateOnScroll>
          </div>

          {/* Specials Carousel */}
          <div className="mb-16">
            <AnimateOnScroll animationType="fadeIn">
                <h2 className="text-3xl font-headline text-foreground mb-4">Today's Specials</h2>
            </AnimateOnScroll>
            <AnimateOnScroll animationType="fadeIn" delay={0.2}>
                <Carousel
                    opts={{
                    align: 'start',
                    loop: true,
                    }}
                    className="w-full relative group/showcase"
                >
                    <CarouselContent className="-ml-4">
                    {specialDrinks.map((drink, index) => (
                        <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                            <MenuItemCard drink={drink} />
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/showcase:opacity-100 transition-opacity bg-transparent border-foreground/50 border-2 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/showcase:opacity-100 transition-opacity bg-transparent border-foreground/50 border-2 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary" />
                </Carousel>
            </AnimateOnScroll>
          </div>


          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredDrinks.map((drink, index) => (
              <AnimateOnScroll key={drink.id} animationType="fadeIn" delay={index * 0.05}>
                <MenuItemCard drink={drink} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
