
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function FranchiseHero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'franchise-hero');

  return (
    <section className="relative bg-card pt-32 pb-20 lg:pt-48 lg:pb-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
             <AnimateOnScroll animationType="slideInFromLeft">
                <Badge variant="default" className="mb-4 text-sm py-1 px-4 rounded-full bg-accent text-accent-foreground">
                    50+ stalls & growing since 2020
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-headline font-bold text-primary leading-tight">
                    Own Your Kopi Dua Darjat Stall — Brew Success, One Cup at a Time.
                </h1>
                <p className="mt-6 text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                    We’re expanding our local kopi culture across Malaysia. Join our growing family and serve the taste everyone’s talking about.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button asChild size="lg" className="rounded-full">
                        <Link href="/franchise/apply">Apply for Franchise</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full">
                        <Link href="#">Download Info Pack</Link>
                    </Button>
                </div>
            </AnimateOnScroll>
          </div>
          <div className="relative aspect-square max-w-lg mx-auto lg:max-w-none">
            <AnimateOnScroll animationType="slideInFromRight">
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover rounded-3xl shadow-lg"
                        data-ai-hint={heroImage.imageHint}
                        priority
                    />
                )}
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
