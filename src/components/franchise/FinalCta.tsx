'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function FinalCta() {
  const ctaImage = PlaceHolderImages.find((img) => img.id === 'franchise-cta');

  return (
    <section className="bg-background">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          {/* Left side: Text content */}
          <div className="flex flex-col justify-center bg-black text-white p-12 lg:p-24 text-center lg:text-left">
            <AnimateOnScroll animationType="slideInFromLeft">
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary leading-tight">
                Your Stall. Your Story. Your Success.
              </h2>
              <p className="mt-6 text-lg md:text-xl max-w-prose text-white/80 mx-auto lg:mx-0">
                Ready to become a part of Malaysia's favourite kopi movement? The next success story could be yours.
              </p>
              <div className="mt-10">
                <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-7 px-10">
                  <Link href="/franchise/apply">Become a Partner Today</Link>
                </Button>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right side: Image */}
          <div className="relative min-h-[50vh] lg:min-h-0">
            {ctaImage && (
              <Image
                src={ctaImage.imageUrl}
                alt={ctaImage.description}
                fill
                className="object-cover"
                data-ai-hint={ctaImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
