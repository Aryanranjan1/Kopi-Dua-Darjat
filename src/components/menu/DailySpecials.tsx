
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import type { MenuItem, Promotion } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { getDiscountDisplay, getLocalized } from '@/lib/utils';
import { useMemo } from 'react';
import { useLanguage } from '../layout/LanguageProvider';

const DailySpecialsContent = () => {
  const firestore = useFirestore();
  const { language } = useLanguage();
  const specialsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'dailySpecials'), limit(7)) : null,
    [firestore]
  );
  const { data: dailySpecials, isLoading: isLoadingSpecials } = useCollection<any>(specialsQuery);

  const specialItemIds = useMemo(() => dailySpecials?.map(s => s.menuItemId) || [], [dailySpecials]);
  
  const itemsQuery = useMemoFirebase(
    () => (firestore && specialItemIds.length > 0) ? query(collection(firestore, 'menuItems'), where('__name__', 'in', specialItemIds)) : null,
    [firestore, specialItemIds]
  );
  const { data: specialItems, isLoading: isLoadingItems } = useCollection<MenuItem>(itemsQuery);

  const promosQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'promotions'), where('status', '==', 'active')) : null,
    [firestore]
  );
  const { data: promotions, isLoading: isLoadingPromos } = useCollection<Promotion>(promosQuery);
  
  const getOfferBadge = (drink: MenuItem): string | null => {
    if (!promotions) return 'Special Offer';
    const promotion = promotions.find(p => p.menuItemIds?.includes(drink.id));
    if (promotion) {
      return getDiscountDisplay(promotion);
    }
    return 'Special Offer';
  };

  const isLoading = isLoadingSpecials || isLoadingItems || isLoadingPromos;

  if (isLoading) {
    return (
       <div className="border-4 border-dashed border-primary/80 rounded-2xl p-6 md:p-8">
        <Skeleton className="h-10 w-1/3 mx-auto mb-8" />
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    )
  }

  if (!specialItems || specialItems.length === 0) {
    return null;
  }
  
  const visibleSpecials = specialItems.slice(0, 3);
  const hiddenSpecials = specialItems.slice(3);


  return (
    <div className="border-4 border-dashed border-primary/80 rounded-2xl p-6 md:p-8">
      <h2 className="text-5xl font-headline text-center font-bold tracking-widest text-foreground mb-8 underline decoration-primary decoration-4 underline-offset-8 uppercase">
        Daily Specials
      </h2>
      <div className="max-w-4xl mx-auto">
        {visibleSpecials.map((drink) => {
          const localizedDrink = getLocalized(drink, language);
          return (
            <div
              key={drink.id}
              className="flex items-center justify-between py-3 border-b border-border"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={drink.imageUrl}
                  alt={localizedDrink.name || ''}
                  width={48}
                  height={48}
                  className="rounded-full object-contain bg-primary/20 p-1"
                />
                <div>
                  <h4 className="font-semibold text-lg">{localizedDrink.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {localizedDrink.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-accent">
                  RM{drink.price.toFixed(2)}
                </p>
                <Badge variant="secondary" className="bg-accent/20 text-accent font-semibold mt-1">{getOfferBadge(drink)}</Badge>
              </div>
            </div>
          )
        })}

        {hiddenSpecials.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionContent>
                <div className="space-y-3 pt-3">
                  {hiddenSpecials.map((drink) => {
                    const localizedDrink = getLocalized(drink, language);
                    return (
                      <div
                        key={drink.id}
                        className="flex items-center justify-between pt-3 border-t border-border"
                      >
                         <div className="flex items-center gap-4">
                            <Image
                            src={drink.imageUrl}
                            alt={localizedDrink.name || ''}
                            width={48}
                            height={48}
                            className="rounded-full object-contain bg-primary/20 p-1"
                            />
                            <div>
                            <h4 className="font-semibold text-lg">{localizedDrink.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                {localizedDrink.description}
                            </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-accent">
                            RM{drink.price.toFixed(2)}
                            </p>
                            <Badge variant="secondary" className="bg-accent/20 text-accent font-semibold mt-1">{getOfferBadge(drink)}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
              <AccordionTrigger className="font-semibold text-accent hover:no-underline justify-center">
                View All Specials
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
}

export const DailySpecials = () => {
    return (
        <div className="container mx-auto px-4 pb-12 sm:pb-16">
            <DailySpecialsContent />
        </div>
    )
}
