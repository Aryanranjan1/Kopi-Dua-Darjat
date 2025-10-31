"use client";

import Image from 'next/image';
import { featuredDrinks } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ShoppingBag, Star } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function FeaturedDrinks() {
  return (
    <section className="py-24 sm:py-32 bg-background text-foreground">
      <div className="container mx-auto px-12">
        <AnimateOnScroll animationType="fadeIn">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-wide">
              Popular products
            </h2>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-16">
              {featuredDrinks.map((drink, index) => (
                <CarouselItem key={drink.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="p-1">
                    <Card className="rounded-3xl bg-card overflow-visible">
                      <CardContent className="relative p-4 pt-32 flex flex-col items-center text-center">
                        <div className="relative w-full h-80 -mt-56 mb-4 group">
                          <Image
                            src={drink.image}
                            alt={drink.name}
                            fill
                            className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 rotate-12"
                          />
                        </div>
                        <div className="w-full flex justify-between items-center text-left">
                            <div className="flex-grow">
                                <h3 className="font-bold text-xl text-foreground truncate">{drink.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="font-semibold text-accent text-lg">RM{drink.price.toFixed(2)}</p>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                           <Button variant="outline" size="icon" className="rounded-full border-2 border-foreground/50 hover:bg-primary hover:border-primary shrink-0">
                             <ShoppingBag className="w-5 h-5" />
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
