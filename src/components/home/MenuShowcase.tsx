
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
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

const filterCategories = ['Specials', 'Coffee', 'Matcha', 'Tea'];

const ShowcaseCard = ({ drink }: { drink: Drink }) => (
  <Link href={`/order/${drink.slug}`} className="group block">
    <Card className="rounded-3xl bg-black overflow-visible border-zinc-800">
      <CardContent className="relative p-4 pt-32 flex flex-col items-center text-center">
        <div className="relative w-full h-80 -mt-48 mb-4">
           <Image
              src={drink.image}
              alt={drink.name}
              fill
              className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 rotate-12"
            />
        </div>
        <div className="w-full text-left">
          <h3 className="font-bold text-xl text-white truncate">{drink.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-semibold text-accent text-lg">RM{drink.price.toFixed(2)}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);


export default function MenuShowcase() {
  const [activeFilter, setActiveFilter] = useState('Specials');

  const filteredDrinks = allDrinks.filter((drink) => {
    if (activeFilter === 'Specials') {
      return drink.tags.includes('Daily Special');
    }
    return drink.tags.includes(activeFilter);
  });

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
              loop: true,
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 py-16">
              {filteredDrinks.map((drink, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4 overflow-visible">
                  <ShowcaseCard drink={drink} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/showcase:opacity-100 transition-opacity bg-transparent border-white border-2 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/showcase:opacity-100 transition-opacity bg-transparent border-white border-2 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary" />
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
