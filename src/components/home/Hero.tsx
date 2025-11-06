
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useFitText } from '@/hooks/use-fit-text';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useFitText<HTMLHeadingElement>(containerRef);

  return (
    <section className="relative w-full bg-primary h-screen overflow-hidden">
      {/* === Frame Image === */}
      <div className="absolute bottom-1/4 left-0 w-[20vw] h-[20vw] max-w-[200px] z-30 pointer-events-none hidden lg:block">
        <AnimateOnScroll animationType="fadeIn" delay={0.6}>
           <Image
            src="/image/image frame.png"
            alt="Frame"
            fill
            className="object-contain"
          />
        </AnimateOnScroll>
      </div>
      
       {/* === Bean Image === */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[15vw] h-[15vw] max-w-[150px] z-30 pointer-events-none hidden lg:block">
        <AnimateOnScroll animationType="fadeIn" delay={0.7}>
          <Image
            src="/image/coffee-bean.png"
            alt="Coffee Bean"
            fill
            className="object-contain"
          />
        </AnimateOnScroll>
      </div>


      {/* === Cup Image === */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-20">
        <AnimateOnScroll
          animationType="fadeIn"
          delay={0.4}
          duration={1}
          className="w-full h-full"
        >
          <div className="absolute left-1/2 -translate-x-1/2 w-[35rem] h-[35rem] sm:w-[50rem] sm:h-[50rem] lg:w-[65vh] lg:h-[65vh] bottom-0">
            <Image
              src="/image/dua-darjat-cup.png"
              alt="Kopi Dua Darjat Cup"
              fill
              className="object-contain drop-shadow-2xl rotate-0 sm:rotate-12 md:rotate-12 lg:rotate-[25deg]"
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
            <div className="pt-24 lg:pt-[190px]">
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
      
      {/* Bottom Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-10 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f7f4ef" fillOpacity="1" d="M0,288L48,288C96,288,192,288,288,256C384,224,480,160,576,133.3C672,107,768,117,864,149.3C960,181,1056,235,1152,229.3C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}
