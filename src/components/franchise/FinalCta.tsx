'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';

export default function FinalCta() {
  const ctaImage = PlaceHolderImages.find((img) => img.id === 'franchise-cta');

  return (
    <section className="relative py-32 text-center text-primary-foreground">
      <div className="absolute inset-0 z-[-2]">
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
      <div className="absolute inset-0 bg-black/60 z-[-1]"></div>

      <AnimateOnScroll className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-6xl font-headline font-bold text-primary drop-shadow-lg">
          Your Stall. Your Story. Your Success.
        </h2>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/90">
          Ready to become a part of Malaysia's favourite kopi movement? The next success story could be yours.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-7 px-10">
            <Link href="/franchise/apply">Become a Partner Today</Link>
          </Button>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
