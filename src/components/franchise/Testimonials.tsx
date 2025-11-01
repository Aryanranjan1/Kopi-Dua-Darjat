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

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-card">
      <div className="container mx-auto px-4">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline text-primary">Success Stories</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from our partners who are brewing success with Kopi Dua Darjat.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto mt-16"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => {
                const image = PlaceHolderImages.find((img) => img.id === testimonial.image);
                return (
                  <CarouselItem key={testimonial.id}>
                    <div className="p-4">
                      <Card className="bg-background rounded-3xl shadow-lg overflow-hidden">
                        <CardContent className="p-0 md:p-8 md:grid md:grid-cols-3 md:items-center">
                            <div className="relative aspect-[4/3] md:aspect-square">
                                {image && (
                                    <Image
                                    src={image.imageUrl}
                                    alt={testimonial.name}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={image.imageHint}
                                    />
                                )}
                            </div>
                            <div className="p-6 md:p-0 md:pl-8 md:col-span-2">
                                <blockquote className="text-lg font-medium text-foreground">
                                “{testimonial.quote}”
                                </blockquote>
                                <footer className="mt-4">
                                <p className="font-bold text-accent text-lg">{testimonial.name}</p>
                                <p className="text-muted-foreground">{testimonial.designation}</p>
                                </footer>
                            </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-12" />
            <CarouselNext className="-right-4 md:-right-12" />
          </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
