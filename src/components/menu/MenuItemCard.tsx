
"use client";

import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

interface MenuItemCardProps {
  drink: MenuItem;
}

export default function MenuItemCard({ drink }: MenuItemCardProps) {
  const hasPromotion = drink.promotionIds && drink.promotionIds.length > 0;

  return (
    <div className="p-1">
      <Card className="rounded-3xl bg-primary/65 overflow-visible">
        <CardContent className="relative p-4 pt-32 flex flex-col items-center text-center">
          {hasPromotion && (
             <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground z-10 shadow-lg">On Offer</Badge>
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
                  <div className="flex items-center gap-2 mt-1">
                      <p className="font-semibold text-accent text-lg">RM{drink.price.toFixed(2)}</p>
                      <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                          ))}
                      </div>
                  </div>
              </div>
             <Button asChild variant="outline" size="icon" className="rounded-full border-2 border-foreground/50 hover:bg-primary hover:border-primary shrink-0">
              <Link href={`/outlets?item=${drink.slug}`}>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
