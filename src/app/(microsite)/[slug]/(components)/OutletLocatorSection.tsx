
'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import InteractiveMap from '@/components/home/InteractiveMap';
import type { Outlet } from '@/lib/types';

interface OutletLocatorSectionProps {
  currentOutlet: Outlet;
}

export default function OutletLocatorSection({ currentOutlet }: OutletLocatorSectionProps) {
  const mapEmbedUrl = `https://maps.google.com/maps?q=${currentOutlet.lat},${currentOutlet.lng}&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="bg-black text-white py-20 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
          Find Us Near You
        </h2>
        <Card className="overflow-hidden shadow-lg rounded-2xl h-[70vh] border-neutral-800">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={mapEmbedUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Card>
        <div className="text-center mt-10">
          <Button
            asChild
            size="lg"
            className="bg-[#F9C349] text-black hover:bg-[#F9C349]/90 rounded-md"
          >
            <a href="/outlets">View All Outlets</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
