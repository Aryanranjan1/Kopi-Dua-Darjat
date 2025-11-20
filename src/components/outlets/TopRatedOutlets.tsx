
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InteractiveMap from '@/components/home/InteractiveMap';
import { Loader2, Star } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Outlet } from '@/lib/types';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const TopOutletCard = ({ outlet }: { outlet: Outlet }) => (
  <Card className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f3e5d3]/35 rounded-3xl">
    <div className="flex-1 overflow-hidden pr-2">
      <h4 className="font-bold text-base sm:text-lg text-foreground">{outlet.name}</h4>
      <div className="flex items-center gap-1 mt-1">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="text-sm font-bold text-foreground">{outlet.rating?.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({outlet.reviewCount || 0} reviews)</span>
      </div>
    </div>
    <Button asChild className="bg-foreground/80 text-background hover:bg-foreground/70 rounded-full shrink-0 w-full sm:w-auto">
      <Link href={`/${outlet.slug}`}>
        View Outlet
      </Link>
    </Button>
  </Card>
);

const TopRatedOutletsSkeleton = () => (
    <div className="lg:col-span-2 flex flex-col">
         <div className="text-center lg:text-left">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-full mt-4" />
        </div>
        <div className="mt-8 flex-grow">
            <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
            </div>
        </div>
    </div>
)

export default function TopRatedOutlets() {
  const firestore = useFirestore();
  const { data: outlets, isLoading: isLoadingOutlets } = useCollection<Outlet>(
    useMemoFirebase(() => (firestore ? query(collection(firestore, 'outlets'), orderBy('rating', 'desc'), limit(20)) : null), [firestore])
  );

  const isLoading = isLoadingOutlets;

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {isLoading ? <TopRatedOutletsSkeleton /> : (
            <div className="lg:col-span-2 flex flex-col">
              <AnimateOnScroll animationType="slideInFromLeft">
                <div className="text-center lg:text-left">
                  <h2 className="text-4xl font-headline font-bold text-foreground inline-block underline decoration-primary/50 decoration-4 underline-offset-8">
                    Top Rated Outlets
                  </h2>
                  <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                    Discover our fan-favorite locations, celebrated for their exceptional service and coffee.
                  </p>
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-8 flex-grow">
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-4">
                      {outlets?.map((outlet, index) => (
                        <TopOutletCard key={outlet.id} outlet={outlet} />
                      ))}
                    </div>
                  </ScrollArea>
                {!isLoading && (!outlets || outlets.length === 0) && (
                  <div className="flex items-center justify-center h-full text-muted-foreground pt-10">
                    <p>No rated outlets found yet.</p>
                  </div>
                )}
              </AnimateOnScroll>
            </div>
          )}

          <AnimateOnScroll animationType='slideInFromRight' className="lg:col-span-3 min-h-[400px] sm:min-h-[600px] h-full mt-8 lg:mt-0">
            <Card className="overflow-hidden shadow-lg rounded-3xl h-full">
              <InteractiveMap />
            </Card>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
