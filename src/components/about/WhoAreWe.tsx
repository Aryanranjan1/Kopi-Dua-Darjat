
'use client';

import Image from 'next/image';
import { useMediaAsset } from '@/lib/media';
import { AnimateOnScroll } from '../animations/AnimateOnScroll';
import TiltedCard from '../animations/TiltedCard';
import { Skeleton } from '../ui/skeleton';

export default function WhoAreWe() {
  const { asset: image, isLoading } = useMediaAsset('brewing-method');

  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimateOnScroll animationType="slideInFromLeft">
            <div className="relative aspect-video rounded-2xl overflow-hidden group">
                {isLoading ? <Skeleton className="w-full h-full" /> : image && (
                    <TiltedCard 
                      imageSrc={image.imageUrl}
                      altText={image.description}
                      containerHeight="100%"
                      imageWidth="100%"
                      imageHeight="100%"
                      captionText={image.description}
                    />
                )}
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll animationType="slideInFromRight" className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground inline-block underline decoration-primary decoration-4 underline-offset-8">
              Who Are We?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              We are the bridge between Malaysia's rich coffee heritage and modern artisan craft.
            </p>
            <p className="mt-4 text-muted-foreground">
              Kopi Dua Darjat ("Two-Class Coffee") was founded on a simple idea: to honour the nostalgic taste of traditional Kopi Kampung while elevating it with the quality and care of artisan brewing. We believe that authentic, high-quality coffee should be accessible to everyone. From our humble beginnings as a small stall, we've grown into a nationwide family, but our mission remains the same: to serve a cup of coffee that feels like home, yet excites the senses.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
