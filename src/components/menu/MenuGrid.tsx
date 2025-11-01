
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { allDrinks } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import MenuItemCard from './MenuItemCard';
import { cn } from '@/lib/utils';

const filterCategories = ['All', 'Specials', 'Coffee', 'Matcha', 'Tea'];

export default function MenuGrid() {
  const [activeFilter, setActiveFilter] = useState('All');
  const heroImage = PlaceHolderImages.find((img) => img.id === 'brand-timeline');

  const filteredDrinks =
    activeFilter === 'All'
      ? allDrinks
      : allDrinks.filter((drink) => drink.tags.includes(activeFilter));

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[50vh] text-primary-foreground flex items-center justify-center text-center">
        <div className="absolute inset-0 z-[-2]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/60 z-[-1]"></div>
        <div className="container relative z-10 px-4">
          <AnimateOnScroll animationType="slideInFromBottom">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary drop-shadow-lg">
              Our Menu
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/90">
              Discover your new favorite, from heritage-inspired kopi to modern artisan creations.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Menu Grid Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          {/* Filter Buttons */}
          <AnimateOnScroll animationType="fadeIn" className="mb-12 flex justify-center flex-wrap gap-4">
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
