
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import MenuItemCard from './MenuItemCard';
import type { MenuItem, Promotion, DailySpecial } from '@/lib/types';
import { Button } from '../ui/button';
import { ChevronsDown, ChevronsUp } from 'lucide-react';

interface MenuCarouselProps {
    title: string;
    items: MenuItem[];
    promotions: Promotion[];
    dailySpecials: DailySpecial[];
}

export default function MenuCarousel({ title, items, promotions, dailySpecials }: MenuCarouselProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!items || items.length === 0) {
        return null;
    }

    const showControls = items.length > 5;
    const categorySlug = title.toLowerCase().replace(/ /g, '-');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-headline font-bold text-foreground tracking-wider">{title}</h3>
                <div className="flex items-center gap-4">
                    <Button variant="link" onClick={() => setIsExpanded(!isExpanded)} className="text-accent hover:text-accent/80">
                        {isExpanded ? 'Show Less' : 'View All'}
                        {isExpanded ? <ChevronsUp className="ml-2 h-4 w-4" /> : <ChevronsDown className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </div>
            {isExpanded ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-24 py-16">
                    {items.map((drink) => (
                        <div key={drink.id} className="overflow-visible">
                            <MenuItemCard 
                                drink={drink}
                                promotions={promotions}
                                dailySpecials={dailySpecials}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <Carousel
                    opts={{
                        align: 'start',
                        loop: showControls,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 py-16">
                    {items.map((drink) => (
                        <CarouselItem key={drink.id} className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4 overflow-visible">
                            <MenuItemCard 
                                drink={drink} 
                                promotions={promotions}
                                dailySpecials={dailySpecials}
                            />
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    {showControls && (
                        <>
                            <CarouselPrevious className="left-2 sm:ml-14" />
                            <CarouselNext className="right-2 sm:mr-14" />
                        </>
                    )}
                </Carousel>
            )}
        </div>
    );
}
