'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Drink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface PromotionCardProps {
  drink: Drink;
}

export default function PromotionCard({ drink }: PromotionCardProps) {
  return (
    <Link href={`/order/${drink.slug}`} className="group block h-full">
      <Card className="overflow-hidden rounded-2xl bg-card/50 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4 bg-background">
            <Image
              src={drink.image}
              alt={drink.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col flex-grow text-center">
            <h3 className="font-bold text-lg text-foreground">{drink.name}</h3>
            <p className="text-sm text-primary font-semibold mt-1 flex-grow">{drink.promotionDetails}</p>
          </div>
          <div className="flex justify-end mt-2">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
