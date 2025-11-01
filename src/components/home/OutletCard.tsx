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
    <Card className="p-4 flex justify-between items-center bg-card/50">
      <div>
        <h4 className="font-bold text-foreground flex items-center">
            <Pin className="w-4 h-4 mr-2 text-accent" />
            {outlet.name}
        </h4>
        <p className="text-sm text-muted-foreground">{outlet.address}</p>
        {outlet.distance && (
          <p className="text-xs font-bold text-accent mt-1">
            {outlet.distance.toFixed(1)} km away
          </p>
        )}
      </div>
      <Button asChild className="bg-foreground text-background hover:bg-foreground/80">
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
          <Map className="mr-2 h-4 w-4" />
          Directions
        </a>
      </Button>
    </Card>
  );
}
