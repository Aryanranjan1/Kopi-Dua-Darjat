
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import type { Outlet } from '@/lib/types';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface MicrositeHeroProps {
    outlet: Outlet;
}

export default function MicrositeHero({ outlet }: MicrositeHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-black text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full">
        {/* Left Side: Content */}
        <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-16 h-full bg-gradient-to-br from-black via-zinc-900/90 to-black">
           <AnimateOnScroll animationType="slideInFromLeft">
                <Badge variant="default" className="mb-4 text-sm py-1 px-4 rounded-full bg-accent text-accent-foreground">
                    Welcome to Kopi Dua Darjat
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-headline font-bold text-primary leading-tight drop-shadow-lg">
                    {outlet.name}
                </h1>
                <p className="mt-6 text-lg lg:text-xl text-white/90 drop-shadow-md max-w-2xl">
                    {outlet.address}
                </p>
                 <p className="mt-2 text-lg text-white/90 drop-shadow-md">
                    Open: {outlet.hours}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <a href="#menu">View Our Menu</a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-black">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`} target="_blank" rel="noopener noreferrer">
                            <MapPin className="mr-2 h-5 w-5" /> Get Directions
                        </a>
                    </Button>
                </div>
            </AnimateOnScroll>
        </div>
        {/* Right Side: Image */}
        <div className="relative min-h-[50vh] lg:min-h-screen w-full h-full">
            <AnimateOnScroll animationType='slideInFromRight' className="h-full w-full">
                <Image 
                    src={outlet.heroImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop'}
                    alt={`Kopi Dua Darjat ${outlet.name}`}
                    fill
                    className="object-cover"
                    priority
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-black/70 lg:via-transparent lg:to-transparent"></div>
            </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
