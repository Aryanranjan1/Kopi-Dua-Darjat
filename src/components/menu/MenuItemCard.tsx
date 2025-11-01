
"use client";

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Drink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MenuItemCardProps {
  drink: Drink;
}

export default function MenuItemCard({ drink }: MenuItemCardProps) {
  return (
    <Card className="bg-card/50 border-border rounded-3xl w-full h-full flex flex-col group overflow-hidden">
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4">
          <Image
            src={drink.image}
            alt={drink.name}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col flex-grow mt-2">
          <h3 className="text-lg font-headline font-semibold text-foreground truncate">{drink.name}</h3>
          <div className="mt-2 flex justify-between items-center">
             <p className="text-xl font-bold text-accent">RM{drink.price.toFixed(2)}</p>
             <Button asChild variant="outline" size="icon" className="rounded-full border-2 border-foreground/50 hover:bg-primary hover:border-primary shrink-0 bg-transparent text-foreground hover:text-primary-foreground">
              <Link href="/outlets">
                <ArrowUpRight className="w-4 h-4" />
              </Link>
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
