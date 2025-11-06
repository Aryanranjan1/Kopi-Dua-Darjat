
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <>
      <section className="relative w-full h-screen flex items-center justify-center bg-primary">

        {/* Grouped Left Image and Arrow */}
        <div className="absolute bottom-0 -left-24 w-[20rem] h-[20rem] z-30 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-[20rem] h-[20rem]">
              <Image
                src="/image/image%20frame.png"
                alt="Image Frame"
                fill
                className="object-contain -rotate-90 pointer-events-none"
              />
            </div>
            <button className="relative w-16 h-16 border-4 border-foreground rounded-full flex items-center justify-center -ml-20 bg-white cursor-pointer" aria-label="Open profile">
              <ArrowUpRight className="w-10 h-10 text-foreground" />
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="absolute top-1/2 right-20 w-36 h-36 md:w-52 md:h-52 z-30 pointer-events-none">
             <Image
                src="/image/coffee-bean.png"
                alt=""
                aria-hidden="true"
                fill
                className="object-contain"
            />
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-6 z-10 flex pt-[190px] pb-32 overflow-hidden">
          <div className="w-full">
            {/* Text Content */}
            <div className="text-left">
              <AnimateOnScroll animationType="fadeIn">
                <h1 className="font-headline font-extrabold text-foreground text-center leading-none text-[clamp(2.5rem,8vw,5rem)] md:whitespace-nowrap">
                  Good Coffee for Great Mornings
                </h1>
                <div className="flex justify-start">
                  <div className="mt-[50px]">
                    <p className="text-base md:text-lg font-body font-bold text-foreground/80 max-w-[390px] text-justify ml-8">
                        From bean to cup, every pour is crafted with passion and precision. Our coffee celebrates the art of flavor , a golden mix of comfort, creativity, and caffeine confidence.
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
            
          </div>
        </div>

        {/* Cup Image Overlay */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[52rem] h-[81vh] z-20 pointer-events-none">
            <div className="relative w-full h-full">
                <Image
                    src="/image/dua-darjat-cup.png"
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-contain object-bottom translate-y-12 rotate-[20deg]"
                />
            </div>
        </div>

        {/* Bottom Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-0 pointer-events-none h-32 md:h-48">
          <Image
            src="/image/wave.svg"
            alt="Wave separator"
            fill
            className="object-cover object-bottom"
          />
        </div>
      </section>
    </>
  );
}
