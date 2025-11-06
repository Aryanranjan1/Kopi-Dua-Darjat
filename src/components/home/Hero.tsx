
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <>
      <section className="relative w-full min-h-screen flex items-center justify-center bg-primary pt-24 pb-32 md:pt-32">

        {/* Main Content Area */}
        <div className="container mx-auto px-6 z-10">
          <div className="w-full">
            {/* Text Content */}
            <div className="text-center">
              <AnimateOnScroll animationType="fadeIn">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground leading-tight w-full text-center">
                  Good Coffee for Great Mornings
                </h1>
                <p className="mt-12 text-sm md:text-base font-body font-bold text-foreground/80 max-w-md text-left ml-12">
                  From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor , a golden mix of comfort, creativity, and caffeine confidence.
                </p>
              </AnimateOnScroll>
              
              <AnimateOnScroll animationType='fadeIn' delay={0.2} className="mt-12 flex items-center justify-center gap-4">
                  <div className="relative w-20 h-20 border-2 border-foreground rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-8 h-8 text-foreground" />
                  </div>
              </AnimateOnScroll>
            </div>
            
          </div>
        </div>

        {/* Bottom Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-0 pointer-events-none h-32 md:h-48">
          <Image
            src="/image/wave.svg"
            alt="Wave separator"
            fill
            className="object-cover object-bottom"
          />
        </div>
      </section>
    </>
  );
}
