
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import Image from 'next/image';

export default function Hero() {
  return (
    <>
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden bg-primary pt-20">
        {/* Main Content Area */}
        <div className="container mx-auto px-12 z-10">
           <AnimateOnScroll animationType="fadeIn">
              <h1 className="text-4xl md:text-5xl lg:text-[54.6px] font-headline font-bold text-foreground drop-shadow-lg">
                Good Coffee for Great Mornings
              </h1>
            </AnimateOnScroll>
        </div>

        {/* Bottom Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-0 pointer-events-none h-32">
          <Image
            src="/image/wave.svg"
            alt="Wave separator"
            fill
            className="object-cover"
          />
        </div>
      </section>
    </>
  );
}
