
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Outlet, MenuItem } from '@/lib/types';
import { useGeolocation } from '@/hooks/use-geolocation';
import { calculateDistance } from '@/lib/geolocation';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Pagination } from '@/components/shared/Pagination';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


const OUTLETS_PER_PAGE = 8;
type SortOption = 'Nearest' | 'Alphabetical';

function OutletShowcaseContent() {
  const searchParams = useSearchParams();
  const firestore = useFirestore();

  const [itemParam, setItemParam] = useState(searchParams.get('item'));
  
  const {
    isLoading: isGeolocationLoading,
    position,
    getPosition,
  } = useGeolocation();
  
  const { data: outlets, isLoading: isLoadingOutlets } = useCollection<Outlet>(
    useMemoFirebase(() => firestore ? query(collection(firestore, 'outlets')) : null, [firestore])
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSort, setActiveSort] = useState<SortOption>('Nearest');
  const [selectedState, setSelectedState] = useState('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);

  const allStates = useMemo(() => {
    if (!outlets) return ['All'];
    const states = new Set<string>(['All']);
    outlets.forEach(outlet => states.add(outlet.city));
    return Array.from(states);
  }, [outlets]);

  useEffect(() => {
    if (!position) {
      getPosition();
    }
  }, [getPosition, position]);

  useEffect(() => {
    if(firestore && !menuItems.length) {
      const fetchItems = async () => {
        setIsLoadingMenuItems(true);
        const itemsQuery = query(collection(firestore, 'menuItems'));
        const itemsSnap = await getDocs(itemsQuery);
        setMenuItems(itemsSnap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)));
        setIsLoadingMenuItems(false);
      }
      fetchItems();
    }
  }, [firestore, menuItems.length]);


  const { filteredAndSortedOutlets, dynamicTitle } = useMemo(() => {
    let processedOutlets: Outlet[] = (outlets || []).map(outlet => ({
      ...outlet,
      distance: position
        ? calculateDistance(position.latitude, position.longitude, outlet.lat, outlet.lng)
        : undefined,
    }));
    
    let dynamicTitle = "Outlet Showcase";

    if (itemParam && menuItems.length > 0) {
      const selectedItem = menuItems.find(item => item.slug === itemParam);
      if (selectedItem) {
        dynamicTitle = `Outlets for ${selectedItem.name}`;
        if (!selectedItem.isGeneral && selectedItem.outletIds && selectedItem.outletIds.length > 0) {
          const itemOutletIds = new Set(selectedItem.outletIds);
          processedOutlets = processedOutlets.filter(outlet => itemOutletIds.has(outlet.id));
        }
      }
    }

    if (selectedState !== 'All') {
      processedOutlets = processedOutlets.filter(outlet => outlet.city === selectedState);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      processedOutlets = processedOutlets.filter(outlet =>
        outlet.name.toLowerCase().includes(lowercasedQuery) ||
        outlet.address.toLowerCase().includes(lowercasedQuery)
      );
    }

    processedOutlets.sort((a, b) => {
      if (activeSort === 'Nearest') {
        if (!position || a.distance === undefined || b.distance === undefined) return a.name.localeCompare(b.name);
        return a.distance - b.distance;
      }
      return a.name.localeCompare(b.name);
    });

    return { filteredAndSortedOutlets: processedOutlets, dynamicTitle };
  }, [outlets, position, selectedState, searchQuery, activeSort, itemParam, menuItems]);

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
    setItemParam(null); 
  }
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    setItemParam(null); 
  }

  const isLoading = isLoadingOutlets || isLoadingMenuItems;

  return (
    <section id="outlet-showcase" className="py-24 sm:py-32 bg-white text-foreground scroll-mt-20">
      <div className="container mx-auto px-6">
        <AnimateOnScroll animationType="slideInFromBottom" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-black inline-block underline decoration-primary decoration-4 underline-offset-8">
            {dynamicTitle}
          </h2>
        </AnimateOnScroll>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
            <div className="relative w-full md:flex-grow-0 md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search outlets..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9 rounded-full w-full"
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select onValueChange={handleStateChange} defaultValue="All">
                  <SelectTrigger className="w-full sm:w-[180px] rounded-full">
                      <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                      {allStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <Select onValueChange={(value) => handleSortChange(value as SortOption)} defaultValue="Nearest">
                  <SelectTrigger className="w-full sm:w-[180px] rounded-full">
                      <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Nearest">Sort by Nearest</SelectItem>
                      <SelectItem value="Alphabetical">Sort by Name</SelectItem>
                  </SelectContent>
              </Select>
            </div>
             <Button onClick={getPosition} disabled={isGeolocationLoading} className="rounded-full w-full md:w-auto">
                {isGeolocationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                Find Near Me
            </Button>
        </div>
        
        <AnimateOnScroll animationType="fadeIn" delay={0.2}>
          {isLoading ? (
             <div className="flex justify-center py-16 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
             </div>
          ) : paginatedOutlets.length > 0 ? (
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

export default function OutletShowcase() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <OutletShowcaseContent />
    </Suspense>
  )
}
