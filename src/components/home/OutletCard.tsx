
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
    <Card className="p-4 flex justify-between items-center bg-[#f3e5d3]/35 rounded-3xl">
      <div className="flex-1 overflow-hidden pr-2">
        <h4 className="font-bold text-foreground flex items-center truncate">
            <Pin className="w-4 h-4 mr-2 text-accent shrink-0" />
            <span className="truncate">{outlet.name}</span>
        </h4>
        <p className="text-sm text-muted-foreground truncate">{outlet.address}</p>
        {outlet.distance && (
          <p className="text-xs font-bold text-accent mt-1">
            {outlet.distance.toFixed(1)} km away
          </p>
        )}
      </div>
      <Button asChild className="bg-foreground/80 text-background hover:bg-foreground/70 rounded-full shrink-0">
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
          <Map className="mr-2 h-4 w-4" />
          Directions
        </a>
      </Button>
    </Card>
  );
}
