
'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Outlet } from '@/lib/types';
import { AnimateOnScroll } from '@/components/animations/AnimateOnScroll';
import { Clock, MapPin, Phone } from 'lucide-react';

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
    <section className="bg-black text-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animationType="slideInFromLeft">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">
              Visit <span style={{color: '#fde047'}}>Us</span> Today
            </h2>
            <div className="space-y-4 text-lg text-neutral-300">
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
            <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                Visit Us Today
              </a>
            </Button>
          </AnimateOnScroll>
          <AnimateOnScroll animationType="fadeIn" delay={0.2}>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="overflow-hidden shadow-lg rounded-2xl h-[60vh] border-neutral-800 transition-all duration-300 hover:ring-4 hover:ring-primary">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={mapEmbedUrl}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none"
                ></iframe>
              </Card>
            </a>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
