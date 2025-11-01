"use client";

import Image from 'next/image';
import { MoreVertical } from 'lucide-react';
import type { Drink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MenuItemCardProps {
  drink: Drink;
}

export default function MenuItemCard({ drink }: MenuItemCardProps) {
  return (
    <Card className="bg-black text-white border-zinc-800 rounded-2xl w-full h-full flex flex-col">
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden mb-4">
          <Image
            src={drink.image}
            alt={drink.name}
            fill
            className="object-cover"
          />
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 rounded-full h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-xl font-headline font-semibold">{drink.name}</h3>
          <p className="text-sm text-zinc-400 flex-grow">{drink.description}</p>
          <div className="mt-4">
             <p className="text-2xl font-bold text-primary">RM{drink.price.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
