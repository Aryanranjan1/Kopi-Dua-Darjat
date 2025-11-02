'use client';

import { useState, useEffect, useMemo } from 'react';
import { outlets } from '@/lib/data';
import type { Outlet } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { calculateDistance } from '@/lib/geolocation';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Pagination } from '@/components/news/Pagination';
import OutletShowcaseCard from './OutletShowcaseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const OUTLETS_PER_PAGE = 8;
type SortOption = 'Nearest' | 'Alphabetical';

export default function OutletShowcase() {
  const {
    isLoading: isGeolocationLoading,
    position,
    getPosition,
  } = useGeolocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedOutlets, setSortedOutlets] = useState<Outlet[]>(outlets);
  const [activeSort, setActiveSort] = useState<SortOption>('Nearest');
  const [selectedState, setSelectedState] = useState('All');

  const allStates = useMemo(() => {
    const states = new Set<string>(['All']);
    outlets.forEach(outlet => states.add(outlet.city));
    return Array.from(states);
  }, []);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  const filteredAndSortedOutlets = useMemo(() => {
    let processedOutlets = outlets.map(outlet => ({
      ...outlet,
      distance: position
        ? calculateDistance(position.latitude, position.longitude, outlet.lat, outlet.lng)
        : undefined,
    }));

    // Filter by state
    if (selectedState !== 'All') {
      processedOutlets = processedOutlets.filter(outlet => outlet.city === selectedState);
    }

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      processedOutlets = processedOutlets.filter(outlet =>
        outlet.name.toLowerCase().includes(lowercasedQuery) ||
        outlet.address.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Sort
    processedOutlets.sort((a, b) => {
      if (activeSort === 'Nearest') {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      }
      // Alphabetical sort
      return a.name.localeCompare(b.name);
    });

    return processedOutlets;
  }, [position, outlets, selectedState, searchQuery, activeSort]);

  const totalPages = Math.ceil(filteredAndSortedOutlets.length / OUTLETS_PER_PAGE);
  const paginatedOutlets = filteredAndSortedOutlets.slice(
    (currentPage - 1) * OUTLETS_PER_PAGE,
    currentPage * OUTLETS_PER_PAGE
  );

  const handleSortChange = (value: SortOption) => {
    setActiveSort(value);
    setCurrentPage(1);
  }

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setCurrentPage(1);
  }
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }

  return (
    <section className="py-24 sm:py-32 bg-background text-foreground">
      <div className="container mx-auto px-6">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground inline-block underline decoration-primary decoration-4 underline-offset-8">
            Outlet Showcase
          </h2>
        </AnimateOnScroll>
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
            <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search outlets..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9 rounded-full"
                />
            </div>
            <Select onValueChange={handleStateChange} defaultValue="All">
                <SelectTrigger className="w-full md:w-[180px] rounded-full">
                    <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                    {allStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleSortChange(value as SortOption)} defaultValue="Nearest">
                <SelectTrigger className="w-full md:w-[180px] rounded-full">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Nearest">Sort by Nearest</SelectItem>
                    <SelectItem value="Alphabetical">Sort by Name</SelectItem>
                </SelectContent>
            </Select>
             <Button onClick={getPosition} disabled={isGeolocationLoading} className="rounded-full">
                {isGeolocationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                Find Near Me
            </Button>
        </div>
        
        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
          {paginatedOutlets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedOutlets.map((outlet) => (
                <OutletShowcaseCard key={outlet.id} outlet={outlet} userLocation={position} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16 text-muted-foreground">
                <p>No outlets match your criteria. Please try a different search or filter.</p>
             </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
}
