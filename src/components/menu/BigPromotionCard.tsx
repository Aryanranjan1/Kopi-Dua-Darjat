
"use client";

import Image from 'next/image';
import type { MenuItem, Promotion } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { getDiscountDisplay } from '@/lib/utils';

interface BigPromotionCardProps {
  drink: MenuItem;
  promotions: Promotion[];
}

export default function BigPromotionCard({ drink, promotions }: BigPromotionCardProps) {
  const promotion = promotions.find(p => p.menuItemIds?.includes(drink.id));
  const offerText = promotion ? getDiscountDisplay(promotion) : null;

  const getDiscountedPrice = () => {
    if (!promotion) return drink.price;
    if (promotion.discountType === 'flat') {
      return drink.price - promotion.discountValue;
    }
    if (promotion.discountType === 'percentage') {
      return drink.price * (1 - promotion.discountValue / 100);
    }
    return drink.price;
  };

  const discountedPrice = getDiscountedPrice();
  const showCutPrice = promotion && (promotion.discountType === 'flat' || promotion.discountType === 'percentage');

  return (
    <div className="p-1 h-full">
      <Card
        className="rounded-3xl border border-black text-black w-full h-full flex flex-col transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        style={{ backgroundColor: '#fddc5d' }}
      >
        <div className="relative w-full aspect-square group">
          {offerText && (
            <Badge className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-black shadow-md z-10">{offerText}</Badge>
          )}
          <Image
            src={drink.imageUrl}
            alt={drink.name}
            fill
            sizes="(max-width: 768px) 90vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="font-bold text-xl sm:text-2xl text-black truncate">{drink.name}</h3>
            <p className="text-sm sm:text-base text-black/60 mt-1 hidden sm:block">{drink.description}</p>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-baseline gap-2">
              {showCutPrice ? (
                <>
                  <p className="font-semibold text-black text-xl sm:text-2xl">RM{discountedPrice.toFixed(2)}</p>
                  <p className="text-base text-black/60 line-through">RM{drink.price.toFixed(2)}</p>
                </>
              ) : (
                <p className="font-semibold text-black text-xl sm:text-2xl">RM{drink.price.toFixed(2)}</p>
              )}
            </div>
            <Button asChild size="icon" className="group rounded-full bg-black text-white hover:bg-white hover:text-black transition-colors duration-300">
              <Link href={`/outlets?promotion=${drink.slug}`}>
                <ArrowUpRight className="h-5 w-5 absolute transition-transform duration-300 group-hover:rotate-45 group-hover:opacity-0" />
                <ArrowRight className="h-5 w-5 absolute transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                <span className="sr-only">View Details</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
