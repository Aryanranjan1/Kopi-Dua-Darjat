
'use client';

import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { Testimonial } from '@/lib/types';
import { useMediaAsset } from '@/lib/media';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, MessageSquare } from 'lucide-react';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const { asset: image, isLoading } = useMediaAsset(testimonial.image);
  
  return (
      <Card className="bg-white border-zinc-200 rounded-3xl h-full shadow-sm flex flex-col">
          <CardContent className="p-8 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    {isLoading ? <Skeleton className="w-full h-full" /> : image && (
                        <Image
                            src={image.imageUrl}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                    )}
                </div>
                 <div className="relative w-16 h-10">
                    <MessageSquare className="w-16 h-16 text-zinc-200" strokeWidth={1} />
                </div>
              </div>
               <div className="flex items-center gap-2 border rounded-full px-3 py-1 text-sm">
                 <div className="w-12 h-12 relative">
                  <Image src="/image/1.svg" alt="Company Logo" fill className="object-contain p-2 filter grayscale" />
                 </div>
                 <span className="font-semibold text-zinc-600">{testimonial.company || 'KDD Franchise'}</span>
               </div>
            </div>

            <blockquote className="text-xl font-medium text-zinc-800 flex-grow my-4">
            “{testimonial.quote}”
            </blockquote>
            
            <div className="border-t border-zinc-200 pt-4">
              <p className="font-bold text-zinc-900 text-lg">{testimonial.name}</p>
              <p className="text-zinc-600">{testimonial.designation}</p>
            </div>
          </CardContent>
      </Card>
  );
}

export default function FranchiseTestimonials() {
  const plugin = React.useRef(
    Autoplay({ delay: 7000, stopOnInteraction: true })
  )

  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'testimonials'), limit(5)) : null, [firestore]);
  const { data: testimonials, isLoading } = useCollection<Testimonial>(testimonialsQuery);
  
  if (isLoading) {
      return (
          <section className="py-24 sm:py-32 bg-white">
              <div className="container mx-auto px-4">
                  <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
              </div>
          </section>
      )
  }

  if (!testimonials || testimonials.length === 0) {
      return null;
  }

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-left max-w-4xl mb-12">
          <p className="font-semibold text-zinc-500 uppercase">Our Reviews</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mt-2">
            What Our <span className="text-zinc-400">Clients Say</span>
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
            <Carousel
              plugins={[plugin.current]}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="-ml-8">
                {testimonials?.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-8">
                    <div className="p-1 h-full">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -top-24 right-0 flex gap-2">
                <CarouselPrevious className="static translate-y-0 w-12 h-12 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 border-none" />
                <CarouselNext className="static translate-y-0 w-12 h-12 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 border-none" />
              </div>
            </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
