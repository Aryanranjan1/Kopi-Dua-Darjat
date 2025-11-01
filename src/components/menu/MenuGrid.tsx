
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
      {/* Menu Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Title & Filters */}
            <AnimateOnScroll animationType="slideInFromLeft">
                <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary drop-shadow-lg mb-4">
                Our Menu
                </h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-lg">
                Discover your new favorite, from heritage-inspired kopi to modern artisan creations.
                </p>
                <div className="mt-8 flex justify-start flex-wrap gap-4">
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
                </div>
            </AnimateOnScroll>
            {/* Right side: Image */}
            <AnimateOnScroll animationType='slideInFromRight'>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
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
            </AnimateOnScroll>
          </div>

        </div>
      </section>
    </div>
  );
}
