
"use client";

import Image from 'next/image';
import type { MenuItem, Promotion } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { getDiscountDisplay } from '@/lib/utils';

interface PromotionCarouselCardProps {
  drink: MenuItem;
  promotions: Promotion[];
}

export default function PromotionCarouselCard({ drink, promotions }: PromotionCarouselCardProps) {
  const promotion = promotions.find(p => p.menuItemIds?.includes(drink.id));
  const offerText = promotion ? getDiscountDisplay(promotion) : null;
  
  return (
    <div className="p-1">
      <Card className="rounded-3xl bg-primary/65 overflow-visible">
        <CardContent className="relative p-4 pt-32 flex flex-col items-center text-center">
          {offerText && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground z-10 shadow-lg">{offerText}</Badge>
          )}
          <div className="relative w-full h-80 -mt-48 mb-4 group">
            <Image
              src={drink.imageUrl}
              alt={drink.name}
              fill
              className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 rotate-12"
            />
          </div>
          <div className="w-full flex justify-between items-center text-left">
              <div className="flex-grow">
                  <h3 className="font-bold text-xl text-foreground truncate">{drink.name}</h3>
              </div>
             <Button asChild variant="outline" size="icon" className="rounded-full border-2 border-foreground/50 hover:bg-primary hover:border-primary shrink-0">
              <Link href={`/outlets?promotion=${drink.slug}`}>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
