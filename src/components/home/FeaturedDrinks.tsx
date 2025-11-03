
"use client";

import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { MenuItem } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ArrowUpRight, Star } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Link from 'next/link';

export default function FeaturedDrinks() {
  const firestore = useFirestore();
  
  // Query for items marked as popular
  const popularQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, 'menuItems'), 
      where('status', '==', 'published'),
      where('isPopular', '==', true),
      limit(6)
    ) : null,
    [firestore]
  );
  const { data: popularItems, isLoading: isLoadingPopular } = useCollection<MenuItem>(popularQuery);
  
  // A fallback query in case no items are marked as popular
  const genericQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, 'menuItems'), 
      where('status', '==', 'published'),
      limit(6)
    ) : null,
    [firestore]
  );
  const { data: genericItems, isLoading: isLoadingGeneric } = useCollection<MenuItem>(genericQuery);

  const drinksToShow = popularItems && popularItems.length > 0 ? popularItems : genericItems;
  const isLoading = isLoadingPopular || isLoadingGeneric;

  if (isLoading) {
    // You can return a skeleton loader here if you want
    return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-[#F7F4EF] text-foreground">
      <div className="container mx-auto px-4 sm:px-12">
        <AnimateOnScroll animationType="fadeIn">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground tracking-wide inline-block underline decoration-primary decoration-4 underline-offset-8">
              Popular products
            </h2>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
          <Carousel
            opts={{
              align: 'start',
              loop: drinksToShow && drinksToShow.length > 3,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-16">
              {drinksToShow?.map((drink) => (
                <CarouselItem key={drink.id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4 overflow-visible">
                  <div className="p-1">
                    <Card className="rounded-3xl bg-primary/65 overflow-visible">
                      <CardContent className="relative p-4 pt-32 flex flex-col items-center text-center">
                        <div className="relative w-full h-80 -mt-48 mb-4 group">
                          <Image
                            src={drink.imageUrl}
                            alt={drink.name}
                            fill
                            className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 rotate-12"
                          />
                        </div>
                        <div className="w-full flex justify-between items-center text-left">
                            <div className="flex-grow overflow-hidden">
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
                           <Button asChild variant="outline" size="icon" className="rounded-full border-2 border-foreground/50 hover:bg-primary hover:border-primary shrink-0 ml-2">
                            <Link href={`/outlets?item=${drink.slug}`}>
                              <ArrowUpRight className="w-5 h-5" />
                            </Link>
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4" />
            <CarouselNext className="right-2 sm:right-4" />
          </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
