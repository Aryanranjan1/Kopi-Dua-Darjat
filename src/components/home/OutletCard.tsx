
'use client';

import type { Outlet } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Map, Pin } from 'lucide-react';

interface OutletCardProps {
  outlet: Outlet & { distance?: number };
  userLocation: { latitude: number; longitude: number } | null;
}

export default function OutletCard({ outlet, userLocation }: OutletCardProps) {
  const directionsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${outlet.lat},${outlet.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${outlet.lat},${outlet.lng}`;

  return (
    <Card className="p-4 flex flex-col items-start gap-4 bg-[#f3e5d3]/35 rounded-3xl">
      <div className="flex-1 w-full min-w-0">
        <h4 className="font-bold text-base text-foreground flex items-start">
            <Pin className="w-4 h-4 mr-2 text-accent shrink-0 mt-1" />
            <span className="break-words">{outlet.name}</span>
        </h4>
        <p className="text-sm text-muted-foreground pl-6 break-words">{outlet.address}</p>
        {outlet.distance && (
          <p className="text-xs font-bold text-accent mt-1 pl-6">
            {outlet.distance.toFixed(1)} km away
          </p>
        )}
      </div>
      <Button asChild className="bg-foreground/80 text-background hover:bg-foreground/70 rounded-full shrink-0 w-full">
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
          <Map className="mr-2 h-4 w-4" />
          Directions
        </a>
      </Button>
    </Card>
  );
}
