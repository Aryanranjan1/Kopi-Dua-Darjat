'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { useFitText } from '@/hooks/use-fit-text';
import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useFitText<HTMLHeadingElement>(containerRef);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-primary overflow-hidden">
      {/* === Bottom Wave === */}
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-36 md:h-48 z-10 pointer-events-none">
        <Image
          src="/image/wave.svg"
          alt="Wave separator"
          fill
          className="object-cover object-bottom"
        />
      </div>

      <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 h-full flex flex-col justify-center md:items-start text-center md:text-left">
        {/* Decorative Assets - Placed first for z-index control */}
        
        {/* Frame group (girl + CTA) */}
        <div className="absolute bottom-6 left-8 sm:left-12 md:left-16 z-30 flex flex-col items-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 pointer-events-none">
                <Image
                    src="/image/image%20frame.png"
                    alt="Decorative frame with a person's photo"
                    fill
                    className="object-contain -rotate-90"
                    aria-hidden="true"
                />
            </div>
            <button
                aria-label="Open profile"
                className="mt-3 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-4 border-foreground bg-white shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
            </button>
        </div>

        {/* Bean accent */}
        <div className="absolute right-4 top-1/2 md:right-16 md:top-[45%] w-20 h-20 sm:w-28 sm:h-28 z-20 pointer-events-none md:block hidden" aria-hidden="true">
            <Image
                src="/image/coffee-bean.png"
                alt=""
                fill
                className="object-contain"
            />
        </div>
        
        {/* Cup centerpiece */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[40%] md:-translate-y-0 md:right-[28%] md:left-auto md:-rotate-12 w-[220px] sm:w-[280px] md:w-[420px] z-10 pointer-events-none mt-24 md:mt-0" aria-hidden="true">
            <Image
                src="/image/dua-darjat-cup.png"
                alt=""
                width={420}
                height={500}
                className="object-contain"
            />
        </div>


        {/* Text Content */}
        <div className="relative w-full md:w-[48%] min-w-[260px] z-20 pt-20 md:pt-0">
          <AnimateOnScroll animationType="fadeIn">
            <h1 ref={h1Ref} className="font-headline font-extrabold text-foreground leading-[1.05] text-[clamp(2.4rem,8.5vw,6.2rem)] md:whitespace-nowrap">
              Good Coffee for Great Mornings
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl font-body font-semibold text-foreground/80 max-w-[42ch] mx-auto md:mx-0 leading-relaxed">
              From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor — a golden mix of comfort, creativity, and caffeine confidence.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
