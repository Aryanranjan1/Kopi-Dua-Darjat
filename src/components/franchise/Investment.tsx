'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function Investment() {
  const stallImage = PlaceHolderImages.find((img) => img.id === 'franchise-stall');

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll animationType="slideInFromLeft" className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-headline text-primary">
              Affordable Cost, High Potential
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Start your own Kopi Dua Darjat stall with an investment as low as{' '}
              <span className="font-bold text-accent">RM25,000</span>.
            </p>
            <p className="mt-4 text-muted-foreground">
              This includes your kiosk, essential equipment, branding kit, initial stock, and comprehensive training for you and your team. We provide a detailed breakdown in our franchise kit to ensure full transparency.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link href="#">Request Franchise Kit</Link>
            </Button>
          </AnimateOnScroll>

          <AnimateOnScroll animationType="slideInFromRight">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
              {stallImage && (
                <Image
                  src={stallImage.imageUrl}
                  alt={stallImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={stallImage.imageHint}
                />
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
