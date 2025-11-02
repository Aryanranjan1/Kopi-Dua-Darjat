
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InteractiveMap from './InteractiveMap';
import { Loader2, MapPin, Search } from 'lucide-react';
import { outlets } from '@/lib/data';
import type { Outlet } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { calculateDistance } from '@/lib/geolocation';
import OutletCard from './OutletCard';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Pagination } from '@/components/news/Pagination';

const OUTLETS_PER_PAGE = 3;

export default function OutletFinder() {
  const {
    isLoading: isGeolocationLoading,
    position,
    error: geolocationError,
    getPosition,
  } = useGeolocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedOutlets, setSortedOutlets] = useState<Outlet[]>(outlets);

  const handleLocateMe = () => {
    getPosition();
  };

  useEffect(() => {
    if (position) {
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
      setSortedOutlets(outletsWithDistance);
      setCurrentPage(1); // Reset to first page after sorting
    }
  }, [position]);

  const filteredOutlets = useMemo(() => {
    let outletsToFilter = sortedOutlets;

    if (!searchQuery) {
      return outletsToFilter;
    }

    const searchWords = searchQuery.toLowerCase().split(' ').filter(w => w);
    
    const scoredOutlets = outletsToFilter.map(outlet => {
      const textToSearch = `${outlet.name} ${outlet.city} ${outlet.address}`.toLowerCase();
      let score = 0;
      searchWords.forEach(word => {
        if (textToSearch.includes(word)) {
          score++;
        }
      });
      return { ...outlet, score };
    }).filter(outlet => outlet.score > 0);

    return scoredOutlets.sort((a, b) => b.score - a.score);

  }, [searchQuery, sortedOutlets]);

  const totalPages = Math.ceil(filteredOutlets.length / OUTLETS_PER_PAGE);
  const paginatedOutlets = filteredOutlets.slice(
    (currentPage - 1) * OUTLETS_PER_PAGE,
    currentPage * OUTLETS_PER_PAGE
  );

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="container mx-auto px-12">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col">
            <AnimateOnScroll animationType="slideInFromLeft">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl font-headline font-bold text-foreground inline-block underline decoration-primary/50 decoration-4 underline-offset-8">
                  Find Us Near You
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Your daily dose of artisan Kopi Kampung is just around the corner.
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animationType="fadeIn" delay={0.2}>
              <div className="mt-6 flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Enter city, postcode, or outlet name..." 
                    className="bg-card/30 rounded-full pl-12"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <Button onClick={handleLocateMe} disabled={isGeolocationLoading} className="rounded-full bg-black text-white hover:bg-primary hover:text-black">
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

            <div className="mt-4 space-y-4 min-h-[300px] flex-grow">
              {paginatedOutlets.map((outlet, index) => (
                <AnimateOnScroll key={outlet.id} animationType='slideInFromLeft' delay={index * 0.1}>
                  <OutletCard outlet={outlet} userLocation={position} />
                </AnimateOnScroll>
              ))}
              {paginatedOutlets.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground pt-10">
                  <p>No outlets found. Try a different search.</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center">
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
          <AnimateOnScroll animationType='slideInFromRight' className="lg:col-span-3 min-h-[600px] h-full">
            <Card className="overflow-hidden shadow-lg rounded-3xl h-full">
              <InteractiveMap />
            </Card>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
