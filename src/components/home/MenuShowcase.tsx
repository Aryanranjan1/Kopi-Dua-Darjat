"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { featuredDrinks } from '@/lib/data';
import MenuItemCard from '../menu/MenuItemCard';

export default function MenuShowcase() {
  return (
    <section className="py-24 sm:py-32 bg-black text-white">
      <div className="container mx-auto px-12">
        <AnimateOnScroll animationType="slideInFromLeft">
          <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary leading-tight text-center">
            A Taste of Dua Darjat
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto text-center">
            Explore our diverse range of beverages, from timeless classics to modern creations, each telling a story of quality and passion.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-16">
          <div className="flex gap-6 overflow-x-auto pb-8 -mx-12 px-12" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {featuredDrinks.map((drink, index) => (
              <div key={index} className="min-w-[300px] flex-shrink-0">
                <MenuItemCard drink={drink} />
              </div>
            ))}
          </div>
        </AnimateOnScroll>
        
        <AnimateOnScroll animationType='fadeIn' delay={0.4} className="mt-12 text-center">
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
