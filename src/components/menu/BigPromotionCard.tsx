
"use client";

import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

interface BigPromotionCardProps {
  drink: MenuItem;
}

export default function BigPromotionCard({ drink }: BigPromotionCardProps) {
  return (
    <div className="p-1 h-full">
        <Card className="rounded-3xl bg-primary/65 overflow-hidden h-full flex flex-col">
            <CardContent className="relative p-4 flex flex-col items-center text-center flex-grow">
            <div className="relative w-full aspect-[1] mb-4 group">
                <Image
                src={drink.imageUrl}
                alt={drink.name}
                fill
                className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="w-full flex justify-between items-center text-left mt-auto">
                <div className="flex-grow">
                    <h3 className="font-bold text-xl text-foreground truncate">{drink.name}</h3>
                </div>
                <Button asChild variant="outline" size="icon" className="rounded-full border-2 border-foreground/50 hover:bg-primary hover:border-primary shrink-0">
                <Link href={`/outlets?promotion=${drink.slug}`}>
                    <ArrowUpRight className="w-5 h-5" />
                </Link>
                </Button>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
