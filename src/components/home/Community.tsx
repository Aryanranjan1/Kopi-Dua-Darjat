
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMedia } from '@/lib/media';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Users } from 'lucide-react';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import { Skeleton } from '../ui/skeleton';

const ImageCard = ({
  id,
  className,
  overlayText,
}: {
  id: string;
  className?: string;
  overlayText?: string;
}) => {
  const { data: media, isLoading } = useMedia();
  const image = media?.find((img) => img.id === id);

  if (isLoading) {
    return <Skeleton className={`rounded-2xl bg-muted ${className}`} />;
  }
  
  if (!image) return null;

  return (
    <AnimateOnScroll animationType="fadeIn" className={`relative overflow-hidden rounded-2xl group ${className}`}>
      <Image
        src={image.imageUrl}
        alt={image.description}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        data-ai-hint={image.imageHint}
      />
      {overlayText && (
        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground p-4">
          <p className="font-semibold text-center">{overlayText}</p>
        </div>
      )}
    </AnimateOnScroll>
  );
};

export default function Community() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Right side: Image Grid */}
          <div className="grid grid-cols-5 grid-rows-3 gap-4 h-[600px]">
            <ImageCard id="community-grid-1" className="col-span-2 row-span-3" overlayText="Be part of a growing community, one cup at a time." />
            <ImageCard id="community-grid-2" className="col-span-3 row-span-2" />
            <ImageCard id="community-grid-3" className="col-span-1 row-span-1" />
            <ImageCard id="community-grid-4" className="col-span-1 row-span-1" />
            <ImageCard id="community-grid-5" className="col-span-1 row-span-1" />
          </div>
          
          {/* Left side: Text Content */}
          <AnimateOnScroll animationType="slideInFromRight" className="text-left">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-5 h-5 text-accent" />
              <span>Thousands of cups shared. Countless stories brewed. Join the movement.</span>
            </div>
            <h2 className="mt-4 text-5xl md:text-7xl font-headline font-bold text-foreground leading-tight">
              One Cup. <br /> One Story. <br /> <span className="text-primary">One Community.</span>
            </h2>
            <p className="mt-6 text-lg max-w-prose text-muted-foreground">
              Share your Kopi Dua Darjat moments with us. Because every cup we share is a new connection made, a new story waiting to be told.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="#">
                  Join on Instagram
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-foreground/50 hover:bg-foreground hover:text-background">
                <Link href="/outlets">
                  Explore Our Outlets <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
