
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

      {/* === Girl Image Frame === */}
      <div className="absolute z-20 bottom-6 left-8 sm:left-12 md:left-16 flex items-center -ml-12 gap-0">
        <div className="relative w-[576px] h-[576px] sm:w-[576px] sm:h-[576px] md:w-[576px] md:h-[576px] pointer-events-none">
            <Image
                src="/image/image%20frame.png"
                alt="Decorative frame with a person's photo"
                fill
                className="object-contain -rotate-90"
                aria-hidden="true"
            />
        </div>
        {/* === Arrow Button === */}
        <button
            aria-label="Locate outlet"
            className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-foreground bg-white shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative z-30"
        >
            <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-foreground" />
        </button>
      </div>

      {/* === Bean Accent === */}
      <div
        className="absolute right-4 top-1/2 md:right-16 md:top-[45%] w-20 h-20 sm:w-28 sm:h-28 z-40 pointer-events-none md:block hidden"
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

      {/* === Main Text Content === */}
      <div
        className="relative container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-between z-30 min-h-screen"
      >
        <div className="w-full md:w-[48%]" ref={containerRef}>
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
      
       {/* === Cup Image === */}
       <div
        className="animate-fade-in-up absolute left-1/2 top-1/2 z-50 mt-24 w-[220px] -translate-x-1/2 -translate-y-1/2 pointer-events-none sm:w-[280px] md:top-[40%] md:w-[420px] md:-translate-y-0 md:left-auto md:right-[28%] md:mt-0"
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

    </section>
  );
}
