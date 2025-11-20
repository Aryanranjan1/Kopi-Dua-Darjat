
"use client";

import Image from 'next/image';
import type { MenuItem, Promotion, DailySpecial } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { getDiscountDisplay } from '@/lib/utils';
import { getLocalized } from '@/lib/utils';
import { useLanguage } from '../layout/LanguageProvider';

interface MenuItemCardProps {
  drink: MenuItem;
  promotions: Promotion[];
  dailySpecials: DailySpecial[];
}

export default function MenuItemCard({ drink, promotions, dailySpecials }: MenuItemCardProps) {
  const { language } = useLanguage();
  const localized = getLocalized(drink, language);

  const getOfferBadge = (): string | null => {
    if (drink.isPopular) {
      return 'Popular';
    }
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
  
  const drinkName = localized.name || drink.slug;
  const drinkDescription = localized.description || '';

  return (
    <div className="p-1 h-full">
      <Card
        className="rounded-3xl text-black border border-black w-full h-full flex flex-col transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        style={{ backgroundColor: '#fddc5d' }}
      >
        {/* Image Section */}
        <div className="relative w-full aspect-square group">
          <Image
            src={drink.imageUrl}
            alt={drinkName}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {offerText && (
             <Badge className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-black shadow-md">{offerText}</Badge>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="font-bold text-lg text-black truncate">{drinkName}</h3>
            <p className="text-sm text-black/60 mt-1 hidden sm:block">{drinkDescription}</p>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="font-semibold text-black text-lg">RM{drink.price.toFixed(2)}</p>
            <Button asChild size="icon" className="group rounded-full bg-black text-white hover:bg-white hover:text-black transition-colors duration-300">
                <Link href={`/outlets?item=${drink.slug}`}>
                    <ArrowUpRight className="h-4 w-4 absolute transition-transform duration-300 group-hover:rotate-45 group-hover:opacity-0" />
                    <ArrowRight className="h-4 w-4 absolute transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                    <span className="sr-only">View Details</span>
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
