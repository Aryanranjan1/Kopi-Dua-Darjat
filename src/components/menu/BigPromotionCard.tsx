
"use client";

import Image from 'next/image';
import type { Drink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

interface BigPromotionCardProps {
  drink: Drink;
}

export default function BigPromotionCard({ drink }: BigPromotionCardProps) {
  return (
    <Card className="rounded-3xl bg-primary/65 overflow-hidden h-full flex flex-col relative">
        <div className="relative w-full h-80">
          <Image
              src={drink.image}
              alt={drink.name}
              fill
              className="object-cover"
          />
        </div>
        <CardContent className="p-8 flex flex-col flex-grow">
            <div className="relative z-10 rounded-xl">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground drop-shadow-md">
                Explore Our <span className="text-primary underline">Latest Offers</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-md drop-shadow-sm">
                Discover limited-time deals and special promotions on your
                favourite Kopi Dua Darjat drinks.
                </p>
            </div>
            <div className="mt-auto pt-8 flex justify-between items-center text-left z-10">
                <div className="flex-grow">
                    <h3 className="font-bold text-2xl text-foreground drop-shadow-lg truncate">{drink.name}</h3>
                    {drink.promotionDetails && (
                    <Badge variant="destructive" className="mt-1 text-base shadow-lg">
                        {drink.promotionDetails}
                    </Badge>
                    )}
                </div>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg">
                    <Link href="/outlets">
                    Visit Us Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
