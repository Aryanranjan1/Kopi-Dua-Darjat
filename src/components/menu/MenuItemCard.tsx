
"use client";

import Image from 'next/image';
import type { Drink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

interface MenuItemCardProps {
  drink: Drink;
}

export default function MenuItemCard({ drink }: MenuItemCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl bg-card/80 border-border/50">
        <div className="relative aspect-[4/5] w-full">
            <Image
            src={drink.image}
            alt={drink.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
             <div className="absolute top-2 right-2 bg-background/50 text-foreground font-bold p-2 rounded-lg text-sm">
                RM{drink.price.toFixed(2)}
            </div>
        </div>
        <CardContent className="p-4">
             <h3 className="text-lg font-headline font-semibold text-foreground truncate">{drink.name}</h3>
             {drink.description && <p className="text-xs text-muted-foreground mt-1 h-8">{drink.description}</p>}
             <Button className="w-full mt-4 rounded-full" asChild>
                <Link href={`/order/${drink.slug}`}>
                    <Plus className="mr-2 h-4 w-4"/> Add to Order
                </Link>
             </Button>
        </CardContent>
    </Card>
  );
}
