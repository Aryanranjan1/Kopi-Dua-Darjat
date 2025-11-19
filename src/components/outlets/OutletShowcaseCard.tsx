
'use client';

import Image from 'next/image';
import type { Outlet } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';

interface OutletShowcaseCardProps {
  outlet: Outlet & { distance?: number };
  userLocation: { latitude: number; longitude: number } | null;
}

export default function OutletShowcaseCard({ outlet, userLocation }: OutletShowcaseCardProps) {
  const directionsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${outlet.lat},${outlet.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${outlet.lat},${outlet.lng}`;

  const imageToShow = outlet.cardImage || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop";

  return (
    <div className="p-1 h-full group">
      <Card className="rounded-3xl bg-primary/30 overflow-hidden h-full flex flex-col border border-primary/40 hover:border-primary transition-all duration-300">
        <CardContent className="relative p-4 flex flex-col text-left flex-grow">
          <Link href={`/${outlet.slug}`} className="block">
            <div className="relative w-full aspect-video mb-4 group overflow-hidden rounded-2xl">
              <Image
                src={imageToShow}
                alt={outlet.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-xl text-foreground truncate transition-colors group-hover:text-accent">{outlet.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{outlet.address}</p>
            </div>
          </Link>
          <div className="w-full flex justify-between items-center text-left mt-4">
            <div>
              {outlet.distance && (
                <p className="text-xs font-bold text-accent flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {outlet.distance.toFixed(1)} km away
                </p>
              )}
            </div>
            <Button asChild variant="outline" size="icon" className="rounded-full border-2 border-foreground/50 hover:bg-primary hover:border-primary shrink-0 bg-transparent text-foreground hover:text-primary-foreground">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
