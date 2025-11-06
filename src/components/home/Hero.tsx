
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
          aria-hidden="true"
        />
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
