
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useFitText } from '@/hooks/use-fit-text';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useFitText<HTMLHeadingElement>(containerRef);

  return (
    <section className="relative w-full bg-primary pt-20 overflow-hidden">
      
      {/* === Cup Image === */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-20">
        <AnimateOnScroll
          animationType="fadeIn"
          delay={0.4}
          duration={1}
          className="w-full h-full"
        >
          <div className="absolute right-0 sm:right-[10%] w-[35rem] h-[35rem] sm:w-[50rem] sm:h-[50rem] lg:w-[70rem] lg:h-[70rem] opacity-40 sm:opacity-50 lg:opacity-100">
            <Image
              src="/image/kdd-cup.png"
              alt="Kopi Dua Darjat Cup"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </AnimateOnScroll>
      </div>

      {/* === Main Text Content === */}
      <div
        className="relative container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-start z-30 min-h-screen"
      >
        <div className="w-full" ref={containerRef}>
            <div className="pt-[190px]">
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
        </div>
      </div>
      

    </section>
  );
}
