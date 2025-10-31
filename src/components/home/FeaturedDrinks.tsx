"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { featuredDrinks } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function FeaturedDrinks() {
  const mainDrink = featuredDrinks.find(drink => drink.id === '1');

  return (
    <section className="py-24 sm:py-32 bg-background text-foreground">
      <div className="container mx-auto px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimateOnScroll animationType="slideInFromLeft" amount={0.4}>
            <div className="max-w-md">
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary leading-tight">
                Signature Selections
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Crafted with passion, our featured drinks represent the heart of Kopi Dua Darjat—a perfect fusion of heritage and modern artisanry.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/menu">
                    View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animationType="slideInFromRight" amount={0.4}>
            {mainDrink && (
              <div className="relative aspect-square group">
                 <Image
                  src={mainDrink.image}
                  alt={mainDrink.name}
                  fill
                  className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
