
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-primary overflow-hidden">
      
      {/* === Left Frame (Girl + Arrow) === */}
      <div className="absolute bottom-12 left-8 sm:left-16 lg:left-24 w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 z-30 flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/image/image%20frame.png"
            alt="Decorative frame"
            fill
            className="object-contain pointer-events-none rotate-[-90deg]"
          />
        </div>
        <button
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 border-4 border-foreground rounded-full flex items-center justify-center bg-white z-40"
          aria-label="Open profile"
        >
          <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
        </button>
      </div>

      {/* === Bean Accent (Right Side) === */}
      <div className="absolute top-[48%] right-4 sm:right-12 md:right-20 w-24 h-24 sm:w-32 sm:h-32 z-30 pointer-events-none">
        <Image
          src="/image/coffee-bean.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain"
        />
      </div>

      {/* === Cup (Centerpiece) === */}
      <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-[35%] w-[22rem] sm:w-[28rem] md:w-[36rem] lg:w-[42rem] xl:w-[50rem] z-20 pointer-events-none">
        <Image
          src="/image/dua-darjat-cup.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain object-bottom rotate-[18deg]"
        />
      </div>

      {/* === Main Text Content === */}
      <div className="relative container mx-auto px-6 z-10 flex flex-col items-center text-center pt-[8rem] sm:pt-[10rem] md:pt-[12rem] pb-32">
        <AnimateOnScroll animationType="fadeIn">
          <h1
            className="
              font-headline font-extrabold text-foreground leading-[1.05]
              text-[clamp(2.3rem,8vw,5.6rem)]
              md:whitespace-nowrap tracking-tight
            "
          >
            Good Coffee for Great Mornings
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-body font-semibold text-foreground/80 max-w-[32rem] sm:max-w-[36rem] mt-6">
            From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor — a golden mix of comfort, creativity, and caffeine confidence.
          </p>
        </AnimateOnScroll>
      </div>

      {/* === Bottom Wave === */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-24 sm:h-36 md:h-48 z-0 pointer-events-none">
        <Image
          src="/image/wave.svg"
          alt="Wave separator"
          fill
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
}
