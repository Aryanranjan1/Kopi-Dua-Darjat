
"use client";

import Image from 'next/image';
import type { MenuItem, Promotion, DailySpecial } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { getDiscountDisplay } from '@/lib/utils';

interface MenuItemCardProps {
  drink: MenuItem;
  promotions: Promotion[];
  dailySpecials: DailySpecial[];
}

export default function MenuItemCard({ drink, promotions, dailySpecials }: MenuItemCardProps) {
  
  const getOfferBadge = (): string | null => {
    const promotion = promotions.find(p => p.menuItemIds?.includes(drink.id));
    if (promotion) {
      return getDiscountDisplay(promotion);
    }
    if (dailySpecials.some(s => s.menuItemId === drink.id)) {
      return 'Special';
    }
    return null;
  };

  const offerText = getOfferBadge();

  return (
    <div className="p-1 h-full">
      <Card className="rounded-3xl bg-primary text-primary-foreground border-primary/40 w-full h-full flex flex-col transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-4 flex flex-col items-center text-center flex-grow">
          {offerText && (
             <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground z-10 shadow-lg">{offerText}</Badge>
          )}
          <div className="relative w-full aspect-square mb-4 group">
            <Image
              src={drink.imageUrl}
              alt={drink.name}
              fill
              className="object-cover drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="w-full text-left mt-auto">
              <h3 className="font-bold text-lg text-primary-foreground truncate">{drink.name}</h3>
              <p className="text-sm text-primary-foreground/70 mt-1 h-10">{drink.description}</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="font-semibold text-primary-foreground text-lg">RM{drink.price.toFixed(2)}</p>
                 <Button asChild size="icon" className="group/btn rounded-full bg-black text-white hover:bg-white hover:text-black transition-colors duration-300">
                    <Link href={`/outlets?item=${drink.slug}`}>
                        <ArrowUpRight className="h-5 w-5 absolute transition-transform duration-300 group-hover/btn:rotate-45 group-hover/btn:opacity-0" />
                        <ArrowRight className="h-5 w-5 absolute transition-transform duration-300 opacity-0 group-hover/btn:opacity-100" />
                        <span className="sr-only">View Details</span>
                    </Link>
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
