
"use client";

import Image from 'next/image';
import type { MenuItem, Promotion, DailySpecial } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Plus, Star } from 'lucide-react';
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
    <div className="p-1 h-full group">
      <Card className="rounded-3xl bg-black text-white border-zinc-800 w-full h-full flex flex-col transition-all duration-300 transform hover:shadow-xl hover:border-primary hover:-translate-y-1">
        <CardContent className="p-4 flex flex-col items-center text-center flex-grow">
          {offerText && (
             <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground z-10 shadow-lg">{offerText}</Badge>
          )}
          <div className="relative w-full aspect-square mb-4 group">
            <Image
              src={drink.imageUrl}
              alt={drink.name}
              fill
              className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="w-full text-left mt-auto">
              <h3 className="font-bold text-lg text-white truncate">{drink.name}</h3>
              <p className="text-sm text-zinc-400 mt-1 h-10">{drink.description}</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="font-semibold text-primary text-lg">RM{drink.price.toFixed(2)}</p>
                <Button size="icon" variant="outline" className="rounded-full bg-zinc-800 border-zinc-700 text-white hover:bg-primary hover:text-black">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
