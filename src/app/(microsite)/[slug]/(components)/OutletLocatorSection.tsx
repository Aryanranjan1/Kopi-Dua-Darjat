
'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Outlet } from '@/lib/types';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Clock, MapPin, Phone, Coffee } from 'lucide-react';
import Image from 'next/image';

interface OutletLocatorSectionProps {
  currentOutlet: Outlet;
}

export default function OutletLocatorSection({ currentOutlet }: OutletLocatorSectionProps) {
  // Use a fallback for lat/lng if not provided
  const lat = currentOutlet.lat || 3.1390; // Default to KL
  const lng = currentOutlet.lng || 101.6869;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section id="outlet-locator" className="bg-black text-white">
      <div className="grid lg:grid-cols-2 min-h-[70vh]">
        <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
            <AnimateOnScroll animationType="slideInFromLeft" className="max-w-md w-full">
                <h2 className="text-4xl md:text-5xl font-headline font-bold flex items-center gap-3">
                    Visit Us Today <Coffee className="h-10 w-10 text-primary" />
                </h2>
                <p className="mt-4 text-lg text-neutral-300">
                    Escape the noise, grab your favourite brew, and feel the warmth of Kopi Dua Darjat at our {currentOutlet.name} outlet.
                </p>
                <div className="space-y-4 text-lg text-neutral-300 mt-8">
                    <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <p>{currentOutlet.address}</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <p>Open: {currentOutlet.hours}</p>
                    </div>
                    {currentOutlet.phone && (
                        <div className="flex items-start gap-4">
                            <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                            <p>{currentOutlet.phone}</p>
                        </div>
                    )}
                </div>
                <div className="relative mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <p className="font-serif italic text-white/80">
                        "The best local coffee I've ever had. A must-visit spot!"
                    </p>
                    <p className="text-sm text-zinc-500 mt-2">- A Happy Customer</p>
                </div>

                <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                    <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="mr-2 h-5 w-5" />
                        Get Directions
                    </a>
                </Button>
            </AnimateOnScroll>
        </div>
        
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full min-h-[50vh] lg:min-h-0">
            <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={mapEmbedUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </a>
      </div>
    </section>
  );
}
