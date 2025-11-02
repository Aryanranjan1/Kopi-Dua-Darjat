
'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MenuShowcaseCardProps {
  drink: MenuItem;
}

export default function MenuShowcaseCard({ drink }: MenuShowcaseCardProps) {
  return (
    <Card className="bg-black text-white border-zinc-800 rounded-3xl w-full h-full flex flex-col">
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-4 bg-zinc-800/50">
          <Image
            src={drink.imageUrl}
            alt={drink.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-xl font-headline font-semibold">{drink.name}</h3>
          <p className="text-sm text-zinc-400 flex-grow mt-1">{drink.description}</p>
          <div className="mt-4 flex justify-between items-center">
             <p className="text-2xl font-bold text-primary">RM{drink.price.toFixed(2)}</p>
             <Button asChild variant="outline" size="icon" className="rounded-full border-2 border-white/50 hover:bg-primary hover:border-primary shrink-0 bg-transparent text-white hover:text-foreground">
              <Link href={`/outlets?item=${drink.slug}`}>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
