'use client';

import { useState, useEffect } from 'react';
import type { Promotion, MenuItem } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, getDocs, doc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import BigPromotionCard from './BigPromotionCard';
import PromotionCard from './PromotionCard';
import PromotionCarouselCard from './PromotionCarouselCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const MenuPromotionsContent = () => {
    const firestore = useFirestore();
    const [promotedItems, setPromotedItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;

        const fetchPromotedItems = async () => {
            setIsLoading(true);
            try {
                const promotionsQuery = query(
                    collection(firestore, 'promotions'),
                    where('status', '==', 'active'),
                    limit(10)
                );
                const promoSnap = await getDocs(promotionsQuery);
                const promotions = promoSnap.docs.map(d => ({ id: d.id, ...d.data() } as Promotion));
                
                const allMenuItemIds = promotions.flatMap(p => p.menuItemIds || []);
                if (allMenuItemIds.length === 0) {
                    setPromotedItems([]);
                    setIsLoading(false);
                    return;
                }

                const uniqueMenuItemIds = [...new Set(allMenuItemIds)];
                
                // Firestore 'in' query is limited to 30 items per query.
                // We'll fetch in chunks if necessary, though 10 promotions are unlikely to exceed this.
                const itemsQuery = query(collection(firestore, 'menuItems'), where('__name__', 'in', uniqueMenuItemIds));
                const itemsSnap = await getDocs(itemsQuery);
                const items = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem));
                
                setPromotedItems(items);

            } catch (error) {
                console.error("Error fetching promoted items:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPromotedItems();
    }, [firestore]);


    if (isLoading) {
        return (
            <div className="py-12 sm:py-16">
                <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-[450px] w-full rounded-3xl" />
                    <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-[217px] w-full rounded-3xl" />
                    <Skeleton className="h-[217px] w-full rounded-3xl" />
                    <Skeleton className="h-[217px] w-full rounded-3xl" />
                    <Skeleton className="h-[217px] w-full rounded-3xl" />
                    </div>
                </div>
                </div>
            </div>
        )
    }

    if (!promotedItems || promotedItems.length < 5) {
        return null; // Don't render if we don't have enough promotions for the layout
    }

    const mainPromoItem = promotedItems[0];
    const gridPromoItems = promotedItems.slice(1, 5);
    const remainingPromoItems = promotedItems.slice(5);
    const showRemainingCarousel = remainingPromoItems.length > 0;

    return (
        <div className="py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mainPromoItem && <BigPromotionCard drink={mainPromoItem} />}
                    <div className="grid grid-cols-2 gap-6">
                        {gridPromoItems.map((drink) => (
                        <PromotionCard key={drink.id} drink={drink} />
                        ))}
                    </div>
                </div>
            </div>

            {showRemainingCarousel && (
                <div className="container mx-auto px-4 mt-16">
                <Carousel
                    opts={{
                    align: 'start',
                    loop: remainingPromoItems.length > 5,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 py-24">
                    {remainingPromoItems.map((drink) => (
                        <CarouselItem
                        key={drink.id}
                        className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4 overflow-visible"
                        >
                        <PromotionCarouselCard drink={drink} />
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    {remainingPromoItems.length > 5 && (
                    <>
                        <CarouselPrevious className="ml-14" />
                        <CarouselNext className="mr-14" />
                    </>
                    )}
                </Carousel>
                </div>
            )}
        </div>
    );
};


export default function MenuPromotions() {
    return <MenuPromotionsContent />;
}
