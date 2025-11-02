
'use client';

import { useState, useEffect, useMemo } from 'react';
import { outlets } from '@/lib/data';
import type { Outlet } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { calculateDistance } from '@/lib/geolocation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Search } from 'lucide-react';
import OutletCard from './OutletCard';
import { Pagination } from '@/components/news/Pagination';
import InteractiveMap from '../home/InteractiveMap';
import { Card } from '../ui/card';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

const OUTLETS_PER_PAGE = 10;

export default function OutletsList() {
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
    }
  }, [position]);

  const filteredOutlets = useMemo(() => {
    return sortedOutlets.filter(outlet =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sortedOutlets]);

  const totalPages = Math.ceil(filteredOutlets.length / OUTLETS_PER_PAGE);
  const paginatedOutlets = filteredOutlets.slice(
    (currentPage - 1) * OUTLETS_PER_PAGE,
    currentPage * OUTLETS_PER_PAGE
  );

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side: Search and List */}
          <div>
            <AnimateOnScroll animationType='slideInFromLeft'>
                <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search by name, city, or address..."
                    className="w-full rounded-full bg-card/50 pl-12"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    />
                </div>
                <Button variant="outline" onClick={handleLocateMe} disabled={isGeolocationLoading} className="rounded-full">
                    {isGeolocationLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                    <MapPin className="mr-2 h-5 w-5" />
                    )}
                    Locate Me
                </Button>
                </div>
                {geolocationError && <p className="mt-2 text-sm text-destructive">{geolocationError}</p>}
            </AnimateOnScroll>
            
            <div className="mt-8 space-y-4">
              {paginatedOutlets.map((outlet) => (
                <AnimateOnScroll key={outlet.id} animationType='fadeIn'>
                    <OutletCard outlet={outlet} userLocation={position} />
                </AnimateOnScroll>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
          
          {/* Right Side: Map */}
          <AnimateOnScroll animationType='slideInFromRight' className="h-[600px] lg:h-auto">
             <Card className="overflow-hidden shadow-lg rounded-3xl h-full">
              <InteractiveMap />
            </Card>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
