"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

const menuCategories = [
  {
    name: 'Kopi Darjat',
    image: '/image/a.png',
    description: 'Signature coffee blends.',
  },
  {
    name: 'Artisan Series',
    image: '/image/b.png',
    description: 'Hand-crafted specialty drinks.',
  },
  {
    name: 'Frappe & Smoothies',
    image: '/image/c.png',
    description: 'Cool and refreshing treats.',
  },
  {
    name: 'Non-Coffee',
    image: '/image/d.png',
    description: 'Delicious teas and more.',
  },
  {
    name: 'Light Bites',
    image: 'https://picsum.photos/seed/lightbites/600/800',
    dataAiHint: 'pastry',
    description: 'Perfectly paired pastries.',
  },
];

export default function MenuShowcase() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-12">
        <AnimateOnScroll animationType="slideInFromLeft">
          <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary leading-tight text-center">
            A Taste of Dua Darjat
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            Explore our diverse range of beverages, from timeless classics to modern creations, each telling a story of quality and passion.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-16">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {menuCategories.map((category, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="p-1">
                    <Card className="overflow-hidden group">
                      <CardContent className="relative flex aspect-[3/4] items-end justify-center p-6">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          {...(category.dataAiHint && { 'data-ai-hint': category.dataAiHint })}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                        <div className="relative z-10 text-center text-primary-foreground">
                          <h3 className="text-2xl font-headline font-bold text-primary">{category.name}</h3>
                          <p className="text-sm">{category.description}</p>
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
        
        <AnimateOnScroll animationType='fadeIn' delay={0.4} className="mt-12 text-center">
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
