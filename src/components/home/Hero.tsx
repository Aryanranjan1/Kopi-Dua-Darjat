
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { useFitText } from '@/hooks/use-fit-text';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useFitText<HTMLHeadingElement>(containerRef);

  return (
    <section className="relative w-full min-h-screen bg-primary overflow-hidden">
      {/* === Bottom Wave === */}
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-36 md:h-48 z-10 pointer-events-none">
        <Image
          src="/image/wave.svg"
          alt="Wave separator"
          fill
          className="object-cover object-bottom"
        />
      </div>

      {/* === Coffee Bean === */}
      <div
        className="absolute right-4 top-1/2 md:right-16 md:top-[45%] w-20 h-20 sm:w-28 sm:h-28 z-20 pointer-events-none md:block hidden"
        aria-hidden="true"
      >
        <Image
          src="/image/coffee-bean.png"
          alt=""
          fill
          className="object-contain"
          loading="lazy"
        />
      </div>

      {/* === Cup Image === */}
      <div
        className="animate-fade-in-up absolute left-1/2 top-1/2 z-20 mt-24 w-[220px] -translate-x-1/2 -translate-y-1/2 pointer-events-none sm:w-[280px] md:top-[40%] md:w-[420px] md:-translate-y-0 md:left-auto md:right-[28%] md:mt-0"
        style={{ transform: 'rotate(18deg)' }}
        aria-hidden="true"
      >
        <Image
          src="/image/dua-darjat-cup.png"
          alt=""
          width={420}
          height={500}
          className="object-contain"
          priority
        />
      </div>

      {/* === Text Content & Frame Group Container === */}
      <div
        className="relative container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-between z-20 min-h-screen"
      >
        {/* Top part for text */}
        <div ref={containerRef} className="pt-[190px] w-full md:w-[48%]">
            <AnimateOnScroll animationType="fadeIn">
              <div>
                <h1
                  ref={h1Ref}
                  className="font-headline font-extrabold text-foreground leading-[1.05] text-[clamp(2.5rem,8.5vw,6.2rem)]"
                >
                  Good Coffee for Great Mornings
                </h1>
              </div>
              <p className="mt-6 text-base sm:text-lg md:text-xl font-body font-semibold text-foreground/80 max-w-[420px] leading-relaxed">
                From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor — a golden mix of comfort, creativity, and caffeine confidence.
              </p>
            </AnimateOnScroll>
        </div>

        {/* Bottom part for frame */}
        <div className="pb-6 w-full flex justify-start">
            <div className="relative z-30 flex flex-row items-center gap-[0.7rem]">
                <div className="relative w-[336px] h-[336px] sm:w-[420px] sm:h-[420px] md:w-[504px] md:h-[504px] pointer-events-none">
                <Image
                    src="/image/image%20frame.png"
                    alt="Decorative frame with a person's photo"
                    fill
                    className="object-contain -rotate-90"
                    aria-hidden="true"
                />
                </div>
                <button
                aria-label="Locate outlet"
                className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center rounded-full border-8 border-foreground bg-white shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                <ArrowUpRight className="w-28 h-28 sm:w-36 sm:h-36 text-foreground" />
                </button>
            </div>
        </div>
      </div>
    </section>
  );
}
