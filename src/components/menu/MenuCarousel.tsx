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
import type { Drink } from '@/lib/types';
import { Button } from '../ui/button';
import { ArrowRight, ChevronsDown, ChevronsUp } from 'lucide-react';

interface MenuCarouselProps {
    title: string;
    items: Drink[];
}

export default function MenuCarousel({ title, items }: MenuCarouselProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!items || items.length === 0) {
        return null;
    }

    const showControls = items.length > 5;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-headline font-bold text-foreground tracking-wider">{title}</h3>
                <Button variant="link" onClick={() => setIsExpanded(!isExpanded)} className="text-accent hover:text-accent/80">
                    {isExpanded ? 'Show Less' : 'View All'}
                    {isExpanded ? <ChevronsUp className="ml-2 h-4 w-4" /> : <ChevronsDown className="ml-2 h-4 w-4" />}
                </Button>
            </div>
            {isExpanded ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-8">
                    {items.map((drink) => (
                        <div key={drink.id} className="overflow-visible">
                            <MenuItemCard drink={drink} />
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
                        <CarouselItem key={drink.id} className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4 overflow-visible">
                            <MenuItemCard drink={drink} />
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    {showControls && (
                        <>
                            <CarouselPrevious className="ml-14" />
                            <CarouselNext className="mr-14" />
                        </>
                    )}
                </Carousel>
            )}
        </div>
    );
}
