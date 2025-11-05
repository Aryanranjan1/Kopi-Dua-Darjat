
'use client';
import type { Testimonial } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="bg-[#F9C349] py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-black">
            Community Voices
          </h2>
          <p className="mt-2 text-lg text-neutral-800">What our customers and partners are saying.</p>
        </AnimateOnScroll>

        <Carousel
          opts={{ align: 'start', loop: testimonials.length > 2 }}
          className="w-full"
        >
          <CarouselContent className="-ml-8">
            {testimonials.map((item, index) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 pl-8">
                <Card className={`rounded-lg h-full ${index % 2 === 0 ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  <CardContent className="p-8 flex flex-col justify-center h-full">
                    <blockquote className="text-lg font-medium border-l-4 pl-4 border-[#F9C349] italic">
                      “{item.quote}”
                    </blockquote>
                    <footer className="mt-6 flex items-center gap-4">
                      {item.image && (
                         <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                         </div>
                      )}
                      <div>
                        <p className={`font-bold ${index % 2 === 0 ? 'text-[#F9C349]' : 'text-black'}`}>{item.name}</p>
                        <p className={`${index % 2 === 0 ? 'text-neutral-400' : 'text-neutral-600'}`}>{item.designation}</p>
                      </div>
                    </footer>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12 bg-white/80 hover:bg-white text-black border-black/20" />
          <CarouselNext className="mr-12 bg-white/80 hover:bg-white text-black border-black/20" />
        </Carousel>
      </div>
    </section>
  );
}
