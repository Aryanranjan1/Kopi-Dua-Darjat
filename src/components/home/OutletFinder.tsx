
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InteractiveMap from './InteractiveMap';
import { Loader2, MapPin } from 'lucide-react';
import { outlets } from '@/lib/data';
import type { Outlet } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { calculateDistance } from '@/lib/geolocation';
import OutletCard from './OutletCard';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function OutletFinder() {
  const {
    isLoading: isGeolocationLoading,
    position,
    error: geolocationError,
    getPosition,
  } = useGeolocation();
  const [closestOutlets, setClosestOutlets] = useState<Outlet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const findClosestOutlets = () => {
    if (!position) {
      getPosition();
      return;
    }

    const outletsWithDistance = outlets.map((outlet) => ({
      ...outlet,
      distance: calculateDistance(
        position.latitude,
        position.longitude,
        outlet.lat,
        outlet.lng
      ),
    }));

    outletsWithDistance.sort((a, b) => a.distance - b.distance);

    setClosestOutlets(outletsWithDistance.slice(0, 3));
  };

  const handleLocateMe = () => {
    if (position) {
      findClosestOutlets();
    } else {
      getPosition();
    }
  };

  // Automatically find closest outlets once position is available
  useState(() => {
    if (position) {
      findClosestOutlets();
    }
  });


  return (
    <section className="py-16">
      <div className="container mx-auto px-12">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 text-center lg:text-left">
            <AnimateOnScroll animationType="slideInFromLeft">
              <h2 className="text-4xl font-headline font-bold text-foreground">
                Find Us Near You
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Your daily dose of artisan Kopi Kampung is just around the corner.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll animationType="fadeIn" delay={0.2}>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter your city or postcode..." 
                    className="bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button>Search</Button>
                </div>
                <Button variant="outline" onClick={handleLocateMe} disabled={isGeolocationLoading}>
                  {isGeolocationLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <MapPin className="mr-2 h-5 w-5" />
                  )}
                  Locate Me
                </Button>
              </div>
            </AnimateOnScroll>
            
            {geolocationError && <p className="mt-2 text-sm text-destructive">{geolocationError}</p>}

            <div className="mt-6 space-y-4">
              {closestOutlets.map((outlet, index) => (
                <AnimateOnScroll key={outlet.id} animationType='slideInFromLeft' delay={index * 0.1}>
                  <OutletCard outlet={outlet} userLocation={position} />
                </AnimateOnScroll>
              ))}
            </div>

            {closestOutlets.length === 0 && (
                 <Button asChild variant="link" className="mt-2 text-accent hover:text-accent/80 pl-0">
                    <Link href="/outlets">Or view all 50+ outlets</Link>
                </Button>
            )}
          </div>
          <AnimateOnScroll animationType='slideInFromRight' className="lg:col-span-3">
            <Card className="overflow-hidden shadow-lg rounded-xl aspect-[4/3]">
              <InteractiveMap />
            </Card>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
