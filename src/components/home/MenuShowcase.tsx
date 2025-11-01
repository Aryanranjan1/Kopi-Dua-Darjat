
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { featuredDrinks } from '@/lib/data';
import MenuItemCard from '../menu/MenuItemCard';

const filterCategories = ['Specials', 'Coffee', 'Matcha', 'Tea'];

export default function MenuShowcase() {
  const [activeFilter, setActiveFilter] = useState('Specials');

  const filteredDrinks = featuredDrinks.filter((drink) =>
    drink.tags.includes(activeFilter)
  );

  return (
    <section className="py-24 sm:py-32 bg-black text-white">
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
          <div
            className="flex gap-6 overflow-x-auto pb-8 -mx-12 px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredDrinks.map((drink, index) => (
              <div key={index} className="min-w-[300px] flex-shrink-0">
                <MenuItemCard drink={drink} />
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.4} className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/menu">
              View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </AnimateOnScroll>
      </div>
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
