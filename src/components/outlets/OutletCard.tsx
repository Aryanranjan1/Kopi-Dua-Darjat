'use client';

import type { Outlet } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Map, Pin, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface OutletCardProps {
  outlet: Outlet & { distance?: number };
  userLocation: { latitude: number; longitude: number } | null;
}

export default function OutletCard({ outlet, userLocation }: OutletCardProps) {
  const directionsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${outlet.lat},${outlet.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${outlet.lat},${outlet.lng}`;

  return (
    <Card className="p-4 transition-all duration-300 bg-primary/30 border-primary/40 text-foreground hover:shadow-lg hover:ring-2 hover:ring-primary/50">
      <div className="flex justify-between items-center gap-4">
        <Link href={`/outlets/${outlet.slug}`} className="flex-grow group">
          <h4 className="font-bold text-lg text-foreground flex items-center group-hover:text-accent transition-colors">
              <Pin className="w-5 h-5 mr-2 text-accent" />
              {outlet.name}
          </h4>
          <p className="text-sm text-muted-foreground pl-7">{outlet.address}</p>
          {outlet.distance && (
            <p className="text-sm font-bold text-accent mt-1 pl-7">
              {outlet.distance.toFixed(1)} km away
            </p>
          )}
        </Link>
        <Button asChild size="icon" variant="ghost" className="rounded-full flex-shrink-0 hover:bg-accent/20">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${outlet.name}`}>
            <ArrowUpRight className="w-5 h-5 text-accent" />
          </a>
        </Button>
      </div>
    </Card>
  );
}
