
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import type { MenuItem } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

const DailySpecialsContent = () => {
  const firestore = useFirestore();
  const specialsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'menuItems'), where('status', '==', 'published'), limit(7)) : null,
    [firestore]
  );
  const { data: dailySpecials, isLoading } = useCollection<MenuItem>(specialsQuery);

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

  if (!dailySpecials || dailySpecials.length === 0) {
    return null;
  }
  
  const visibleSpecials = dailySpecials.slice(0, 3);
  const hiddenSpecials = dailySpecials.slice(3);


  return (
    <div className="border-4 border-dashed border-primary/80 rounded-2xl p-6 md:p-8">
      <h2 className="text-5xl font-headline text-center font-bold tracking-widest text-foreground mb-8 underline decoration-primary decoration-4 underline-offset-8 uppercase">
        Daily Specials
      </h2>
      <div className="max-w-4xl mx-auto">
        {visibleSpecials.map((drink) => (
          <div
            key={drink.id}
            className="flex items-center justify-between py-3 border-b border-border"
          >
            <div className="flex items-center gap-4">
              <Image
                src={drink.imageUrl}
                alt={drink.name}
                width={48}
                height={48}
                className="rounded-full object-contain bg-primary/20 p-1"
              />
              <div>
                <h4 className="font-semibold text-lg">{drink.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {drink.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-accent">
                RM{drink.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        {hiddenSpecials.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionContent>
                <div className="space-y-3 pt-3">
                  {hiddenSpecials.map((drink) => (
                    <div
                      key={drink.id}
                      className="flex items-center justify-between pt-3 border-t border-border"
                    >
                       <div className="flex items-center gap-4">
                          <Image
                          src={drink.imageUrl}
                          alt={drink.name}
                          width={48}
                          height={48}
                          className="rounded-full object-contain bg-primary/20 p-1"
                          />
                          <div>
                          <h4 className="font-semibold text-lg">{drink.name}</h4>
                          <p className="text-sm text-muted-foreground">
                              {drink.description}
                          </p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-bold text-lg text-accent">
                          RM{drink.price.toFixed(2)}
                          </p>
                      </div>
                    </div>
                  ))}
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
