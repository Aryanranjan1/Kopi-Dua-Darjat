
'use client';

import * as React from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { useFitText } from '@/hooks/use-fit-text';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { Outlet } from '@/lib/types';

interface MicrositeHeroProps {
    outlet: Outlet;
}

const DesktopHero = ({ outlet }: MicrositeHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useFitText<HTMLHeadingElement>(containerRef);
  
  return (
    <>
      {/* === Main Text Content === */}
      <div
        className="relative container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-start z-10 pt-28"
      >
        <div ref={containerRef} className="w-full">
            <AnimateOnScroll animationType="fadeIn">
                <div className="w-full">
                    <h1
                    ref={h1Ref}
                    className="font-headline font-extrabold text-foreground leading-[1.05] text-[clamp(2.5rem,10vw,8rem)]"
                    >
                    {outlet.name}
                    </h1>
                     <div className="max-w-[40%]">
                        <p className="relative z-10 mt-6 text-base sm:text-lg md:text-xl font-body font-bold text-foreground/90 leading-relaxed">
                            {outlet.address} <br/> Open Today: {outlet.hours}
                        </p>
                        <AnimateOnScroll animationType="slideInFromLeft" delay={0.2} className="relative mt-8 w-[128px] h-[128px] pointer-events-auto">
                          {/* Frame Image */}
                          <div className="relative w-full h-full">
                            <Image src="/image/image frame.png" alt="Frame decoration" layout="fill" className="object-contain scale-[2] -rotate-90"/>
                          </div>
                          {/* Button next to image */}
                          <div className="absolute left-[100%] top-[50%] -translate-x-1/4 -translate-y-1/4 w-[50px] h-[50px]">
                              <a href={`https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-white text-black border-2 border-black rounded-full w-full h-full hover:bg-black hover:text-white transition-all duration-300 group">
                                  <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-45" />
                              </a>
                          </div>
                        </AnimateOnScroll>
                    </div>
                </div>
            </AnimateOnScroll>
        </div>
      </div>

      {/* Decorative Images Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        
        {/* Coffee Beans */}
        <AnimateOnScroll animationType="slideInFromRight" delay={0.3} className="absolute right-[calc(10%_-_30px)] bottom-[calc(12%_-_80px)] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]">
          <Image src="/image/coffee-bean.png" alt="Coffee beans" layout="fill" className="object-contain"/>
        </AnimateOnScroll>

         <AnimateOnScroll animationType="fadeIn" delay={0.4} className="absolute right-[calc(10%_-_30px)] bottom-[calc(12%_+_100px)] w-[250px] pointer-events-auto">
          <p className="text-base sm:text-lg md:text-xl font-body font-bold text-foreground/90 leading-relaxed text-right">Brewed for Great Taste</p>
        </AnimateOnScroll>

        {/* Main Cup */}
        <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] z-20">
          <AnimateOnScroll animationType="slideInFromBottom" delay={0.1}>
            <Image src="/image/dua-darjat-cup.png" alt="Kopi Dua Darjat splashing cup" layout="fill" className="object-contain animate-float"/>
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
          <path fill="#F7F4EF" fillOpacity="1" d="M0,288L48,288C96,288,192,288,288,256C384,224,480,160,576,133.3C672,107,768,117,864,149.3C960,181,1056,235,1152,229.3C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </>
  );
};

const MobileHero = ({ outlet }: MicrositeHeroProps) => {
  return (
    <div className="container mx-auto px-6 pt-24 pb-20 text-center">
      <AnimateOnScroll>
        <h1 className="font-headline font-extrabold text-foreground leading-tight text-5xl">
          {outlet.name}
        </h1>
        <p className="mt-4 text-base font-body font-normal text-foreground/80 max-w-md mx-auto leading-relaxed">
          {outlet.address} <br/> Open Today: {outlet.hours}
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
       <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                <a href="#menu">View Our Menu</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-black text-black hover:bg-black hover:text-white">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2 h-5 w-5" /> Get Directions
                </a>
            </Button>
        </div>
    </div>
  );
};


export default function MicrositeHero({ outlet }: MicrositeHeroProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  return (
    <section className="relative w-full bg-primary overflow-hidden min-h-screen">
      {isMobile ? <MobileHero outlet={outlet} /> : <DesktopHero outlet={outlet} />}
    </section>
  );
}
