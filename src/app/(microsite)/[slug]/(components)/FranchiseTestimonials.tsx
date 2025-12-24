
'use client';

import Image from 'next/image';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import type { Testimonial } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getLocalized } from '@/lib/utils';
import { useMediaAsset } from '@/lib/media';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const { asset: companyLogo, isLoading: isLoadingLogo } = useMediaAsset('logo-symbol');

  const { language } = useLanguage();
  const localized = getLocalized(testimonial, language);

  return (
    <Card className="bg-white border-zinc-200 rounded-3xl h-full shadow-sm flex flex-col mx-2">
        <CardContent className="p-8 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  {testimonial.image ? (
                      <Image
                          src={testimonial.image}
                          alt={localized.name || ''}
                          fill
                          className="object-cover"
                      />
                  ) : <Skeleton className="w-full h-full rounded-full" /> }
              </div>
               <div className="relative w-16 h-10">
                  <MessageSquare className="w-16 h-16 text-zinc-200" strokeWidth={1} />
              </div>
            </div>
             <div className="flex items-center gap-2 border rounded-full px-3 py-1 text-sm">
               <div className="w-12 h-12 relative">
                {isLoadingLogo ? <Skeleton className="w-full h-full rounded-full" /> : companyLogo && (
                  <Image src={companyLogo.imageUrl} alt="Company Logo" fill className="object-contain p-2 filter grayscale brightness-0 invert-0" data-ai-hint={companyLogo.imageHint} />
                )}
               </div>
               <span className="font-semibold text-zinc-600">{testimonial.company || 'KDD Franchise'}</span>
             </div>
          </div>

          <blockquote className="text-xl font-medium text-zinc-800 flex-grow my-4">
          “{localized.quote}”
          </blockquote>
          
          <div className="border-t border-zinc-200 pt-4">
            <p className="font-bold text-zinc-900 text-lg">{localized.name}</p>
            <p className="text-zinc-600">{localized.designation}</p>
          </div>
        </CardContent>
    </Card>
);
}

export default function FranchiseTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="relative text-left max-w-4xl mb-12">
            <div className="flex justify-between items-end">
                <div>
                    <p className="font-semibold text-zinc-500 uppercase">Our Reviews</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mt-2">
                        What Our <span style={{color: '#fde047'}}>Customers Say</span>
                    </h2>
                </div>
            </div>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
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
             <div className="absolute -top-20 right-0 flex items-center gap-2">
                <CarouselPrevious className="static translate-y-0 bg-black text-white hover:bg-zinc-800 rounded-full border-none" />
                <CarouselNext className="static translate-y-0 bg-black text-white hover:bg-zinc-800 rounded-full border-none" />
              </div>
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={testimonial.id || index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
