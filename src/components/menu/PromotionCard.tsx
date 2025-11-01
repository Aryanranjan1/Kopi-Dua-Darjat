'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Drink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface PromotionCardProps {
  drink: Drink;
}

export default function PromotionCard({ drink }: PromotionCardProps) {
  return (
    <Link href={`/order/${drink.slug}`} className="group block">
      <Card className="overflow-hidden rounded-2xl bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={drink.image}
              alt={drink.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          </div>
          <div className="p-4 -mt-16 relative z-10 text-white">
            <h3 className="font-bold text-lg truncate">{drink.name}</h3>
            <p className="text-sm text-primary font-semibold">{drink.promotionDetails}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
