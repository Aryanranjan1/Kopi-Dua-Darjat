'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-primary overflow-hidden flex items-center justify-center">
      {/* === Bottom Wave === */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-24 sm:h-36 md:h-48 z-0 pointer-events-none">
        <Image
          src="/image/wave.svg"
          alt="Wave separator"
          fill
          className="object-cover object-bottom"
        />
      </div>

      {/* === Girl Frame + Arrow === */}
      <div className="absolute bottom-6 left-8 sm:left-12 md:left-16 z-30 flex flex-col items-center">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
          <Image
            src="/image/image%20frame.png"
            alt="Decorative frame"
            fill
            className="object-contain -rotate-90 pointer-events-none"
          />
        </div>
        <button
          aria-label="Open profile"
          className="mt-3 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-4 border-foreground bg-white shadow-md"
        >
          <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
        </button>
      </div>

      {/* === Coffee Bean === */}
      <div className="absolute right-8 md:right-16 top-[50%] w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 z-30 pointer-events-none">
        <Image
          src="/image/coffee-bean.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain"
        />
      </div>

      {/* === Cup Image === */}
      <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[20rem] sm:w-[26rem] md:w-[32rem] lg:w-[38rem] z-20 pointer-events-none">
        <Image
          src="/image/dua-darjat-cup.png"
          alt="Coffee Cup"
          fill
          className="object-contain rotate-[18deg] animate-fade-in-up"
        />
      </div>

      {/* === Text Content (anchored left) === */}
      <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-start items-start text-left z-10 pt-24 md:pt-40 text-center md:text-left md:items-start">
        <AnimateOnScroll animationType="fadeIn">
          <h1 className="font-headline font-extrabold text-foreground leading-[1.05] text-[clamp(2.5rem,8vw,5.5rem)] md:whitespace-nowrap">
            Good Coffee for Great Mornings
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl font-body font-semibold text-foreground/80 max-w-[420px] leading-relaxed mx-auto md:mx-0">
            From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor — a golden mix of comfort, creativity, and caffeine confidence.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}