
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <>
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-primary pt-24 pb-32 md:pt-32">

        {/* Main Content Area */}
        <div className="container mx-auto px-6 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Text Content */}
            <div className="text-left">
              <AnimateOnScroll animationType="fadeIn">
                <h1 className="text-4xl md:text-5xl lg:text-[54.6px] font-headline font-bold text-foreground leading-tight">
                  Good Coffee for Great Mornings
                </h1>
                <p className="mt-4 text-sm md:text-base font-body font-bold text-foreground/80 max-w-md">
                  From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor , a golden mix of comfort, creativity, and caffeine confidence.
                </p>
              </AnimateOnScroll>
              
              <AnimateOnScroll animationType='fadeIn' delay={0.2} className="mt-12 flex items-center gap-4">
                  <div className="relative w-32 h-32 hidden md:block">
                     <Image
                        src="/image/e.png"
                        alt="Woman enjoying coffee"
                        width={128}
                        height={128}
                        className="object-contain"
                     />
                     {/* Doodle */}
                     <svg className="absolute -top-2 -left-2 w-8 h-8 text-foreground" viewBox="0 0 100 100">
                        <path d="M10 50 C 20 20, 40 20, 50 50" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round"/>
                        <path d="M50 50 C 60 80, 80 80, 90 50" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round"/>
                     </svg>
                  </div>
                  <div className="relative w-20 h-20 border-2 border-foreground rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-8 h-8 text-foreground" />
                  </div>
              </AnimateOnScroll>
            </div>
            
            {/* Right Side Content & Images */}
            <div className="relative h-[500px] flex items-center justify-center">
                {/* Main Coffee Cup Image */}
                <AnimateOnScroll animationType='fadeIn' delay={0.3} className="z-10">
                   <Image
                    src="/image/coffee.png"
                    alt="Kopi Dua Darjat splashing coffee"
                    width={400}
                    height={500}
                    className="object-contain drop-shadow-2xl"
                  />
                </AnimateOnScroll>

                {/* Coffee Beans & Text */}
                <AnimateOnScroll animationType='fadeIn' delay={0.5} className="absolute bottom-10 right-0 z-20 text-right">
                    <p className="font-body font-bold text-foreground/80 text-sm mb-2">
                        Coffee that fuels your hustle and warms your heart.
                    </p>
                    <div className="relative w-32 h-24 ml-auto">
                        <Image
                            src="/image/f.png"
                            alt="Coffee beans"
                            width={128}
                            height={96}
                            className="object-contain"
                        />
                         {/* Doodle */}
                        <svg className="absolute -top-2 right-2 w-8 h-8 text-foreground scale-x-[-1]" viewBox="0 0 100 100">
                            <path d="M10 50 C 20 20, 40 20, 50 50" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round"/>
                            <path d="M50 50 C 60 80, 80 80, 90 50" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round"/>
                        </svg>
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
