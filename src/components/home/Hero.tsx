
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useFitText } from '@/hooks/use-fit-text';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useFitText<HTMLHeadingElement>(containerRef);

  return (
    <section className="relative w-full bg-primary min-h-screen overflow-hidden flex flex-col justify-between">
      {/* === Main Text Content === */}
      <div
        className="relative container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-start z-30 pt-28"
        ref={containerRef}
      >
        <div className="w-full max-w-5xl">
          <AnimateOnScroll animationType="fadeIn">
            <div>
              <h1
                ref={h1Ref}
                className="font-headline font-extrabold text-foreground leading-[1.05] text-[clamp(2.5rem,10vw,8rem)]"
              >
                Good Coffee for Great Mornings
              </h1>
            </div>
            <p className="mt-6 text-base sm:text-lg md:text-xl font-body font-normal text-foreground/90 max-w-[420px] leading-relaxed">
              From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor , a golden mix of comfort, creativity, and caffeine confidence.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Decorative Images Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {/* Woman Image */}
        <div className="absolute left-[8%] top-[55%] w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]">
          <AnimateOnScroll animationType="fadeIn" delay={0.2}>
            <Image src="/image/image frame.png" alt="Frame decoration" layout="fill" className="object-contain"/>
          </AnimateOnScroll>
        </div>
        
        {/* Diagonal Arrow Button */}
        <div className="absolute left-[20%] top-[62%] w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] pointer-events-auto">
          <AnimateOnScroll animationType="fadeIn" delay={0.4}>
             <Button asChild variant="outline" size="icon" className="w-full h-full rounded-full border-2 border-foreground/50 hover:bg-foreground group transition-transform hover:scale-105">
                <Link href="/menu">
                    <ArrowUpRight className="w-1/2 h-1/2 text-foreground group-hover:text-background" />
                </Link>
             </Button>
          </AnimateOnScroll>
        </div>
        
        {/* Coffee Beans */}
        <div className="absolute right-[15%] bottom-[12%] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]">
          <AnimateOnScroll animationType="fadeIn" delay={0.3}>
            <Image src="/image/coffee-bean.png" alt="Coffee beans" layout="fill" className="object-contain"/>
          </AnimateOnScroll>
        </div>

        {/* Main Cup */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/4 w-[50vh] h-[50vh] sm:w-[65vh] sm:h-[65vh]">
          <AnimateOnScroll animationType="slideInFromBottom" delay={0.1}>
            <Image src="/image/dua-darjat-cup.png" alt="Kopi Dua Darjat splashing cup" layout="fill" className="object-contain"/>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Bottom Wave SVG */}
      <div className="relative w-full z-10 pointer-events-none mt-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            fill="#FFFFFF"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
