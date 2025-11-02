
'use client';

import { useState, useEffect, useMemo } from 'react';
import { outlets } from '@/lib/data';
import type { Outlet } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { calculateDistance } from '@/lib/geolocation';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Pagination } from '@/components/news/Pagination';
import OutletShowcaseCard from './OutletShowcaseCard';

const OUTLETS_PER_PAGE = 10;

export default function OutletShowcase() {
  const { position, getPosition } = useGeolocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedOutlets, setSortedOutlets] = useState<Outlet[]>(outlets);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

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
      outletsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
      setSortedOutlets(outletsWithDistance);
    }
  }, [position]);

  const totalPages = Math.ceil(sortedOutlets.length / OUTLETS_PER_PAGE);
  const paginatedOutlets = sortedOutlets.slice(
    (currentPage - 1) * OUTLETS_PER_PAGE,
    currentPage * OUTLETS_PER_PAGE
  );

  return (
    <section className="py-24 sm:py-32 bg-black text-white">
      <div className="container mx-auto px-6">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Outlet Showcase
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Discover our featured outlets across Malaysia. Your next favorite coffee spot awaits.
          </p>
        </AnimateOnScroll>
        
        <AnimateOnScroll animationType="fadeIn" delay={0.2} className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedOutlets.map((outlet) => (
              <OutletShowcaseCard key={outlet.id} outlet={outlet} userLocation={position} />
            ))}
          </div>

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
