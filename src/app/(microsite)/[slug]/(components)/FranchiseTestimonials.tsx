
'use client';

import Image from 'next/image';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"


const testimonials = [
  {
    quote: "I always wanted to own a café. Kopi Dua Darjat made that dream a reality with a low-cost, high-return model.",
    name: "Ravi Chandran",
    designation: "Customer, Putrajaya",
    image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=500",
    company: "KDD Fan"
  },
  {
    quote: "The brand recognition is incredible. Customers love the coffee, and my outlet has been profitable since month one.",
    name: "Siti Nurhaliza",
    designation: "Customer, Kajang",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    company: "KDD Fan"
  },
  {
    quote: "I started my stall in Shah Alam — sold out every morning within 2 weeks! The training and marketing support made everything easy.",
    name: "Ahmad Faizal",
    designation: "Customer, Shah Alam",
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=500",
    company: "KDD Fan"
  },
  {
    quote: "The Darjat Borneo is my absolute favorite. The Gula Apong flavor is so unique and addictive! I grab one every morning.",
    name: "Chloe Tan",
    designation: "Student, Subang Jaya",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500",
    company: "KDD Fan"
  },
  {
    quote: "Best local coffee brand out there. The quality is consistent and the price is unbeatable. A true Malaysian success story.",
    name: "Faris bin Rosli",
    designation: "Graphic Designer, KL",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    company: "KDD Fan"
  },
  {
    quote: "I'm not even a big coffee drinker, but their Matcha series is amazing. It's my go-to treat after a long week.",
    name: "Isabelle Lim",
    designation: "Marketing Executive, PJ",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
    company: "KDD Fan"
  },
  {
    quote: "Fast service, friendly staff, and fantastic coffee. The perfect combination for my daily coffee run.",
    name: "Daniel Kumar",
    designation: "IT Consultant, Cyberjaya",
    image: "https://images.unsplash.com/photo-1628157588553-5ee30a6c26e3?w=500",
    company: "KDD Fan"
  },
];


const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <Card className="bg-white border-zinc-200 rounded-3xl h-full shadow-sm flex flex-col mx-2">
        <CardContent className="p-8 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                  />
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
             <div className="absolute -top-16 right-0 flex items-center gap-2">
                <CarouselPrevious className="static translate-y-0 bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800" />
                <CarouselNext className="static translate-y-0 bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800" />
              </div>
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
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
