
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

        {/* Left Image */}
        <div className="absolute top-1/4 left-0 w-48 h-48 md:w-64 md:h-64 z-0">
            <Image
                src="/image/image frame.png"
                alt="Image Frame"
                fill
                className="object-contain -rotate-90"
            />
        </div>

        {/* Right Image */}
        <div className="absolute top-1/2 right-0 w-48 h-48 md:w-64 md:h-64 z-0">
             <Image
                src="/image/coffee-bean.png"
                alt="Coffee Bean"
                fill
                className="object-contain"
            />
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-6 z-10">
          <div className="w-full">
            {/* Text Content */}
            <div className="text-left">
              <AnimateOnScroll animationType="fadeIn">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground leading-tight text-center">
                  Good Coffee for Great Mornings
                </h1>
                <div className="mt-12">
                  <p className="mt-4 text-sm md:text-base font-body font-bold text-foreground/80 max-w-md text-left ml-12">
                    From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor , a golden mix of comfort, creativity, and caffeine confidence.
                  </p>
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animationType='fadeIn' delay={0.2} className="mt-12 flex items-center justify-center gap-4">
                  <div className="relative w-20 h-20 border-2 border-foreground rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-8 h-8 text-foreground" />
                  </div>
              </AnimateOnScroll>
            </div>
            
          </div>
        </div>

        {/* Cup Image Overlay */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1/2 z-20 pointer-events-none">
            <div className="relative w-full h-full">
                <Image
                    src="/image/dua-darjat-cup.png"
                    alt="Kopi Dua Darjat Cup"
                    fill
                    className="object-contain object-bottom rotate-[35deg] translate-x-5 translate-y-4"
                />
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
