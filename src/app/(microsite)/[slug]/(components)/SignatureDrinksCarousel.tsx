
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

const DrinkCard = ({ item }: { item: MenuItem }) => (
  <Link href={`/menu#${item.slug}`} className="block group">
    <Card className="rounded-3xl overflow-hidden bg-transparent border-none shadow-none h-full flex flex-col">
      <div className="relative aspect-square w-full">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-contain p-4 drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-4 text-center text-black">
        <h4 className="font-headline font-bold text-xl truncate">{item.name}</h4>
        <p className="text-sm text-black/70 line-clamp-2 mt-1 h-10">{item.description}</p>
      </CardContent>
    </Card>
  </Link>
);

export default function SignatureDrinksCarousel({ items }: { items: MenuItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll animationType="fadeIn">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/4 pl-4">
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
