
"use client";

import Image from 'next/image';
import type { MenuItem, Promotion } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { getDiscountDisplay } from '@/lib/utils';

interface PromotionCardProps {
  drink: MenuItem;
  promotions: Promotion[];
}

export default function PromotionCard({ drink, promotions }: PromotionCardProps) {
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
        className="rounded-3xl border border-black text-black w-full h-full flex flex-col transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 overflow-visible"
        style={{ backgroundColor: '#fddc5d' }}
      >
        <CardContent className="relative p-4 pt-32 flex flex-col items-center text-center flex-grow">
          {offerText && (
            <Badge className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-black shadow-md z-10">{offerText}</Badge>
          )}
          <div className="relative w-full h-64 -mt-48 mb-4 group">
            <Image
                src={drink.imageUrl}
                alt={drink.name}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
                className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 rotate-12"
            />
          </div>
          <div className="w-full text-left mt-auto">
            <h3 className="font-bold text-lg text-black truncate">{drink.name}</h3>
            <p className="text-sm text-black/60 mt-1 h-10">{drink.description}</p>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex items-baseline gap-2">
                  {showCutPrice ? (
                    <>
                      <p className="font-semibold text-black text-base">RM{discountedPrice.toFixed(2)}</p>
                      <p className="text-xs text-black/60 line-through">RM{drink.price.toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="font-semibold text-black text-base">RM{drink.price.toFixed(2)}</p>
                  )}
                </div>
                <Button asChild size="icon" className="group rounded-full bg-black text-white hover:bg-white hover:text-black transition-colors duration-300">
                <Link href={`/outlets?promotion=${drink.slug}`}>
                  <ArrowUpRight className="h-4 w-4 absolute transition-transform duration-300 group-hover:opacity-0" />
                  <ArrowRight className="h-4 w-4 absolute transition-transform duration-300 opacity-0 group-hover:opacity-100" />
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
