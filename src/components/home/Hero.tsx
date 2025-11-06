
'use client';

import * as React from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { useFitText } from '@/hooks/use-fit-text';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/use-media-query';

const DesktopHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useFitText<HTMLHeadingElement>(containerRef);

  return (
    <>
      {/* === Main Text Content === */}
      <div
        className="relative container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-start z-30 pt-28"
      >
        <div ref={containerRef} className="w-full">
            <AnimateOnScroll animationType="fadeIn">
                <div className="w-full">
                    <h1
                    ref={h1Ref}
                    className="font-headline font-extrabold text-foreground leading-[1.05] text-[clamp(2.5rem,10vw,8rem)]"
                    >
                    Good Coffee for Great Morning
                    </h1>
                     <div className="max-w-[40%]">
                        <p className="mt-6 text-base sm:text-lg md:text-xl font-body font-normal text-foreground/90 leading-relaxed">
                            From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor , a golden mix of comfort, creativity, and caffeine confidence.
                        </p>
                    </div>
                </div>
            </AnimateOnScroll>
        </div>
      </div>

      {/* Decorative Images Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
        
        {/* Frame Image */}
        <div className="absolute left-[calc(8%_-_60px)] top-[calc(55%_+_140px)] w-[128px] h-[128px]">
          <AnimateOnScroll animationType="fadeIn" delay={0.2}>
            <Image src="/image/image frame.png" alt="Frame decoration" layout="fill" className="object-contain scale-[2] -rotate-90"/>
          </AnimateOnScroll>
        </div>
        
        {/* Button next to image */}
         <div className="absolute left-[calc(8%_+_50px)] top-[calc(55%_+_185px)] w-[50px] h-[50px] pointer-events-auto">
          <AnimateOnScroll animationType="fadeIn" delay={0.3}>
              <Link href="/outlets" className="flex items-center justify-center bg-white text-black border-2 border-black rounded-full w-full h-full hover:bg-black hover:text-white transition-all duration-300 group">
                  <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-45" />
              </Link>
          </AnimateOnScroll>
        </div>
        
        {/* Coffee Beans */}
        <div className="absolute right-[calc(10%_-_30px)] bottom-[calc(12%_+_20px)] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]">
          <AnimateOnScroll animationType="fadeIn" delay={0.3}>
            <Image src="/image/coffee-bean.png" alt="Coffee beans" layout="fill" className="object-contain"/>
          </AnimateOnScroll>
        </div>

        {/* Main Cup */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vh] h-[60vh]">
          <AnimateOnScroll animationType="slideInFromBottom" delay={0.1}>
            <Image src="/image/dua-darjat-cup.png" alt="Kopi Dua Darjat splashing cup" layout="fill" className="object-contain rotate-[25deg]"/>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Bottom Wave SVG */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path fill="#f7f4ef" fillOpacity="1" d="M0,288L48,288C96,288,192,288,288,256C384,224,480,160,576,133.3C672,107,768,117,864,149.3C960,181,1056,235,1152,229.3C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

    </>
  );
};

const MobileHero = () => {
  return (
    <div className="container mx-auto px-6 pt-24 pb-20 text-center">
      <AnimateOnScroll>
        <h1 className="font-headline font-extrabold text-foreground leading-tight text-5xl">
          Good Coffee for Great Mornings
        </h1>
        <p className="mt-4 text-base font-body font-semibold text-foreground/80 max-w-md mx-auto leading-relaxed">
          From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor.
        </p>
      </AnimateOnScroll>
      <AnimateOnScroll delay={0.2} className="mt-8">
        <div className="relative w-full max-w-sm mx-auto aspect-square">
          <Image
            src="/image/dua-darjat-cup.png"
            alt="Kopi Dua Darjat Cup"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </AnimateOnScroll>
    </div>
  );
};

export default function Hero() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  return (
    <section className="relative w-full bg-primary overflow-hidden min-h-screen">
      {isMobile ? <MobileHero /> : <DesktopHero />}
    </section>
  );
}
