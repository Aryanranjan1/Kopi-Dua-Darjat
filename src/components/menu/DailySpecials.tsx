
'use client';

import { allDrinks } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '../ui/badge';
import Image from 'next/image';

const dailySpecials = allDrinks
  .filter((d) => d.tags.includes('Daily Special'))
  .slice(0, 7);
const visibleSpecials = dailySpecials.slice(0, 3);
const hiddenSpecials = dailySpecials.slice(3);

export function DailySpecials() {
  if (dailySpecials.length === 0) {
    return null;
  }

  return (
    <div
      className="container mx-auto px-4 pb-12 sm:pb-16"
    >
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
                  src={drink.image}
                  alt={drink.name}
                  width={48}
                  height={48}
                  className="rounded-full object-contain"
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
                {drink.promotionDetails && (
                  <Badge variant="destructive" className="mt-1">
                    {drink.promotionDetails}
                  </Badge>
                )}
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
                            src={drink.image}
                            alt={drink.name}
                            width={48}
                            height={48}
                            className="rounded-full object-contain"
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
                             {drink.promotionDetails && (
                                <Badge variant="destructive" className="mt-1">
                                    {drink.promotionDetails}
                                </Badge>
                                )}
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
    </div>
  );
}
