'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { testimonials } from '@/lib/data';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
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

export default function Testimonials() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )
  
  return (
    <section className="py-24 sm:py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">Success Stories</h2>
          <p className="mt-4 text-lg text-white/70">
            Hear from our partners who are brewing success with Kopi Dua Darjat.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto mt-24"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-8">
              {testimonials.map((testimonial) => {
                const image = PlaceHolderImages.find((img) => img.id === testimonial.image);
                return (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 pl-8">
                    <div className="p-4 h-full">
                        <div className="relative h-full mt-10">
                            {image && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-accent shadow-lg z-10">
                                    <Image
                                        src={image.imageUrl}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={image.imageHint}
                                    />
                                </div>
                            )}
                            <Card className="bg-zinc-900/50 border-zinc-800 rounded-3xl h-full pt-20 shadow-lg text-center">
                                <CardContent className="p-8 min-h-[280px] flex flex-col justify-center">
                                <blockquote className="text-lg font-medium text-white/90">
                                “{testimonial.quote}”
                                </blockquote>
                                <footer className="mt-6">
                                <p className="font-bold text-accent text-xl">{testimonial.name}</p>
                                <p className="text-white/60">{testimonial.designation}</p>
                                </footer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-12 bg-zinc-800 border-zinc-700 text-white hover:bg-primary hover:text-black" />
            <CarouselNext className="-right-4 md:-right-12 bg-zinc-800 border-zinc-700 text-white hover:bg-primary hover:text-black" />
          </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
