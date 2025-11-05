
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import type { Outlet } from '@/lib/types';

interface MicrositeHeroProps {
    outlet: Outlet;
}

export default function MicrositeHero({ outlet }: MicrositeHeroProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 text-white overflow-hidden">
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="/video/bg1.mp4"
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center">
             <AnimateOnScroll animationType="slideInFromBottom">
                <Badge variant="default" className="mb-4 text-sm py-1 px-4 rounded-full bg-accent text-accent-foreground">
                    Welcome to Kopi Dua Darjat
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-headline font-bold text-primary leading-tight drop-shadow-lg">
                    {outlet.name}
                </h1>
                <p className="mt-6 text-lg lg:text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
                    {outlet.address}
                </p>
                 <p className="mt-2 text-lg text-white/90 drop-shadow-md">
                    Open: {outlet.hours}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-center">
                    <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <a href="#menu">View Our Menu</a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-black">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`} target="_blank" rel="noopener noreferrer">
                            Get Directions
                        </a>
                    </Button>
                </div>
            </AnimateOnScroll>
          </div>
      </div>
    </section>
  );
}
