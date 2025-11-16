
'use client';

import type { MenuItem } from '@/lib/types';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay"
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Star } from 'lucide-react';

const DrinkCard = ({ item }: { item: MenuItem }) => (
  <Card className="rounded-3xl overflow-hidden group bg-primary border-black/10 transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
    <div className="relative aspect-square w-full">
      <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
      {item.isPopular && <Badge className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-black shadow-md">Popular</Badge>}
    </div>
    <CardContent className="p-4 flex flex-col flex-grow text-black">
      <h4 className="font-headline font-bold text-base sm:text-lg truncate">{item.name}</h4>
      <p className="text-sm text-black/70 line-clamp-2 mt-1 flex-grow hidden sm:block">{item.description}</p>
      <div className="flex items-center gap-2 mt-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-black/80 fill-black/80" />
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="font-semibold text-black text-base sm:text-lg">RM{item.price.toFixed(2)}</p>
        <Link href="#" className="bg-black text-white rounded-full p-1.5 sm:p-2 hover:bg-neutral-800">
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default function PopularProductsCarousel({ items }: { items: MenuItem[] }) {
  if (!items || items.length === 0) return null;

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll animationType="fadeIn">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12 text-black uppercase underline decoration-primary decoration-4 underline-offset-8">
                Popular Here
            </h2>
            <Carousel
              plugins={[plugin.current]}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full relative"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="-ml-4">
                {items.map((item) => (
                  <CarouselItem key={item.id} className="basis-1/2 md:basis-1/2 lg:basis-1/4 pl-4">
                    <DrinkCard item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
            </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
