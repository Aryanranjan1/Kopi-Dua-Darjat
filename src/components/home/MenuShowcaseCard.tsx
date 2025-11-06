
'use-client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { MenuItem, Promotion, DailySpecial } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { getDiscountDisplay } from '@/lib/utils';

interface MenuShowcaseCardProps {
  drink: MenuItem;
  promotions: Promotion[];
  dailySpecials: DailySpecial[];
}

export default function MenuShowcaseCard({ drink, promotions, dailySpecials }: MenuShowcaseCardProps) {
  
  const getOfferBadge = (): string | null => {
    const promotion = promotions.find(p => p.menuItemIds?.includes(drink.id));
    if (promotion) {
      return getDiscountDisplay(promotion);
    }
    if (dailySpecials.some(s => s.menuItemId === drink.id)) {
      return 'Special';
    }
    return null;
  };

  const offerText = getOfferBadge();

  return (
    <Card className="bg-black text-white border-zinc-800 rounded-3xl w-full h-full flex flex-col transition-all duration-300 transform hover:shadow-xl hover:border-primary hover:-translate-y-1">
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link href={`/outlets?item=${drink.slug}`} className="block">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-4 bg-zinc-800/50 group">
            {offerText && (
              <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground z-10 shadow-lg">{offerText}</Badge>
            )}
            <Image
              src={drink.imageUrl}
              alt={drink.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-headline font-semibold group-hover:text-primary transition-colors">{drink.name}</h3>
            <p className="text-sm text-zinc-400 mt-1">{drink.description}</p>
          </div>
        </Link>
        <div className="mt-4 flex justify-between items-center">
            <p className="text-2xl font-bold text-primary">RM{drink.price.toFixed(2)}</p>
            <Button asChild variant="outline" size="icon" className="rounded-full border-2 border-white/50 hover:bg-primary hover:border-primary shrink-0 bg-transparent text-white hover:text-foreground">
            <Link href={`/outlets?item=${drink.slug}`}>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
