
'use client';

import type { MenuItem, Promotion } from '@/lib/types';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDiscountDisplay } from '@/lib/utils';
import Link from 'next/link';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

interface SignatureDrinksCarouselProps {
  items: MenuItem[];
  promotions: Promotion[];
}

const DrinkCard = ({ item, promotions }: { item: MenuItem; promotions: Promotion[] }) => {
  const promotion = promotions.find(p => p.menuItemIds?.includes(item.id));
  const offerText = promotion ? getDiscountDisplay(promotion) : null;
  
  return (
    <Card className="rounded-lg overflow-hidden group bg-white border-black/10 transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
      <div className="relative aspect-square w-full">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        {offerText && (
          <Badge className="absolute top-2 right-2 bg-[#F9C349] text-black">{offerText}</Badge>
        )}
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <h4 className="font-headline font-bold text-lg text-black truncate">{item.name}</h4>
        <p className="text-sm text-neutral-600 line-clamp-2 mt-1 h-10 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-2">
            <p className="font-semibold text-black text-lg">RM{item.price.toFixed(2)}</p>
            <Button asChild className="bg-black text-white hover:bg-neutral-800 rounded-md">
                <Link href="#">Try Now</Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SignatureDrinksCarousel({ items, promotions }: SignatureDrinksCarouselProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#FAF3E0] py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <Carousel
          opts={{ align: 'start', loop: items.length > 4 }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {items.map((item, index) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                 <AnimateOnScroll animationType="fadeIn" delay={index * 0.1}>
                    <DrinkCard item={item} promotions={promotions} />
                 </AnimateOnScroll>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12 bg-white hover:bg-neutral-200 border-black/20" />
          <CarouselNext className="mr-12 bg-white hover:bg-neutral-200 border-black/20" />
        </Carousel>
      </div>
    </section>
  );
}
