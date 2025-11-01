
"use client";

import Image from 'next/image';
import type { Drink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface MenuItemCardProps {
  drink: Drink;
}

export default function MenuItemCard({ drink }: MenuItemCardProps) {
  return (
    <div className="text-center">
      <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden mb-4 shadow-lg">
        <Image
          src={drink.image}
          alt={drink.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-headline font-semibold text-foreground capitalize">{drink.name}</h3>
    </div>
  );
}
